'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePublicClient, useBlockNumber } from 'wagmi';
import { formatUnits, parseAbiItem } from 'viem';
import { useAaveVaultConfig } from './config';

export type AaveVaultEvent = {
    type: 'deposit' | 'withdraw';
    amount: string;
    blockNumber: bigint;
    transactionHash: string;
};

const depositedEvent = parseAbiItem('event Deposited(uint256 amount)');
const withdrawnEvent = parseAbiItem('event Withdrawn(uint256 amount)');

export function useGetAaveVaultEvents(limit = 50) {
    const { address, enabled } = useAaveVaultConfig();
    const publicClient = usePublicClient();
    const { data: currentBlock } = useBlockNumber();

    const [events, setEvents] = useState<AaveVaultEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchEvents = useCallback(async () => {
        if (!publicClient || !address || !enabled || !currentBlock) return;

        setIsLoading(true);
        setError(null);

        try {
            const fromBlock = currentBlock > BigInt(1000) ? currentBlock - BigInt(1000) : BigInt(0);

            const [depositLogs, withdrawLogs] = await Promise.all([
                publicClient.getLogs({
                    address,
                    event: depositedEvent,
                    fromBlock,
                    toBlock: 'latest',
                }),
                publicClient.getLogs({
                    address,
                    event: withdrawnEvent,
                    fromBlock,
                    toBlock: 'latest',
                }),
            ]);

            const depositEvents: AaveVaultEvent[] = depositLogs.map((log) => ({
                type: 'deposit' as const,
                amount: formatUnits(log.args.amount ?? BigInt(0), 6),
                blockNumber: log.blockNumber ?? BigInt(0),
                transactionHash: log.transactionHash ?? '',
            }));

            const withdrawEvents: AaveVaultEvent[] = withdrawLogs.map((log) => ({
                type: 'withdraw' as const,
                amount: formatUnits(log.args.amount ?? BigInt(0), 6),
                blockNumber: log.blockNumber ?? BigInt(0),
                transactionHash: log.transactionHash ?? '',
            }));

            const allEvents = [...depositEvents, ...withdrawEvents]
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
