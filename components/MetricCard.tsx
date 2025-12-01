import {Card} from "@/components/ui/card";

type MetricCardProps = {
    icon: React.ReactNode;
    value: string;
    label: string;
};

export default function MetricCard({ icon, value, label }: MetricCardProps) {
    return (
        <Card className="flex items-center justify-between border-slate-800 bg-slate-950/80 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    {icon}
                </div>
                <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            {label}
          </span>
                </div>
            </div>
            <span className="text-lg font-semibold text-slate-50">{value}</span>
        </Card>
    );
}
