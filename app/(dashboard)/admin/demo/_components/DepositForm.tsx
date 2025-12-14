'use client';

import { useState, useRef, useEffect } from 'react';
import { useDeposit, useApproveEurc, useEurcAllowance } from '@/hooks/contracts/AaveVault';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { parseUnits } from 'viem';
import { useChainId } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';

interface DepositFormProps {
    onSuccess: () => void;
}

export function DepositForm({ onSuccess }: DepositFormProps) {
    const [amount, setAmount] = useState('');
    const chainId = useChainId();
    const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    const decimals = addresses?.stablecoinDecimals ?? 6;

    const { data: allowance, refetch: refetchAllowance } = useEurcAllowance();

    // Approve hook
    const {
        approve,
        isPending: isApprovePending,
        isConfirming: isApproveConfirming,
        isSuccess: isApproveSuccess,
        error: approveError,
        reset: resetApprove,
    } = useApproveEurc();

    // Deposit hook
    const {
        deposit,
        isPending: isDepositPending,
        isConfirming: isDepositConfirming,
        isSuccess: isDepositSuccess,
        error: depositError,
        reset: resetDeposit,
    } = useDeposit();

    const prevApproveSuccessRef = useRef(isApproveSuccess);
    const prevDepositSuccessRef = useRef(isDepositSuccess);
    const prevApproveErrorRef = useRef(approveError);
    const prevDepositErrorRef = useRef(depositError);

    const isValidAmount = amount === '' || (!isNaN(Number(amount)) && Number(amount) > 0);
    const canSubmit = !isNaN(Number(amount)) && Number(amount) > 0;

    // Check if allowance is sufficient for the amount
    const amountBigInt = canSubmit ? parseUnits(amount, decimals) : BigInt(0);
    const hasEnoughAllowance = typeof allowance === 'bigint' && amountBigInt <= allowance;

    // Determine if we need to approve first
    const needsApproval = canSubmit && !hasEnoughAllowance;

    useEffect(() => {
        if (isApproveSuccess && !prevApproveSuccessRef.current) {
            toast.success('Approbation confirmee');
            refetchAllowance();
        }
        prevApproveSuccessRef.current = isApproveSuccess;
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (isDepositSuccess && !prevDepositSuccessRef.current) {
            toast.success('Depot confirme');
            onSuccess();
        }
        prevDepositSuccessRef.current = isDepositSuccess;
    }, [isDepositSuccess, onSuccess]);

    useEffect(() => {
        if (approveError && approveError !== prevApproveErrorRef.current) {
            toast.error(approveError.message);
        }
        prevApproveErrorRef.current = approveError;
    }, [approveError]);

    useEffect(() => {
        if (depositError && depositError !== prevDepositErrorRef.current) {
            toast.error(depositError.message);
        }
        prevDepositErrorRef.current = depositError;
    }, [depositError]);

    const handleApprove = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        approve(amount);
    };

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit || needsApproval) return;
        deposit(amount);
    };

    const handleReset = () => {
        setAmount('');
        resetApprove();
        resetDeposit();
    };

    const isLoading = isApprovePending || isApproveConfirming || isDepositPending || isDepositConfirming;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Depot EURC</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
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
                        {needsApproval ? (
                            <Button
                                type="button"
                                onClick={handleApprove}
                                disabled={!canSubmit || isLoading}
                                className="flex-1"
                            >
                                {isApprovePending
                                    ? 'Confirmation...'
                                    : isApproveConfirming
                                    ? 'Approbation en cours...'
                                    : '1. Approuver'}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleDeposit}
                                disabled={!canSubmit || isLoading}
                                className="flex-1"
                            >
                                {isDepositPending
                                    ? 'Confirmation...'
                                    : isDepositConfirming
                                    ? 'Depot en cours...'
                                    : 'Deposer'}
                            </Button>
                        )}
                        {isDepositSuccess && (
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
