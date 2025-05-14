import {NextResponse} from "next/server";
import {Request} from "next/dist/compiled/@edge-runtime/primitives";
import {fetchPastCounterValues} from "@/hooks/fetchCounterValue";

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const uid = body.userId;

        const start = new Date(body.start) || new Date();
        const end = new Date(body.end) || new Date();

        const id: string = context.params.id;
        const userToken = request.headers.get('Authorization')?.split(' ')[1];

        if(!uid || !userToken) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        let ValuesMap = await fetchPastCounterValues(id, userToken, start, end);

        if(!ValuesMap) {
            return NextResponse.json(
                { error: 'No values found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {values: ValuesMap},
            {status: 200}
        );
    } catch (error) {
        console.error('Error incrementing counter:', error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}