import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface LinePoint {
  label: string;
  value: number;
  secondary: number;
}

const TIMEFRAME_DATA: Record<'1H' | '24H' | '7D', LinePoint[]> = {
  '1H': [
    { label: '00m', value: 138, secondary: 160 },
    { label: '10m', value: 142, secondary: 158 },
    { label: '20m', value: 135, secondary: 162 },
    { label: '30m', value: 148, secondary: 165 },
    { label: '40m', value: 140, secondary: 159 },
    { label: '50m', value: 144, secondary: 161 },
    { label: '60m', value: 142, secondary: 160 },
  ],
  '24H': [
    { label: '00:00', value: 124, secondary: 155 },
    { label: '04:00', value: 132, secondary: 158 },
    { label: '08:00', value: 158, secondary: 172 },
    { label: '12:00', value: 168, secondary: 180 },
    { label: '16:00', value: 152, secondary: 170 },
    { label: '20:00', value: 146, secondary: 164 },
    { label: '24:00', value: 142, secondary: 160 },
  ],
  '7D': [
    { label: 'Mon', value: 134, secondary: 150 },
    { label: 'Tue', value: 145, secondary: 162 },
    { label: 'Wed', value: 138, secondary: 159 },
    { label: 'Thu', value: 165, secondary: 178 },
    { label: 'Fri', value: 152, secondary: 168 },
    { label: 'Sat', value: 128, secondary: 148 },
    { label: 'Sun', value: 142, secondary: 160 },
  ],
};

interface MonoRoundedLineChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedLineChart({ theme = 'dark', compact = false }: MonoRoundedLineChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D'>('24H');

  const currentData = TIMEFRAME_DATA[timeframe];
  const latestVal = currentData[currentData.length - 1].value;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full rounded-3xl transition-all duration-300 group flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 ${
        compact ? 'aspect-[16/10] min-h-[220px] w-full' : 'min-h-[290px]'
      } ${
        isDark ? 'bg-[#141414] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-white/20' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-200 text-black hover:border-neutral-300'
      }`}
    >
      {/* Sleek Minimal Header: Only Live Readout & Timeframe Toggle, No Title Header */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            {latestVal}
          </span>
          <span className="text-xs font-mono opacity-70">ms</span>
          <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            99.98%
          </span>
        </div>

        {/* Timeframe pill selector */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['1H', '24H', '7D'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTimeframe(tf);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                timeframe === tf
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Stage — Product Focused */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={currentData} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }}
            />
            <YAxis
              domain={['dataMin - 10', 'dataMax + 10']}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }}
            />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />

            <Line
              type="monotone"
              dataKey="secondary"
              name="SLA Cap"
              stroke={isDark ? '#52525B' : '#A1A1AA'}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
              dot={false}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 600}
            />

            <Line
              type="monotone"
              dataKey="value"
              name="Active Latency"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{
                r: 3.5,
                fill: isDark ? '#FFFFFF' : '#09090B',
                stroke: isDark ? '#181818' : '#FFFFFF',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5.5,
                fill: isDark ? '#FFFFFF' : '#09090B',
                stroke: isDark ? '#A1A1AA' : '#52525B',
                strokeWidth: 2,
              }}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
