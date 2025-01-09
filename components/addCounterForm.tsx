'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AddCounterForm() {
    const [formData, setFormData] = useState({
        title: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await pb.collection('counter_type').create({
                title: formData.title,
            });

            toast({
                title: "Counter successfully added",
                description: 'Welcome to Counter App!',
            });

            router.replace('/counter/');
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        setIsLoggedIn(false);

        const checkAuthState = async () => {
            try {
                if (!pb.authStore.isValid) {
                    router.replace('/auth/login');
                } else if (!pb.authStore.model?.verified){
                    router.replace('/auth/verification');
                } else if (!pb.authStore.model?.sudo) {
                    router.replace('/counter/');
                } else {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Failed to check auth state:', error);
            }
        };

        checkAuthState();
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                {isLoggedIn ? (
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                        <h2 className="mb-6 text-2xl font-bold text-center ">
                            Add Counter
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-white">Title</label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}>

                                {isLoading ? 'Loading...' : "Add counter"}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="dark:text-white">Sorry you don't have enough rights to do this</div>
                )}

            </div>
        </div>
    );
}