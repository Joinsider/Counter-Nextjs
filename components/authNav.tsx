'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Button } from './ui/button';
import { Settings } from '@geist-ui/icons';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useTranslation } from '@/lib/hooks/useTranslation'; // Add this line to import useTranslation from your translation file, e.g., useTranslation.tsx or similar

export function AuthNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [username, setUsername] = useState('');

    const { t } = useTranslation(); // Add this line to import useTranslation from your translation file, e.g., useTranslation.tsx or similar

    useEffect(() => {
        const checkAuthState = async () => {
            const authState = await pb.authStore.isValid;
            setIsLoggedIn(authState);
            if (authState) {
                setUsername(pb.authStore.model?.username);
            }
        };

        checkAuthState();

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="relative">
            <div className="absolute top-4 right-4 z-50">
                {scrollY < 200 && (
                    isLoggedIn ? (
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="outline" className="bg-white dark:bg-gray-700">
                                    <Settings size={20} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium text-center">{username}</p>
                                    <Link href="/auth/change-username">
                                        <Button variant="outline" className="w-full">
                                            {t("auth.changeUsername")}
                                        </Button>
                                    </Link>
                                    <Link href="/auth/logout">
                                        <Button variant="outline" className="w-full">
                                            {t('auth.logout')}
                                        </Button>
                                    </Link>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <Link href="/auth/login">
                            <Button variant="outline" className="bg-white dark:bg-gray-700">
                                {t('auth.login')}
                            </Button>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}
