import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface WaterfallPoint {
  step: string;
  base: number;
  delta: number;
}

const WATERFALL_DATA: WaterfallPoint[] = [
  { step: 'Opening', base: 0, delta: 120 },
  { step: 'Yield', base: 120, delta: 45 },
  { step: 'Infra', base: 147, delta: 18 },
  { step: 'Grants', base: 135, delta: 12 },
  { step: 'Closing', base: 0, delta: 135 },
];

interface MonoRoundedWaterfallChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedWaterfallChart({ theme = 'dark', compact = false }: MonoRoundedWaterfallChartProps) {
  const isDark = theme === 'dark';

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
            $135k <span className="text-xs font-normal opacity-70">closing reserve</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +$15.0k Margin
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Monthly Flow
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WATERFALL_DATA} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <XAxis dataKey="step" tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Bar dataKey="base" stackId="a" fill="transparent" />
            <Bar
              dataKey="delta"
              name="Balance ($k)"
              stackId="a"
              fill={isDark ? '#FFFFFF' : '#09090B'}
              radius={[6, 6, 6, 6]}
              barSize={compact ? 16 : 22}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
