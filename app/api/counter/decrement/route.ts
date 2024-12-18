import {decrementCounter} from "@/lib/api/counter";
import {NextResponse} from "next/server";

export const runtime = 'edge';

export async function POST() {
    try {
        const counter = await decrementCounter();
        return NextResponse.json(counter);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}