import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface BubblePoint {
  x: number; // Volume $M
  y: number; // Fee APY %
  z: number; // Liquidity Depth
  pair: string;
}

const BUBBLE_DATA: BubblePoint[] = [
  { x: 180, y: 18.5, z: 750, pair: 'SOL / USDC' },
  { x: 95, y: 14.2, z: 480, pair: 'SOL / USDT' },
  { x: 64, y: 24.8, z: 360, pair: 'JUP / SOL' },
  { x: 38, y: 32.4, z: 280, pair: 'BONK / SOL' },
];

interface MonoRoundedBubbleChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedBubbleChart({ theme = 'dark', compact = false }: MonoRoundedBubbleChartProps) {
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
            $377M <span className="text-xs font-normal opacity-70">TVL</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
            32.4% Max APY
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Top 4 Pools
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
            <XAxis dataKey="x" name="24h Vol ($M)" unit="M" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis dataKey="y" name="Fee APY (%)" unit="%" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <ZAxis dataKey="z" range={[120, 480]} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter
              name="Liquidity Pool"
              data={BUBBLE_DATA}
              fill={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(9,9,11,0.2)'}
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={2}
              animationDuration={800}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
