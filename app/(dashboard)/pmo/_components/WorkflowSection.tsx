'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowButton } from './WorkflowButton';
import { type WorkflowAction, WORKFLOW_ACTIONS, WORKFLOW_STATUS_LABELS } from '@/hooks/contracts/pricingDAO';

type WorkflowSectionProps = {
    status: number;
    onStatusChange: () => void;
    onCycleReset: () => void;
};

export function WorkflowSection({status, onStatusChange, onCycleReset}: WorkflowSectionProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>
                    Workflow
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                        (Étape actuelle : {WORKFLOW_STATUS_LABELS[status] ?? 'Inconnu'})
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {WORKFLOW_ACTIONS.map((config: { action: WorkflowAction; label: string; enabledAtStatus: number; resetsProposal: any; }) => (
                        <WorkflowButton
                            key={config.action}
                            label={config.label}
                            action={config.action}
                            enabled={status === config.enabledAtStatus}
                            onSuccess={config.resetsProposal ? onCycleReset : onStatusChange}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
