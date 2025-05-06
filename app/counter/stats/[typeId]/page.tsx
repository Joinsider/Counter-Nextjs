'use client'

import {AuthNav} from "@/components/auth/authNav";
import {SideMenu} from "@/components/SideMenu";
import {useParams} from "next/navigation";
import LoadCounterStats from "@/components/loadCounterStats";
import {useEffect, useState} from "react";
import {pb} from "@/lib/pocketbase";
import {Collections} from "@/lib/constants/collections";

interface ChartData {
    day: string;
    value: number;
}

export default function CounterPage() {
    const params = useParams();
    const typeId = params.typeId as string;

    const [title, setTitle] = useState<string>('');

    useEffect(() => {
        if (!typeId) {
            console.error('No typeId provided');
        }

        const fetchCounter = async () => {
            const type = await pb.collection(Collections.COUNTER_TYPE).getOne(typeId);
            setTitle(type.title);
        }

        fetchCounter();
    }, [typeId]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AuthNav/>
            <SideMenu/>
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">Counter Stats</h1>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">{title}</h3>
                    <LoadCounterStats typeId={typeId}/>
                </div>
            </div>
        </main>
    );
}