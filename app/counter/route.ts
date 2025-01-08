import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
) {
    const url = new URL('/counter/3bqw5z4ht16sz75', request.nextUrl.origin);
    return NextResponse.redirect(url.toString());
}