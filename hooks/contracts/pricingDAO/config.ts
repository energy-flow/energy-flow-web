import { useChainId } from 'wagmi';
import PricingDAOAbi from '@/lib/contracts/abis/PricingDAO.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { type Abi, keccak256, toBytes } from 'viem';

export const pricingDAOAbi = PricingDAOAbi.abi as Abi;

// Role constants matching the smart contract
export const PMO_ROLE = keccak256(toBytes('PMO_ROLE'));
export const MEMBER_ROLE = keccak256(toBytes('MEMBER_ROLE'));

export function usePricingDAOConfig() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return {
        address: addresses?.pricingDAO as `0x${string}`,
        abi: pricingDAOAbi,
        enabled: !!addresses?.pricingDAO,
    };
}
