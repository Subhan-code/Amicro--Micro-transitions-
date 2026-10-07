import React, { useState, useId } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface AreaPoint {
  time: string;
  volume: number;
}

const MONO_AREA_DATA: AreaPoint[] = [
  { time: '00:00', volume: 8.4 },
  { time: '04:00', volume: 11.2 },
  { time: '08:00', volume: 16.5 },
  { time: '12:00', volume: 19.8 },
  { time: '16:00', volume: 18.4 },
  { time: '20:00', volume: 14.6 },
  { time: '24:00', volume: 12.1 },
];

interface MonoRoundedAreaChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedAreaChart({ theme = 'dark', compact = false }: MonoRoundedAreaChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const idPrefix = useId().replace(/:/g, '');
  const [curve, setCurve] = useState<'monotone' | 'linear'>('monotone');

  const latestVal = MONO_AREA_DATA[MONO_AREA_DATA.length - 3].volume;

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
      {/* Header: Clean readout + curve mode pill */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            {latestVal}
          </span>
          <span className="text-xs font-mono opacity-70">Gbps</span>
          <span className="text-[10px] font-mono text-blue-400 font-medium">
            Peak 92%
          </span>
        </div>

        {/* Curve Mode Pill */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurve('monotone');
            }}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
              curve === 'monotone'
                ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
            }`}
          >
            Spline
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurve('linear');
            }}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
              curve === 'linear'
                ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
            }`}
          >
            Linear
          </button>
        </div>
      </div>

      {/* Main Recharts Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <linearGradient id={`${idPrefix}mono-area-gradient`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity={isDark ? "0.35" : "0.22"} />
              <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MONO_AREA_DATA} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />

            <Area
              type={curve}
              dataKey="volume"
              name="Bandwidth (Gbps)"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}mono-area-gradient)`}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
