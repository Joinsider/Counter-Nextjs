import {pocketbase} from '../pocketbase/client';
import {Collections} from '../constants/collections';
import {Counter} from '../types/counter';
import {format} from 'date-fns';
import {date} from "zod";
import {pb} from "@/lib/pocketbase";

export async function getCounter(): Promise<Counter> {
    try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const records = await pb
            .collection(Collections.COUNTER)
            .getFullList<Counter>({
                limit: 50,
            }).then((res) => {
                return res.filter((record) => record.id === today);
            });


        if (records.length === 0) {
            return createCounter();
        }

        return records[0];
    } catch (error) {
        console.error('Error fetching counter:', error);
        throw new Error('Failed to fetch counter');
    }
}

export async function createCounter(): Promise<Counter> {
    return pb
        .collection(Collections.COUNTER)
        .create<Counter>({
            value: 1,
            date: format(new Date(), 'yyyy-MM-dd'),
        });
}


export async function incrementCounter() {
    try {
        console.log("GETTING COUNTER")
        const counter = await getCounter();
        console.log(counter);
        counter.value += 1;
        await pb.collection('counters').update('counterId', counter);
        return counter;
    } catch (error) {
        console.error('Error incrementing counter:', error);
        throw error;
    }
}

export async function decrementCounter() {
    try {
        const counter = await getCounter();
        counter.value -= 1;
        await pb.collection('counters').update('counterId', counter);
        return counter;
    } catch (error) {
        console.error('Error decrementing counter:', error);
        throw error;
    }
}