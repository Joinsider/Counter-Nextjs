import { Counter } from '@/lib/pocketbase';

interface CounterDisplayProps {
  value: number;
}

export function CounterDisplay({ value }: CounterDisplayProps) {
  return (
    <div className="text-6xl font-bold text-gray-900 dark:text-gray-100">
      {value.toLocaleString()}
    </div>
  );
}