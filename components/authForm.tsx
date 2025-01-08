'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsError(false);
        setError("");

        try {
            if (mode === 'login') {
                 await pb.collection('users').authWithPassword(formData.email, formData.password);
            } else {
                const regex = /^i24\d{3}@hb\.dhbw-stuttgart\.de$/;
                if(regex.test(formData.email)){
                    await pb.collection('users').create({
                        email: formData.email,
                        password: formData.password,
                        passwordConfirm: formData.password,
                        username: formData.username,
                    });
                    await pb.collection('users').authWithPassword(formData.email, formData.password);
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
            if(verified === false) {
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

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md">
                <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
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
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            {isError && (
                                <div className="text-red-500 dark:text-red-400">
                                    Email must be a DHBW Stuttgart Campus Horb Email and Password must be at least 8 characters long
                                    {error}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link
                            href={mode === 'login' ? '/auth/signup' : '/auth/login'}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                            {mode === 'login'
                                ? "Need an account? Sign up"
                                : "Already have an account? Sign in"}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}