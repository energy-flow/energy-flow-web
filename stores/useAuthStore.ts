import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/hooks/useUserRole';

type AuthState = {
    role: UserRole;
    address: string | null;
    isConnected: boolean;
    hasHydrated: boolean;
    setAuth: (auth: { role: UserRole; address: string | null; isConnected: boolean }) => void;
    reset: () => void;
    setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: 'none',
            address: null,
            isConnected: false,
            hasHydrated: false,
            setAuth: (auth) => set(auth),
            reset: () => set({ role: 'none', address: null, isConnected: false }),
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'auth-storage', // localStorage key
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);