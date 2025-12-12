'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { usePricingDAOConfig } from './config';

const PONDER_API_URL = process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069';

export type DAOMember = {
    address: `0x${string}`;
    role: 'producer' | 'consumer';
};

// Fetches members via Ponder GraphQL API (indexed from MemberAdded/MemberRemoved events)
export function useGetMembers() {
    const { enabled } = usePricingDAOConfig();

    const { data: members = [], isLoading, error, refetch } = useQuery({
        queryKey: ['ponder', 'members'],
        queryFn: async (): Promise<DAOMember[]> => {
            const response = await fetch(`${PONDER_API_URL}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query GetMembers {
                            members {
                                items {
                                    address
                                    isProducer
                                }
                            }
                        }
                    `,
                }),
            });

            if (!response.ok) {
                throw new Error(`Ponder API error: ${response.status}`);
            }

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0]?.message || 'GraphQL error');
            }

            return data.members.items.map((m: { address: string; isProducer: boolean }) => ({
                address: m.address as `0x${string}`,
                role: m.isProducer ? 'producer' : 'consumer',
            }));
        },
        enabled,
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
