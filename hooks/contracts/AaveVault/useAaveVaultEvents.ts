'use client';

import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

const PONDER_API_URL = process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069';

export type AaveVaultEvent = {
    type: 'deposit' | 'withdraw';
    amount: string;
    blockNumber: bigint;
    transactionHash: string;
};

export function useGetAaveVaultEvents(limit = 50) {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;

    const { data: events = [], isLoading, error, refetch } = useQuery({
        queryKey: ['ponder', 'aaveVaultEvents', limit, decimals],
        queryFn: async (): Promise<AaveVaultEvent[]> => {
            const response = await fetch(`${PONDER_API_URL}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query GetAaveVaultEvents($limit: Int) {
                            aaveVaultEvents(orderBy: "blockNumber", orderDirection: "desc", limit: $limit) {
                                items {
                                    id
                                    type
                                    amount
                                    blockNumber
                                    txHash
                                }
                            }
                        }
                    `,
                    variables: { limit },
                }),
            });

            if (!response.ok) {
                throw new Error(`Ponder API error: ${response.status}`);
            }

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0]?.message || 'GraphQL error');
            }

            return data.aaveVaultEvents.items.map((e: {
                type: string;
                amount: string;
                blockNumber: string;
                txHash: string;
            }) => ({
                type: e.type as 'deposit' | 'withdraw',
                amount: formatUnits(BigInt(e.amount), decimals),
                blockNumber: BigInt(e.blockNumber),
                transactionHash: e.txHash,
            }));
        },
    });

    return { events, isLoading, error, refetch };
}
