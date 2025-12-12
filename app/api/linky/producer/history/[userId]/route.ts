import { NextRequest } from 'next/server';

const MOCK_HISTORY = [
  { month: 'Jan', kWhProduced: 180, kWhSelfConsumed: 99, kWhSurplus: 81 },
  { month: 'Fév', kWhProduced: 210, kWhSelfConsumed: 115, kWhSurplus: 95 },
  { month: 'Mar', kWhProduced: 290, kWhSelfConsumed: 145, kWhSurplus: 145 },
  { month: 'Avr', kWhProduced: 350, kWhSelfConsumed: 175, kWhSurplus: 175 },
  { month: 'Mai', kWhProduced: 420, kWhSelfConsumed: 189, kWhSurplus: 231 },
  { month: 'Juin', kWhProduced: 480, kWhSelfConsumed: 192, kWhSurplus: 288 },
  { month: 'Juil', kWhProduced: 510, kWhSelfConsumed: 204, kWhSurplus: 306 },
  { month: 'Août', kWhProduced: 470, kWhSelfConsumed: 188, kWhSurplus: 282 },
  { month: 'Sep', kWhProduced: 360, kWhSelfConsumed: 162, kWhSurplus: 198 },
  { month: 'Oct', kWhProduced: 250, kWhSelfConsumed: 137, kWhSurplus: 113 },
  { month: 'Nov', kWhProduced: 170, kWhSelfConsumed: 102, kWhSurplus: 68 },
  { month: 'Déc', kWhProduced: 140, kWhSelfConsumed: 84, kWhSurplus: 56 },
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
