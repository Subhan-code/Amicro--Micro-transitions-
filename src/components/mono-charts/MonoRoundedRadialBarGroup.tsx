import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip } from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';

interface GroupPoint {
  name: string;
  val: number;
  alloc: string;
}

const RADIAL_GROUP_DATA: GroupPoint[] = [
  { name: 'Compute (CPU)', val: 88, alloc: '28/32 Cores' },
  { name: 'Memory Pool', val: 72, alloc: '92/128 GB' },
  { name: 'NVMe Bandwidth', val: 56, alloc: '3.4/6.0 GB/s' },
  { name: 'Network Buffer', val: 42, alloc: '4.2/10 Gbps' },
];

interface MonoRoundedRadialBarGroupProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedRadialBarGroup({ theme = 'dark', compact = false }: MonoRoundedRadialBarGroupProps) {
  const isDark = theme === 'dark';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeItem = hoveredIdx !== null ? RADIAL_GROUP_DATA[hoveredIdx] : null;

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
            {activeItem ? `${activeItem.val}%` : '74.5%'}
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {activeItem ? activeItem.name : 'Cluster Saturation'}
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          {activeItem ? activeItem.alloc : 'Peak 88%'}
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
            innerRadius="20%"
            outerRadius="95%"
            barSize={compact ? 8 : 10}
            data={RADIAL_GROUP_DATA}
            startAngle={180}
            endAngle={0}
          >
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            {RADIAL_GROUP_DATA.map((item, idx) => (
              <RadialBar
                key={idx}
                background={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                dataKey="val"
                name={item.name}
                cornerRadius={8}
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
