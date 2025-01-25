'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchCounter, incrementCounter, decrementCounter } from '@/lib/store/slices/counterSlice';
import { CounterDisplay } from '@/components/ui/counter-display';
import { CounterButton } from '@/components/ui/counter-button';
import { APP_TITLE } from '@/lib/config';
import { PastCounters } from "@/components/past_counters";
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";
import LoadCounterStats from "@/components/loadCounterStats";

interface CounterProps {
    typeId?: string;
}

export function Counter({ typeId = '3bqw5z4ht16sz75' }: CounterProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { value, date, title, isLoading, error } = useSelector((state: RootState) => state.counter);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const valid = await pb.authStore.isValid;
                const verified = pb.authStore.model?.verified;
                if (valid) {
                    if (!verified) {
                        router.replace('/auth/verification');
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuthState();
        dispatch(fetchCounter(typeId));
    }, [dispatch, typeId, router]);

    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    const handleIncrement = () => {
        dispatch(incrementCounter());
    };

    const handleDecrement = () => {
        dispatch(decrementCounter());
    };

    const isLoggedIn = pb.authStore.isValid && pb.authStore.model?.verified;

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
                    <CounterDisplay value={value}/>
                    {date && (
                        <span className="text-sm text-gray-500">
                            {date}
                        </span>
                    )}
                </div>

                {isLoggedIn ? (
                    <div className="flex flex-col space-y-3">
                        <CounterButton
                            onClick={handleIncrement}
                            isLoading={isLoading}
                            text="Increment"
                            disabled={isLoading}
                        />
                        <CounterButton
                            onClick={handleDecrement}
                            isLoading={isLoading}
                            text="Decrement"
                            disabled={isLoading || value === 0}
                        />
                    </div>
                ) : (
                    <div>Login to edit the counter</div>
                )}
                <PastCounters typeId={typeId}/>
            </div>
            <LoadCounterStats typeId={typeId}/>
        </div>
    );
}