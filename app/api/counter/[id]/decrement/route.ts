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

        if(uid === typeof NextResponse) {
            return uid;
        }

        const value = await fetchCounterValue(id, userToken);

        if(value <= 0) {
            return NextResponse.json(
                { error: 'Counter cannot be decremented below 0' },
                { status: 400 }
            );
        }

        const data = await pb.collection('counter_event').create({
            type: id,
            user: uid,
            action: 'decrement'
        })

        if(!data) {
            return NextResponse.json(
                { error: 'Failed to create counter event' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { value: value - 1 },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}