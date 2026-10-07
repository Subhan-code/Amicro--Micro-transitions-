import React, { useState } from 'react';
import { motion } from 'motion/react';

interface PyramidLevel {
  label: string;
  count: string;
  widthPct: number;
  opacity: number;
  rate: string;
}

const PIPELINE_LEVELS: PyramidLevel[] = [
  { label: 'Finalized Block', count: '78.4k', widthPct: 34, opacity: 1, rate: '99.9%' },
  { label: 'Banking Consensus', count: '84.2k', widthPct: 54, opacity: 0.72, rate: '97.4%' },
  { label: 'SigVerify Queue', count: '92.6k', widthPct: 74, opacity: 0.45, rate: '98.8%' },
  { label: 'Network Inbound', count: '104.2k', widthPct: 94, opacity: 0.22, rate: '100%' },
];

interface MonoRoundedPyramidChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedPyramidChart({ theme = 'dark', compact = false }: MonoRoundedPyramidChartProps) {
  const isDark = theme === 'dark';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeLevel = hoveredIdx !== null ? PIPELINE_LEVELS[hoveredIdx] : PIPELINE_LEVELS[0];

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
            {activeLevel.count} <span className="text-xs font-normal opacity-70">tx/s</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {activeLevel.rate} Finality
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          {activeLevel.label}
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-3 transition-colors min-h-0 duration-300 flex flex-col items-center justify-around gap-2 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {PIPELINE_LEVELS.map((lvl, idx) => {
          const isHovered = hoveredIdx === idx;

          return (
            <motion.div
              key={idx}
              initial={{ scaleX: 0.85, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`h-7 sm:h-8 rounded-xl transition-all duration-200 flex items-center justify-between px-3 border cursor-pointer ${
                isHovered ? 'scale-[1.03] shadow-md z-10' : ''
              }`}
              style={{
                width: `${lvl.widthPct}%`,
                backgroundColor: isDark ? `rgba(255,255,255,${lvl.opacity})` : `rgba(9,9,11,${lvl.opacity})`,
                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(9,9,11,0.2)',
                color: isDark ? (lvl.opacity > 0.6 ? '#000000' : '#FFFFFF') : (lvl.opacity > 0.6 ? '#FFFFFF' : '#000000'),
              }}
            >
              <span className="text-[10px] font-bold font-mono tracking-tight truncate">{lvl.label}</span>
              <span className="text-[10px] font-mono opacity-80 shrink-0 ml-1">{lvl.count}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
