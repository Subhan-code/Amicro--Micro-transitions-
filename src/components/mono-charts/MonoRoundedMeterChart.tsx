import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MonoRoundedMeterChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedMeterChart({ theme = 'dark', compact = false }: MonoRoundedMeterChartProps) {
  const isDark = theme === 'dark';
  const val = 88; // 88% efficiency score (1.12 PUE)

  const data = [
    { name: 'Active Efficiency', value: val },
    { name: 'Overhead', value: 100 - val },
  ];

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
            380 <span className="text-xs font-normal opacity-70">W/Node</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            1.12 PUE
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Tier-IV
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 flex flex-col items-center justify-center ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="75%"
              startAngle={180}
              endAngle={0}
              innerRadius={compact ? 44 : 54}
              outerRadius={compact ? 60 : 72}
              cornerRadius={7}
              strokeLinecap="round"
              paddingAngle={4}
            >
              <Cell fill={isDark ? '#FFFFFF' : '#09090B'} />
              <Cell fill={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(9,9,11,0.1)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-3 sm:bottom-4 flex flex-col items-center pointer-events-none">
          <span className="text-lg sm:text-xl font-bold font-mono tracking-tight tabular-nums">
            98.2%
          </span>
          <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Energy Efficiency
          </span>
        </div>
      </div>
    </motion.div>
  );
}
