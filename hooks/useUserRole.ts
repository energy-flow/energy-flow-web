'use client';

import { useAccount, useReadContracts } from 'wagmi';
import { useMemo } from 'react';
import PricingDAOAbi from '@/lib/contracts/abis/PricingDAO.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { useChainId } from 'wagmi';

export type UserRole = 'pmo' | 'producer' | 'consumer' | 'none';

export function useUserRole() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    const contractConfig = {
        address: addresses?.pricingDAO as `0x${string}`,
        abi: PricingDAOAbi.abi,
    };

    // Batch read all role checks in one call
    const { data, isLoading, error } = useReadContracts({
        contracts: [
            {
                ...contractConfig,
                functionName: 'hasRole',
                // TODO: Mettre l'adresse de la PMO
                args: [
                    '0x0000000000000000000000000000000000000000000000000000000000000000', // DEFAULT_ADMIN_ROLE
                    address,
                ],
            },
            {
                ...contractConfig,
                functionName: 'isProducer',
                args: [address],
            },
            {
                ...contractConfig,
                functionName: 'isConsumer',
                args: [address],
            },
        ],
        query: {
            enabled: isConnected && !!address && !!addresses?.pricingDAO,
        },
    });

    const role: UserRole = useMemo(() => {
        if (!data) return 'none';

        const [isAdmin, isProducer, isConsumer] = data;

        if (isAdmin.result === true) return 'pmo';
        if (isProducer.result === true) return 'producer';
        if (isConsumer.result === true) return 'consumer';

        return 'none';
    }, [data]);

    return {
        role,
        isLoading,
        error,
        isConnected,
        address,
    };
}
