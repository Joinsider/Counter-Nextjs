// app/counter/[typeId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { Counter } from "@/components/counter";
import { AuthNav } from "@/components/auth/authNav";
import { SideMenu } from "@/components/SideMenu";
import React from "react";
import SudoNav from "@/components/sudoNav";
import { Chat } from '@/components/Chat';

export default function CounterPage() {
    const params = useParams();
    const typeId = params.typeId as string;

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AuthNav />
            <SideMenu />
            <SudoNav />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                    <Counter typeId={typeId} />
                </div>
                <div className="mt-8">
                    <Chat typeId={typeId} />
                </div>
            </div>
        </main>
    );
}
