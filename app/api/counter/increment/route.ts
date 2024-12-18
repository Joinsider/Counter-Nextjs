import {incrementCounter} from "@/lib/api/counter";
import {NextResponse} from "next/server";

export async function POST() {
    try {
        const counter = await incrementCounter();
        return NextResponse.json(counter);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}