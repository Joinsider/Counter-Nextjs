import { useState } from 'react';
import useSWR from 'swr';
import { Counter } from '../types/counter';

const fetcher = async (url: string): Promise<Counter> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch counter');
  }
  return res.json();
};

export function useCounter() {
  const [isLoading, setIsLoading] = useState(false);
  const { data, error, mutate } = useSWR<Counter>('/api/counter', fetcher, {
    refreshInterval: 10000,
    dedupingInterval: 0,
  });

  const increment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/counter/increment', { method: 'POST' });

      if (!response.ok) {
        throw new Error('Failed to increment counter');
      }
      const newData = await response.json();
      await mutate(newData, false);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const decrement = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/counter/decrement', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to decrement counter');
      }
      const newData = await response.json();
      await mutate(newData, false);
    } catch (error) {
      console.error('Error decrementing counter:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    value: data?.value ?? 0,
    isLoading,
    error,
    increment,
    decrement
  };
}