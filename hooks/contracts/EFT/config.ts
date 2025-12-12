import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import EFTAbiJson from '@/lib/contracts/abis/EFT.json';
import type { Abi } from 'viem';

export const eftAbi = EFTAbiJson.abi as Abi;

export function useEFTConfig() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return {
        address: addresses?.EFT as `0x${string}`,
        abi: eftAbi,
        enabled: !!addresses?.EFT,
    };
}
