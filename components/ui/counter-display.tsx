interface CounterDisplayProps {
  value: number;
}

export function CounterDisplay({ value }: CounterDisplayProps) {
  return (
      <div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
        {value.toLocaleString()}
      </div>
  );
}
