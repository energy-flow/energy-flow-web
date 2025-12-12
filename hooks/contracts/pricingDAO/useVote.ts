'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { usePricingDAOConfig } from './config';

export enum VoteChoice {
    None = 0,
    For = 1,
    Against = 2,
    Abstain = 3,
}

export function useGetVote(proposalId: bigint | undefined) {
    const { address, abi, enabled } = usePricingDAOConfig();
    const { address: userAddress } = useAccount();

    const { data, isLoading, error, refetch } = useReadContract({
        address,
        abi,
        functionName: 'getVote',
        args: [proposalId, userAddress],
        query: {
            enabled: enabled && !!proposalId && !!userAddress,
        },
    });

    return { data, isLoading, error, refetch };
}

export function useVote() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const vote = (choice: VoteChoice) => {
        writeContract({
            address,
            abi,
            functionName: 'vote',
            args: [choice],
        });
    };

    return { vote, isPending, isConfirming, isSuccess, error, reset };
}
