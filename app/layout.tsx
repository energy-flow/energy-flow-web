import "./globals.css";
import Layout from "@/components/Layout"
import { Providers } from "./providers"
import type React from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

type Props = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: Props) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster closeButton />
                    <Providers>
                        <Layout>{children}</Layout>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
