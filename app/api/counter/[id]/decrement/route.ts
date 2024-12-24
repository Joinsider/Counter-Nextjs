import {decrementCounter} from "@/lib/api/counter";
import {NextResponse} from "next/server";
import {Request} from "next/dist/compiled/@edge-runtime/primitives";

export const runtime = 'edge';

export async function POST(
    request: Request,
    context: { params: { id: string } }
) {
    try {
        const id: string = context.params.id;
        if (!id) {
            return NextResponse.json(
                { error: 'Missing counter ID' },
                { status: 400 }
            );
        }
        const counter = await decrementCounter(id);
        return NextResponse.json(counter);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}