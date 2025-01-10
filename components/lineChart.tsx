'use client'

import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import React, {FC, useEffect, useState} from "react";

interface ChartData {
    day: string;
    value: number;
}

interface AreaChartPlotProps {
    data: ChartData[];
}

const AreaChartPlot: FC<AreaChartPlotProps> = ({ data }) => {
    const [interval, setInterval] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setInterval(5); // Mobile view: show every 5th day
            } else {
                setInterval(0); // Desktop view: show all days
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial interval based on current window size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart width={730} height={250} data={data}
                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d88b00" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#d8c614" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="day" interval={interval}/>
                    <YAxis/>
                    <Tooltip/>
                    <Area type="monotone" dataKey="value" stroke="#d88b00" fillOpacity={1} fill="url(#colorUv)"/>
                </AreaChart>
            </ResponsiveContainer>
        </>
    );
}

export default AreaChartPlot;