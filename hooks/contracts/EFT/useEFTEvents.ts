'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePublicClient, useBlockNumber } from 'wagmi';
import { parseAbiItem, formatUnits } from 'viem';
import { useEFTConfig } from './config';

export type EFTEvent = {
    type: 'mint' | 'burn';
    address: `0x${string}`;
    amount: string;
    meterId?: string;
    blockNumber: bigint;
    transactionHash: `0x${string}`;
};

const energyTokenizedEvent = parseAbiItem('event EnergyTokenized(address indexed recipient, uint256 amount, string meterId)');
const energyBurnedEvent = parseAbiItem('event EnergyBurned(address indexed account, uint256 amount)');

export function useGetEFTEvents(limit = 50) {
    const { address, enabled } = useEFTConfig();
    const publicClient = usePublicClient();
    const { data: currentBlock } = useBlockNumber();

    const [events, setEvents] = useState<EFTEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!publicClient || !address || !enabled || !currentBlock) return;

        setIsLoading(true);
        setError(null);

        try {
            const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);

            const [mintLogs, burnLogs] = await Promise.all([
                publicClient.getLogs({
                    address,
                    event: energyTokenizedEvent,
                    fromBlock,
                    toBlock: 'latest',
                }),
                publicClient.getLogs({
                    address,
                    event: energyBurnedEvent,
                    fromBlock,
                    toBlock: 'latest',
                }),
            ]);

            const mintEvents: EFTEvent[] = mintLogs.map((log) => ({
                type: 'mint' as const,
                address: log.args.recipient as `0x${string}`,
                amount: formatUnits(log.args.amount as bigint, 18),
                meterId: log.args.meterId as string,
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            }));

            const burnEvents: EFTEvent[] = burnLogs.map((log) => ({
                type: 'burn' as const,
                address: log.args.account as `0x${string}`,
                amount: formatUnits(log.args.amount as bigint, 18),
                blockNumber: log.blockNumber,
                transactionHash: log.transactionHash,
            }));

            const allEvents = [...mintEvents, ...burnEvents]
                .sort((a, b) => Number(b.blockNumber - a.blockNumber))
                .slice(0, limit);

            setEvents(allEvents);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch events'));
        } finally {
            setIsLoading(false);
        }
    }, [publicClient, address, enabled, currentBlock, limit]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return { events, isLoading, error, refetch: fetchEvents };
}
