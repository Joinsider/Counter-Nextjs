import {useEffect, useState} from 'react';
import {Counter} from '../types/counter';
import {pb} from "@/lib/pocketbase";
import {Collections} from "@/lib/constants/collections";

export function useCounter(typeId: string) {
    const [counter, setCounter] = useState<Counter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('Title Loading...');

    useEffect(() => {
        // Fetch initial counter data and subscribe to changes
        const fetchCounter = async () => {
            try {
                const type = await pb.collection(Collections.COUNTER_TYPE).getOne(typeId);
                setTitle(type.title);

                const today = new Date().toISOString().split('T')[0];
                const records = await pb.collection(Collections.COUNTER).getList(1, 1, {
                    filter: `date = "${today}" && type = "${typeId}"`,
                    expand: 'type'
                });

                if (records.items.length > 0) {
                    const counter: Counter = {
                        id: records.items[0].id,
                        value: records.items[0].value,
                        date: records.items[0].date,
                        type: records.items[0].type,
                        created: records.items[0].created,
                        updated: records.items[0].updated,
                    }
                    setCounter(counter);
                } else {
                    // Create new counter if none exists for today
                    const newCounter = await pb.collection(Collections.COUNTER).create({
                        value: 0,
                        date: today,
                        type: typeId,
                    });
                    const counter: Counter = {
                        id: newCounter.id,
                        value: newCounter.value,
                        date: newCounter.date,
                        type: newCounter.type,
                        created: newCounter.created,
                        updated: newCounter.updated,
                    }
                    setCounter(counter);
                }
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch counter');
                setIsLoading(false);
            }
        };

        fetchCounter();

        // Subscribe to real-time updates
        const subscription = pb.collection(Collections.COUNTER).subscribe('*', async ({record}) => {
            if (record.type === typeId) {
                const counter: Counter = {
                    id: record.id,
                    value: record.value,
                    date: record.date,
                    type: record.type,
                    created: record.created,
                    updated: record.updated,
                }
                setCounter(counter);
            }
        });

        // Cleanup subscription
        return () => {
            pb.collection(Collections.COUNTER).unsubscribe();
        };
    }, [typeId]);

    const updateCounter = async (action: 'increment' | 'decrement'): Promise<void> => {
        if (isLoading || !counter) return;

        try {
            const newValue = action === 'increment' ? counter.value + 1 : counter.value - 1;
            await pb.collection(Collections.COUNTER).update(counter.id, {
                value: newValue
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update counter');
        }
    };

    return {
        value: counter?.value ?? 0,
        date: counter?.date,
        type: typeId,
        title,
        isLoading,
        error,
        increment: () => updateCounter('increment'),
        decrement: () => updateCounter('decrement'),
    };
}