import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = Readonly<{ children: React.ReactNode }>;

export default function Layout({ children }: Props) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-background">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
