'use client';

import { useParams, useRouter } from 'next/navigation';
import { AuthNav } from "@/components/authNav";
import { SideMenu } from "@/components/SideMenu";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { fetchCountdown } from '@/lib/store/slices/countdownSlice';
import { pb } from '@/lib/pocketbase';
import { Button } from '@/components/ui/button';

export default function CountdownPage() {
    const params = useParams();
    const router = useRouter();
    const countdownId = params.countdownId as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentCountdown: countdown, isLoading, error } = useSelector((state: RootState) => state.countdown);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isFinished, setIsFinished] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            try {
                if (!pb.authStore.isValid) {
                    router.replace('/auth/login');
                } else if (!pb.authStore.model?.verified) {
                    router.replace('/auth/verification');
                } else {
                    setIsLoggedIn(true);
                    dispatch(fetchCountdown(countdownId));
                }
            } catch (error) {
                console.error('Failed to check auth state:', error);
                router.replace('/auth/login');
            } finally {
                setAuthChecked(true);
            }
        };

        checkAuthState();
    }, [dispatch, countdownId, router]);

    useEffect(() => {
        if (countdown && pb.authStore.model) {
            setIsAdmin(countdown.admin === pb.authStore.model.id);
        }
    }, [countdown]);

    useEffect(() => {
        if (!countdown) return;

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const endDate = new Date(countdown.date).getTime();
            const difference = endDate - now;

            if (difference <= 0) {
                setIsFinished(true);
                setTimeLeft('');
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [countdown]);

    if (!authChecked || isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    if (!countdown) {
        return <div>Loading countdown...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AuthNav />
            <SideMenu />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardContent className="pt-6">
                        <h1 className="text-3xl font-bold text-center mb-8">{countdown.title}</h1>
                        <div className="text-center">
                            {isAdmin && (
                                <div className="mb-4">
                                    <Button variant="outline" className="mr-2">
                                        Edit
                                    </Button>
                                    <Button variant="destructive">
                                        Delete
                                    </Button>
                                </div>
                            )}
                            {isFinished ? (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                        Countdown Finished!
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Ended on {new Date(countdown.date).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-bold font-mono">{timeLeft}</h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Until {new Date(countdown.date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}