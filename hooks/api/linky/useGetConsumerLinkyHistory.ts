import { useQuery } from '@tanstack/react-query';

type MonthlyConsumption = {
  month: string;
  kWhConsumed: number;
  costEuros: number;
};

type ConsumerLinkyHistoryData = {
  userId: string;
  year: number;
  history: MonthlyConsumption[];
};

export function useGetConsumerLinkyHistory(userId: string) {
  return useQuery<ConsumerLinkyHistoryData>({
    queryKey: ['linky', 'consumer', 'history', userId],
    queryFn: async () => {
      const res = await fetch(`/api/linky/consumer/history/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch consumer history');
      return res.json();
    },
    enabled: !!userId,
  });
}
