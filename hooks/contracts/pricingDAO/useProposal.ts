'use client';

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';
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

export function useGetProposalData() {
    const { address, abi, enabled } = usePricingDAOConfig();

    const { data: basicData, isLoading: isLoadingBasic, error: basicError, refetch } = useReadContracts({
        contracts: [
            { address, abi, functionName: 'hasActiveProposal' },
            { address, abi, functionName: 'activeProposalId' },
            { address, abi, functionName: 'currentPrice' },
        ],
        query: { enabled },
    });

    const hasActiveProposal = basicData?.[0]?.result as boolean;
    const activeProposalId = basicData?.[1]?.result as bigint;
    const currentPrice = basicData?.[2]?.result as bigint;

    const { data: proposalData, isLoading: isLoadingProposal } = useReadContract({
        address,
        abi,
        functionName: 'getProposal',
        args: [activeProposalId],
        query: {
            enabled: activeProposalId > BigInt(0),
        },
    });

    const proposal: ProposalData | null = useMemo(() => {
        if (!proposalData || activeProposalId === BigInt(0)) {
            return null;
        }

        const data = proposalData as ProposalRawData;

        return {
            id: activeProposalId,
            pricePerKWh: data.pricePerKWh,
            priceInEuros: formatUnits(data.pricePerKWh, 6),
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
        currentPrice: currentPrice ? formatUnits(currentPrice, 6) : null,
        isLoading: isLoadingBasic || isLoadingProposal,
        error: basicError,
        refetch,
    };
}

export function useCreateProposal() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createProposal = (priceInEuros: string) => {
        const priceInWei = parseUnits(priceInEuros, 6);

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
    };
}
