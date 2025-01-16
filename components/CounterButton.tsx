// components/CounterButton.tsx
interface CounterButtonProps {
    onClick: () => void;
    isLoading: boolean;
    text: string;
    disabled?: boolean;
}

export function CounterButton({ onClick, isLoading, text, disabled }: CounterButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isLoading || disabled}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
            {isLoading ? 'Loading...' : text}
        </button>
    );
}
