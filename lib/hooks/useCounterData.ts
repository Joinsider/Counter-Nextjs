// lib/hooks/useCounterData.ts
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';

export interface CounterData {
    id: string;
    value: number;
    date: string;
    title: string;
    pastCounters: any[];
    stats: any[];
    isLoading: boolean;
    error: string | null;
}

export function useCounterData(typeId: string) {
    const [data, setData] = useState<CounterData>({
        id: '',
        value: 0,
        date: '',
        title: '',
        pastCounters: [],
        stats: [],
        isLoading: true,
        error: null
    });

    const fetchData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Fetch current counter
            const counterResult = await pb.collection('counter').getList(1, 1, {
                filter: `date = "${today}" && type = "${typeId}"`,
            });

            let currentCounter = counterResult.items[0];
            if (!currentCounter) {
                currentCounter = await pb.collection('counter').create({
                    value: 0,
                    date: today,
                    type: typeId,
                });
            }

            // Fetch type info
            const type = await pb.collection('counter_type').getOne(typeId);

            // Fetch past counters
            const pastCounters = await pb.collection('counter').getList(1, 50, {
                filter: `type = "${typeId}" && date != "${today}"`,
                sort: '-date',
            });

            setData({
                id: currentCounter.id,
                value: currentCounter.value,
                date: currentCounter.date,
                title: type.title,
                pastCounters: pastCounters.items,
                stats: [], // Add stats fetching if needed
                isLoading: false,
                error: null
            });
        } catch (error) {
            setData(prev => ({
                ...prev,
                isLoading: false,
                error: 'An unknown error occurred'
            }));
        }
    };

    const updateCounter = async (action: 'increment' | 'decrement') => {
        if (data.isLoading) return;

        const newValue = action === 'increment' ? data.value + 1 : data.value - 1;
        try {
            await pb.collection('counter').update(data.id, {
                value: newValue
            });
            setData(prev => ({
                ...prev,
                value: newValue
            }));
        } catch (error) {
            setData(prev => ({
                ...prev,
                isLoading: false,
                error: 'An unknown error occurred'
            }));
        }
    };

    useEffect(() => {
        fetchData();

        // Subscribe to real-time updates
        const subscription = pb.collection('counter').subscribe('*', (data) => {
            if (data.record.type === typeId) {
                setData(prev => ({
                    ...prev,
                    value: data.record.value
                }));
            }
        });

        return () => {
            pb.collection('counter').unsubscribe();
        };
    }, [typeId]);

    return {
        ...data,
        increment: () => updateCounter('increment'),
        decrement: () => updateCounter('decrement'),
        refresh: fetchData
    };
}
