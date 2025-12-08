'use client';

import { useState, useRef, useEffect } from 'react';
import { useMint } from '@/hooks/contracts/EFT';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isAddress } from 'viem';

export function MintForm() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [meterId, setMeterId] = useState('');

    const { mint, isPending, isConfirming, isSuccess, error, reset } = useMint();

    const prevSuccessRef = useRef(isSuccess);
    const prevErrorRef = useRef(error);

    const isValidAddress = recipient === '' || isAddress(recipient);
    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = isAddress(recipient) && Number(amount) > 0 && meterId.trim() !== '';

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Transaction confirmée');
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess]);

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast.error(error.message);
        }
        prevErrorRef.current = error;
    }, [error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        mint(recipient as `0x${string}`, amount, meterId);
    };

    const handleReset = () => {
        setRecipient('');
        setAmount('');
        setMeterId('');
        reset();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Mint EFT</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Adresse du destinataire
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
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
                            Montant (kWh)
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

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            ID Compteur
                        </label>
                        <input
                            type="text"
                            value={meterId}
                            onChange={(e) => setMeterId(e.target.value)}
                            placeholder="METER-001"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={!canSubmit || isPending || isConfirming}
                            className="flex-1"
                        >
                            {isPending ? 'Confirmation...' : isConfirming ? 'Mint en cours...' : 'Mint'}
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
