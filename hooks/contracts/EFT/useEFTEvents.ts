'use client';

import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';

const PONDER_API_URL = process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069';

export type EFTEvent = {
    type: 'mint' | 'burn';
    address: `0x${string}`;
    amount: string;
    meterId?: string;
    blockNumber: bigint;
    transactionHash: `0x${string}`;
};

export function useGetEFTEvents(limit = 50) {
    const { data: events = [], isLoading, error, refetch } = useQuery({
        queryKey: ['ponder', 'eftEvents', limit],
        queryFn: async (): Promise<EFTEvent[]> => {
            const response = await fetch(`${PONDER_API_URL}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `
                        query GetEFTEvents($limit: Int) {
                            eftEvents(orderBy: "blockNumber", orderDirection: "desc", limit: $limit) {
                                items {
                                    id
                                    type
                                    address
                                    amount
                                    meterId
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

            return data.eftEvents.items.map((e: {
                type: string;
                address: string;
                amount: string;
                meterId: string | null;
                blockNumber: string;
                txHash: string;
            }) => ({
                type: e.type as 'mint' | 'burn',
                address: e.address as `0x${string}`,
                amount: formatUnits(BigInt(e.amount), 18),
                meterId: e.meterId || undefined,
                blockNumber: BigInt(e.blockNumber),
                transactionHash: e.txHash as `0x${string}`,
            }));
        },
    });

    return { events, isLoading, error, refetch };
}
