import {pb} from "@/lib/pocketbase";


export const fetchCounterValue = async (id: string, userToken: any) => {
    pb.authStore.save(userToken, null);
    const today = new Date().toISOString().split('T')[0];
    const filter = `type = "${id}" && created >= "${today} 00:00:00.000Z" && created <= "${today} 23:59:59.999Z"`;
    const state = await pb.collection('counter_event').getFullList({
        filter: filter,
        sort: '-created'
    });
    console.log(state);

    let value = 0;
    if(!state) {
        return value;
    }

    for(const record of state) {
        if(record.action === 'increment') {
            value++;
        } else {
            value--;
        }

    }

    return value;
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