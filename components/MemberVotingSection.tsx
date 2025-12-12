'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteButton } from '@/components/VoteButton';
import {
    type ProposalData,
    VoteChoice,
    useGetVote,
    useVote,
    WORKFLOW_STATUS_LABELS,
} from '@/hooks/contracts/pricingDAO';

const VOTE_CHOICE_LABELS: Record<VoteChoice, string> = {
    [VoteChoice.None]: 'Non voté',
    [VoteChoice.For]: 'Pour',
    [VoteChoice.Against]: 'Contre',
    [VoteChoice.Abstain]: 'Abstention',
};

type MemberVotingSection = {
    workflowStatus: number;
    proposal: ProposalData | null;
    currentPrice: string | null;
    isLoading: boolean;
    onVoteSuccess?: () => void;
};

export function MemberVotingSection({
    workflowStatus,
    proposal,
    currentPrice,
    isLoading,
    onVoteSuccess,
}: MemberVotingSection) {
    const { data: userVote, isLoading: isLoadingVote } = useGetVote(proposal?.id);
    const { vote, isPending, isConfirming, isSuccess, error } = useVote();

    const prevErrorRef = useRef(error);
    const prevSuccessRef = useRef(isSuccess);

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast.error(error.message);
        }
        prevErrorRef.current = error;
    }, [error]);

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Vote enregistré avec succès');
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess]);

    const [votedChoice, setVotedChoice] = useState<VoteChoice | null>(null);
    const [pendingChoice, setPendingChoice] = useState<VoteChoice | null>(null);

    const isVotingPhase = workflowStatus === 3;
    const isVoting = isPending || isConfirming;

    useEffect(() => {
        if (isSuccess && pendingChoice !== null) {
            setVotedChoice(pendingChoice); // Store the confirmed vote
            setPendingChoice(null); // Reset pending state
            onVoteSuccess?.(); // Call parent callback
        }
    }, [isSuccess, pendingChoice, onVoteSuccess]);

    const hasVoted = votedChoice !== null || (userVote !== undefined && userVote !== VoteChoice.None);
    const displayedVote = votedChoice ?? userVote;

    const handleVote = (choice: VoteChoice) => {
        setPendingChoice(choice);
        vote(choice);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Proposition de prix</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Chargement...</p>
                </CardContent>
            </Card>
        );
    }

    if (!proposal) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Proposition de prix</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Aucune proposition en cours.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Étape actuelle : {WORKFLOW_STATUS_LABELS[workflowStatus] ?? 'Inconnu'}
                    </p>
                </CardContent>
            </Card>
        );
    }

    const totalProducerVotes = Number(proposal.producersVotedFor) + Number(proposal.producersVotedAgainst);
    const totalConsumerVotes = Number(proposal.consumersVotedFor) + Number(proposal.consumersVotedAgainst);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Proposition de prix
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                        (Étape : {WORKFLOW_STATUS_LABELS[workflowStatus] ?? 'Inconnu'})
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Final result (after VotesTallied) */}
                {workflowStatus >= 5 && proposal.applied && (
                    <div className={`p-4 rounded-lg ${
                        currentPrice === proposal.priceInEuros
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                        <p className="font-medium">
                            {currentPrice === proposal.priceInEuros
                                ? `Proposition adoptée : ${proposal.priceInEuros} €/kWh sera appliqué`
                                : `Proposition rejetée : le prix reste à ${currentPrice} €/kWh`
                            }
                        </p>
                    </div>
                )}

                {/* Proposed vs current price */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Prix actuel</p>
                        <p className="text-2xl font-bold">{currentPrice ?? '-'} €/kWh</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Prix proposé</p>
                        <p className="text-2xl font-bold text-primary">{proposal.priceInEuros} €/kWh</p>
                    </div>
                </div>

                {/* Voting section */}
                <div className="pt-4 border-t">
                    {!isVotingPhase ? (
                        <p className="text-muted-foreground">
                            Le vote n&apos;est pas encore ouvert.
                        </p>
                    ) : isLoadingVote ? (
                        <p className="text-muted-foreground">Vérification de votre vote...</p>
                    ) : hasVoted ? (
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Vous avez voté</p>
                            <p className="font-medium">{VOTE_CHOICE_LABELS[displayedVote as VoteChoice]}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="font-medium">Votre vote</p>
                            <div className="flex gap-3">
                                <VoteButton
                                    choice={VoteChoice.For}
                                    onClick={() => handleVote(VoteChoice.For)}
                                    isLoading={isVoting && pendingChoice === VoteChoice.For}
                                    disabled={isVoting}
                                />
                                <VoteButton
                                    choice={VoteChoice.Against}
                                    onClick={() => handleVote(VoteChoice.Against)}
                                    isLoading={isVoting && pendingChoice === VoteChoice.Against}
                                    disabled={isVoting}
                                />
                                <VoteButton
                                    choice={VoteChoice.Abstain}
                                    onClick={() => handleVote(VoteChoice.Abstain)}
                                    isLoading={isVoting && pendingChoice === VoteChoice.Abstain}
                                    disabled={isVoting}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Vote results */}
                <div className="space-y-4">
                    <h4 className="font-medium">Résultats des votes</h4>

                    {/* Producers */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Producteurs</span>
                            <span>{totalProducerVotes} / {Number(proposal.snapshotProducersCount)} votes</span>
                        </div>
                        <div className="flex gap-2 text-sm">
                            <span className="text-green-600">Pour: {Number(proposal.producersVotedFor)}</span>
                            <span className="text-destructive">Contre: {Number(proposal.producersVotedAgainst)}</span>
                        </div>
                    </div>

                    {/* Consumers */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Consommateurs</span>
                            <span>{totalConsumerVotes} / {Number(proposal.snapshotConsumersCount)} votes</span>
                        </div>
                        <div className="flex gap-2 text-sm">
                            <span className="text-green-600">Pour: {Number(proposal.consumersVotedFor)}</span>
                            <span className="text-destructive">Contre: {Number(proposal.consumersVotedAgainst)}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
