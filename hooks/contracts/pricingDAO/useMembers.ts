'use client';

import { useWriteContract, useWaitForTransactionReceipt, usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';
import { usePricingDAOConfig } from './config';

export type DAOMember = {
    address: `0x${string}`;
    role: 'producer' | 'consumer';
};

// Fetches members via MemberAdded/MemberRemoved events (no on-chain array)
export function useGetMembers() {
    const { address, enabled } = usePricingDAOConfig();
    const publicClient = usePublicClient();

    const { data: members = [], isLoading, error, refetch } = useQuery({
        queryKey: ['pricingDAO', 'members', address],
        queryFn: async (): Promise<DAOMember[]> => {
            if (!publicClient || !address) return [];

            const [addedLogs, removedLogs] = await Promise.all([
                publicClient.getLogs({
                    address,
                    event: parseAbiItem('event MemberAdded(address indexed member, bool isProducer)'),
                    fromBlock: BigInt(0),
                }),
                publicClient.getLogs({
                    address,
                    event: parseAbiItem('event MemberRemoved(address indexed member, bool wasProducer)'),
                    fromBlock: BigInt(0),
                }),
            ]);

            const membersMap = new Map<`0x${string}`, 'producer' | 'consumer'>();

            for (const log of addedLogs) {
                const member = log.args.member as `0x${string}`;
                const isProducer = log.args.isProducer as boolean;
                membersMap.set(member, isProducer ? 'producer' : 'consumer');
            }

            for (const log of removedLogs) {
                const member = log.args.member as `0x${string}`;
                membersMap.delete(member);
            }

            return Array.from(membersMap.entries()).map(([addr, role]) => ({
                address: addr,
                role,
            }));
        },
        enabled: enabled && !!publicClient,
    });

    return {
        members,
        isLoading,
        error,
        refetch,
    };
}

export function useAddMember() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const addMember = (memberAddress: `0x${string}`, isProducer: boolean) => {
        writeContract({
            address,
            abi,
            functionName: 'addMember',
            args: [memberAddress, isProducer],
        });
    };

    return {
        addMember,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}

export function useRemoveMember() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const removeMember = (memberAddress: `0x${string}`) => {
        writeContract({
            address,
            abi,
            functionName: 'removeMember',
            args: [memberAddress],
        });
    };

    return {
        removeMember,
        isPending,
        isConfirming,
        isSuccess,
        error,
    };
}
