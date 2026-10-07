import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface DonutSegment {
  name: string;
  value: number;
  amount: string;
}

const MONO_DONUT_DATA: DonutSegment[] = [
  { name: 'Core Stake', value: 45, amount: '$64.2M' },
  { name: 'Liquidity Pool', value: 30, amount: '$42.8M' },
  { name: 'Insurance Fund', value: 15, amount: '$21.4M' },
  { name: 'Ecosystem', value: 10, amount: '$14.4M' },
];

interface MonoRoundedDonutChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedDonutChart({ theme = 'dark', compact = false }: MonoRoundedDonutChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeItem = hoverIndex !== null ? MONO_DONUT_DATA[hoverIndex] : null;

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
      {/* Header: Clean stat and allocation pill */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            {activeItem ? `${activeItem.name} (${activeItem.value}%)` : '$142.8M'}
          </span>
          <span className="text-xs font-mono opacity-70">TVL</span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-300 border border-white/10' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
        }`}>
          <span>4 Pools</span>
        </div>
      </div>

      {/* Main Recharts Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 flex items-center justify-center touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} />
            <Pie
              data={MONO_DONUT_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={compact ? 44 : 54}
              outerRadius={compact ? 66 : 78}
              paddingAngle={5}
              cornerRadius={7}
              strokeLinecap="round"
              onMouseEnter={(_, idx) => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 800}
            >
              {MONO_DONUT_DATA.map((entry, index) => {
                const isHovered = hoverIndex === index;
                const fillColor = isDark
                  ? index === 0
                    ? '#FFFFFF'
                    : index === 1
                    ? 'rgba(255,255,255,0.72)'
                    : index === 2
                    ? 'rgba(255,255,255,0.42)'
                    : 'rgba(255,255,255,0.2)'
                  : index === 0
                  ? '#09090B'
                  : index === 1
                  ? 'rgba(9,9,11,0.72)'
                  : index === 2
                  ? 'rgba(9,9,11,0.42)'
                  : 'rgba(9,9,11,0.2)';

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={fillColor}
                    stroke={isHovered ? (isDark ? '#FFFFFF' : '#000000') : 'transparent'}
                    strokeWidth={isHovered ? 2 : 0}
                    className="transition-all duration-200"
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-base sm:text-lg font-bold font-mono tracking-tight tabular-nums">
            {activeItem ? activeItem.amount : '100%'}
          </span>
          <span className={`text-[9px] font-mono tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {activeItem ? activeItem.name.split(' ')[0] : 'ALLOCATED'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
