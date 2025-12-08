'use client';

import { useCallback } from 'react';
import { TokenInfo } from './_components/TokenInfo';
import { MintForm } from './_components/MintForm';
import { BurnForm } from './_components/BurnForm';
import { BalanceChecker } from './_components/BalanceChecker';
import { TransactionHistory } from './_components/TransactionHistory';
import { AaveVaultInfo } from './_components/AaveVaultInfo';
import { DepositForm } from './_components/DepositForm';
import { WithdrawForm } from './_components/WithdrawForm';
import { PmoInfoChecker } from './_components/PmoInfoChecker';
import { AaveVaultHistory } from './_components/AaveVaultHistory';
import { OwnerGuard } from '@/components/auth/OwnerGuard';
import { useGetAavePosition, useTotalDeposited, useTotalWithdrawn } from '@/hooks/contracts/AaveVault';
import { useTotalSupply, useGetEFTEvents } from '@/hooks/contracts/EFT';

export default function DemoPage() {
    // EFT hooks
    const { data: totalSupply, isLoading: isLoadingSupply, refetch: refetchSupply } = useTotalSupply();
    const { events, isLoading: isLoadingEvents, error: eventsError, refetch: refetchEvents } = useGetEFTEvents(50);

    const refetchEFT = useCallback(() => {
        refetchSupply();
        refetchEvents();
    }, [refetchSupply, refetchEvents]);

    // AaveVault hooks
    const { data: aavePosition, isLoading: isLoadingPosition, refetch: refetchPosition } = useGetAavePosition();
    const { data: totalDeposited, isLoading: isLoadingDeposited, refetch: refetchDeposited } = useTotalDeposited();
    const { data: totalWithdrawn, isLoading: isLoadingWithdrawn, refetch: refetchWithdrawn } = useTotalWithdrawn();

    const isLoadingVault = isLoadingPosition || isLoadingDeposited || isLoadingWithdrawn;

    const refetchVault = useCallback(() => {
        refetchPosition();
        refetchDeposited();
        refetchWithdrawn();
    }, [refetchPosition, refetchDeposited, refetchWithdrawn]);

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            {/* Section EFT */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Token EFT</h1>
                <p className="text-muted-foreground">
                    Démonstration du cycle de vie du token EFT : mint, burn et consultation des soldes
                </p>
            </div>

            <div className="space-y-6">
                <TokenInfo
                    totalSupply={totalSupply as bigint | undefined}
                    isLoading={isLoadingSupply}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MintForm onSuccess={refetchEFT} />
                    <BurnForm onSuccess={refetchEFT} />
                    <BalanceChecker />
                </div>

                <TransactionHistory
                    events={events}
                    isLoading={isLoadingEvents}
                    error={eventsError}
                    refetch={refetchEvents}
                />
            </div>

            {/* Section Aave Vault */}
            <div className="mt-12 mb-6">
                <h2 className="text-2xl font-bold">Aave Vault</h2>
                <p className="text-muted-foreground">
                    Gestion des dépôts EURC dans Aave V3 pour générer des rendements
                </p>
            </div>

            <OwnerGuard>
                <div className="space-y-6">
                    <AaveVaultInfo
                        aavePosition={aavePosition as bigint | undefined}
                        totalDeposited={totalDeposited as bigint | undefined}
                        totalWithdrawn={totalWithdrawn as bigint | undefined}
                        isLoading={isLoadingVault}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DepositForm onSuccess={refetchVault} />
                        <WithdrawForm onSuccess={refetchVault} />
                        <PmoInfoChecker />
                    </div>

                    <AaveVaultHistory />
                </div>
            </OwnerGuard>
        </div>
    );
}
