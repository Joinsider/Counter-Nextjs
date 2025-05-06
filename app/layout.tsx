import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "@/components/providers";
import { ThemeSwitcher } from "@/components/themeSwitcher";
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en" suppressHydrationWarning className=''>
      <head>
        <link
          rel="preload"
          href="/counter.webp"
          as="image"
          type="image/webp"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <NextUIProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <SpeedInsights />
              <Analytics />
              <ThemeSwitcher />
            </ThemeProvider>
          </NextUIProvider>
        </Providers>
      </body>
    </html>
  );
}