'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {pb} from '@/lib/pocketbase';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {useToast} from '@/hooks/use-toast';
import {useTranslation} from '@/lib/hooks/useTranslation';

export default function ChangeUsernameForm() {
    const [formData, setFormData] = useState({
        username: '',
        currentUsername: pb.authStore.model?.username || '',
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
            await pb.collection('users').update(pb.authStore.model?.id, {
                username: formData.username,
            })

            const uinfo = await pb.collection('user_info').getList(1, 1, {
                filter: `userId="${pb.authStore.model?.id}"`
            });
            const userInfo = uinfo.items[0];

            await pb.collection('user_info').update(userInfo.id, {
                username: formData.username,
            });

            await pb.authStore.model?.update({ username: formData.username });

        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            router.replace('/counter/');
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
                            {t('auth.changeUsername')}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-white">{t('auth.currentUsername')}</label>
                                <Input
                                    type="text"
                                    name="currentUsername"
                                    value={formData.currentUsername}
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium dark:text-white">{t('auth.newUsername')}</label>
                                <Input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full dark:bg-gray-600 dark:text-white"
                                disabled={isLoading}>

                                {isLoading ? t('commont.loading') : t('auth.changeUsername')}
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