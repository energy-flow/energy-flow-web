import { useChainId } from 'wagmi';
import PricingDAOAbi from '@/lib/contracts/abis/PricingDAO.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { type Abi } from 'viem';

export const pricingDAOAbi = PricingDAOAbi.abi as Abi;

export function usePricingDAOConfig() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return {
        address: addresses?.pricingDAO as `0x${string}`,
        abi: pricingDAOAbi,
        enabled: !!addresses?.pricingDAO,
    };
}
