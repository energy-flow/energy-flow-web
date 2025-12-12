'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/hooks/useUserRole';
import { ROLE_ROUTES } from '@/lib/constants';

type Props = {
    allowedRoles: UserRole[];
    children: ReactNode;
};

/**
 * Connection check is handled by proxy.ts.
 */
export function RoleGuard({ allowedRoles, children }: Props) {
    const router = useRouter();

    const {
        role,
        hasHydrated,
        isRoleLoading
    } = useAuthStore();

    const redirectTarget = (() => {
        if (role === 'none') {
            return '/';
        }
        if (!allowedRoles.includes(role)) {
            return ROLE_ROUTES[role][0];
        }
        return null;
    })();

    useEffect(() => {
        // Wait for Zustand hydration AND role loading from contract
        if (!hasHydrated || isRoleLoading) {
            return;
        }
        if (redirectTarget) {
            router.replace(redirectTarget);
        }
    }, [redirectTarget, router, hasHydrated, isRoleLoading]);

    // Don't render until hydrated and role is loaded
    if (!hasHydrated || isRoleLoading) {
        return null;
    }

    if (redirectTarget) {
        return null;
    }

    return <>{children}</>;
}

