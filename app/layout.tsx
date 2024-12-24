import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {SideMenu} from "@/components/SideMenu";

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: 'Counter App',
    description: 'A simple counter app to count things like words in a lecture or bad jokes in a meeting.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SideMenu/>
                <main className="flex-1 ml-64 p-8 from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    {children}
                </main>
            </body>
        </html>
    );
}
