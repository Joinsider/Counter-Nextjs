'use client';

import { AuthNav } from "@/components/authNav";
import { SideMenu } from "@/components/SideMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from '@/lib/pocketbase';
import { Collections } from '@/lib/constants/collections';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/store';
import { createCountdown } from '@/lib/store/slices/countdownSlice';

export default function CreateCountdownPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.countdown);
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState('');
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
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
                    await pb.collection(Collections.COUNTDOWN).getList(1, 1, {
                        sort: '-created'
                    });
                } catch (initError) {
                    console.error('Failed to initialize context:', initError);
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
    }, [router]);

    if (!authChecked || isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(createCountdown({ title, endDate })).unwrap();
            router.push('/countdown');
        } catch (error) {
            console.error('Error creating countdown:', error);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <AuthNav />
            <SideMenu />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Countdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Title
                                </label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter countdown title"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                                    End Date
                                </label>
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-500">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Creating...' : 'Create Countdown'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}