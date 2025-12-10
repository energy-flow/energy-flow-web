'use client';

import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useHasMinterRole } from '@/hooks/contracts/EFT';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Props = {
    children: ReactNode;
};

export function MinterRoleGuard({ children }: Props) {
    const { address, isConnected } = useAccount();
    const { data: hasMinterRole, isLoading } = useHasMinterRole(address);

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet not connected</AlertTitle>
                    <AlertDescription>
                        Please connect your wallet to access this page.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse text-muted-foreground">
                    Checking permissions...
                </div>
            </div>
        );
    }

    if (!hasMinterRole) {
        return (
            <div className="flex items-center justify-center min-h-[400px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        You need the MINTER_ROLE to access this demo page.
                        Contact your administrator to get access.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return <>{children}</>;
}
