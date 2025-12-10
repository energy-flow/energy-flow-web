'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGetMaxPrice, useSetMaxPrice } from '@/hooks/contracts/pricingDAO';

type Props = {
    onSuccess?: () => void;
};

export function SetMaxPriceSection({ onSuccess }: Props) {
    const [price, setPrice] = useState('');
    const { maxPrice, maxPriceFormatted, isLoading: isLoadingPrice, refetch } = useGetMaxPrice();
    const { setMaxPrice, isPending, isConfirming, isSuccess, error, reset } = useSetMaxPrice();

    useEffect(() => {
        if (isSuccess) {
            toast.success('Prix maximum mis à jour avec succès');
            setPrice('');
            refetch();
            reset();
            onSuccess?.();
        }
    }, [isSuccess, refetch, reset, onSuccess]);

    useEffect(() => {
        if (error) {
            toast.error('Échec de la mise à jour du prix maximum', {
                description: error.message,
            });
        }
    }, [error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!price) return;
        setMaxPrice(price);
    };

    const displayMaxPrice = () => {
        if (isLoadingPrice) return 'Chargement...';
        if (!maxPrice || maxPrice === BigInt(0)) return '0 (pas de limite)';
        return `${maxPriceFormatted} EUR/kWh`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Définir le prix maximum</CardTitle>
                <CardDescription>
                    Définir le prix maximum autorisé pour les propositions (ex : tarif EDF)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 text-sm text-muted-foreground">
                    Prix maximum actuel : {displayMaxPrice()}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        step="0.000001"
                        min="0"
                        placeholder="Nouveau prix maximum (EUR/kWh)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                    <Button
                        type="submit"
                        disabled={isPending || isConfirming || !price}
                        className="w-full"
                    >
                        {isPending ? 'Confirmation...' : isConfirming ? 'Traitement...' : 'Mettre à jour'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
