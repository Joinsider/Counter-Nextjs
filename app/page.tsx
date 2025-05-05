import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import { AuthNav } from "@/components/authNav";
import Main from "@/components/main";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/themeSwitcher";

export default function Home() {
    return (
        <main className="min-h-screen">
            <AuthNav />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                    <Main />
                    <SpeedInsights />
                    <Analytics />
                </div>
            </div>
            <div className="flex justify-center">
                <Link href={'/datenschutz'} className="p-2 text-blue-500 hover:underline">
                    Datenschutzerklärung
                </Link>
                <Link href={'/impressum'} className="p-2 text-blue-500 hover:underline">
                    Impressum
                </Link>
            </div>
            <ThemeSwitcher />
        </main>
    );
}