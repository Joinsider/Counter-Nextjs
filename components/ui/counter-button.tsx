import {Button} from './button';
import {Loader2} from 'lucide-react';

interface CounterButtonProps {
    onClick: () => void;
    isLoading: boolean;
    text: string;
}

export function CounterButton({onClick, isLoading, text}: CounterButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="lg"
            className="w-48"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2"/>
            ) : null}
            {text}
        </Button>
    );
}