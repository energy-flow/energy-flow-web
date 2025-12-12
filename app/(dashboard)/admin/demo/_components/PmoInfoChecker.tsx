'use client';

import { useState } from 'react';
import { useGetPmoInfo } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatUnits, isAddress } from 'viem';

export function PmoInfoChecker() {
    const [address, setAddress] = useState('');
    const [checkedAddress, setCheckedAddress] = useState<`0x${string}` | undefined>();

    const { data: pmoInfo, isLoading } = useGetPmoInfo(checkedAddress);

    const isValidAddress = address === '' || isAddress(address);
    const canCheck = isAddress(address);

    const pmoData = pmoInfo as [bigint, bigint] | undefined;
    const formattedDeposited = pmoData ? formatUnits(pmoData[0], 6) : null;
    const formattedWithdrawn = pmoData ? formatUnits(pmoData[1], 6) : null;

    const handleCheck = () => {
        if (canCheck) {
            setCheckedAddress(address as `0x${string}`);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Infos PMO</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Adresse PMO
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

                    {checkedAddress && formattedDeposited !== null && (
                        <div className="p-4 bg-muted rounded-md space-y-3">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Déposé</div>
                                <div className="font-mono text-xl font-semibold text-green-600 dark:text-green-400">
                                    {formattedDeposited} <span className="text-base text-muted-foreground">EURC</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Retiré</div>
                                <div className="font-mono text-xl font-semibold text-orange-600 dark:text-orange-400">
                                    {formattedWithdrawn} <span className="text-base text-muted-foreground">EURC</span>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                                {checkedAddress}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
