'use client'

import AreaChartPlot from "@/components/lineChart";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase";

interface ChartData {
    day: string;
    value: number;
}

interface CounterProps {
    typeId?: string;
}

export default function LoadCounterStats({ typeId }: CounterProps) {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        if (typeId) {
            const fetchData = async () => {
                try {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                    const res = await pb.collection('counter').getList(1, 50, {
                        filter: `type = "${typeId}" && created >= "${thirtyDaysAgo.toISOString()}"`,
                    });

                    // Transform the data into the correct format
                    const mappedData = res.items.map((item: any) => ({
                        day: new Date(item.date).getDate().toString(),
                        value: item.value
                    }));

                    // Create an array for all 30 days
                    const last30Days = Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - (29 - i));
                        return {
                            day: date.getDate().toString(),
                            value: 0
                        };
                    });

                    // Merge fetched data with the complete date range
                    const completeData = last30Days.map(day => {
                        const found = mappedData.find(item => item.day === day.day);
                        return found || day;
                    });

                    setData(completeData);
                } catch (error) {
                    console.error('Error fetching counter data:', error);
                }
            };

            fetchData();
        }
    }, [typeId]);

    if (!data.length) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded pt-2 pb-2">
                <AreaChartPlot data={data} />
            </div>
        </div>
    );
}
