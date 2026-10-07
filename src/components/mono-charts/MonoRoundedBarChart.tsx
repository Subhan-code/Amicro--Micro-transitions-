import React, { useState } from 'react';
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

interface BarPoint {
  label: string;
  primary: number;
  secondary: number;
}

const BAR_DATA_SETS: Record<'7D' | '30D', BarPoint[]> = {
  '7D': [
    { label: 'Mon', primary: 4120, secondary: 1250 },
    { label: 'Tue', primary: 4780, secondary: 1420 },
    { label: 'Wed', primary: 4420, secondary: 1310 },
    { label: 'Thu', primary: 5190, secondary: 1580 },
    { label: 'Fri', primary: 4980, secondary: 1500 },
    { label: 'Sat', primary: 4240, secondary: 1210 },
    { label: 'Sun', primary: 4892, secondary: 1440 },
  ],
  '30D': [
    { label: 'W1', primary: 3950, secondary: 1100 },
    { label: 'W2', primary: 4320, secondary: 1280 },
    { label: 'W3', primary: 4680, secondary: 1390 },
    { label: 'W4', primary: 5120, secondary: 1540 },
  ],
};

interface MonoRoundedBarChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedBarChart({ theme = 'dark', compact = false }: MonoRoundedBarChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [range, setRange] = useState<'7D' | '30D'>('7D');

  const currentData = BAR_DATA_SETS[range];
  const latestVal = currentData[currentData.length - 1].primary.toLocaleString();

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
            {latestVal}
          </span>
          <span className="text-xs font-mono opacity-70">tx/s</span>
          <span className="text-[10px] font-mono text-emerald-400 font-medium">
            +14.8%
          </span>
        </div>

        {/* Range Selector */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['7D', '30D'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRange(r);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                range === r
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 10, right: 12, left: -22, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              vertical={false}
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />

            <Bar
              dataKey="primary"
              name="Executed Tx/s"
              fill={isDark ? '#FFFFFF' : '#09090B'}
              radius={[6, 6, 6, 6]}
              barSize={compact ? 14 : 18}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 700}
            />

            <Bar
              dataKey="secondary"
              name="Vote Tx/s"
              fill={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.16)'}
              radius={[6, 6, 6, 6]}
              barSize={compact ? 14 : 18}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 700}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
