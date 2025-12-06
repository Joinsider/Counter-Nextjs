import { NextRequest, NextResponse } from 'next/server';
import { getCounter } from '@/lib/api/counter';

export const runtime = 'edge';

export async function GET(
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

        // Get the expand parameter from the URL
        const { searchParams } = new URL(request.url);
        let expandParams = searchParams.get('expand');
        let expand = false;

        if(expandParams === 'true') {
            expand = true;
        }

        const counter = await getCounter(id, expand);
        return NextResponse.json(counter);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
