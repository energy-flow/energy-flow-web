'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { useAaveVaultConfig } from './config';

type Address = `0x${string}` | undefined;

// Read owner() and compare with connected account
export function useIsOwner() {
    const { address, abi, enabled } = useAaveVaultConfig();
    const { address: account } = useAccount();

    const { data: owner, isLoading } = useReadContract({
        address,
        abi,
        functionName: 'owner',
        query: { enabled },
    });

    return {
        isOwner: owner !== undefined && account !== undefined && owner === account,
        isLoading,
        owner: owner as Address,
    };
}

// Read getAavePosition() - returns aEURC balance
export function useGetAavePosition() {
    const { address, abi, enabled } = useAaveVaultConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'getAavePosition',
        query: { enabled },
    });
}

// Read totalDeposited
export function useTotalDeposited() {
    const { address, abi, enabled } = useAaveVaultConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'totalDeposited',
        query: { enabled },
    });
}

// Read totalWithdrawn
export function useTotalWithdrawn() {
    const { address, abi, enabled } = useAaveVaultConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'totalWithdrawn',
        query: { enabled },
    });
}

// Read getPmoInfo(pmoAddress) - returns (deposited, withdrawn)
export function useGetPmoInfo(pmoAddress: Address) {
    const { address, abi, enabled } = useAaveVaultConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'getPmoInfo',
        args: pmoAddress ? [pmoAddress] : undefined,
        query: {
            enabled: enabled && !!pmoAddress,
        },
    });
}

// Write deposit(pmo, amount) - EURC uses 6 decimals
export function useDeposit() {
    const { address, abi } = useAaveVaultConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const deposit = (pmo: Address, amountEurc: string) => {
        if (!pmo) return;
        const amount = parseUnits(amountEurc, 6);
        writeContract({
            address,
            abi,
            functionName: 'deposit',
            args: [pmo, amount],
        });
    };

    return { deposit, isPending, isConfirming, isSuccess, error, reset };
}

// Write withdraw(pmo, amount) - EURC uses 6 decimals, withdraws directly to PMO
export function useWithdraw() {
    const { address, abi } = useAaveVaultConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const withdraw = (pmo: Address, amountEurc: string) => {
        if (!pmo) return;
        const amount = parseUnits(amountEurc, 6);
        writeContract({
            address,
            abi,
            functionName: 'withdraw',
            args: [pmo, amount],
        });
    };

    return { withdraw, isPending, isConfirming, isSuccess, error, reset };
}
