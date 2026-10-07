import React, { useState } from 'react';
import { motion } from 'motion/react';

interface MonoRoundedSankeyChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedSankeyChart({ theme = 'dark', compact = false }: MonoRoundedSankeyChartProps) {
  const isDark = theme === 'dark';
  const [activeChannel, setActiveChannel] = useState<'all' | 'mempool' | 'rpc'>('all');

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
            84.2k <span className="text-xs font-normal opacity-70">tx/s</span>
          </div>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Routed
          </span>
        </div>

        <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ${
          isDark ? 'bg-white/5 text-neutral-400' : 'bg-neutral-100 text-neutral-600'
        }`}>
          2 Ingress → Leader Slot
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-3 transition-colors min-h-0 duration-300 flex items-center justify-between gap-4 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {/* Left Source Nodes */}
        <div className="flex flex-col justify-around h-full gap-2 z-10">
          <div
            onMouseEnter={() => setActiveChannel('mempool')}
            onMouseLeave={() => setActiveChannel('all')}
            className={`w-20 sm:w-24 h-10 rounded-xl flex flex-col justify-center px-2 border transition-all cursor-pointer ${
              activeChannel === 'mempool' ? 'scale-105 shadow-md' : ''
            } ${
              isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black'
            }`}
          >
            <span className="text-[10px] font-bold font-mono truncate">Mempool</span>
            <span className="text-[9px] font-mono opacity-70">48.5k tx/s</span>
          </div>

          <div
            onMouseEnter={() => setActiveChannel('rpc')}
            onMouseLeave={() => setActiveChannel('all')}
            className={`w-20 sm:w-24 h-10 rounded-xl flex flex-col justify-center px-2 border transition-all cursor-pointer ${
              activeChannel === 'rpc' ? 'scale-105 shadow-md' : ''
            } ${
              isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black'
            }`}
          >
            <span className="text-[10px] font-bold font-mono truncate">RPC Direct</span>
            <span className="text-[9px] font-mono opacity-70">35.7k tx/s</span>
          </div>
        </div>

        {/* SVG Flow Channels */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none p-4" preserveAspectRatio="none">
          <path
            d="M 90,38 C 160,38 180,60 250,60"
            fill="none"
            stroke={isDark ? '#FFFFFF' : '#09090B'}
            strokeWidth={activeChannel === 'mempool' ? 18 : 12}
            strokeOpacity={activeChannel === 'rpc' ? 0.08 : isDark ? 0.35 : 0.22}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <path
            d="M 90,84 C 160,84 180,60 250,60"
            fill="none"
            stroke={isDark ? '#FFFFFF' : '#09090B'}
            strokeWidth={activeChannel === 'rpc' ? 16 : 10}
            strokeOpacity={activeChannel === 'mempool' ? 0.08 : isDark ? 0.28 : 0.18}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>

        {/* Right Sink Node */}
        <div className="flex items-center justify-center h-full z-10 mr-1 sm:mr-3">
          <div className={`w-20 sm:w-24 h-14 rounded-2xl flex flex-col items-center justify-center text-center p-1.5 shadow-lg border ${
            isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
          }`}>
            <span className="text-[10px] font-bold font-mono tracking-tight">Leader Slot</span>
            <span className="text-[11px] font-extrabold font-mono mt-0.5">84.2k</span>
            <span className="text-[8px] font-mono opacity-70">CONFIRMED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
