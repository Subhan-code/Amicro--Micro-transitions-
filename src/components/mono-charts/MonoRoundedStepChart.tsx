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

interface StepPoint {
  tier: string;
  fee: number;
}

const STEP_DATA: StepPoint[] = [
  { tier: 'Min', fee: 5.0 },
  { tier: 'Low', fee: 12.4 },
  { tier: 'Median', fee: 24.8 },
  { tier: 'Fast', fee: 42.0 },
  { tier: 'Turbo', fee: 68.5 },
  { tier: 'Max', fee: 95.0 },
];

interface MonoRoundedStepChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedStepChart({ theme = 'dark', compact = false }: MonoRoundedStepChartProps) {
  const isDark = theme === 'dark';
  const [tierFilter, setTierFilter] = useState<'All' | 'Priority'>('All');

  const displayedData = tierFilter === 'Priority' ? STEP_DATA.slice(2) : STEP_DATA;

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
            68.5 <span className="text-xs font-normal opacity-70">µLamports</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Median 24.8 µL
          </span>
        </div>

        {/* Filter Toggle */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['All', 'Priority'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTierFilter(mode);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                tierFilter === mode
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayedData} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="tier" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Line
              type="stepAfter"
              dataKey="fee"
              name="Fee (µL)"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              dot={{ r: 4, fill: isDark ? '#FFFFFF' : '#09090B', stroke: isDark ? '#141414' : '#FFFFFF', strokeWidth: 1.5 }}
              animationDuration={700}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
