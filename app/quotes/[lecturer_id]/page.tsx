'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {useTranslation} from '@/lib/hooks/useTranslation';
import {useDispatch, useSelector} from 'react-redux';
import {fetchQuotesByLecturer, addQuote} from '@/lib/store/slices/quoteSlice';
import {fetchLecturers} from '@/lib/store/slices/lecturerSlice';
import {AppDispatch, RootState} from '@/lib/store/store';
import {format} from 'date-fns';
import {SideMenu} from "@/components/SideMenu";
import {ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {checkAuthState} from "@/hooks/check-auth-state";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {AuthNav} from "@/components/auth/authNav";

export default function LecturerQuotesPage() {
    const {lecturer_id} = useParams() as { lecturer_id: string };
    const router = useRouter();
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const {currentLanguage} = useSelector((state: RootState) => state.language);

    // Get quotes from Redux state
    const {quotes, status, error} = useSelector((state: RootState) => state.quotes);

    // Find the lecturer name if available in Redux state
    const {lecturers} = useSelector((state: RootState) => state.lecturer);
    const lecturer = lecturers.find(lec => lec.id === lecturer_id);

    // Form state
    const [quoteText, setQuoteText] = useState('');
    const [firstMentioned, setFirstMentioned] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const redirectToQuotes = () => {
        router.push('/quotes');
    }

    useEffect(() => {
        // Move async logic inside a regular function
        const checkAuth = async () => {
            try {
                await checkAuthState();
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        // Call the async function
        checkAuth();

        if (lecturer_id) {
            dispatch(fetchQuotesByLecturer(lecturer_id));
        }
    }, [dispatch, lecturer_id]);

    // Fetch lecturers if they're not already loaded
    useEffect(() => {
        if (lecturers.length === 0) {
            dispatch(fetchLecturers());
        }
    }, [dispatch, lecturers.length]);

    const handleAddQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quoteText.trim()) return;

        setIsSubmitting(true);
        try {
            await dispatch(addQuote({
                lecturerId: lecturer_id,
                text: quoteText,
                firstMentioned,
            })).unwrap();

            setQuoteText('');
            setFirstMentioned(format(new Date(), 'yyyy-MM-dd'));
        } catch (err) {
            console.error('Error adding quote:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AuthNav/>
            <SideMenu/>
            <div className="flex flex-col min-h-screen pt-20">
                <div className="container mx-auto p-4">
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="white dark:accent-zinc-500"
                            onClick={redirectToQuotes}>
                            <ArrowLeft className="h-[1.2rem] w-[1.2rem]"/>
                        </Button>
                        <h1 className="text-2xl font-bold">{lecturer ? lecturer.name : t('common.loading')}</h1>
                        <span className="ml-2 text-gray-500">({quotes.length} {t('quotes.quotesCount')})</span>
                    </div>

                    {/* Add quote form */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg dark:bg-zinc-900 shadow">
                        <h2 className="text-xl mb-4">{t('quotes.addQuote')}</h2>
                        <form onSubmit={handleAddQuote} className="space-y-4">
                            <div>
                                <label className="block mb-2" htmlFor="quoteText">{t('quotes.quoteText')}</label>
                                <Textarea
                                    id="quoteText"
                                    value={quoteText}
                                    onChange={(e) => setQuoteText(e.target.value)}
                                    className="w-full p-2 border rounded min-h-[100px]"
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2"
                                       htmlFor="firstMentioned">{t('quotes.firstMentioned')}</label>
                                <Input
                                    id="firstMentioned"
                                    type="date"
                                    value={firstMentioned}
                                    onChange={(e) => setFirstMentioned(e.target.value)}
                                    className="p-2 border rounded"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="px-4 py-2 rounded"
                                disabled={isSubmitting || !quoteText.trim()}
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

                    {/* Quotes list */}
                    <div>
                        <h2 className="text-xl mb-4">{t('quotes.quotesList')}</h2>
                        {status === 'loading' && quotes.length === 0 ? (
                            <p>{t('common.loading')}</p>
                        ) : quotes.length > 0 ? (
                            <ul className="space-y-4">
                                {quotes.map((quote) => (
                                    <li key={quote.id} className="p-4 border rounded">
                                        <blockquote className="italic mb-2">"{quote.text}"</blockquote>
                                        <div className="text-sm text-gray-500">
                                            {t('quotes.firstMentionedOn')} {new Date(quote.first_mentioned).toLocaleDateString(currentLanguage)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">{t('quotes.noQuotes')}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}