'use client';

import { useEffect } from 'react';
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
    const { execute, isPending, isConfirming, isSuccess, reset } = useWorkflowAction(action);

    useEffect(() => {
        if (isSuccess) {
            onSuccess?.();
            reset();
        }
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
