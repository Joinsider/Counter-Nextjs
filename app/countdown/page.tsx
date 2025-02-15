'use client';

import { AuthNav } from "@/components/authNav";
import { SideMenu } from "@/components/SideMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchCountdowns } from '@/lib/store/slices/countdownSlice';
import { pb } from '@/lib/pocketbase';
import { useRouter } from 'next/navigation';
import { Collections } from '@/lib/constants/collections';

export default function CountdownPage() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { activeCountdowns, pastCountdowns, isLoading, error } = useSelector((state: RootState) => state.countdown);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        let isSubscribed = true;

        const checkAuthState = async () => {
            if (!isSubscribed) return;
            try {
                const valid = await pb.authStore.isValid;
                const verified = pb.authStore.model?.verified;
                
                if (!valid) {
                    setIsLoggedIn(false);
                    router.replace('/auth/login');
                    return;
                }
                
                if (!verified) {
                    setIsLoggedIn(false);
                    router.replace('/auth/verification');
                    return;
                }

                setIsLoggedIn(true);

                try {
                    // Initialize collection context
                    await pb.collection('countdown').getList(1, 1, {
                        sort: '-created'
                    });
                    dispatch(fetchCountdowns());
                } catch (initError) {
                    console.error('Failed to initialize context:', initError);
                    // Don't redirect on collection initialization error
                    // Just log the error and continue
                }
            } catch (error) {
                console.error('Failed to check auth state:', error);
                setIsLoggedIn(false);
                router.replace('/auth/login');
            } finally {
                setAuthChecked(true);
            }
        };

        checkAuthState();

        return () => {
            isSubscribed = false;
        };
    }, [dispatch, router]);

    if (!authChecked || isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AuthNav />
            <SideMenu />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Countdowns</h1>
                    <Link href="/countdown/create">
                        <Button variant="outline" className="bg-white dark:bg-gray-600">
                            Create Countdown
                        </Button>
                    </Link>
                </div>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Countdowns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {activeCountdowns.map((countdown) => (
                                    <Link key={countdown.id} href={`/countdown/${countdown.id}`}>
                                        <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <h3 className="font-semibold">{countdown.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Ends: {new Date(countdown.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                {activeCountdowns.length === 0 && (
                                    <p className="text-gray-500 dark:text-gray-400">No active countdowns</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Past Countdowns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {pastCountdowns.map((countdown) => (
                                    <Link key={countdown.id} href={`/countdown/${countdown.id}`}>
                                        <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <h3 className="font-semibold">{countdown.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Ended: {new Date(countdown.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                                {pastCountdowns.length === 0 && (
                                    <p className="text-gray-500 dark:text-gray-400">No past countdowns</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}