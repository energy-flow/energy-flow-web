'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Leaf } from "lucide-react"
import Link from 'next/link';
import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { ROLE_ROUTES } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

const ROLE_CONFIG: Record<UserRole, { label: string; color: string } | null> = {
    admin: { label: 'Admin', color: 'bg-red-500/15 text-red-600 dark:text-red-400' },
    pmo: { label: 'PMO', color: 'bg-violet-500/15 text-violet-600 dark:text-violet-400' },
    producer: { label: 'Producteur', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
    consumer: { label: 'Consommateur', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    none: null,
};

export default function Header() {
    const { role } = useUserRole();
    const roleConfig = ROLE_CONFIG[role];
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-border dark:bg-card/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-0">
                {/* Logo + brand */}
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500">
                        <Leaf className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-emerald-500">
                            Energy Flow
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-muted-foreground">
                            Decentralized Energy System
                        </span>
                    </div>
                </div>

                {/* Center navigation (desktop) */}
                <nav className="hidden items-center gap-2 rounded-full bg-slate-100 px-1 py-1 text-xs font-medium text-slate-600 dark:bg-secondary dark:text-slate-300 lg:flex">
                    <Link href="/">
                        <button className="rounded-full bg-emerald-500 px-4 py-1 text-[11px] font-semibold text-white">
                            Accueil
                        </button>
                    </Link>
                    {role !== 'none' && (
                        <Link href={ROLE_ROUTES[role][0]}>
                            <button className="rounded-full px-4 py-1 hover:bg-slate-200 dark:hover:bg-accent">
                                Dashboard
                            </button>
                        </Link>
                    )}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {roleConfig && (
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${roleConfig.color}`}>
                            {roleConfig.label}
                        </span>
                    )}
                    <ThemeToggle />
                    <ConnectButton />
                </div>
            </div>
        </header>
    )
}