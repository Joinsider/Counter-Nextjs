'use client'

import AreaChartPlot from "@/components/lineChart";
import {useEffect, useState} from "react";
import {pb} from "@/lib/pocketbase";

interface ChartData {
    day: string;
    value: number;
}

interface CounterProps {
    typeId?: string;
}

export default function LoadCounterStats({typeId}: CounterProps) {
    const [data, setData] = useState<ChartData[]>([]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedDate = thirtyDaysAgo.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"

    useEffect(() => {
        if (typeId) {
            const fetchData = async () => {
                try {
                    const res = await pb.collection('counter').getList(1, 50, {
                        filter: `type = "${typeId}" && created >= "${thirtyDaysAgo.toISOString()}"`,
                    });

                    let mappedData = res.items.map((item: any) => ({
                        day: new Date(item.date).getDate().toString(), // Extract the day
                        value: item.value // Assuming the value field is named 'value'
                    }));

                    // Create an array of the last 30 days
                    const last30Days = Array.from({length: 30}, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return {
                            day: date.getDate().toString(),
                            value: 0
                        };
                    }).reverse();

                    // Merge the fetched data with the last 30 days array
                    const completeData = last30Days.map(day => {
                        const found = mappedData.find(item => item.day === day.day);
                        return found ? found : day;
                    });

                    setData(completeData);
                } catch (error) {
                    console.error('Error fetching counter data:', error);
                    return [];
                }
            }

            fetchData();
        }
    }, [typeId]);

    return (
        <div>
            <div className="w-1.0 h-80 bg-gray-200 dark:bg-gray-700 rounded pt-2 pb-2">
                <AreaChartPlot data={data}/>
            </div>
        </div>
    );
}