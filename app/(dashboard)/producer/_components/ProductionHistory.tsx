import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MonthlyProduction = {
  month: string;
  kWhProduced: number;
  kWhSelfConsumed: number;
  kWhSurplus: number;
};

type ProductionHistoryProps = {
  data: MonthlyProduction[];
  year: number;
};

export default function ProductionHistory({ data, year }: ProductionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique de production {year} recolté sur le compteur Linky</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Mois</th>
              <th className="text-right py-2 font-medium">Production (kWh)</th>
              <th className="text-right py-2 font-medium">Autoconsommé (kWh)</th>
              <th className="text-right py-2 font-medium">Surplus (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} className="border-b last:border-0">
                <td className="py-2">{row.month}</td>
                <td className="text-right py-2">{row.kWhProduced}</td>
                <td className="text-right py-2">{row.kWhSelfConsumed}</td>
                <td className="text-right py-2">{row.kWhSurplus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
