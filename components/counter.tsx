'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchCounter, incrementCounter, decrementCounter } from '@/lib/store/slices/counterSlice';
import { CounterDisplay } from '@/components/ui/counter-display';
import { CounterButton } from '@/components/ui/counter-button';
import { APP_TITLE } from '@/lib/config';
import { pb } from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

const PastCounters = dynamic(() => import("@/components/past_counters").then(mod => ({ default: mod.PastCounters })), {
    ssr: false
});

const LoadCounterStats = dynamic(() => import("@/components/loadCounterStats"), {
    ssr: false
});

interface CounterProps {
    typeId?: string;
}

export function Counter({ typeId = '3bqw5z4ht16sz75' }: CounterProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { value, date, title, isLoading, error } = useSelector((state: RootState) => state.counter);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let isSubscribed = true;
        let unsubscribe: (() => void) | undefined;

        const checkAuthState = async () => {
            if (!isSubscribed) return;
            try {
                const valid = await pb.authStore.isValid;
                const verified = pb.authStore.model?.verified;
                setIsLoggedIn(valid && verified);
                if (valid && !verified) {
                    router.replace('/auth/verification');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsLoggedIn(false);
            } finally {
                setAuthChecked(true);
            }
        };

        const setupRealtimeSubscription = async () => {
            if (!isSubscribed) return;
            unsubscribe = await pb.realtime.subscribe('*', (e) => {
                if (e.action === 'connect') {
                    console.log('Connected to realtime');
                } else if (e.action === 'error') {
                    console.log('Realtime connection error');
                }
            });
        };

        checkAuthState();
        dispatch(fetchCounter(typeId));
        setupRealtimeSubscription();

        return () => {
            isSubscribed = false;
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [dispatch, typeId, router]);

    if (!authChecked) {
        return <div className="flex justify-center items-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    const handleIncrement = () => {
        dispatch(incrementCounter(typeId));
    };

    const handleDecrement = () => {
        dispatch(decrementCounter(typeId));
    };

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