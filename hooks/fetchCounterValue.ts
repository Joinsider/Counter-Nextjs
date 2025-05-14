import {pb} from "@/lib/pocketbase";


export const fetchCounterValue = async (id: string, userToken: any) => {
    pb.authStore.save(userToken, null);
    const today = new Date().toISOString().split('T')[0];
    const filter = `type = "${id}" && created >= "${today} 00:00:00.000Z" && created <= "${today} 23:59:59.999Z"`;
    const state = await pb.collection('counter_event').getFullList({
        filter: filter,
        sort: '-created'
    });

    let value = 0;
    if (!state) {
        return value;
    }

    for (const record of state) {
        if (record.action === 'increment') {
            value++;
        } else {
            value--;
        }

    }

    return value;
}

export const fetchPastCounterValues = async (id: string, userToken: string, start: Date, end: Date) => {
    pb.authStore.save(userToken, null);

    const startFormatted = start.toISOString().split('T')[0] + ' 00:00:00.000Z';
    const endFormatted = end.toISOString().split('T')[0] + ' 23:59:59.999Z';

    const filter = `type = "${id}" && created >= "${startFormatted}" && created <= "${endFormatted}"`;

    const state = await pb.collection('counter_event').getFullList({
        filter: filter,
        sort: '-created'
    });

    if (!state) {
        return {};
    }

    // For each day in the range, calculate the final counter value for each day
    // by processing events chronologically and tracking the running total
    const events = [...state].sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());

    // Group events by date
    const dailyEvents = new Map();
    for (const record of events) {
        const dateKey = record.created.split(' ')[0]; // Format: YYYY-MM-DD

        if (!dailyEvents.has(dateKey)) {
            dailyEvents.set(dateKey, 0);
        } else {
            const action = record.action === 'increment' ? 1 : -1;
            dailyEvents.set(dateKey, dailyEvents.get(dateKey) + action);
        }
    }

    // Convert Map to a plain object for proper JSON serialization
    const resultObject: Record<string, number> = {};
    dailyEvents.forEach((value, date) => {
        resultObject[date] = value;
    });

    return resultObject;
}

export const checkBody = async (request: Request) => {
    const body = await request.json();
    console.log(body);
    const uid = body.userId;
    if (!uid) {
        return false;
    }

    return uid;
}