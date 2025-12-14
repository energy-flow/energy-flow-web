'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useChainId } from 'wagmi';
import { parseUnits } from 'viem';
import { useAaveVaultConfig } from './config';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import ERC20AbiJson from '@/lib/contracts/abis/ERC20.json';
import type { Abi } from 'viem';

type Address = `0x${string}` | undefined;
const erc20Abi = ERC20AbiJson.abi as Abi;

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

// Read EURC allowance for vault
export function useEurcAllowance() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const eurcAddress = addresses?.EURC as `0x${string}`;
    const vaultAddress = addresses?.AaveVault as `0x${string}`;
    const { address: account } = useAccount();

    return useReadContract({
        address: eurcAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: account && vaultAddress ? [account, vaultAddress] : undefined,
        query: {
            enabled: !!eurcAddress && !!vaultAddress && !!account,
        },
    });
}

// Approve vault to spend EURC/EURS
export function useApproveEurc() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const eurcAddress = addresses?.EURC as `0x${string}`;
    const vaultAddress = addresses?.AaveVault as `0x${string}`;
    const decimals = addresses?.stablecoinDecimals ?? 6;

    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const approve = (amountEurc: string) => {
        if (!vaultAddress || !eurcAddress) return;
        const amount = parseUnits(amountEurc, decimals);
        writeContract({
            address: eurcAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [vaultAddress, amount],
        });
    };

    return { approve, isPending, isConfirming, isSuccess, error, reset };
}

// Write deposit(amount)
export function useDeposit() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;
    const { address, abi } = useAaveVaultConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const deposit = (amountEurc: string) => {
        const amount = parseUnits(amountEurc, decimals);
        writeContract({
            address,
            abi,
            functionName: 'deposit',
            args: [amount],
        });
    };

    return { deposit, isPending, isConfirming, isSuccess, error, reset };
}

// Write withdraw(amount)
export function useWithdraw() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;
    const { address, abi } = useAaveVaultConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const withdraw = (amountEurc: string) => {
        const amount = parseUnits(amountEurc, decimals);
        writeContract({
            address,
            abi,
            functionName: 'withdraw',
            args: [amount],
        });
    };

    return { withdraw, isPending, isConfirming, isSuccess, error, reset };
}
