'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Button } from './ui/button';

export function AuthNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const checkAuthState = async () => {
            const authState = await pb.authStore.isValid;
            setIsLoggedIn(authState);
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
                    <Link href={isLoggedIn ? "/auth/logout" : "/auth/login"}>
                        <Button variant="outline" className="bg-white dark:bg-gray-700">
                            {isLoggedIn ? "Logout" : "Login"}
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}