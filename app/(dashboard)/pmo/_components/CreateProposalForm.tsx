'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCreateProposal } from '@/hooks/contracts/pricingDAO';
import { Loader2 } from 'lucide-react';

type CreateProposalFormProps = {
    onSuccess?: () => void;
    disabled?: boolean;
};

export function CreateProposalForm({ onSuccess, disabled }: CreateProposalFormProps) {
    const [price, setPrice] = useState('');
    const { createProposal, isPending, isConfirming, isSuccess, error } = useCreateProposal();

    const prevErrorRef = useRef(error);
    const prevSuccessRef = useRef(isSuccess);

    const priceNumber = parseFloat(price);
    const isValidPrice = price === '' || (!isNaN(priceNumber) && priceNumber > 0);
    const canSubmit = !isNaN(priceNumber) && priceNumber > 0 && !isPending && !isConfirming && !disabled;

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast.error(error.message);
        }
        prevErrorRef.current = error;
    }, [error]);

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Proposition créée avec succès');
            setPrice('');
            onSuccess?.();
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess, onSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        createProposal(price);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                    Prix proposé (€/kWh)
                </label>
                <div className="relative">
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.15"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={disabled}
                        className={`w-full px-3 py-2 pr-12 border rounded-md bg-background text-sm ${
                            !isValidPrice ? 'border-destructive' : 'border-input'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        €/kWh
                    </span>
                </div>
                {!isValidPrice && (
                    <p className="text-sm text-destructive">Le prix doit être supérieur à 0</p>
                )}
            </div>

            {disabled && (
                <p className="text-sm text-muted-foreground">
                    La phase de proposition doit être démarrée pour créer une proposition.
                </p>
            )}

            <Button type="submit" disabled={!canSubmit}>
                {(isPending || isConfirming) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? 'Confirmation...' : isConfirming ? 'Transaction en cours...' : 'Proposer ce prix'}
            </Button>
        </form>
    );
}
