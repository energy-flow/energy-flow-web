'use client';

import { useCallback } from 'react';
import { useWorkflowStatus, useGetProposalData } from '@/hooks/pricingDAO';
import {MemberVotingSection} from '@/components/MemberVotingSection';

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

    const handleVoteSuccess = useCallback(() => {
        refetchStatus();
        refetchProposal();
    }, [refetchStatus, refetchProposal]);

    if (isLoadingStatus) return <p>Chargement...</p>;
    if (statusError) return <p>Erreur: {statusError.message}</p>;

    return (
        <div className="space-y-8 py-8">
            <h1 className="text-2xl font-bold">Espace Consommateur</h1>

            <MemberVotingSection
                workflowStatus={status as number}
                proposal={proposal}
                currentPrice={currentPrice}
                isLoading={isLoadingProposal}
                onVoteSuccess={handleVoteSuccess}
            />
        </div>
    );
}
