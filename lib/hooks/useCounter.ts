import {useEffect, useState} from 'react';
import useSWR from 'swr';
import { Counter, CounterResponse } from '../types/counter';
import {CounterType, pb} from "@/lib/pocketbase";
import {Collections} from "@/lib/constants/collections";

const BASE_URL = '/api/counter';

const fetcher = async (url: string): Promise<Counter> => {
    const res = await fetch(`${url}?expand=type`);
    if (!res.ok) {
        throw new Error(`Failed to fetch counter: ${res.statusText}`);
    }
    return res.json();
};

export function useCounter(typeId: string) {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState<string>('Title Loading...');

    // Fetch counter type once
    useEffect(() => {
        const fetchCounterType = async () => {
            try {
                const type = await pb.collection(Collections.COUNTER_TYPE).getOne(typeId);
                setTitle(type.title);
            } catch (error) {
                console.error('Error fetching counter type:', error);
                setTitle('Unknown Counter');
            }
        };

        if (typeId) {
            fetchCounterType();
        }
    }, [typeId]);

    const { data, error, mutate } = useSWR<Counter>(
        `/api/counter/${typeId}`,
        fetcher,
        {
            refreshInterval: 10000,
            dedupingInterval: 0,
        }
    );

    const updateCounter = async (action: 'increment' | 'decrement'): Promise<void> => {
        if (isLoading || !data) return;

        const optimisticData: Counter = {
            ...data,
            value: action === 'increment' ? data.value + 1 : data.value - 1
        };

        setIsLoading(true);
        try {
            // Optimistic update
            await mutate(optimisticData, false);

            // API call
            const response = await fetch(
                `${BASE_URL}/${typeId}/${action}`,
                { method: 'POST' }
            );

            if (!response.ok) {
                throw new Error(`Failed to ${action} counter`);
            }

            const result: Counter = await response.json();
            await mutate(result, false);
        } catch (error) {
            // Rollback on error
            await mutate(data, false);
            console.error(`Error ${action}ing counter:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        value: data?.value ?? 0,
        date: data?.date,
        type: typeId,
        title,
        isLoading,
        error: error?.message,
        increment: () => updateCounter('increment'),
        decrement: () => updateCounter('decrement'),
    };
}
