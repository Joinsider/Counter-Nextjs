import {Collections} from '../constants/collections';
import {Counter} from '../types/counter';
import {format} from 'date-fns';
import {pb} from "@/lib/pocketbase";

export async function getCounter(): Promise<Counter> {
    try {
        const record = await getRecord();

        if(!record) {
            return createCounter();
        }

        return {
            id: record.id,
            value: record.value,
            date: record.date,
            created: record.created,
            updated: record.updated,
        };

    } catch (error) {
        console.error('Error fetching counter:', error);
        throw new Error('Failed to fetch counter');
    }
}

export async function getRecord(): Promise<any> {
    const today = format(new Date(), 'yyyy-MM-dd');
    const records = await ((pb.collection(Collections.COUNTER).getList(1, 50, {
        filter: `date = "${today}"`,
        cache: "no-store",
    })));
    return records.items[0];
}



export async function createCounter(): Promise<Counter> {
    return pb.collection(Collections.COUNTER)
        .create<Counter>({
            value: 1,
            date: format(new Date(), 'yyyy-MM-dd'),
        });
}


export async function incrementCounter() {
    try {
        const counter = await getRecord();
        const value = counter.value += 1;

        return await pb.collection(Collections.COUNTER).update(counter.id, {
            value,
        });
    } catch (error) {
        console.error('Error decrementing counter:', error);
        throw error;
    }
}

export async function decrementCounter() {
    try {
        const counter = await getRecord();
        const value = counter.value -= 1;

        return await pb.collection(Collections.COUNTER).update(counter.id, {
            value,
        });
    } catch (error) {
        console.error('Error decrementing counter:', error);
        throw error;
    }
}