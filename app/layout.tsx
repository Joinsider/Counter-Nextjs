// app/layout.tsx
import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import React from "react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";


const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Counter App',
    description: 'Track different types of counters',
};

export default function RootLayout({
                                       children,
                                   }: {
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
        <body
            className={`${inter.className} bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>

        <div className="flex min-h-screen">

            <main className="flex-1 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
        <SpeedInsights/>
        <Analytics/>
        </body>
        </html>
    );
}
