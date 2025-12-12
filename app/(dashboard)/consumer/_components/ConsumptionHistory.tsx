import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MonthlyConsumption = {
  month: string;
  kWhConsumed: number;
  costEuros: number;
};

type ConsumptionHistoryProps = {
  data: MonthlyConsumption[];
  year: number;
};

export default function ConsumptionHistory({ data, year }: ConsumptionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique de consommation {year}</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Mois</th>
              <th className="text-right py-2 font-medium">Consommation (kWh)</th>
              <th className="text-right py-2 font-medium">Coût (€)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month} className="border-b last:border-0">
                <td className="py-2">{row.month}</td>
                <td className="text-right py-2">{row.kWhConsumed}</td>
                <td className="text-right py-2">{row.costEuros.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
