import {decrementCounter} from "@/lib/api/counter";
import {NextResponse, NextRequest} from "next/server";

export const runtime = 'edge';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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