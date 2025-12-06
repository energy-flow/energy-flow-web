'use client';

import { useCallback } from 'react';
import { useWorkflowStatus, useGetProposalData, useGetMembers } from '@/hooks/pricingDAO';
import { WorkflowSection, ProposalSection, MembersSection } from './_components';

export default function PMODashboard() {
    // Hooks
    const {
        data: status,
        isLoading: isLoadingStatus,
        error: statusError,
        refetch: refetchStatus,
    } = useWorkflowStatus();

    const {
        members,
        isLoading: isLoadingMembers,
        error: membersError,
        refetch: refetchMembers,
    } = useGetMembers();

    const {
        hasActiveProposal,
        proposal,
        currentPrice,
        isLoading: isLoadingProposal,
        refetch: refetchProposal,
    } = useGetProposalData();

    const handleStatusChange = useCallback(() => {
        refetchStatus();
    }, [refetchStatus]);

    const handleProposalChange = useCallback(() => {
        refetchStatus();
        refetchProposal();
    }, [refetchStatus, refetchProposal]);

    const handleMemberChange = useCallback(() => {
        refetchMembers();
    }, [refetchMembers]);

    // Loading & Error states
    if (isLoadingStatus) return <p>Chargement...</p>;
    if (statusError) return <p>Erreur: {statusError.message}</p>;

    const workflowStatus = status as number;

    return (
        <div className="space-y-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <WorkflowSection
                    status={workflowStatus}
                    onStatusChange={handleStatusChange}
                    onCycleReset={handleProposalChange}
                />

                <ProposalSection
                    proposal={proposal}
                    currentPrice={currentPrice}
                    hasActiveProposal={hasActiveProposal}
                    isLoading={isLoadingProposal}
                    workflowStatus={workflowStatus}
                    onProposalCreated={handleProposalChange}
                />
            </div>
            <MembersSection
                members={members}
                isLoading={isLoadingMembers}
                error={membersError}
                onMemberChange={handleMemberChange}
            />
        </div>
    );
}
