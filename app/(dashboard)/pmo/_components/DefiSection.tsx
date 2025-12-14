'use client';

import { formatUnits } from 'viem';
import { useChainId } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

interface DefiSectionProps {
    pmoDeposited: bigint | undefined;
    pmoWithdrawn: bigint | undefined;
    totalDeposited: bigint | undefined;
    totalWithdrawn: bigint | undefined;
    aavePosition: bigint | undefined;
    isLoading: boolean;
}

export function DefiSection({
    pmoDeposited,
    pmoWithdrawn,
    totalDeposited,
    totalWithdrawn,
    aavePosition,
    isLoading,
}: DefiSectionProps) {
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;

    // Calculate PMO capital
    const pmoCapital = (pmoDeposited ?? BigInt(0)) - (pmoWithdrawn ?? BigInt(0));

    // Calculate global interest
    const totalNet = (totalDeposited ?? BigInt(0)) - (totalWithdrawn ?? BigInt(0));
    const globalInterest = (aavePosition ?? BigInt(0)) - totalNet;

    // Calculate PMO proportional interest
    let pmoInterest = BigInt(0);
    if (totalNet > BigInt(0) && pmoCapital > BigInt(0)) {
        pmoInterest = (pmoCapital * globalInterest) / totalNet;
    }

    // Convert to numbers for display
    const pmoCapitalNum = Number(formatUnits(pmoCapital, decimals));
    const pmoInterestNum = Number(formatUnits(pmoInterest, decimals));
    const aavePositionNum = Number(formatUnits(aavePosition ?? BigInt(0), decimals));

    // Calculate yield percentage
    const yieldPercent = pmoCapitalNum > 0 ? (pmoInterestNum / pmoCapitalNum) * 100 : 0;

    const isPositive = pmoInterest >= BigInt(0);
    const sign = isPositive ? '+' : '';
    const interestColor = isPositive
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-600 dark:text-red-400';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Rendements DeFi
                    <Badge variant="secondary">Aave V3</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Capital investi</span>
                        <span className="font-mono font-semibold text-lg">
                            {isLoading ? '...' : `${pmoCapitalNum.toFixed(2)} EURC`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Intérêts générés</span>
                        <span className={`font-mono font-semibold text-lg ${interestColor}`}>
                            {isLoading ? '...' : `${sign}${pmoInterestNum.toFixed(2)} EURC`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Taux de rendement</span>
                        <span className={`font-mono font-semibold text-lg ${interestColor}`}>
                            {isLoading ? '...' : `${sign}${yieldPercent.toFixed(2)}%`}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Position globale</span>
                        <span className="font-mono font-semibold text-lg text-muted-foreground">
                            {isLoading ? '...' : `${aavePositionNum.toFixed(2)} EURC`}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
