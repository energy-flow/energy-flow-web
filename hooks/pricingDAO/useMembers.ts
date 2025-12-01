'use client';

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useMemo } from 'react';
import { usePricingDAOConfig } from './config';

// ============ Types ============

export type DAOMember = {
    address: `0x${string}`;
    role: 'producer' | 'consumer';
};

// ============ Read Hooks ============

export function useDAOMembers() {
    const { address, abi, enabled } = usePricingDAOConfig();

    // Get member addresses
    const {
        data: memberAddresses,
        isLoading: isLoadingMembers,
        error: membersError,
        refetch,
    } = useReadContract({
        address,
        abi,
        functionName: 'getMembers',
        query: { enabled },
    });

    // Get role for each member
    const roleContracts = useMemo(() => {
        if (!memberAddresses || !Array.isArray(memberAddresses)) return [];

        return memberAddresses.map((addr: `0x${string}`) => ({
            address,
            abi,
            functionName: 'isProducer' as const,
            args: [addr] as const,
        }));
    }, [memberAddresses, address, abi]);

    const { data: roleResults, isLoading: isLoadingRoles } = useReadContracts({
        contracts: roleContracts,
        query: { enabled: roleContracts.length > 0 },
    });

    const members: DAOMember[] = useMemo(() => {
        if (!memberAddresses || !Array.isArray(memberAddresses) || !roleResults) {
            return [];
        }

        return memberAddresses.map((addr: `0x${string}`, index: number) => ({
            address: addr,
            role: roleResults[index]?.result === true ? 'producer' : 'consumer',
        }));
    }, [memberAddresses, roleResults]);

    return {
        members,
        isLoading: isLoadingMembers || isLoadingRoles,
        error: membersError,
        refetch,
    };
}

// ============ Write Hooks ============

export function useAddMember() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const addMember = (memberAddress: `0x${string}`, isProducer: boolean) => {
        writeContract({
            address,
            abi,
            functionName: 'addMember',
            args: [memberAddress, isProducer],
        });
    };

    return {
        addMember,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}

export function useRemoveMember() {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const removeMember = (memberAddress: `0x${string}`) => {
        writeContract({
            address,
            abi,
            functionName: 'removeMember',
            args: [memberAddress],
        });
    };

    return {
        removeMember,
        isPending,
        isConfirming,
        isSuccess,
        error,
        hash,
    };
}
