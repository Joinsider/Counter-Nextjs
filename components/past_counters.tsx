// components/PastCounters.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import { Counter } from "@/lib/types/counter";
import { ChevronDownCircle, ChevronUpCircle, ChevronLeft, ChevronRight } from '@geist-ui/icons';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface CounterProps {
    typeId?: string;
}

export function PastCounters({ typeId }: CounterProps) {
    const [pastCounters, setPastCounters] = useState<Counter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [hoveredDate, setHoveredDate] = useState<string | null>(null);
    const { t, currentLanguageState } = useTranslation();
    
    // State for current displayed month and year
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    if (!typeId) {
        typeId = '3bqw5z4ht16sz75';
    }

    useEffect(() => {
        const fetchPastCounters = async () => {
            try {
                setIsLoading(true);
                
                // Calculate start and end dates for the current month
                const startDate = new Date(currentYear, currentMonth, 1);
                const endDate = new Date(currentYear, currentMonth + 1, 0);
                
                const startDateStr = startDate.toISOString().split('T')[0];
                const endDateStr = endDate.toISOString().split('T')[0];
                
                // Fetch only counters for the current month view
                const records = await pb.collection('counter').getList<Counter>(1, 50, {
                    filter: `type = "${typeId}" && date >= "${startDateStr}" && date <= "${endDateStr}"`,
                    sort: '-date',
                    expand: 'type'
                });

                const nonZeroCounters = records.items.filter(counter => counter.value !== 0);
                setPastCounters(nonZeroCounters);

                // Remove counters with value 0 from the database
                const zeroValueCounters = records.items.filter(counter => counter.value === 0);
                for (const counter of zeroValueCounters) {
                    await pb.collection('counter').delete(counter.id);
                }
            } catch (error) {
                console.error('Error fetching past counters:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPastCounters();
    }, [typeId, currentMonth, currentYear]); // Re-fetch when month or year changes

    // Navigate to previous month
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Navigate to next month
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Go to current month
    const goToCurrentMonth = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    if (isLoading) {
        return <div className="text-center mt-8">Loading past counters...</div>;
    }

    // Generate calendar data
    const generateCalendarData = () => {
        // Create a map of dates with counter values
        const counterMap = new Map();
        pastCounters.forEach(counter => {
            counterMap.set(counter.date, counter);
        });

        // Get the first day of the month
        const firstDay = new Date(currentYear, currentMonth, 1);
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Get the last day of the month
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Create calendar grid (6 rows x 7 columns)
        const calendarDays = [];
        let dayCounter = 1;

        // Create weeks (rows)
        for (let week = 0; week < 6; week++) {
            const weekDays = [];

            // Create days in week (columns)
            for (let day = 0; day < 7; day++) {
                if ((week === 0 && day < startingDayOfWeek) || dayCounter > daysInMonth) {
                    // Empty cell
                    weekDays.push(null);
                } else {
                    // Format the date as YYYY-MM-DD
                    const date = new Date(currentYear, currentMonth, dayCounter);
                    const formattedDate = date.toISOString().split('T')[0];

                    // Check if this date has a counter
                    const hasCounter = counterMap.has(formattedDate);
                    const counter = hasCounter ? counterMap.get(formattedDate) : null;

                    weekDays.push({
                        day: dayCounter,
                        date: formattedDate,
                        hasCounter,
                        counter
                    });

                    dayCounter++;
                }
            }

            calendarDays.push(weekDays);

            // If we've already processed all days in the month, break
            if (dayCounter > daysInMonth) {
                break;
            }
        }

        return calendarDays;
    };

    const calendarData = generateCalendarData();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get month name
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthName = monthNames[currentMonth];

    // Check if current view is the current month/year
    const isCurrentMonth = currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center cursor-default" onClick={() => setIsCollapsed(!isCollapsed)}>
                {t('counter.pastCountersTitle')}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-4 text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                    {isCollapsed ?
                        <ChevronDownCircle size={20} /> :
                        <ChevronUpCircle size={20} />
                    }
                </button>
            </h2>
            <div>
                {!isCollapsed && (
                    <div className="space-y-4">
                        <div className="calendar-container p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
                            {/* Month navigation */}
                            <div className="flex justify-between items-center mb-4">
                                <button 
                                    onClick={goToPreviousMonth}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Previous month"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <div className="flex flex-col items-center">
                                    <div className="text-center font-semibold text-lg">
                                        {currentMonthName} {currentYear}
                                    </div>
                                    {!isCurrentMonth && (
                                        <button 
                                            onClick={goToCurrentMonth}
                                            className="text-xs text-blue-500 hover:underline mt-1"
                                        >
                                            Go to current month
                                        </button>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={goToNextMonth}
                                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    aria-label="Next month"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {/* Day names */}
                                {dayNames.map(day => (
                                    <div key={day} className="text-center font-medium text-gray-500 dark:text-gray-400 text-sm py-1">
                                        {day}
                                    </div>
                                ))}

                                {/* Calendar days */}
                                {calendarData.flat().map((dayData, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            relative h-12 border border-gray-200 dark:border-gray-600 rounded-md
                                            ${!dayData ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'} 
                                            ${dayData?.hasCounter ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                                            flex items-center justify-center
                                        `}
                                        onMouseEnter={() => dayData?.hasCounter && setHoveredDate(dayData.date)}
                                        onMouseLeave={() => setHoveredDate(null)}
                                    >
                                        {dayData && (
                                            <>
                                                <span className="text-sm">{dayData.day}</span>

                                                {/* Hover tooltip */}
                                                {hoveredDate === dayData.date && dayData.hasCounter && (
                                                    <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap">
                                                        {t('counter.pastCountersValue')}: {dayData.counter.value}
                                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
                                                    </div>
                                                )}

                                                {/* Indicator dot for days with counters */}
                                                {dayData.hasCounter && (
                                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {pastCounters.length === 0 && (
                            <div className="text-center text-gray-500">
                                No past counters found for this month
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}