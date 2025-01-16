// components/Counter.tsx
'use client';

import { useCounterData } from '@/lib/hooks/useCounterData';
import { CounterDisplay } from './CounterDisplay';
import { CounterButton } from './CounterButton';
import { APP_TITLE } from '@/lib/config';
import { useEffect, useState } from "react";
import { pb } from '@/lib/pocketbase';
import { useRouter } from "next/navigation";
import {PastCounters} from "@/components/past_counters";
import LoadCounterStats from "@/components/loadCounterStats";

interface CounterProps {
    typeId?: string;
}

export function Counter({ typeId = '3bqw5z4ht16sz75' }: CounterProps) {
    const router = useRouter();
    const {
        value,
        isLoading,
        error,
        increment,
        decrement,
        title,
        date
    } = useCounterData(typeId);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const valid = await pb.authStore.isValid;
                const verified = pb.authStore.model?.verified;
                if (valid) {
                    if (verified) {
                        setIsLoggedIn(true);
                    } else {
                        router.replace('/auth/verification');
                    }
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuthState();
    }, []);

    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-center space-y-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {APP_TITLE}
                </h1>

                {title && (
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-500">
                        {title}
                    </h2>
                )}

                <div className="flex flex-col items-center space-y-2">
                    <CounterDisplay value={value} />
                    {date && (
                        <span className="text-sm text-gray-500">
              {date}
            </span>
                    )}
                </div>

                {isLoggedIn ? (
                    <div className="flex flex-col space-y-3">
                        <CounterButton
                            onClick={increment}
                            isLoading={isLoading}
                            text="Increment"
                            disabled={isLoading}
                        />
                        <CounterButton
                            onClick={decrement}
                            isLoading={isLoading}
                            text="Decrement"
                            disabled={isLoading}
                        />
                    </div>
                ) : (
                    <div>Login to edit the counter</div>
                )}

                <PastCounters typeId={typeId} />
            </div>
            <LoadCounterStats typeId={typeId} />
        </div>
    );
}
