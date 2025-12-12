'use client';

import { useCallback } from 'react';
import { useWorkflowStatus, useGetProposalData } from '@/hooks/contracts/pricingDAO';
import {MemberVotingSection} from '@/components/MemberVotingSection';
import ConsumptionHistory from "./_components/ConsumptionHistory";
import {useGetConsumerLinkyHistory} from "@/hooks/api/linky";

export default function ConsumerDashboard() {
    const {
        data: status,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus,
    } = useWorkflowStatus();

    const {
        proposal,
        currentPrice,
        isLoading: isLoadingProposal,
        refetch: refetchProposal,
    } = useGetProposalData();

    const { data: linkyData } = useGetConsumerLinkyHistory('user-123');

    const handleVoteSuccess = useCallback(() => {
        refetchStatus();
        refetchProposal();
    }, [refetchStatus, refetchProposal]);

    if (isLoadingStatus) return <p>Chargement...</p>;
    if (statusError) return <p>Erreur: {statusError.message}</p>;

    return (
        <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Espace Consommateur</h1>

            <MemberVotingSection
                workflowStatus={status as number}
                proposal={proposal}
                currentPrice={currentPrice}
                isLoading={isLoadingProposal}
                onVoteSuccess={handleVoteSuccess}
            />

            <ConsumptionHistory data={linkyData?.history ?? []} year={linkyData?.year ?? 0} />
        </>
    );
}
