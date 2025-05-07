'use client';

import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '@/lib/store/store';
import {fetchCounterTypes, toggleCollapse, setCollapsed} from '@/lib/store/slices/sideMenuSlice';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useTranslation} from '@/lib/hooks/useTranslation';
import {PanelLeftClose, PanelLeftOpen} from "lucide-react";
import {Button} from "@/components/ui/button";

export function SideMenu() {
    const dispatch = useDispatch<AppDispatch>();
    const {types, isLoading, isCollapsed} = useSelector((state: RootState) => state.sideMenu);
    const pathname = usePathname();
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(setCollapsed(true));
        dispatch(fetchCounterTypes());
    }, [dispatch]);

    return (
        <>
            <Button
                onClick={() => dispatch(toggleCollapse())}
                className={`fixed top-4 ${isCollapsed ? 'left-4' : 'left-[17rem]'} z-50 p-2 rounded-lg transition-all duration-300 shadow-lg`}
                aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}>
                {isCollapsed ? <PanelLeftOpen/> : <PanelLeftClose/>}
            </Button>

            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => dispatch(setCollapsed(true))}
                />
            )}

            <div className={`
                    fixed left-0 top-0 h-screen bg-gray-50 dark:bg-gray-800
                    shadow-lg z-30 transition-all duration-300 ease-in-out
                    ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
                    w-64 flex flex-col
                `}>
                {/* Fixed header section */}

                <div className="p-4 pt-8 pb-2">
                    <h2 className="font-bold text-lg text-gray-700 dark:text-gray-200">
                        {t('common.appTitle') || 'Counter App'}
                    </h2>
                </div>

                {/* Scrollable content section */}
                <nav className="flex-1 overflow-y-auto p-4 pt-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"/>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                                {t('navigation.counter') || 'Quotes'}
                            </h3>
                            {types.map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/counter/${type.id}`}
                                    onClick={() => dispatch(setCollapsed(true))}
                                    className={`
                                            block p-2 rounded-lg transition-colors whitespace-nowrap
                                            ${pathname === `/counter/${type.id}`
                                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                    }
                                    `}>
                                    {type.title}
                                </Link>
                            ))}

                            <div className="my-4 border-t border-gray-300 dark:border-gray-600"></div>

                            <div className="mt-2">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-2">
                                    {t('navigation.quotes') || 'Quotes'}
                                </h3>
                                <Link
                                    href="/quotes"
                                    onClick={() => dispatch(setCollapsed(true))}
                                    className={`
                                            block p-2 rounded-lg transition-colors whitespace-nowrap
                                            ${pathname.startsWith('/quotes')
                                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                                    }
                                    `}>
                                    {t('navigation.viewQuotes') || 'View Quotes'}
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
}