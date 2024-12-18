import { NextResponse } from 'next/server';
import { getCounter, incrementCounter } from '@/lib/api/counter';


export const runtime = 'edge';

export async function GET() {
  try {
    const counter = await getCounter();
    return NextResponse.json(counter);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
