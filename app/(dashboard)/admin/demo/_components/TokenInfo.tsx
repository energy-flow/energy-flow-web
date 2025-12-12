'use client';

import { formatUnits } from 'viem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TokenInfoProps {
    totalSupply: bigint | undefined;
    isLoading: boolean;
}

export function TokenInfo({ totalSupply, isLoading }: TokenInfoProps) {
    const formattedSupply = totalSupply !== undefined ? formatUnits(totalSupply, 18) : '0';

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    Infos Token
                    <Badge variant="secondary">EFT</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Supply totale</span>
                    <span className="font-mono font-semibold">
                        {isLoading ? '...' : `${formattedSupply} kWh`}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
