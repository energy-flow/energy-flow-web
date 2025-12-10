import {Card} from "@/components/ui/card";

type MetricCardProps = {
    icon: React.ReactNode;
    value: string;
    label: string;
};

export default function MetricCard({ icon, value, label }: MetricCardProps) {
    return (
        <Card className="flex items-center justify-between border-slate-200 bg-white px-5 py-4 dark:border-border dark:bg-card">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-secondary dark:text-muted-foreground">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-muted-foreground">
                        {label}
                    </span>
                </div>
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-foreground">{value}</span>
        </Card>
    );
}
