// app/quotes/lecturers/page.tsx
'use client';

import React, {useState, useEffect} from 'react';
import {useTranslation} from '@/lib/hooks/useTranslation';
import {useDispatch, useSelector} from 'react-redux';
import {fetchLecturers, addLecturer} from '@/lib/store/slices/lecturerSlice';
import {AppDispatch, RootState} from '@/lib/store/store';
import Link from 'next/link';

export default function LecturersPage() {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    // Get lecturers from Redux state
    const {lecturers, status, error} = useSelector((state: RootState) => state.lecturer);

    const [newLecturerName, setNewLecturerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchLecturers());
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">{t('navigation.lecturers')}</h1>

            {/* Add lecturer form */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl mb-4">{t('common.add')}</h2>
                <form onSubmit={handleAddLecturer} className="flex gap-4">
                    <input
                        type="text"
                        value={newLecturerName}
                        onChange={(e) => setNewLecturerName(e.target.value)}
                        placeholder={t('addLecturer.name')}
                        className="flex-grow p-2 border rounded"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={isSubmitting || !newLecturerName.trim()}
                    >
                        {isSubmitting ? t('common.loading') : t('common.add')}
                    </button>
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
                    <ul className="border rounded divide-y">
                        {lecturers.map((lecturer) => (
                            <li key={lecturer.id}>
                                <Link
                                    href={`/quotes/${lecturer.id}`}
                                    className="p-4 flex justify-between items-center block hover:bg-gray-50 transition-colors"
                                >
                                    <span>{lecturer.name}</span>
                                    <span className="text-gray-500 text-sm">
                                                                        {new Date(lecturer.created).toLocaleDateString()}
                                                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">{t('counter.noCounters')}</p>
                )}
            </div>
        </div>
    );
}