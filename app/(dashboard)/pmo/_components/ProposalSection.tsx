'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreateProposalForm } from './CreateProposalForm';
import { type ProposalData } from '@/hooks/contracts/pricingDAO';

type ProposalSectionProps = {
    proposal: ProposalData | null;
    currentPrice: string | null;
    hasActiveProposal: boolean;
    isLoading: boolean;
    workflowStatus: number;
    onProposalCreated: () => void;
};

function VoteProgressBar({ votesFor, totalVotes }: { votesFor: number; totalVotes: number }) {
    if (totalVotes === 0) return null;

    const percentage = (votesFor / totalVotes) * 100;

    return (
        <div className="w-full bg-muted rounded-full h-2">
            <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

function VoteResults({ proposal }: { proposal: ProposalData }) {
    const totalProducerVotes = Number(proposal.producersVotedFor) + Number(proposal.producersVotedAgainst);
    const totalConsumerVotes = Number(proposal.consumersVotedFor) + Number(proposal.consumersVotedAgainst);

    return (
        <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-medium">Résultats du vote</h4>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Producteurs</span>
                    <span>
                        {proposal.producersVotedFor.toString()} pour / {proposal.producersVotedAgainst.toString()} contre
                        <span className="text-muted-foreground ml-1">
                            (sur {proposal.snapshotProducersCount.toString()})
                        </span>
                    </span>
                </div>
                <VoteProgressBar
                    votesFor={Number(proposal.producersVotedFor)}
                    totalVotes={totalProducerVotes}
                />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Consommateurs</span>
                    <span>
                        {proposal.consumersVotedFor.toString()} pour / {proposal.consumersVotedAgainst.toString()} contre
                        <span className="text-muted-foreground ml-1">
                            (sur {proposal.snapshotConsumersCount.toString()})
                        </span>
                    </span>
                </div>
                <VoteProgressBar
                    votesFor={Number(proposal.consumersVotedFor)}
                    totalVotes={totalConsumerVotes}
                />
            </div>
        </div>
    );
}

function ProposalStatusBadge({ workflowStatus }: { workflowStatus: number }) {
    switch (workflowStatus) {
        case 1:
            return <Badge variant="secondary">En attente de validation</Badge>;
        case 2:
            return <Badge variant="secondary">Prête pour le vote</Badge>;
        case 3:
            return <Badge>Vote en cours</Badge>;
        case 4:
            return <Badge variant="secondary">Vote terminé</Badge>;
        default:
            return null;
    }
}

function ProposalDetails({ proposal, workflowStatus }: { proposal: ProposalData; workflowStatus: number }) {
    return (
        <>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-md border border-primary/20">
                <span className="text-sm font-medium">Prix proposé</span>
                <span className="font-bold text-lg">{proposal.priceInEuros} €/kWh</span>
            </div>

            {workflowStatus >= 3 && <VoteResults proposal={proposal} />}
        </>
    );
}

function NoProposalMessage({ workflowStatus }: { workflowStatus: number }) {
    let message = 'Aucune proposition active.';

    if (workflowStatus === 0) {
        message += " Démarrez d'abord la phase de proposition.";
    } else if (workflowStatus === 1) {
        message += " Créez une proposition de prix.";
    }

    return <p className="text-sm text-muted-foreground">{message}</p>;
}

export function ProposalSection({
    proposal,
    currentPrice,
    hasActiveProposal,
    isLoading,
    workflowStatus,
    onProposalCreated,
}: ProposalSectionProps) {
    const showCreateForm = workflowStatus === 1 && !hasActiveProposal;

    return (
        <div className="space-y-8">
            {/* Proposal card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Proposition de prix</span>
                        {hasActiveProposal && <ProposalStatusBadge workflowStatus={workflowStatus} />}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoading ? (
                        <p className="text-muted-foreground">Chargement...</p>
                    ) : (
                        <>
                            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                                <span className="text-sm text-muted-foreground">Prix actuel</span>
                                <span className="font-semibold">{currentPrice ?? '—'} €/kWh</span>
                            </div>

                            {hasActiveProposal && proposal ? (
                                <ProposalDetails proposal={proposal} workflowStatus={workflowStatus} />
                            ) : (
                                <NoProposalMessage workflowStatus={workflowStatus} />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Creation form (conditional) */}
            {showCreateForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Créer une proposition de prix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CreateProposalForm disabled={false} onSuccess={onProposalCreated} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
