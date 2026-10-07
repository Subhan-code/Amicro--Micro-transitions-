import React from 'react';
import { motion } from 'motion/react';

interface BulletItem {
  title: string;
  actual: number;
  target: number;
  unit: string;
  status: 'passed' | 'warning';
}

const BULLET_ITEMS: BulletItem[] = [
  { title: 'Block Time', actual: 380, target: 400, unit: 'ms', status: 'passed' },
  { title: 'Vote Success', actual: 98.6, target: 95.0, unit: '%', status: 'passed' },
  { title: 'Cluster Throughput', actual: 4850, target: 4500, unit: 'TPS', status: 'passed' },
];

interface MonoRoundedBulletChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedBulletChart({ theme = 'dark', compact = false }: MonoRoundedBulletChartProps) {
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
            3 / 3 <span className="text-xs font-normal opacity-70">targets met</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% SLO
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          Tier-1 Node
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-3 transition-colors min-h-0 duration-300 flex flex-col justify-around gap-2.5 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {BULLET_ITEMS.map((item, idx) => {
          const ratio = Math.min(100, Math.round((item.actual / (item.target * 1.15)) * 100));
          const targetMarker = Math.round((item.target / (item.target * 1.15)) * 100);

          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={isDark ? 'text-white font-medium' : 'text-black font-medium'}>{item.title}</span>
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                  {item.actual} {item.unit} / <span className="opacity-60">{item.target} {item.unit}</span>
                </span>
              </div>
              <div className={`relative w-full h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-black/10'
              }`}>
                {/* Actual Bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ratio}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`}
                />
                {/* Target Marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 rounded-full bg-emerald-400 shadow-sm"
                  style={{ left: `${targetMarker}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
