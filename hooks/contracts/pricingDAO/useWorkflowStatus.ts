'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { usePricingDAOConfig } from './config';

export type WorkflowAction =
    | 'startProposalRegistration'
    | 'endProposalRegistration'
    | 'startVotingSession'
    | 'endVotingSession'
    | 'executeProposal'
    | 'resetWorkflow';

export type WorkflowActionConfig = {
    action: WorkflowAction;
    label: string;
    enabledAtStatus: number;
    resetsProposal: boolean;
};

export const WORKFLOW_ACTIONS: WorkflowActionConfig[] = [
    { action: 'startProposalRegistration', label: 'Démarrer la proposition', enabledAtStatus: 0, resetsProposal: false },
    { action: 'endProposalRegistration', label: 'Terminer la proposition', enabledAtStatus: 1, resetsProposal: false },
    { action: 'startVotingSession', label: 'Lancer le vote', enabledAtStatus: 2, resetsProposal: false },
    { action: 'endVotingSession', label: 'Terminer le vote', enabledAtStatus: 3, resetsProposal: false },
    { action: 'executeProposal', label: 'Comptabiliser les votes', enabledAtStatus: 4, resetsProposal: false },
    { action: 'resetWorkflow', label: 'Nouveau cycle', enabledAtStatus: 5, resetsProposal: true },
];

export const WORKFLOW_STATUS_LABELS = [
    'Enregistrement des membres',
    'Proposition en cours',
    'Proposition terminée',
    'Vote en cours',
    'Vote terminé',
    'Votes comptabilisés',
] as const;

export function useWorkflowStatus() {
    const { address, abi, enabled } = usePricingDAOConfig();

    return useReadContract({
        address,
        abi,
        functionName: 'workflowStatus',
        query: { enabled },
    });
}

export function useWorkflowAction(action: WorkflowAction) {
    const { address, abi } = usePricingDAOConfig();
    const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const execute = () => {
        writeContract({
            address,
            abi,
            functionName: action,
        });
    };

    return {
        execute,
        isPending,
        isConfirming,
        isSuccess,
        error,
        reset,
    };
}
