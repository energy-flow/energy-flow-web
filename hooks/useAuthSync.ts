'use client';

import { useEffect } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUserRole } from './useUserRole';

/**
 * Syncs wallet connection state to Zustand store and manages the wallet cookie.
 * Redirects are handled by:
 * - proxy.ts (middleware): connection check
 * - RoleGuard: role-based access
 */
export function useAuthSync() {
    const { address, isConnected } = useAccount();
    const { role, isLoading } = useUserRole();
    const { setAuth, reset, setRoleLoading } = useAuthStore();

    // Sync loading state
    useEffect(() => {
        setRoleLoading(isLoading);
    }, [isLoading, setRoleLoading]);

    // Sync role to store when it changes
    useEffect(() => {
        if (!isLoading && isConnected && address) {
            setAuth({ role, address, isConnected: true });
        }
    }, [role, isLoading, isConnected, address, setAuth]);

    useAccountEffect({
        onConnect({ address }) {
            document.cookie = `wallet-connected=${address}; path=/; max-age=86400; SameSite=Strict`;
        },
        onDisconnect() {
            document.cookie = 'wallet-connected=; path=/; max-age=0';
            reset();
            window.location.href = '/';
        },
    });

    return { isLoading };
}
