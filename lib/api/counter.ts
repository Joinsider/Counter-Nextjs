import { Collections } from '../constants/collections';
import { Counter } from '../types/counter';
import { format } from 'date-fns';
import {CounterType, pb} from "@/lib/pocketbase";


export async function getCounter(id: string, extend: boolean): Promise<Counter> {
    try {
        let record = await getRecord(id);

        if (!record) {
            return createCounter(id);
        }

        if(extend) {
            const type: CounterType = await pb.collection(Collections.COUNTER_TYPE).getOne<CounterType>(record.type);
            if(!type) throw new Error('Counter type not found');
            record.expand = { type };
            return record;
        }

        return record;
    } catch (error) {
        console.error('Error fetching counter:', error);
        throw error;
    }
}

export async function getRecord(typeId: string): Promise<Counter | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const records = await pb.collection(Collections.COUNTER).getList<Counter>(1, 50, {
        filter: `date = "${today}" && type = "${typeId}"`,
        expand: 'type',
        cache: "no-store",
    });

    return records.items[0] || null;
}

export async function createCounter(typeId: string): Promise<Counter> {
    return pb.collection(Collections.COUNTER)
        .create<Counter>({
            value: 1,
            date: format(new Date(), 'yyyy-MM-dd'),
            type: typeId,
        });
}

export async function incrementCounter(id: string) {
    try {
        const counter = await getRecord(id);
        if (!counter) throw new Error('Counter not found');

        const value = counter.value + 1;

        return await pb.collection(Collections.COUNTER).update<Counter>(counter.id, {
            value,
        }, {
            expand: 'type'
        });
    } catch (error) {
        console.error('Error incrementing counter:', error);
        throw error;
    }
}

export async function decrementCounter(id: string) {
    try {
        const counter = await getRecord(id);
        if (!counter) throw new Error('Counter not found');

        const value = counter.value - 1;

        return await pb.collection(Collections.COUNTER).update<Counter>(counter.id, {
            value,
        }, {
            expand: 'type'
        });
    } catch (error) {
        console.error('Error decrementing counter:', error);
        throw error;
    }
}
