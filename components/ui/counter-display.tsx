interface CounterDisplayProps {
  value: number;
}

export function CounterDisplay({ value }: CounterDisplayProps) {
  return (
      <div className="text-6xl font-bold text-gray-800">
        {value.toLocaleString()}
      </div>
  );
}
