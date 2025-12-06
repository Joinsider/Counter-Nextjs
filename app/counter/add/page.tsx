'use client';

import { AuthNav } from "@/components/auth/authNav";
import { SideMenu } from "@/components/SideMenu";
import React from "react";
import dynamic from "next/dynamic";

const AddCounterForm = dynamic(
    () => import('@/components/addCounterForm'),
    {
        loading: () => (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
            </div>
        ),
        ssr: false
    }
);

export default function CounterPage() {
    return <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AuthNav />
        <SideMenu />
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                <AddCounterForm />
            </div>
        </div>
    </main>
}