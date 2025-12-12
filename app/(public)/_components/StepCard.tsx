type StepCardProps = {
    step: string;
    title: string;
    description: string;
};

export default function StepCard({ step, title, description }: StepCardProps) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-5 text-center dark:border-border dark:bg-card/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                {step}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-foreground">{title}</p>
                <p className="text-xs text-slate-600 dark:text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
