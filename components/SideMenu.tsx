// components/SideMenu.tsx
'use client';

import {useEffect, useState} from 'react';
import {CounterType, pb} from '@/lib/pocketbase';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

export function SideMenu() {
    const [types, setTypes] = useState<CounterType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const fetchCounterTypes = async () => {
            try {
                const records = await pb.collection('counter_type').getList<CounterType>(1, 50, {
                    sort: '-title',
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

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <nav className="w-64 bg-gray-100 dark:bg-gray-800 h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                    <Link href={`/`}>
                        Counter Types
                    </Link>
                </h2>
                <div className="space-y-2">
                    {types.map((type) => (
                        <Link
                            key={type.id}
                            href={`/counter/${type.id}`}
                            className={`block p-2 rounded-lg transition-colors
                                ${pathname === `/counter/${type.id}`
                                ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                            }`}>
                            {type.title}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
