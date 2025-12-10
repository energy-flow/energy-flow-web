'use client';

import { ReactNode } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { usePricingDAOConfig, DEFAULT_ADMIN_ROLE } from '@/hooks/contracts/pricingDAO';

type Props = {
    children: ReactNode;
};

export function AdminRoleGuard({ children }: Props) {
    const { address, isConnected } = useAccount();
    const { address: contractAddress, abi, enabled } = usePricingDAOConfig();

    const { data: hasAdminRole, isLoading } = useReadContract({
        address: contractAddress,
        abi,
        functionName: 'hasRole',
        args: [DEFAULT_ADMIN_ROLE, address],
        query: {
            enabled: enabled && !!address,
        },
    });

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[200px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet not connected</AlertTitle>
                    <AlertDescription>
                        Please connect your wallet to access this section.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-pulse text-muted-foreground">
                    Checking permissions...
                </div>
            </div>
        );
    }

    if (!hasAdminRole) {
        return (
            <div className="flex items-center justify-center min-h-[200px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        Only platform administrators (ADMIN_ROLE) can access this section.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return <>{children}</>;
}
