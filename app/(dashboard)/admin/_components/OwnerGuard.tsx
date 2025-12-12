'use client';

import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useIsOwner } from '@/hooks/contracts/AaveVault';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Props = {
    children: ReactNode;
};

export function OwnerGuard({ children }: Props) {
    const { isConnected } = useAccount();
    const { isOwner, isLoading } = useIsOwner();

    if (!isConnected) {
        return (
            <div className="flex items-center justify-center min-h-[200px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Wallet non connecté</AlertTitle>
                    <AlertDescription>
                        Veuillez connecter votre wallet pour accéder à cette section.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-pulse text-muted-foreground">
                    Vérification des permissions...
                </div>
            </div>
        );
    }

    if (!isOwner) {
        return (
            <div className="flex items-center justify-center min-h-[200px] p-6">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Accès refusé</AlertTitle>
                    <AlertDescription>
                        Seul le propriétaire (Owner) du contrat AaveVault peut accéder à cette section.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return <>{children}</>;
}
