import React from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface RadarPoint {
  subject: string;
  metric: number;
}

const RADAR_DATA: RadarPoint[] = [
  { subject: 'Finality', metric: 95 },
  { subject: 'Uptime', metric: 99 },
  { subject: 'Peer Quality', metric: 88 },
  { subject: 'SigVerify', metric: 92 },
  { subject: 'Stake Weight', metric: 86 },
];

interface MonoRoundedRadarChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedRadarChart({ theme = 'dark', compact = false }: MonoRoundedRadarChartProps) {
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
            94.2 <span className="text-xs font-normal opacity-70">/ 100</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Tier-1 Grade
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          5 Vectors
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 flex items-center justify-center ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={compact ? 44 : 54} data={RADAR_DATA}>
            <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9.5, fill: isDark ? '#A1A1AA' : '#52525B' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Radar
              name="Benchmark Score"
              dataKey="metric"
              stroke={isDark ? '#FFFFFF' : '#09090B'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(9,9,11,0.18)'}
              animationDuration={700}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
