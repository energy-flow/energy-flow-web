'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { useEFTConfig } from './config';

type TxHash = `0x${string}` | undefined;

export function useBalanceOf(account: TxHash) {
    const { address, abi, enabled } = useEFTConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'balanceOf',
        args: account ? [account] : undefined,
        query: {
            enabled: enabled && !!account,
        },
    });
}

export function useTotalSupply() {
    const { address, abi, enabled } = useEFTConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'totalSupply',
        query: { enabled },
    });
}

export function useHasMinterRole(account: TxHash) {
    const { address, abi, enabled } = useEFTConfig();

    // Lit le hash du MINTER_ROLE depuis le contrat
    const { data: minterRoleHash } = useReadContract({
        address,
        abi,
        functionName: 'MINTER_ROLE',
        query: { enabled },
    });

    // Verifie si l'account a ce rôle
    return useReadContract({
        address,
        abi,
        functionName: 'hasRole',
        args: minterRoleHash && account ? [minterRoleHash, account] : undefined,
        query: {
            enabled: enabled && !!minterRoleHash && !!account,
        },
    });
}

export function useMint() {
    const { address, abi } = useEFTConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const mint = (to: TxHash, amountKwh: string, meterId: string) => {
        const amountWei = parseUnits(amountKwh, 18);
        writeContract({
            address,
            abi,
            functionName: 'mint',
            args: [to, amountWei, meterId],
        });
    };

    return { mint, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useBurnFrom() {
    const { address, abi } = useEFTConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const burnFrom = (account: TxHash, amountKwh: string) => {
        const amountWei = parseUnits(amountKwh, 18);
        writeContract({
            address,
            abi,
            functionName: 'burnFrom',
            args: [account, amountWei],
        });
    };

    return { burnFrom, isPending, isConfirming, isSuccess, error, hash, reset };
}
