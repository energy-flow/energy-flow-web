type FeatureRowProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

export default function FeatureRow({ icon, title, description }: FeatureRowProps) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-slate-900/40 px-3 py-3">
            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-slate-100">{title}</p>
                <p className="text-xs text-slate-400">{description}</p>
            </div>
        </div>
    );
}
