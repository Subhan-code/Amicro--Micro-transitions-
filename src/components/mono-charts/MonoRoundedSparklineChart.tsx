import React from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useIsMobile } from '../../hooks/useIsMobile';

interface SparkRow {
  name: string;
  val: string;
  badge: string;
  data: { x: number; y: number }[];
}

const SPARK_ROWS: SparkRow[] = [
  {
    name: 'CPU Core Temp',
    val: '42.4°C',
    badge: 'Nominal',
    data: [{ x: 1, y: 38 }, { x: 2, y: 41 }, { x: 3, y: 39 }, { x: 4, y: 44 }, { x: 5, y: 42.4 }],
  },
  {
    name: 'NVMe IOPS',
    val: '48.2k',
    badge: 'High I/O',
    data: [{ x: 1, y: 28 }, { x: 2, y: 34 }, { x: 3, y: 42 }, { x: 4, y: 49 }, { x: 5, y: 48.2 }],
  },
  {
    name: 'Memory Pool',
    val: '18.4 GB',
    badge: 'Optimized',
    data: [{ x: 1, y: 14 }, { x: 2, y: 16 }, { x: 3, y: 17.5 }, { x: 4, y: 18.8 }, { x: 5, y: 18.4 }],
  },
];

interface MonoRoundedSparklineChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedSparklineChart({ theme = 'dark', compact = false }: MonoRoundedSparklineChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

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
            3 / 3 <span className="text-xs font-normal opacity-70">sensors online</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Nominal
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Live Polling
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-3 transition-colors min-h-0 duration-300 flex flex-col justify-around gap-2.5 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {SPARK_ROWS.map((row, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex flex-col w-28 shrink-0">
              <span className={`text-[11px] font-medium tracking-tight truncate ${isDark ? 'text-white' : 'text-black'}`}>{row.name}</span>
              <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>{row.val}</span>
            </div>
            <div className="flex-1 h-7">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={row.data}>
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={isDark ? '#FFFFFF' : '#09090B'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    dot={false}
                    isAnimationActive={!isMobile}
                    animationDuration={isMobile ? 0 : 700}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 shrink-0">
              {row.badge}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
