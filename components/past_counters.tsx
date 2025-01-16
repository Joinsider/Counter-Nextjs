// components/PastCounters.tsx
'use client';

import { useCounterData } from '@/lib/hooks/useCounterData';

export function PastCounters({ typeId }: { typeId: string }) {
    const { pastCounters, isLoading } = useCounterData(typeId);

    if (isLoading) {
        return <div>Loading past counters...</div>;
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Past Counters</h2>
            <div className="space-y-4">
                {pastCounters.map((counter) => (
                    <div key={counter.id} className="p-4 bg-gray-100 rounded-lg dark:bg-gray-600">
                        <div className="flex justify-between">
                            <span>Value: {counter.value}</span>
                            <span>{counter.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
