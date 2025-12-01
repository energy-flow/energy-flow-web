export default function Footer() {
    return (
        <footer className="border-t border-slate-900/80 bg-black/70 py-5">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 text-[11px] text-slate-500 lg:flex-row lg:px-0">
                <span>© {new Date().getFullYear()} Energy Flow. Tous droits réservés.</span>
                <span>Conforme ACC Enedis · RGPD · MiCA.</span>
            </div>
        </footer>
    )
}