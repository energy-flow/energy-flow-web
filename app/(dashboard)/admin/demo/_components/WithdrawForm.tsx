'use client';

import { useState, useRef, useEffect } from 'react';
import { useWithdraw } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isAddress } from 'viem';

interface WithdrawFormProps {
    onSuccess: () => void;
}

export function WithdrawForm({ onSuccess }: WithdrawFormProps) {
    const [pmoAddress, setPmoAddress] = useState('');
    const [amount, setAmount] = useState('');

    const { withdraw, isPending, isConfirming, isSuccess, error, reset } = useWithdraw();

    const prevSuccessRef = useRef(isSuccess);
    const prevErrorRef = useRef(error);

    const isValidPmoAddress = pmoAddress === '' || isAddress(pmoAddress);
    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = isAddress(pmoAddress) && Number(amount) > 0;

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Withdraw confirmé');
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
        withdraw(pmoAddress as `0x${string}`, amount);
    };

    const handleReset = () => {
        setPmoAddress('');
        setAmount('');
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Withdraw EURC</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Destinataire (PMO)
                        </label>
                        <input
                            type="text"
                            value={pmoAddress}
                            onChange={(e) => setPmoAddress(e.target.value)}
                            placeholder="0x..."
                            className={`w-full px-3 py-2 border rounded-md bg-background font-mono text-sm ${
                                !isValidPmoAddress ? 'border-destructive' : 'border-input'
                            }`}
                        />
                        {!isValidPmoAddress && (
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
                            variant="destructive"
                            disabled={!canSubmit || isPending || isConfirming}
                            className="flex-1"
                        >
                            {isPending ? 'Confirmation...' : isConfirming ? 'Withdraw en cours...' : 'Withdraw'}
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
