'use client';

import { useState, useRef, useEffect } from 'react';
import { useDeposit } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isAddress } from 'viem';

interface DepositFormProps {
    onSuccess: () => void;
}

export function DepositForm({ onSuccess }: DepositFormProps) {
    const [pmoAddress, setPmoAddress] = useState('');
    const [amount, setAmount] = useState('');

    const { deposit, isPending, isConfirming, isSuccess, error, reset } = useDeposit();

    const prevSuccessRef = useRef(isSuccess);
    const prevErrorRef = useRef(error);

    const isValidAddress = pmoAddress === '' || isAddress(pmoAddress);
    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = isAddress(pmoAddress) && Number(amount) > 0;

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Deposit confirmé');
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
        deposit(pmoAddress as `0x${string}`, amount);
    };

    const handleReset = () => {
        setPmoAddress('');
        setAmount('');
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Dépot EURC</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Adresse PMO
                        </label>
                        <input
                            type="text"
                            value={pmoAddress}
                            onChange={(e) => setPmoAddress(e.target.value)}
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
                                Le montant doit être positif
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={!canSubmit || isPending || isConfirming}
                            className="flex-1"
                        >
                            {isPending ? 'Confirmation...' : isConfirming ? 'Deposit en cours...' : 'Deposit'}
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
