import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SPENDING_DATA } from '../constants';

interface SpendingChartProps {
  isDarkMode?: boolean;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ isDarkMode = false }) => {
  const [isMounted, setIsMounted] = useState(false);
  const gridColor = isDarkMode ? '#334155' : '#f1f5f9';
  const axisColor = isDarkMode ? '#94a3b8' : '#94a3b8'; // Slate 400 looks okay on both
  const tooltipBg = isDarkMode ? '#1e293b' : '#fff';
  const tooltipBorder = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipText = isDarkMode ? '#f8fafc' : '#1e293b';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col transition-colors duration-300">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white">Cash Flow Analysis</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">6 Month Trend</p>
      </div>
      
      {/* 
        Fix for Recharts "width(-1) and height(-1)" error:
        1. Using a relative container with an absolute child.
        2. Deferring rendering until mount (isMounted) ensures DOM dimensions are ready.
        3. Adding min-height ensures flex parent doesn't collapse to 0 initially.
      */}
      <div className="flex-1 w-full min-h-[200px] relative">
        {isMounted && (
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={SPENDING_DATA}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: axisColor, fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: axisColor, fontSize: 12 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: tooltipBg, 
                    borderColor: tooltipBorder, 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  itemStyle={{ color: tooltipText, fontWeight: 600 }}
                  labelStyle={{ color: axisColor }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};