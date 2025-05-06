'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {pb} from '@/lib/pocketbase';
import {useToast} from '@/hooks/use-toast';
import {useTranslation} from '@/lib/hooks/useTranslation';
import {Input} from "@/components/ui/input";
import {Button} from '@/components/ui/button';

export default function AddCounterForm() {
    const [formData, setFormData] = useState({
        name: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const {toast} = useToast();
    const {t} = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await pb.collection('counter_type').create({
                name: formData.name.charAt(0).toUpperCase() + formData.name.substring(1),
            });

            toast({
                title: t('auth.success'),
                description: t('auth.counterCreated'),
            });

            router.replace('/counter/');
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : t('common.genericError'),
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
                } else if (!pb.authStore.model?.verified) {
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
                    <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-700">
                        <h2 className="mb-6 text-2xl font-bold text-center ">
                            {t('addCounter.add')}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label
                                    className="block mb-2 text-sm font-medium dark:text-white">{t('addLecturer.name')}</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full dark:bg-gray-600 dark:text-white"
                                disabled={isLoading}>

                                {isLoading ? t('common.loading') : t('addCounter.add')}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="dark:text-white">{t('auth.notEnoughRights')}</div>
                )}

            </div>
        </div>
    );
}