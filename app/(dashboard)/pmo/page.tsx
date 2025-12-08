'use client';

import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useWorkflowStatus, useGetProposalData, useGetMembers } from '@/hooks/contracts/pricingDAO';
import { useGetAavePosition, useTotalDeposited, useTotalWithdrawn, useGetPmoInfo } from '@/hooks/contracts/AaveVault';
import { WorkflowSection } from '@/app/(dashboard)/pmo/_components/WorkflowSection';
import { ProposalSection } from '@/app/(dashboard)/pmo/_components/ProposalSection';
import { MembersSection } from '@/app/(dashboard)/pmo/_components/MembersSection';
import { DefiSection } from '@/app/(dashboard)/pmo/_components/DefiSection';

export default function PMODashboard() {
    const { address: pmoAddress } = useAccount();

    // PricingDAO Hooks
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

    // AaveVault Hooks
    const { data: aavePosition, isLoading: isLoadingPosition } = useGetAavePosition();
    const { data: totalDeposited, isLoading: isLoadingDeposited } = useTotalDeposited();
    const { data: totalWithdrawn, isLoading: isLoadingWithdrawn } = useTotalWithdrawn();
    const { data: pmoInfo, isLoading: isLoadingPmoInfo } = useGetPmoInfo(pmoAddress);

    const pmoData = pmoInfo as [bigint, bigint] | undefined;
    const isLoadingDefi = isLoadingPosition || isLoadingDeposited || isLoadingWithdrawn || isLoadingPmoInfo;

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
            <DefiSection
                pmoDeposited={pmoData?.[0]}
                pmoWithdrawn={pmoData?.[1]}
                totalDeposited={totalDeposited as bigint | undefined}
                totalWithdrawn={totalWithdrawn as bigint | undefined}
                aavePosition={aavePosition as bigint | undefined}
                isLoading={isLoadingDefi}
            />
            <MembersSection
                members={members}
                isLoading={isLoadingMembers}
                error={membersError}
                onMemberChange={handleMemberChange}
            />
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
        </div>
    );
}
