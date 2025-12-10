'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MembersTable } from './MembersTable';
import { AddMemberForm } from './AddMemberForm';
import { type DAOMember } from '@/hooks/contracts/pricingDAO';

type MembersSectionProps = {
    members: DAOMember[];
    isLoading: boolean;
    error: Error | null;
    onMemberChange: () => void;
};

export function MembersSection({ members, isLoading, error, onMemberChange }: MembersSectionProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Membres de la PMO</CardTitle>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <p className="text-destructive">Erreur: {error.message}</p>
                    ) : (
                        <MembersTable
                            members={members}
                            isLoading={isLoading}
                            onMemberRemoved={onMemberChange}
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ajouter un membre</CardTitle>
                </CardHeader>
                <CardContent>
                    <AddMemberForm onSuccess={onMemberChange} />
                </CardContent>
            </Card>
        </div>
    );
}
