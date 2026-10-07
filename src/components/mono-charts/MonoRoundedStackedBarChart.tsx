import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface StackedPoint {
  label: string;
  defi: number;
  transfers: number;
  oracles: number;
}

const STACKED_DATA: StackedPoint[] = [
  { label: '04:00', defi: 3.2, transfers: 2.1, oracles: 1.4 },
  { label: '08:00', defi: 4.8, transfers: 2.9, oracles: 1.8 },
  { label: '12:00', defi: 6.4, transfers: 3.8, oracles: 2.2 },
  { label: '16:00', defi: 7.2, transfers: 4.1, oracles: 2.6 },
  { label: '20:00', defi: 5.6, transfers: 3.4, oracles: 2.0 },
  { label: '24:00', defi: 4.2, transfers: 2.6, oracles: 1.6 },
];

interface MonoRoundedStackedBarChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedStackedBarChart({ theme = 'dark', compact = false }: MonoRoundedStackedBarChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

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
            24.8M <span className="text-xs font-normal opacity-70">daily tx</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            52% DeFi
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          3 Program Classes
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={STACKED_DATA} margin={{ top: 12, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Bar dataKey="defi" name="DeFi & Swaps" stackId="a" fill={isDark ? '#FFFFFF' : '#09090B'} radius={[0, 0, 6, 6]} barSize={compact ? 14 : 18} isAnimationActive={!isMobile} animationDuration={isMobile ? 0 : 700} />
            <Bar dataKey="transfers" name="System Transfers" stackId="a" fill={isDark ? 'rgba(255,255,255,0.52)' : 'rgba(9,9,11,0.52)'} isAnimationActive={!isMobile} animationDuration={isMobile ? 0 : 700} />
            <Bar dataKey="oracles" name="Oracles / Governance" stackId="a" fill={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(9,9,11,0.22)'} radius={[6, 6, 0, 0]} isAnimationActive={!isMobile} animationDuration={isMobile ? 0 : 700} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
