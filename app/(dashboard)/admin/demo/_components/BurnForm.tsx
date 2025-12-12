'use client';

import { useState, useRef, useEffect } from 'react';
import { useBurnFrom } from '@/hooks/contracts/EFT';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isAddress } from 'viem';

interface BurnFormProps {
    onSuccess: () => void;
}

export function BurnForm({ onSuccess }: BurnFormProps) {
    const [account, setAccount] = useState('');
    const [amount, setAmount] = useState('');

    const { burnFrom, isPending, isConfirming, isSuccess, error, reset } = useBurnFrom();

    const prevSuccessRef = useRef(isSuccess);
    const prevErrorRef = useRef(error);

    const isValidAddress = account === '' || isAddress(account);
    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = isAddress(account) && Number(amount) > 0;

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Transaction de burn confirmée');
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
        burnFrom(account as `0x${string}`, amount);
    };

    const handleReset = () => {
        setAccount('');
        setAmount('');
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Burn EFT</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Adresse du compte
                        </label>
                        <input
                            type="text"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                            placeholder="0x..."
                            className={`w-full px-3 py-2 border rounded-md bg-background font-mono text-sm ${
                                !isValidAddress ? 'border-destructive' : 'border-input'
                            }`}
                        />
                        {!isValidAddress && (
                            <p className="text-sm text-destructive mt-1">Adresse invalide</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Amount (kWh)
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
                                Le montant doit être positif
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
                            {isPending ? 'Confirmation...' : isConfirming ? 'Burn en cours...' : 'Burn'}
                        </Button>
                        {isSuccess && (
                            <Button type="button" variant="outline" onClick={handleReset}>
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
