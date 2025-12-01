import { useReadContract } from 'wagmi';
import { useChainId } from 'wagmi';
import PricingDAOAbi from '@/lib/contracts/abis/PricingDAO.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

export function useWorkflowStatus() {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

    return useReadContract({
        address: addresses?.pricingDAO as `0x${string}`,
        abi: PricingDAOAbi.abi,
        functionName: 'workflowStatus',
    });
}