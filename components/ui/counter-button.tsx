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
            disabled={disabled}
            className={`px-4 py-2 rounded-md bg-purple-600 text-white 
                hover:bg-purple-700 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                min-w-[120px]`}
        >
            {isLoading ? 'Loading...' : text}
        </button>
    );
}

