import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface PolarPoint {
  name: string;
  count: number;
  label: string;
}

const POLAR_DATA: PolarPoint[] = [
  { name: 'US-East', count: 95, label: '1.42B req' },
  { name: 'EU-Central', count: 72, label: '980M req' },
  { name: 'AP-South', count: 54, label: '640M req' },
  { name: 'SA-East', count: 32, label: '310M req' },
];

interface MonoRoundedPolarChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedPolarChart({ theme = 'dark', compact = false }: MonoRoundedPolarChartProps) {
  const isDark = theme === 'dark';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeRegion = hoveredIdx !== null ? POLAR_DATA[hoveredIdx] : null;

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
            {activeRegion ? activeRegion.label : '3.35B'}
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {activeRegion ? activeRegion.name : 'Global Queries'}
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          4 Edge Zones
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 flex items-center justify-center ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="24%"
            outerRadius="88%"
            barSize={compact ? 8 : 11}
            data={POLAR_DATA}
            startAngle={90}
            endAngle={-270}
          >
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            {POLAR_DATA.map((item, idx) => (
              <RadialBar
                key={idx}
                background={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                dataKey="count"
                name={item.name}
                cornerRadius={6}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                fill={
                  isDark
                    ? idx === 0 ? '#FFFFFF' : idx === 1 ? 'rgba(255,255,255,0.72)' : idx === 2 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.22)'
                    : idx === 0 ? '#09090B' : idx === 1 ? 'rgba(9,9,11,0.72)' : idx === 2 ? 'rgba(9,9,11,0.45)' : 'rgba(9,9,11,0.22)'
                }
                animationDuration={800}
              />
            ))}
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
