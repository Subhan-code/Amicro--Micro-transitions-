import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DitherChartTooltipContent } from '../dither-charts/lib/recharts-tooltip';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ScatterPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  isLeader?: boolean;
}

const ALL_NODES: ScatterPoint[] = [
  { x: 18, y: 1450, z: 280, name: 'Validator Alpha (US-East)', isLeader: true },
  { x: 26, y: 890, z: 220, name: 'Staking Prime (EU-Central)', isLeader: true },
  { x: 34, y: 640, z: 180, name: 'SolNode 04 (AP-South)' },
  { x: 42, y: 1120, z: 260, name: 'Nexus Stake (US-West)', isLeader: true },
  { x: 55, y: 420, z: 140, name: 'Helios Node (EU-West)' },
  { x: 68, y: 310, z: 120, name: 'Apex Validator (SA-East)' },
  { x: 22, y: 980, z: 240, name: 'Atlas Core (US-Central)', isLeader: true },
];

interface MonoRoundedScatterChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedScatterChart({ theme = 'dark', compact = false }: MonoRoundedScatterChartProps) {
  const isDark = theme === 'dark';
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<'All' | 'Leaders'>('All');

  const filteredData = filter === 'Leaders' ? ALL_NODES.filter((n) => n.isLeader) : ALL_NODES;

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
      {/* Header: Clean readout + filter only */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            32.4
          </span>
          <span className="text-xs font-mono opacity-70">ms ping</span>
          <span className="text-[10px] font-mono text-blue-400 font-medium">
            {filteredData.length} nodes
          </span>
        </div>

        {/* Filter selector */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['All', 'Leaders'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFilter(f);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                filter === f
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Recharts Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-2 transition-colors min-h-0 duration-300 touch-pan-y ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 12, left: -22, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            />
            <XAxis
              dataKey="x"
              name="Ping (ms)"
              type="number"
              unit="ms"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }}
            />
            <YAxis
              dataKey="y"
              name="Stake (k SOL)"
              type="number"
              unit="k"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9.5, fill: isDark ? '#71717A' : '#A1A1AA' }}
            />
            <ZAxis dataKey="z" range={[80, 260]} />
            <Tooltip content={<DitherChartTooltipContent theme={theme} indicator="dot" />} cursor={{ strokeDasharray: '3 3' }} />

            <Scatter
              name="Validator Nodes"
              data={filteredData}
              fill={isDark ? '#FFFFFF' : '#09090B'}
              stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(9,9,11,0.5)'}
              strokeWidth={1.5}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 700}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
