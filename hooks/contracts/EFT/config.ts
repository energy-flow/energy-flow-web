import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { pricingDAOAbi } from '@/hooks/contracts/pricingDAO/config';

export function useEFTConfig() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return {
        address: addresses?.pricingDAO as `0x${string}`,
        abi: pricingDAOAbi,
        enabled: !!addresses?.pricingDAO,
    };
}
