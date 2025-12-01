'use client';

import { useWorkflowStatus } from '@/hooks/usePricingDAO';

const WORKFLOW_LABELS = [
    'RegisteringVoters',
    'ProposalsRegistrationStarted',
    'ProposalsRegistrationEnded',
    'VotingSessionStarted',
    'VotingSessionEnded',
    'VotesTallied',
] as const;

export default function PMODashboard() {
    const { data: status, isLoading, error, refetch: refetchStatus } = useWorkflowStatus();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">PMO Dashboard</h1>
            <p>Workflow Status: <strong>{WORKFLOW_LABELS[Number(status)] ?? 'Unknown'}</strong></p>
        </div>
    );
}