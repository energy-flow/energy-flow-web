'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type DAOMember, useRemoveMember } from '@/hooks/contracts/pricingDAO';
import { Loader2, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type MembersTableProps = {
    members: DAOMember[];
    isLoading: boolean;
    onMemberRemoved?: () => void;
};

function truncateAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function RemoveButton({ address, onSuccess }: { address: `0x${string}`; onSuccess?: () => void }) {
    const { removeMember, isPending, isConfirming, isSuccess, error } = useRemoveMember();

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
            toast.success('Membre supprimé avec succès');
            onSuccess?.();
        }
        prevSuccessRef.current = isSuccess;
    }, [isSuccess, onSuccess]);

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={() => removeMember(address)}
            disabled={isPending || isConfirming}
        >
            {(isPending || isConfirming) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Trash2 className="h-4 w-4" />
            )}
        </Button>
    );
}

export function MembersTable({ members, isLoading, onMemberRemoved }: MembersTableProps) {
    if (isLoading) {
        return <p className="text-muted-foreground">Chargement des membres...</p>;
    }

    if (members.length === 0) {
        return <p className="text-muted-foreground">Aucun membre enregistré</p>;
    }

    return (
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b">
                    <th className="text-left py-2 font-medium">Adresse</th>
                    <th className="text-left py-2 font-medium">Rôle</th>
                    <th className="text-right py-2 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody>
                {members.map((member) => (
                    <tr key={member.address} className="border-b last:border-0">
                        <td className="py-2 font-mono">{truncateAddress(member.address)}</td>
                        <td className="py-2">
                            <Badge className={member.role === 'producer'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent'
                                : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-transparent'
                            }>
                                {member.role === 'producer' ? 'Producteur' : 'Consommateur'}
                            </Badge>
                        </td>
                        <td className="py-2 text-right">
                            <RemoveButton address={member.address} onSuccess={onMemberRemoved} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
