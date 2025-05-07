// app/quotes/lecturers/page.tsx
'use client';

import React, {useState, useEffect} from 'react';
import {useTranslation} from '@/lib/hooks/useTranslation';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLecturers, addLecturer} from '@/lib/store/slices/lecturerSlice';
import {AppDispatch, RootState} from '@/lib/store/store';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {checkAuthState} from "@/hooks/check-auth-state";
import {SideMenu} from "@/components/SideMenu";
import {AuthNav} from "@/components/auth/authNav";

export default function LecturersPage() {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Get lecturers from Redux state
    const {lecturers, status, error} = useSelector((state: RootState) => state.lecturer);

    const [newLecturerName, setNewLecturerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        try {
            checkAuthState().then(() => {
                // Fetch lecturers when the component mounts
                dispatch(fetchLecturers());
            })
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }, [dispatch]);

    const handleAddLecturer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLecturerName.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(addLecturer(newLecturerName)).unwrap();
            // Refresh the lecturer list
            dispatch(fetchLecturers());
            setNewLecturerName('');
        } catch (err) {
            console.error('Error adding lecturer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SideMenu/>
            <AuthNav/>
            <div className="container mx-auto p-4 pt-16">
                <h1 className="text-2xl font-bold mb-6">{t('navigation.lecturers')}</h1>

                {/* Add lecturer form */}
                <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow dark:bg-zinc-900">
                    <h2 className="text-xl mb-4 dark:text-white">{t('quotes.addLecturer')}</h2>
                    <form onSubmit={handleAddLecturer} className="flex flex-col sm:flex-row gap-4">
                        <Input
                            type="text"
                            value={newLecturerName}
                            onChange={(e) => setNewLecturerName(e.target.value)}
                            placeholder={t('addLecturer.name')}
                            className="w-full"
                            disabled={isSubmitting}
                        />
                        <Button
                            type="submit"
                            className="w-full sm:w-auto whitespace-nowrap"
                            disabled={isSubmitting || !newLecturerName.trim()}
                        >
                            {isSubmitting ? t('common.loading') : t('common.add')}
                        </Button>
                    </form>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        {error}
                    </div>
                )}

                {/* Lecturers list with links */}
                <div>
                    <h2 className="text-xl mb-4">{t('navigation.lecturers')}</h2>
                    {status === 'loading' && lecturers.length === 0 ? (
                        <p>{t('common.loading')}</p>
                    ) : lecturers.length > 0 ? (
                        <div className={"pb-16"}>
                            <ul className="border rounded divide-y">
                                {lecturers.map((lecturer) => (
                                    <li key={lecturer.id}>
                                        <Link
                                            href={`/quotes/${lecturer.id}`}
                                            className="p-4 flex justify-between items-center block hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            <span>{lecturer.name}</span>
                                            <span className="text-gray-500 text-sm">
                                                                        {new Date(lecturer.created).toLocaleDateString()}
                                                                    </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-gray-500 pb-16">{t('counter.noCounters')}</p>
                    )}
                </div>
            </div>
        </>
    );
}