'use client';

import { type EFTEvent } from '@/hooks/contracts/EFT';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface TransactionHistoryProps {
    events: EFTEvent[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

export function TransactionHistory({ events, isLoading, error, refetch }: TransactionHistoryProps) {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Historique des transactions</CardTitle>
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
                                    <th className="text-left py-2 px-2 font-medium">Adresse</th>
                                    <th className="text-right py-2 px-2 font-medium">Montant</th>
                                    <th className="text-left py-2 px-2 font-medium">ID Compteur</th>
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

function EventRow({ event }: { event: EFTEvent }) {
    return (
        <tr className="border-b last:border-b-0 hover:bg-muted/50">
            <td className="py-2 px-2">
                <Badge variant={event.type === 'mint' ? 'default' : 'destructive'}>
                    {event.type === 'mint' ? 'Mint' : 'Burn'}
                </Badge>
            </td>
            <td className="py-2 px-2 font-mono text-xs">
                {event.address.slice(0, 6)}...{event.address.slice(-4)}
            </td>
            <td className="py-2 px-2 text-right font-mono">
                {event.amount} kWh
            </td>
            <td className="py-2 px-2 text-muted-foreground">
                {event.meterId || '-'}
            </td>
            <td className="py-2 px-2 text-right text-muted-foreground font-mono text-xs">
                {event.blockNumber.toString()}
            </td>
        </tr>
    );
}
