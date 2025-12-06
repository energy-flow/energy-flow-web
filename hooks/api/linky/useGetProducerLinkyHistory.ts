import { useQuery } from '@tanstack/react-query';

type MonthlyProduction = {
  month: string;
  kWhProduced: number;
  kWhSelfConsumed: number;
  kWhSurplus: number;
};

type ProducerLinkyHistoryData = {
  userId: string;
  year: number;
  history: MonthlyProduction[];
};

export function useGetProducerLinkyHistory(userId: string) {
  return useQuery<ProducerLinkyHistoryData>({
    queryKey: ['linky', 'producer', 'history', userId],
    queryFn: async () => {
      const res = await fetch(`/api/linky/producer/history/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch producer history');
      return res.json();
    },
    enabled: !!userId,
  });
}
