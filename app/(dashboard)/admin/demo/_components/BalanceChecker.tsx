'use client';

import { useState } from 'react';
import { useBalanceOf } from '@/hooks/contracts/EFT';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatUnits, isAddress } from 'viem';

export function BalanceChecker() {
    const [address, setAddress] = useState('');
    const [checkedAddress, setCheckedAddress] = useState<`0x${string}` | undefined>();

    const { data: balance, isLoading } = useBalanceOf(checkedAddress);

    const isValidAddress = address === '' || isAddress(address);
    const canCheck = isAddress(address);

    const formattedBalance = balance !== undefined ? formatUnits(balance as bigint, 18) : null;

    const handleCheck = () => {
        if (canCheck) {
            setCheckedAddress(address as `0x${string}`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Consulter le solde</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Adresse
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="0x..."
                            className={`w-full px-3 py-2 border rounded-md bg-background font-mono text-sm ${
                                !isValidAddress ? 'border-destructive' : 'border-input'
                            }`}
                        />
                        {!isValidAddress && (
                            <p className="text-sm text-destructive mt-1">Adresse invalide</p>
                        )}
                    </div>

                    <Button
                        onClick={handleCheck}
                        disabled={!canCheck || isLoading}
                        className="w-full"
                        variant="outline"
                    >
                        {isLoading ? 'Vérification...' : 'Vérifier'}
                    </Button>

                    {checkedAddress && formattedBalance !== null && (
                        <div className="p-4 bg-muted rounded-md">
                            <div className="text-sm text-muted-foreground mb-1">Solde</div>
                            <div className="font-mono text-2xl font-semibold">
                                {formattedBalance} <span className="text-base text-muted-foreground">kWh</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                                {checkedAddress}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
