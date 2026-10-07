import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

interface MonoRoundedKpiCardChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

const KPI_SETS = {
  YoY: [
    { period: 'Jan', val: 240 },
    { period: 'Mar', val: 285 },
    { period: 'May', val: 320 },
    { period: 'Jul', val: 390 },
    { period: 'Sep', val: 430 },
    { period: 'Nov', val: 482.9 },
  ],
  MoM: [
    { period: 'W1', val: 462 },
    { period: 'W2', val: 468 },
    { period: 'W3', val: 474 },
    { period: 'W4', val: 482.9 },
  ],
};

export function MonoRoundedKpiCardChart({ theme = 'dark', compact = false }: MonoRoundedKpiCardChartProps) {
  const isDark = theme === 'dark';
  const [period, setPeriod] = useState<'YoY' | 'MoM'>('YoY');

  const currentData = KPI_SETS[period];

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
      {/* Header: Clean readout + period toggle only */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            $482,900
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-medium">
            {period === 'YoY' ? '+28.4% YoY' : '+3.8% MoM'}
          </span>
        </div>

        {/* Period toggle */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['YoY', 'MoM'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPeriod(p);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                period === p
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage Sparkline */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 flex flex-col justify-end ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <div className="w-full h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData}>
              <defs>
                <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={isDark ? "#FFFFFF" : "#09090B"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className={`px-2.5 py-1 rounded-md text-[10px] font-mono shadow-md border ${
                        isDark ? 'bg-black border-white/10 text-white' : 'bg-white border-neutral-200 text-black'
                      }`}>
                        ${payload[0].value}k ARR
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="val"
                stroke={isDark ? '#FFFFFF' : '#09090B'}
                strokeWidth={2.5}
                strokeLinecap="round"
                fill="url(#kpiGrad)"
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
