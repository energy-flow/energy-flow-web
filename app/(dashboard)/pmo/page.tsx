'use client';

import { useWorkflowStatus } from '@/hooks/usePricingDAO';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Loader2} from "lucide-react";

const WORKFLOW_LABELS = [
    'RegisteringVoters',
    'ProposalsRegistrationStarted',
    'ProposalsRegistrationEnded',
    'VotingSessionStarted',
    'VotingSessionEnded',
    'VotesTallied',
] as const;

type TxHash = `0x${string}`;
type WorkflowStatusFn =
    | "startProposalsRegistering"
    | "endProposalsRegistering"
    | "startVotingSession"
    | "endVotingSession"
    | "tallyVotes";

export default function PMODashboard() {
    const { data: status, isLoading, error, refetch: refetchStatus } = useWorkflowStatus();

    const WBtn = ({label, ws, enabled}: { label: string; ws: WorkflowStatusFn; enabled: boolean }) => (
        <Button disabled={!enabled}>
            {/*{pendingWorkflow === ws ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}*/}
            {label}
        </Button>
    );

    // TODO: changer ca
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        // <div>
        //     <h1 className="text-2xl font-bold mb-4">PMO Dashboard</h1>
        //     <p>Workflow Status: <strong>{WORKFLOW_LABELS[Number(status)] ?? 'Unknown'}</strong></p>
        // </div>
        <Card className="mb-8 mt-8">
            <CardHeader>
                <CardTitle>Worflow status</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    <WBtn label="Start Proposals" ws="startProposalsRegistering" enabled={status === 0} />
                    <WBtn label="End Proposals"   ws="endProposalsRegistering"   enabled={status === 1} />
                    <WBtn label="Start Voting"    ws="startVotingSession"        enabled={status === 2} />
                    <WBtn label="End Voting"      ws="endVotingSession"          enabled={status === 3} />
                    <WBtn label="Tally Votes"     ws="tallyVotes"                enabled={status === 4} />
                </div>
            </CardContent>
        </Card>
    );
}