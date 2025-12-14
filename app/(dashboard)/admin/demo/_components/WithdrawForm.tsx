'use client';

import { useState, useRef, useEffect } from 'react';
import { useWithdraw } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WithdrawFormProps {
    onSuccess: () => void;
}

export function WithdrawForm({ onSuccess }: WithdrawFormProps) {
    const [amount, setAmount] = useState('');

    const { withdraw, isPending, isConfirming, isSuccess, error, reset } = useWithdraw();

    const prevSuccessRef = useRef(isSuccess);
    const prevErrorRef = useRef(error);

    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = !isNaN(Number(amount)) && Number(amount) > 0;

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Retrait confirme');
            onSuccess();
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess, onSuccess]);

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast.error(error.message);
        }
        prevErrorRef.current = error;
    }, [error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        withdraw(amount);
    };

    const handleReset = () => {
        setAmount('');
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Retrait EURC</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Montant (EURC)
                        </label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100"
                            className={`w-full px-3 py-2 border rounded-md bg-background ${
                                !isValidAmount ? 'border-destructive' : 'border-input'
                            }`}
                        />
                        {!isValidAmount && (
                            <p className="text-sm text-destructive mt-1">
                                Le montant doit etre positif
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={!canSubmit || isPending || isConfirming}
                            className="flex-1"
                        >
                            {isPending ? 'Confirmation...' : isConfirming ? 'Retrait en cours...' : 'Retirer'}
                        </Button>
                        {isSuccess && (
                            <Button type="button" variant="outline" onClick={handleReset}>
                                Reinitialiser
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
