'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { useRouter } from "next/navigation";
import { useTranslation } from '@/lib/hooks/useTranslation';

export function VerificationNav() {
    const [isSent, setIsSent] = useState(false);
    const router = useRouter();
    const { t } = useTranslation();

    useEffect(() => {
        let mounted = true;

        const checkAuthState = async () => {
            try {
                // Check if user exists
                if (!pb.authStore.model) {
                    router.push('/auth/login');
                    return;
                }

                const model = await pb.collection('users').getOne(pb.authStore.model.id);

                const isVerified = model?.verified;

                if (isVerified) {
                    await pb.collection('users').authRefresh();
                    router.push('/counter/');
                    return;
                }

                // Only send verification if component is mounted and email not sent
                if (mounted && !isSent) {
                    await pb.collection('users').requestVerification(pb.authStore.model.email);
                    setIsSent(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        checkAuthState();

        // Cleanup function
        return () => {
            mounted = false;
        };
    }, []); // Empty dependency array

    return (
        <div className="flex min-h-screen items-center justify-center flex-col bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">
                    {isSent ? t('auth.emailVerificationMailSent') : t('auth.checkVerificationMail')}
                </h1>
                {isSent && (
                    <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
                        {t('auth.goBackToStartpage')}
                    </Link>
                )}
            </div>
        </div>
    );
}
