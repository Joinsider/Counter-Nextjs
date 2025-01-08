'use client';

import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import {useRouter} from "next/navigation";

export function LogoutNav() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await pb.authStore.clear();

            const loggedIn = await pb.authStore.isValid;
            if(!loggedIn) {
                router.replace('/');
            }
        }

        logout()
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Logging out...</p>
        </div>
    );
}