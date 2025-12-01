'use client';

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useMemo } from 'react';
import { formatEther, parseEther } from 'viem';
import { usePricingDAOConfig } from './config';

export type ProposalData = {
    id: bigint;
    pricePerKWh: bigint;
    priceInEuros: string;
    applied: boolean;
    snapshotProducersCount: bigint;
    snapshotConsumersCount: bigint;
    producersVotedFor: bigint;
    producersVotedAgainst: bigint;
    consumersVotedFor: bigint;
    consumersVotedAgainst: bigint;
};

type ProposalRawData = {
    pricePerKWh: bigint;
    applied: boolean;
    snapshotProducersCount: bigint;
    snapshotConsumersCount: bigint;
    producersVotedFor: bigint;
    producersVotedAgainst: bigint;
    consumersVotedFor: bigint;
    consumersVotedAgainst: bigint;
};

// GET Proposal
export function useProposal() {
    const { address, abi, enabled } = usePricingDAOConfig();

    // Fetch basic proposal info
    const { data: basicData, isLoading: isLoadingBasic, error: basicError, refetch } = useReadContracts({
        contracts: [
            { address, abi, functionName: 'hasActiveProposal' },
            { address, abi, functionName: 'activeProposalId' },
            { address, abi, functionName: 'currentPrice' },
        ],
        query: { enabled },
    });

    const hasActiveProposal = basicData?.[0]?.result as boolean | undefined;
    const activeProposalId = basicData?.[1]?.result as bigint | undefined;
    const currentPrice = basicData?.[2]?.result as bigint | undefined;

    // Fetch proposal details if active
    const { data: proposalData, isLoading: isLoadingProposal } = useReadContract({
        address,
        abi,
        functionName: 'getProposal',
        args: [activeProposalId],
        query: {
            enabled: !!hasActiveProposal && activeProposalId !== undefined,
        },
    });

    const proposal: ProposalData | null = useMemo(() => {
        if (!hasActiveProposal || !proposalData || activeProposalId === undefined) {
            return null;
        }

        const data = proposalData as ProposalRawData;

        return {
            id: activeProposalId,
            pricePerKWh: data.pricePerKWh,
            priceInEuros: formatEther(data.pricePerKWh),
            applied: data.applied,
            snapshotProducersCount: data.snapshotProducersCount,
            snapshotConsumersCount: data.snapshotConsumersCount,
            producersVotedFor: data.producersVotedFor,
            producersVotedAgainst: data.producersVotedAgainst,
            consumersVotedFor: data.consumersVotedFor,
            consumersVotedAgainst: data.consumersVotedAgainst,
        };
    }, [hasActiveProposal, proposalData, activeProposalId]);

    return {
        hasActiveProposal: hasActiveProposal ?? false,
        proposal,
        currentPrice: currentPrice ? formatEther(currentPrice) : null,
        isLoading: isLoadingBasic || isLoadingProposal,
        error: basicError,
        refetch,
    };
}

// SET Proposal
export function useCreateProposal() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createProposal = (priceInEuros: string) => {
        const priceInWei = parseEther(priceInEuros);

        writeContract({
            address,
            abi,
            functionName: 'createProposal',
            args: [priceInWei],
        });
    };

    return {
        createProposal,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
