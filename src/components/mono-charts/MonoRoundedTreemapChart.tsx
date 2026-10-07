import React, { useState } from 'react';
import { motion } from 'motion/react';

interface TileNode {
  label: string;
  share: number;
  size: string;
  flex: string;
  opacity: number;
}

const TREEMAP_TILES: TileNode[] = [
  { label: 'Accounts DB', share: 48, size: '1.21 TB', flex: 'col-span-2 row-span-2', opacity: 1 },
  { label: 'Snapshots', share: 28, size: '720 GB', flex: 'col-span-1 row-span-2', opacity: 0.65 },
  { label: 'Index Cache', share: 14, size: '360 GB', flex: 'col-span-2 row-span-1', opacity: 0.38 },
  { label: 'Mempool', share: 10, size: '250 GB', flex: 'col-span-1 row-span-1', opacity: 0.2 },
];

interface MonoRoundedTreemapChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedTreemapChart({ theme = 'dark', compact = false }: MonoRoundedTreemapChartProps) {
  const isDark = theme === 'dark';
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activeTile = hoveredIdx !== null ? TREEMAP_TILES[hoveredIdx] : null;

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
            {activeTile ? activeTile.size : '2.54 TB'}
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {activeTile ? `${activeTile.label} (${activeTile.share}%)` : 'NVMe Ledger State'}
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          4 Partitions
        </div>
      </div>

      {/* Main Stage Grid */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 grid grid-cols-3 grid-rows-3 gap-1.5 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {TREEMAP_TILES.map((tile, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`${tile.flex} rounded-xl p-2.5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] cursor-pointer border ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}
            style={{
              backgroundColor: isDark
                ? `rgba(255,255,255,${tile.opacity})`
                : `rgba(9,9,11,${tile.opacity})`,
              color: isDark ? (tile.opacity > 0.5 ? '#000000' : '#FFFFFF') : (tile.opacity > 0.5 ? '#FFFFFF' : '#000000'),
            }}
          >
            <span className="text-[11px] font-bold tracking-tight font-sans truncate">{tile.label}</span>
            <div className="flex items-center justify-between text-[10px] font-mono opacity-85">
              <span>{tile.size}</span>
              <span>{tile.share}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
