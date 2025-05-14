import {NextResponse} from "next/server";
import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {checkBody, fetchCounterValue} from "@/hooks/fetchCounterValue";

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const id: string = context.params.id;
        const userToken = request.headers.get('Authorization')?.split(' ')[1];

        if (!userToken) {
            return NextResponse.json(
                { error: 'User Token is required' },
                { status: 400 }
            );
        }

        let value = await fetchCounterValue(id, userToken);

        if(value <= 0) {
            value = 0;
        }

        return NextResponse.json(
            { value: value },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}