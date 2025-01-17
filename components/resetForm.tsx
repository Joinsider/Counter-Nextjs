'use client';

import React, {useRef, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {pb} from '@/lib/pocketbase';
import Link from 'next/link';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {useToast} from '@/hooks/use-toast';
import ReCAPTCHA from "react-google-recaptcha";

interface AuthFormProps {
    mode: 'request' | 'reset';
    token?: string;
}

export default function ResetForm({mode, token}: AuthFormProps) {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const {toast} = useToast();
    const [isVerified, setIsVerified] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    async function handleCaptchaSubmission(token: string | null) {
        try {
            if (token) {
                await fetch("/api", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({token}),
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

        if(!isVerified) {
            setIsError(true);
            const error = "Please verify the captcha";
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
            if (mode === 'request') {
                const regex = /^i240(0[1-9]|[1-3][0-9])@hb\.dhbw-stuttgart\.de$/;
                if (regex.test(formData.email)) {
                    await pb.collection('users').requestPasswordReset(formData.email);
                } else {
                    setIsError(true);
                    const error = "Email must be a i24... e-mail";
                    setError(error);
                    throw new Error(error);
                }
                router.replace('/auth/logout');
            } else if (mode === 'reset' && formData.password === formData.repeatPassword && token !== undefined) {
                await pb.collection('users').confirmPasswordReset(token, formData.password, formData.repeatPassword);

                const verified = pb.authStore.model?.verified;
                if (verified === false) {
                    router.replace('/auth/verification');
                } else {
                    router.replace('/counter/');
                }
            }

            toast({
                title: mode === 'request' ? 'Password reset mail was sent' : 'Password reset was successful',
                description: 'Welcome to Counter App!',
            });


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
                        {mode === 'request' ? 'Request password reset' : 'Reset Password'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'request' && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {mode === 'reset' && (
                            <div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        min={8}
                                        minLength={8}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        name="repeatPassword"
                                        value={formData.repeatPassword}
                                        min={8}
                                        minLength={8}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                        <div>
                            {isError && (
                                <div className="text-red-500 dark:text-red-400">
                                    Error: {error}
                                </div>
                            )}
                        </div>

                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            ref={recaptchaRef}
                            onChange={handleChange}
                            onExpired={handleExpired} />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : mode === 'request' ? 'Request Reset Email' : 'Reset Password'}
                        </Button>
                    </form>

                    {mode === 'request' && (
                        <div className="mt-4 text-center">
                            <Link
                                href="/auth/login"
                                className="text-blue-600 hover:underline dark:text-blue-400">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
        ;
}