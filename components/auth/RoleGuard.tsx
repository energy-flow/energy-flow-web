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
 * Guards pages by role. Redirects to the user's correct dashboard if they don't have access.
 * Connection check is handled by proxy.ts.
 */
export function RoleGuard({ allowedRoles, children }: Props) {
    const router = useRouter();

    const {
        role,
        hasHydrated
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
        // Wait for Zustand to hydrate from localStorage
        if (!hasHydrated) {
            return
        }
        if (redirectTarget) {
            router.replace(redirectTarget);
        }
    }, [redirectTarget, router, hasHydrated]);

    if (redirectTarget) {
        return null;
    }

    return <>{children}</>;
}

