'use client';

import { TokenInfo, MintForm, BurnForm, BalanceChecker, TransactionHistory } from './_components';

export default function DemoPage() {
    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Démo EFT</h1>
                <p className="text-muted-foreground">
                    Démonstration du cycle de vie du token EFT : mint, burn et consultation des soldes
                </p>
            </div>

            <div className="space-y-6">
                <TokenInfo />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MintForm />
                    <BurnForm />
                    <BalanceChecker />
                </div>

                <TransactionHistory />
            </div>
        </div>
    );
}
