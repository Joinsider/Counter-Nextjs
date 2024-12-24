// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SideMenu } from '@/components/SideMenu';

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
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`}>
            <div className="flex min-h-screen">
                <SideMenu />
                <main className="flex-1 transition-all duration-300 ease-in-out">
                    {children}
                </main>
            </div>
        </body>
        </html>
    );
}
