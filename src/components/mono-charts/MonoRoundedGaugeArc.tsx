import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MonoRoundedGaugeArcProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedGaugeArc({ theme = 'dark', compact = false }: MonoRoundedGaugeArcProps) {
  const isDark = theme === 'dark';
  const [tier, setTier] = useState<'Standard' | 'Enterprise'>('Enterprise');

  const val = tier === 'Enterprise' ? 99.98 : 99.5;
  const data = [
    { name: 'Active Uptime', value: val },
    { name: 'Allowable SLA', value: Math.max(0.01, 100 - val) },
  ];

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
      {/* Header: Clean readout + tier toggle only */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            {val}%
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            OPTIMAL
          </span>
        </div>

        {/* Tier selector */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['Standard', 'Enterprise'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTier(t);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                tier === t
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {t === 'Standard' ? 'Std' : 'Ent'}
            </button>
          ))}
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
              startAngle={210}
              endAngle={-30}
              innerRadius={compact ? 48 : 58}
              outerRadius={compact ? 64 : 76}
              cornerRadius={8}
              strokeLinecap="round"
              paddingAngle={4}
            >
              <Cell fill={isDark ? '#FFFFFF' : '#09090B'} />
              <Cell fill={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(9,9,11,0.1)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute bottom-3 sm:bottom-4 flex flex-col items-center pointer-events-none">
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight tabular-nums">
            {val}%
          </span>
          <span className={`text-[10px] font-mono tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {tier} SLA Met
          </span>
        </div>
      </div>
    </motion.div>
  );
}
