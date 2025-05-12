'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/lib/store/store';
import {fetchCounter, incrementCounter, decrementCounter} from '@/lib/store/slices/counterSlice';
import {CounterDisplay} from '@/components/ui/counter-display';
import {CounterButton} from '@/components/ui/counter-button';
import {pb} from "@/lib/pocketbase";
import {useRouter} from "next/navigation";
import {useTranslation} from '@/lib/hooks/useTranslation';

const PastCounters = dynamic(() => import("@/components/past_counters").then(mod => ({default: mod.PastCounters})), {
    ssr: false
});

const LoadCounterStats = dynamic(() => import("@/components/loadCounterStats"), {
    ssr: false
});

interface CounterProps {
    typeId?: string;
}

export function Counter({typeId = '3bqw5z4ht16sz75'}: CounterProps) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const {value, date, title, isLoading, error} = useSelector((state: RootState) => state.counter);
    const {currentLanguage} = useSelector((state: RootState) => state.language);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const {t} = useTranslation();

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

            // Subscribe to the counter collection
            unsubscribe = await pb.collection('counter').subscribe('*', (e) => {
                if (e.action === 'create' || e.action === 'update' || e.action === 'delete') {
                    console.log('Counter data changed:', e);
                    // Refresh counter data when changes occur
                    dispatch(fetchCounter(typeId));
                }
            });

            // Also subscribe to counter_type for title changes
            await pb.collection('counter_type').subscribe('*', (e) => {
                if (e.action === 'update' && e.record.id === typeId) {
                    console.log('Counter type updated:', e);
                    dispatch(fetchCounter(typeId));
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
                    {t('common.appTitle')}
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
                            {new Date(date).toLocaleDateString(currentLanguage)}
                        </span>
                    )}
                </div>

                {isLoggedIn ? (
                    <div className="flex flex-col space-y-3">
                        <CounterButton
                            onClick={handleIncrement}
                            isLoading={isLoading}
                            text={t('counter.increment')}
                            disabled={isLoading}
                        />
                        <CounterButton
                            onClick={handleDecrement}
                            isLoading={isLoading}
                            text={t('counter.decrement')}
                            disabled={isLoading || value === 0}
                        />
                    </div>
                ) : (
                    <div>{t('counter.loginToEdit')}</div>
                )}
                <PastCounters typeId={typeId}/>
            </div>
            <LoadCounterStats typeId={typeId}/>
        </div>
    );
}