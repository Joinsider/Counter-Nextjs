'use client';

import {useCounter} from '@/lib/hooks/useCounter';
import {CounterDisplay} from '@/components/ui/counter-display';
import {CounterButton} from '@/components/ui/counter-button';
import {APP_TITLE} from '@/lib/config';
import React, {useEffect, useState} from "react";
import {PastCounters} from "@/components/past_counters";
import {pb} from "@/lib/pocketbase";
import {useRouter} from "next/navigation";

export const dynamic = 'force-dynamic'

interface CounterProps {
    typeId?: string;
}

export function Counter({typeId}: CounterProps) {
    const router = useRouter();
    if (!typeId) {
        typeId = '3bqw5z4ht16sz75';
    }

    const {value, isLoading, error, increment, decrement, title, date} = useCounter(typeId);


    if (error) {
        return (
            <div className="text-center text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    const handleIncrement = async () => {
        try {
            await increment();
        } catch (error) {
            console.error('Failed to increment:', error);
        }
    };

    const handleDecrement = async () => {
        try {
            await decrement();
        } catch (error) {
            console.error('Failed to decrement:', error);
        }
    };

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const valid = await pb.authStore.isValid;
                const verified = pb.authStore.model?.verified;
                if (valid) {
                    if(verified){
                        setIsLoggedIn(true);
                    }else {
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
    }, []); // Empty dependency array

    return (
        <div className="flex flex-col items-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {APP_TITLE}
            </h1>

            {title && (
                <h2 className="text-2xl font-semibold text-gray-700">
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
                        disabled={isLoading}
                    />
                </div>
            ) : (
                <div>Login to edit the counter</div>
            ) }
            <PastCounters typeId={typeId}/>
        </div>

    );
}
