'use client';

import { useGetAaveVaultEvents, type AaveVaultEvent } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function AaveVaultHistory() {
    const { events, isLoading, error, refetch } = useGetAaveVaultEvents(50);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Historique Aave Vault</CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={refetch}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="text-sm text-destructive mb-4">
                        Erreur de chargement : {error.message}
                    </div>
                )}

                {events.length === 0 && !isLoading && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        Aucune transaction
                    </div>
                )}

                {isLoading && events.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                        Chargement...
                    </div>
                )}

                {events.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-2 font-medium">Type</th>
                                    <th className="text-right py-2 px-2 font-medium">Montant</th>
                                    <th className="text-right py-2 px-2 font-medium">Bloc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <EventRow key={`${event.transactionHash}-${index}`} event={event} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function EventRow({ event }: { event: AaveVaultEvent }) {
    return (
        <tr className="border-b last:border-b-0 hover:bg-muted/50">
            <td className="py-2 px-2">
                <Badge variant={event.type === 'deposit' ? 'default' : 'destructive'}>
                    {event.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                </Badge>
            </td>
            <td className="py-2 px-2 text-right font-mono">
                {event.amount} EURC
            </td>
            <td className="py-2 px-2 text-right text-muted-foreground font-mono text-xs">
                {event.blockNumber.toString()}
            </td>
        </tr>
    );
}
