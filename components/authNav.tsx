'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Button } from './ui/button';

export function AuthNav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthState = async () => {
            const authState = await pb.authStore.isValid;
            setIsLoggedIn(authState);
        };

        checkAuthState();
    }, []);

    return (
        <div className="fixed top-4 right-4 z-50">
            <Link href={isLoggedIn ? "/auth/logout" : "/auth/login"}>
                <Button variant="outline" className="bg-white dark:bg-gray-800">
                    {isLoggedIn ? "Logout" : "Login"}
                </Button>
            </Link>
        </div>
    );
}