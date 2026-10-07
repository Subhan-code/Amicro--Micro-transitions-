import React, { useId } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface RangePoint {
  day: string;
  range: [number, number];
}

const RANGE_DATA: RangePoint[] = [
  { day: 'Mon', range: [0.12, 0.28] },
  { day: 'Tue', range: [0.15, 0.35] },
  { day: 'Wed', range: [0.14, 0.30] },
  { day: 'Thu', range: [0.18, 0.42] },
  { day: 'Fri', range: [0.16, 0.38] },
  { day: 'Sat', range: [0.11, 0.25] },
  { day: 'Sun', range: [0.13, 0.29] },
];

interface MonoRoundedRangeChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedRangeChart({ theme = 'dark', compact = false }: MonoRoundedRangeChartProps) {
  const isDark = theme === 'dark';
  const idPrefix = useId().replace(/:/g, '');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full rounded-3xl transition-all duration-300 group flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 ${
        compact ? 'aspect-[16/10] min-h-[220px] w-full' : 'min-h-[290px]'
      } ${
        isDark ? 'bg-[#141414] border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-white/20' : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-200 text-black hover:border-neutral-300'
      }`}
    >
      {/* Metric Header */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-baseline gap-2">
          <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            0.18% <span className="text-xs font-normal opacity-70">median spread</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            99% Conf. Band
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          7D Variance
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <linearGradient id={`${idPrefix}range-grad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.32" />
              <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.04" />
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={RANGE_DATA} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="range"
              name="Slippage Range (%)"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}range-grad)`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
