// components/SideMenu.tsx
'use client';

import {useEffect, useState} from 'react';
import {CounterType, pb} from '@/lib/pocketbase';
import Link from 'next/link';
import {usePathname} from 'next/navigation';


export function SideMenu() {
    const [types, setTypes] = useState<CounterType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsCollapsed(true);
        const fetchCounterTypes = async () => {
            try {
                const records = await pb.collection('counter_type').getList<CounterType>(1, 50, {
                    sort: 'title'
                });
                setTypes(records.items);
            } catch (error) {
                console.error('Error fetching counter types:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounterTypes();
    }, []);

    return (
        <>
            {/* Toggle Button - Fixed Position */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-200 dark:bg-gray-700
                          hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors size-2"
                aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}>
                <span className="w-6 h-6 font-bold">&#9776;</span>
            </button>

            {/* Overlay for mobile - closes menu when clicking outside */}
            {!isCollapsed && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
            )}

            {/* Side Menu */}
            <nav className={`
                fixed left-0 top-0 h-screen bg-gray-50 dark:bg-gray-800 
                shadow-lg z-30 transition-all duration-300 ease-in-out
                ${isCollapsed ? 'w-0 overflow-hidden' : 'w-64'}
            `}>
                <div className="p-4 pt-16">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <div
                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"/>
                        </div>
                    ) : (
                        <div className={`space-y-2 ${isCollapsed ? 'invisible' : 'visible'}`}>
                            {types.map((type) => (
                                <Link
                                    key={type.id}
                                    href={`/counter/${type.id}`}
                                    onClick={() => setIsCollapsed(true)}
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
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
