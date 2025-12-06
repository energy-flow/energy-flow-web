import { NextRequest } from 'next/server';

const MOCK_HISTORY = [
  { month: 'Jan', kWhConsumed: 320, costEuros: 48.00 },
  { month: 'Fév', kWhConsumed: 290, costEuros: 43.50 },
  { month: 'Mar', kWhConsumed: 260, costEuros: 39.00 },
  { month: 'Avr', kWhConsumed: 220, costEuros: 33.00 },
  { month: 'Mai', kWhConsumed: 180, costEuros: 27.00 },
  { month: 'Juin', kWhConsumed: 150, costEuros: 22.50 },
  { month: 'Juil', kWhConsumed: 140, costEuros: 21.00 },
  { month: 'Août', kWhConsumed: 145, costEuros: 21.75 },
  { month: 'Sep', kWhConsumed: 190, costEuros: 28.50 },
  { month: 'Oct', kWhConsumed: 250, costEuros: 37.50 },
  { month: 'Nov', kWhConsumed: 310, costEuros: 46.50 },
  { month: 'Déc', kWhConsumed: 350, costEuros: 52.50 },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  return Response.json({
    userId,
    year: 2025,
    history: MOCK_HISTORY,
  });
}
