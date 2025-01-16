'use client';

import React, {useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {pb} from '@/lib/pocketbase';
import Link from 'next/link';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {useToast} from '@/hooks/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';


interface AuthFormProps {
    mode: 'login' | 'signup';
}

export default function AuthForm({mode}: AuthFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const {toast} = useToast();

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);

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
            if (mode === 'login') {
                const res = await pb.collection('users').authWithPassword(formData.email, formData.password);
            } else {
                const regex = /^i240(0[1-9]|[1-3][0-9])@hb\.dhbw-stuttgart\.de$/;
                if(formData.password.length < 8 || formData.password.length > 70) {
                    setIsError(true);
                    const error = "Password must be between 8 and 70 characters";
                    setError(error);
                    throw new Error(error);
                }else if (regex.test(formData.email)) {
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
                    const error = "Email must be a i24... e-mail";
                    setError(error);
                    throw new Error(error);
                }
            }

            toast({
                title: mode === 'login' ? 'Logged in successfully' : 'Account created successfully',
                description: 'Welcome to Counter App!',
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
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive',
            });
            setIsError(true);
            setError(error instanceof Error ? error.message : 'Something went wrong');
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
                        {mode === 'login' ? 'Sign In' : 'Sign Up'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block mb-2 text-sm font-medium">Username</label>
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
                            <label className="block mb-2 text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Password</label>
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
                                    Error: {error}
                                </div>
                            )}
                        </div>

                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                            ref={recaptchaRef}
                            onChange={handleChange}
                            onExpired={handleExpired}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center flex flex-col">
                        <Link
                            href={mode === 'login' ? '/auth/signup' : '/auth/login'}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {mode === 'login'
                                ? "Need an account? Sign up"
                                : "Already have an account? Sign in"}
                        </Link>
                        {mode === 'login' && (
                            <Link
                                href="/auth/reset"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                                Forgot Password
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}