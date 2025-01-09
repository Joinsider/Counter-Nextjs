import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import React from "react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider} from "@/components/providers";
import {ThemeSwitcher} from "@/components/themeSwitcher";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Counter App',
    description: 'Track different types of counters',
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <title>Counter App</title>
            <meta name="apple-mobile-web-app-title" content="Counter"/>
            <meta charSet="utf-8"/>
            <meta title="Counter App"/>
            <meta name="description" content="Track different types of counters"/>
            <meta name="apple-mobile-web-app-title" content="Counter"/>
        </head>
        <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextUIProvider>
                <div className="flex min-h-screen">
                    <main className="flex-1 transition-all duration-300 ease-in-out">
                        <ThemeSwitcher />
                        {children}
                    </main>
                </div>
            </NextUIProvider>
        </ThemeProvider>
        <SpeedInsights/>
        <Analytics/>
        </body>
        </html>
    );
}