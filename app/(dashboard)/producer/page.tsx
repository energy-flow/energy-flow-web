'use client';

import { useCallback } from "react";
import { useGetProposalData, useWorkflowStatus } from "@/hooks/contracts/pricingDAO";
import { MemberVotingSection } from "@/components/MemberVotingSection";
import ProductionHistory from "./_components/ProductionHistory";
import { useGetProducerLinkyHistory } from "@/hooks/api/linky";

export default function ProducerDashboard() {
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

    const { data: linkyData } = useGetProducerLinkyHistory('user-123');

    const handleVoteSuccess = useCallback(() => {
        refetchStatus();
        refetchProposal();
    }, [refetchStatus, refetchProposal]);


    if (isLoadingStatus) return <p>Chargement...</p>;
    if (statusError) return <p>Erreur: {statusError.message}</p>;

    const workflowStatus = status as number;

    return (
        <>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Espace Producteur</h1>

            <MemberVotingSection
                workflowStatus={workflowStatus}
                proposal={proposal}
                currentPrice={currentPrice}
                isLoading={isLoadingProposal}
                onVoteSuccess={handleVoteSuccess}
            />
            <ProductionHistory data={linkyData?.history ?? []} year={linkyData?.year ?? 0} />
        </>
    );
}