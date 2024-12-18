'use client';

import { useCounter } from '@/lib/hooks/useCounter';
import { CounterDisplay } from '@/components/ui/counter-display';
import { CounterButton } from '@/components/ui/counter-button';
import { APP_TITLE } from '@/lib/config';
import {useEffect} from "react";

export const dynamic = 'force-dynamic'

export function Counter() {
  const { value, isLoading, error, increment, decrement } = useCounter();

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load counter
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        {APP_TITLE}
      </h1>
      <CounterDisplay value={value} />
      <CounterButton onClick={increment} isLoading={isLoading} text={"Increment"}/>
        <CounterButton onClick={decrement} isLoading={isLoading} text={"Decrement"}/>
    </div>
  );
}