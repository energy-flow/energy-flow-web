'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { type WorkflowAction, useWorkflowAction } from '@/hooks/contracts/pricingDAO';
import { Loader2 } from 'lucide-react';

type WorkflowButtonProps = {
    label: string;
    action: WorkflowAction;
    enabled: boolean;
    onSuccess?: () => void;
};

export function WorkflowButton({ label, action, enabled, onSuccess }: WorkflowButtonProps) {
    const { execute, isPending, isConfirming, isSuccess, error, reset } = useWorkflowAction(action);

    const prevErrorRef = useRef(error);
    const prevSuccessRef = useRef(isSuccess);

    useEffect(() => {
        if (error && error !== prevErrorRef.current) {
            toast.error(error.message);
        }
        prevErrorRef.current = error;
    }, [error]);

    useEffect(() => {
        if (isSuccess && !prevSuccessRef.current) {
            toast.success('Action effectuée avec succès');
            onSuccess?.();
            reset();
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess, onSuccess, reset]);

    const isLoading = isPending || isConfirming;

    return (
        <Button
            onClick={() => execute()}
            disabled={!enabled || isLoading}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {label}
        </Button>
    );
}
