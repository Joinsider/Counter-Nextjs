'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';


interface AuthFormProps {
    mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useTranslation();

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const theme = useSelector((state: RootState) => state.theme.theme);

    async function handleCaptchaSubmission(token: string | null) {
        try {
            if (token) {
                await fetch("/api", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });
                setIsVerified(true);
            }
        } catch (e) {
            setIsVerified(false);
        }
    }

    function handleExpired() {
        setIsVerified(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);
        setError("");

        if (!isVerified) {
            setIsError(true);
            const error = t('auth.captchaVerification');
            setError(error);
            toast({
                title: 'Error',
                description: error,
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        try {
            if (mode === 'login') {
                const res = await pb.collection('users').authWithPassword(formData.email, formData.password);
            } else {
                const regex = /^i2[0-9]{4}@hb\.dhbw-stuttgart\.de$/;
                if (formData.password.length < 8 || formData.password.length > 70) {
                    setIsError(true);
                    const error = t('auth.passwordRequirements');
                    setError(error);
                    throw new Error(error);
                } else if (regex.test(formData.email)) {
                    const res = await pb.collection('users').create({
                        email: formData.email,
                        password: formData.password,
                        passwordConfirm: formData.password,
                        username: formData.username,
                    });
                    await pb.collection('users').authWithPassword(formData.email, formData.password);
                    await pb.collection('user_info').create({
                        userId: res.id,
                        username: formData.username,
                    })
                } else {
                    setIsError(true);
                    const error = t('auth.emailRequirements');
                    setError(error);
                    throw new Error(error);
                }
            }

            toast({
                title: mode === 'login' ? t('auth.loggedInSuccess') : t('auth.accountCreatedSuccess'),
                description: t('auth.welcomeMessage'),
            });

            const verified = pb.authStore.model?.verified;
            if (verified === false) {
                router.replace('/auth/verification');
            } else {
                router.replace('/counter/');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : t('auth.somethingWentWrong'),
                variant: 'destructive',
            });
            setIsError(true);
            setError(error instanceof Error ? error.message : t('auth.somethingWentWrong'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | string | null) => {
        if (typeof e === 'string' || e === null) {
            handleCaptchaSubmission(e);
        } else {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
                    <h2 className="mb-6 text-2xl font-bold text-center">
                        {mode === 'login' ? t('auth.login') : t('auth.signup')}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">{t('auth.username')}</label>
                                <Input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block mb-2 text-sm font-medium">{t('auth.email')}</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">{t('auth.password')}</label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                min={8}
                                minLength={8}
                                maxLength={70}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            {isError && (
                                <div className="text-red-500 dark:text-red-400">
                                    {t('common.error')}: {error}
                                </div>
                            )}
                        </div>


                        <ReCAPTCHA
                            key={theme === 'system'
                                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                                : theme}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            ref={recaptchaRef}
                            theme={theme === 'system'
                                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                                : theme as 'light' | 'dark'}
                            onChange={handleChange}
                            onExpired={handleExpired}
                        />

                        <div className="space-y-2">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? t('common.loading') : mode === 'login' ? t('auth.login') : t('auth.signup')}
                            </Button>

                            <div className="text-center">
                                {mode === 'login' ? (
                                    <>
                                        <Link href="/auth/signup" className="text-blue-600 hover:underline dark:text-blue-400">
                                            {t('auth.signup')}
                                        </Link>
                                        <br />
                                        <Link href="/auth/reset" className="text-blue-600 hover:underline dark:text-blue-400">
                                            {t('auth.forgotPassword')}
                                        </Link>
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="text-blue-600 hover:underline dark:text-blue-400">
                                        {t('auth.login')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
