'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAddMember } from '@/hooks/contracts/pricingDAO';
import { Loader2 } from 'lucide-react';
import { isAddress } from 'viem';

type AddMemberFormProps = {
    onSuccess?: () => void;
};

export function AddMemberForm({ onSuccess }: AddMemberFormProps) {
    const [address, setAddress] = useState('');
    const [isProducer, setIsProducer] = useState(true);
    const { addMember, isPending, isConfirming, isSuccess, error } = useAddMember();

    const isValidAddress = address === '' || isAddress(address);
    const canSubmit = isAddress(address) && !isPending && !isConfirming;

    useEffect(() => {
        if (isSuccess) {
            setAddress('');
            onSuccess?.();
        }
    }, [isSuccess, onSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        addMember(address as `0x${string}`, isProducer);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="address" className="text-sm font-medium">
                    Adresse du membre
                </label>
                <input
                    id="address"
                    type="text"
                    placeholder="0x..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`px-3 py-2 border rounded-md bg-background text-sm ${
                        !isValidAddress ? 'border-destructive' : 'border-input'
                    }`}
                />
                {!isValidAddress && (
                    <p className="text-sm text-destructive">Adresse invalide</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Rôle</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            checked={isProducer}
                            onChange={() => setIsProducer(true)}
                            className="accent-primary"
                        />
                        <span className="text-sm">Producteur</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="role"
                            checked={!isProducer}
                            onChange={() => setIsProducer(false)}
                            className="accent-primary"
                        />
                        <span className="text-sm">Consommateur</span>
                    </label>
                </div>
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    Erreur: {error.message}
                </p>
            )}

            <Button type="submit" disabled={!canSubmit}>
                {(isPending || isConfirming) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? 'Confirmation...' : isConfirming ? 'Transaction en cours...' : 'Ajouter le membre'}
            </Button>
        </form>
    );
}
