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

interface StreamPoint {
  t: string;
  inflow: number;
  outflow: number;
}

const STREAM_DATA: StreamPoint[] = [
  { t: '00h', inflow: 28, outflow: 18 },
  { t: '04h', inflow: 42, outflow: 24 },
  { t: '08h', inflow: 58, outflow: 36 },
  { t: '12h', inflow: 84, outflow: 48 },
  { t: '16h', inflow: 76, outflow: 52 },
  { t: '20h', inflow: 64, outflow: 38 },
];

interface MonoRoundedStreamChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedStreamChart({ theme = 'dark', compact = false }: MonoRoundedStreamChartProps) {
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
            $84.2M <span className="text-xs font-normal opacity-70">volume</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +$26.4M Net Inflow
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Dual Corridor
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <linearGradient id={`${idPrefix}stream-g1`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.38" />
              <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id={`${idPrefix}stream-g2`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.2" />
              <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={STREAM_DATA} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Area
              type="natural"
              dataKey="inflow"
              name="Inbound Bridge ($M)"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}stream-g1)`}
              animationDuration={700}
            />
            <Area
              type="natural"
              dataKey="outflow"
              name="Outbound Bridge ($M)"
              stroke={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(9,9,11,0.45)'}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={`url(#${idPrefix}stream-g2)`}
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
