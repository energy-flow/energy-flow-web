'use client';

import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

interface AaveVaultInfoProps {
    aavePosition: bigint | undefined;
    totalDeposited: bigint | undefined;
    totalWithdrawn: bigint | undefined;
    isLoading: boolean;
}

export function AaveVaultInfo({ aavePosition, totalDeposited, totalWithdrawn, isLoading }: AaveVaultInfoProps) {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;

    const formattedPosition = aavePosition !== undefined ? formatUnits(aavePosition, decimals) : '0';
    const formattedDeposited = totalDeposited !== undefined ? formatUnits(totalDeposited, decimals) : '0';
    const formattedWithdrawn = totalWithdrawn !== undefined ? formatUnits(totalWithdrawn, decimals) : '0';

    // Calculate interest
    const netDeposited = (totalDeposited ?? BigInt(0)) - (totalWithdrawn ?? BigInt(0));
    const interest = (aavePosition ?? BigInt(0)) - netDeposited;
    const interestNum = Number(formatUnits(interest, decimals));
    const netDepositedNum = Number(formatUnits(netDeposited, decimals));
    const interestPercent = netDepositedNum > 0 ? (interestNum / netDepositedNum) * 100 : 0;

    const isPositive = interest >= BigInt(0);
    const sign = isPositive ? '+' : '';
    const interestColor = isPositive
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400';

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    Position Aave
                    <Badge variant="secondary">aEURC</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Balance aEURC</span>
                        <span className="font-mono font-semibold text-lg text-green-600 dark:text-green-400">
                            {isLoading ? '...' : `${formattedPosition} EURC`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Total déposé</span>
                        <span className="font-mono font-semibold text-lg">
                            {isLoading ? '...' : `${formattedDeposited} EURC`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Total retiré</span>
                        <span className="font-mono font-semibold text-lg text-orange-600 dark:text-orange-400">
                            {isLoading ? '...' : `${formattedWithdrawn} EURC`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Intérêts générés</span>
                        <span className={`font-mono font-semibold text-lg ${interestColor}`}>
                            {isLoading ? '...' : `${sign}${interestNum.toFixed(2)} EURC`}
                        </span>
                        <span className={`font-mono text-sm ${interestColor}`}>
                            {isLoading ? '' : `(${sign}${interestPercent.toFixed(2)}%)`}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
