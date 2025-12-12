'use client';

import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import AaveVaultAbiJson from '@/lib/contracts/abis/AaveVault.json';
import type { Abi } from 'viem';

export const aaveVaultAbi = AaveVaultAbiJson.abi as Abi;

export function useAaveVaultConfig() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return {
        address: addresses?.AaveVault as `0x${string}`,
        abi: aaveVaultAbi,
        enabled: !!addresses?.AaveVault,
    };
}
