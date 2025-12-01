type StepCardProps = {
    step: string;
    title: string;
    description: string;
};

export default function StepCard({ step, title, description }: StepCardProps) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-5 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300">
                {step}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">{title}</p>
                <p className="text-xs text-slate-400">{description}</p>
            </div>
        </div>
    );
}
