import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = Readonly<{ children: React.ReactNode }>;

export default function Layout({ children }: Props) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    )
}
