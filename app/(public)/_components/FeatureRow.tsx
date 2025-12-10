type FeatureRowProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

export default function FeatureRow({ icon, title, description }: FeatureRowProps) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-slate-100 px-3 py-3 dark:bg-secondary/60">
            <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-accent dark:text-muted-foreground">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-sm font-medium text-slate-900 dark:text-foreground">{title}</p>
                <p className="text-xs text-slate-600 dark:text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
