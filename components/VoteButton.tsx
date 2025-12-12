'use client';

import { Button } from '@/components/ui/button';
import { VoteChoice } from '@/hooks/contracts/pricingDAO';
import { Loader2 } from 'lucide-react';

const VOTE_CONFIG = {
    [VoteChoice.For]: {
        label: 'Pour',
        variant: 'default' as const,
        className: 'bg-green-600 hover:bg-green-700',
    },
    [VoteChoice.Against]: {
        label: 'Contre',
        variant: 'destructive' as const,
        className: '',
    },
    [VoteChoice.Abstain]: {
        label: 'Abstention',
        variant: 'secondary' as const,
        className: '',
    },
};

type VoteButtonProps = {
    choice: VoteChoice.For | VoteChoice.Against | VoteChoice.Abstain;
    onClick: () => void;
    isLoading?: boolean;
    disabled?: boolean;
};

export function VoteButton({ choice, onClick, isLoading, disabled }: VoteButtonProps) {
    const config = VOTE_CONFIG[choice];

    return (
        <Button
            variant={config.variant}
            className={config.className}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Vote en cours...' : config.label}
        </Button>
    );
}
