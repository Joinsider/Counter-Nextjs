import {incrementCounter} from "@/lib/api/counter";
import {NextResponse} from "next/server";
import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {pb} from "@/lib/pocketbase";
import {checkBody, fetchCounterValue} from "@/hooks/fetchCounterValue";

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const uid = await checkBody(request);
        const id: string = context.params.id;
        const userToken = request.headers.get('Authorization')?.split(' ')[1];

        if(!uid) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        let value = await fetchCounterValue(id, userToken);
        if(value <= 0) {
            value = 0;
        }
        console.log('Incrementing counter:', id, 'by user:', uid);

        const data = await pb.collection('counter_event').create({
            type: id,
            user: uid,
            action: 'increment'
        })

        console.log(data);

        return NextResponse.json(
            { value: value + 1 },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error incrementing counter:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}