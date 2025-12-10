'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { usePricingDAOConfig } from './config';

export function useGetMaxPrice() {
    const { address, abi, enabled } = usePricingDAOConfig();

    const { data, isLoading, error, refetch } = useReadContract({
        address,
        abi,
        functionName: 'maxPrice',
        query: { enabled },
    });

    return {
        maxPrice: data as bigint | undefined,
        maxPriceFormatted: data ? formatUnits(data as bigint, 6) : null,
        isLoading,
        error,
        refetch,
    };
}

export function useSetMaxPrice() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const setMaxPrice = (priceInEuros: string) => {
        const priceInWei = parseUnits(priceInEuros, 6);

        writeContract({
            address,
            abi,
            functionName: 'setMaxPrice',
            args: [priceInWei],
        });
    };

    return {
        setMaxPrice,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}
