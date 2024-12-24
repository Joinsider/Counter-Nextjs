// components/PastCounters.tsx
'use client';

import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import {Counter} from "@/lib/types/counter";


const COUNTER_TYPE_ID = '3bqw5z4ht16sz75';

export function PastCounters() {
    const [pastCounters, setPastCounters] = useState<Counter[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPastCounters = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const records = await pb.collection('counter').getList<Counter>(1, 50, {
                    filter: `type = "${COUNTER_TYPE_ID}" && date != "${today}"`,
                    sort: '-date',
                    expand: 'type'
                });
                setPastCounters(records.items);
            } catch (error) {
                console.error('Error fetching past counters:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastCounters();
    }, []);

    if (isLoading) {
        return <div className="text-center mt-8">Loading past counters...</div>;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Past Counters</h2>
            <div className="space-y-4">
                {pastCounters.map((counter) => (
                    <div
                        key={counter.id}
                        className="p-4 bg-gray-50 rounded-lg shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-medium">
                                Value: {counter.value}
                            </div>
                            <div className="text-sm text-gray-500">
                                {counter.date}
                            </div>
                        </div>
                    </div>
                ))}
                {pastCounters.length === 0 && (
                    <div className="text-center text-gray-500">
                        No past counters found
                    </div>
                )}
            </div>
        </div>
    );
}
