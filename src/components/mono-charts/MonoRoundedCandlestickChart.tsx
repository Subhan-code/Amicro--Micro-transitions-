import React, { useState } from 'react';
import { motion } from 'motion/react';

interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: string;
}

const CANDLE_DATA_SETS: Record<'15M' | '1H' | '4H', CandlePoint[]> = {
  '15M': [
    { time: '14:00', open: 172.5, high: 174.8, low: 171.8, close: 174.2, vol: '12.4k' },
    { time: '14:15', open: 174.2, high: 176.5, low: 173.9, close: 175.8, vol: '18.2k' },
    { time: '14:30', open: 175.8, high: 176.2, low: 174.1, close: 174.6, vol: '9.8k' },
    { time: '14:45', open: 174.6, high: 177.8, low: 174.4, close: 177.2, vol: '24.1k' },
    { time: '15:00', open: 177.2, high: 179.5, low: 176.5, close: 178.4, vol: '31.5k' },
  ],
  '1H': [
    { time: '11:00', open: 168.0, high: 171.2, low: 167.5, close: 170.8, vol: '48.2k' },
    { time: '12:00', open: 170.8, high: 173.5, low: 169.8, close: 172.5, vol: '62.4k' },
    { time: '13:00', open: 172.5, high: 175.0, low: 171.9, close: 174.2, vol: '55.1k' },
    { time: '14:00', open: 174.2, high: 177.8, low: 173.8, close: 177.2, vol: '84.6k' },
    { time: '15:00', open: 177.2, high: 180.2, low: 176.0, close: 178.4, vol: '95.2k' },
  ],
  '4H': [
    { time: '00:00', open: 162.0, high: 166.5, low: 161.2, close: 165.8, vol: '180k' },
    { time: '04:00', open: 165.8, high: 170.2, low: 164.5, close: 169.4, vol: '240k' },
    { time: '08:00', open: 169.4, high: 174.8, low: 168.2, close: 173.6, vol: '310k' },
    { time: '12:00', open: 173.6, high: 180.2, low: 172.5, close: 178.4, vol: '420k' },
  ],
};

interface MonoRoundedCandlestickChartProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
}

export function MonoRoundedCandlestickChart({ theme = 'dark', compact = false }: MonoRoundedCandlestickChartProps) {
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<'15M' | '1H' | '4H'>('15M');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const currentData = CANDLE_DATA_SETS[timeframe];
  const activeCandle = hoveredIdx !== null ? currentData[hoveredIdx] : currentData[currentData.length - 1];

  const minVal = Math.min(...currentData.map((c) => c.low)) - 1;
  const maxVal = Math.max(...currentData.map((c) => c.high)) + 1;
  const range = maxVal - minVal;

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
      {/* Header: Clean spot price + timeframe toggle only */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums font-sans">
            ${activeCandle.close.toFixed(2)}
          </span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            +8.6%
          </span>
          <span className={`text-[10px] font-mono opacity-60 hidden sm:inline ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Vol {activeCandle.vol}
          </span>
        </div>

        {/* Timeframe pill selector */}
        <div className={`inline-flex items-center p-0.5 rounded-lg border text-[10px] font-mono font-medium ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
        }`}>
          {(['15M', '1H', '4H'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setTimeframe(tf);
                setHoveredIdx(null);
              }}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer border-0 ${
                timeframe === tf
                  ? isDark ? 'bg-white text-black font-semibold' : 'bg-black text-white font-semibold'
                  : isDark ? 'text-neutral-400 hover:text-white bg-transparent' : 'text-neutral-600 hover:text-black bg-transparent'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stage */}
      <div className={`relative w-full flex-1 rounded-[14px] overflow-hidden p-3 transition-colors min-h-0 duration-300 flex items-center justify-around gap-2.5 ${
        isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
      }`}>
        {currentData.map((c, idx) => {
          const isBull = c.close >= c.open;
          const bodyTop = Math.max(c.open, c.close);
          const bodyBottom = Math.min(c.open, c.close);

          const bodyTopPct = ((maxVal - bodyTop) / range) * 100;
          const bodyHeightPct = Math.max(6, ((bodyTop - bodyBottom) / range) * 100);
          const highPct = ((maxVal - c.high) / range) * 100;
          const lowPct = ((maxVal - c.low) / range) * 100;
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer group/candle"
            >
              {/* Wick Line */}
              <div
                className={`absolute w-[1.5px] rounded-full transition-all duration-200 ${
                  isHovered ? (isDark ? 'bg-white' : 'bg-black') : isDark ? 'bg-white/40' : 'bg-black/30'
                }`}
                style={{
                  top: `${highPct}%`,
                  bottom: `${100 - lowPct}%`,
                }}
              />
              {/* Body Box */}
              <div
                className={`absolute w-5 sm:w-7 rounded-md transition-all duration-200 border ${
                  isHovered ? 'scale-105 shadow-md' : ''
                }`}
                style={{
                  top: `${bodyTopPct}%`,
                  height: `${bodyHeightPct}%`,
                  backgroundColor: isBull
                    ? isDark ? '#FFFFFF' : '#09090B'
                    : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(9,9,11,0.12)',
                  borderColor: isDark ? '#FFFFFF' : '#09090B',
                }}
              />
              <span className={`absolute bottom-0 text-[9px] font-mono transition-colors ${
                isHovered ? (isDark ? 'text-white font-bold' : 'text-black font-bold') : isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {c.time}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
