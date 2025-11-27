import "./globals.css";
import Layout from "@/components/Layout"
import { Providers } from "./providers"
import type React from "react";
import { Toaster } from "@/components/ui/sonner";

type Props = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en">
        <body>
        <Toaster closeButton />
        <Providers>
            <Layout>{children}</Layout>
        </Providers>
        </body>
        </html>
    );
}
