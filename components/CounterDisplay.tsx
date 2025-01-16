interface CounterDisplayProps {
    value: number;
}

export function CounterDisplay({ value }: CounterDisplayProps) {
    return (
        <div className="text-6xl font-bold text-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {value}
        </div>
    );
}