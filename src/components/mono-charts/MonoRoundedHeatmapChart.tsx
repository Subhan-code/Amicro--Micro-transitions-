import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HeatmapNode {
  day: string;
  hours: number[];
}

const HEATMAP_DATA: HeatmapNode[] = [
  { day: 'Mon', hours: [14, 38, 72, 54, 88, 32, 58] },
  { day: 'Tue', hours: [28, 56, 84, 68, 42, 76, 24] },
  { day: 'Wed', hours: [48, 68, 34, 78, 62, 92, 44] },
  { day: 'Thu', hours: [22, 76, 58, 44, 94, 52, 68] },
  { day: 'Fri', hours: [58, 88, 66, 84, 48, 36, 74] },
];

const TIME_SLOTS = ['00h', '04h', '08h', '12h', '16h', '20h', '24h'];

interface MonoRoundedHeatmapChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedHeatmapChart({ theme = 'dark', compact = false }: MonoRoundedHeatmapChartProps) {
  const isDark = theme === 'dark';
  const [hoveredCell, setHoveredCell] = useState<{ day: string; time: string; val: number } | null>(null);

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
            {hoveredCell ? `${hoveredCell.val}%` : '58%'}
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {hoveredCell ? `${hoveredCell.day} ${hoveredCell.time}` : 'Peak 94% (16h UTC)'}
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          35 Windows
        </div>
      </div>

      {/* Main Stage Matrix Grid */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2.5 sm:p-3 transition-colors duration-300 flex flex-col justify-between gap-1.5 sm:gap-2 min-h-0 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {HEATMAP_DATA.map((row, rIdx) => (
          <div key={rIdx} className="flex items-center justify-between gap-2.5 w-full">
            <span className={`text-[10px] font-mono w-7 shrink-0 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {row.day}
            </span>
            <div className="flex-1 flex items-center justify-between gap-1.5 sm:gap-2">
              {row.hours.map((val, cIdx) => {
                const opacity = Math.max(0.08, val / 100);
                const isHovered = hoveredCell?.day === row.day && hoveredCell?.time === TIME_SLOTS[cIdx];

                return (
                  <div
                    key={cIdx}
                    onMouseEnter={() => setHoveredCell({ day: row.day, time: TIME_SLOTS[cIdx], val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`aspect-square flex-1 rounded-[4px] sm:rounded-[6px] transition-all cursor-pointer ${
                      isHovered ? 'scale-125 z-10 shadow-md ring-2 ring-white/50' : 'hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: isDark ? `rgba(255,255,255,${opacity})` : `rgba(9,9,11,${opacity})`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
