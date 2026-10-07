import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ComposedPoint {
  label: string;
  rewards: number;
  apy: number;
}

const COMPOSED_DATA: ComposedPoint[] = [
  { label: 'Ep. 420', rewards: 184, apy: 7.2 },
  { label: 'Ep. 421', rewards: 210, apy: 7.5 },
  { label: 'Ep. 422', rewards: 242, apy: 7.8 },
  { label: 'Ep. 423', rewards: 206, apy: 7.6 },
  { label: 'Ep. 424', rewards: 275, apy: 8.1 },
  { label: 'Ep. 425', rewards: 298, apy: 8.4 },
];

interface MonoRoundedComposedChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedComposedChart({ theme = 'dark', compact = false }: MonoRoundedComposedChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<'all' | 'rewards' | 'apy'>('all');

  const totalRewards = COMPOSED_DATA.reduce((acc, item) => acc + item.rewards, 0);

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
      {/* Header: Clean metric + toggle only */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            {totalRewards}
          </span>
          <span className="text-xs font-mono opacity-70">SOL</span>
          <span className="text-[10px] font-mono text-emerald-400 font-medium">
            8.4% APY
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['all', 'rewards', 'apy'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setViewMode(mode);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 capitalize ${
                viewMode === mode
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={COMPOSED_DATA} margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis yAxisId="right" orientation="right" hide domain={[6, 10]} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />

            {(viewMode === 'all' || viewMode === 'rewards') && (
              <Bar
                yAxisId="left"
                dataKey="rewards"
                name="Rewards (SOL)"
                fill={isDark ? 'rgba(255,255,255,0.18)' : 'rgba(9,9,11,0.14)'}
                stroke={isDark ? 'rgba(255,255,255,0.45)' : 'rgba(9,9,11,0.35)'}
                strokeWidth={1}
                radius={[6, 6, 6, 6]}
                barSize={compact ? 16 : 22}
                isAnimationActive={!isMobile}
                animationDuration={isMobile ? 0 : 700}
              />
            )}

            {(viewMode === 'all' || viewMode === 'apy') && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="apy"
                name="Yield APY (%)"
                stroke={isDark ? '#FFFFFF' : '#09090B'}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={{
                  r: 3.5,
                  fill: isDark ? '#FFFFFF' : '#09090B',
                  stroke: isDark ? '#141414' : '#FFFFFF',
                  strokeWidth: 2,
                }}
                isAnimationActive={!isMobile}
                animationDuration={isMobile ? 0 : 800}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
