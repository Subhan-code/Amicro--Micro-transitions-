import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// ==========================================
// ROW 4: DRAWING STROKES (3 VARIATIONS)
// ==========================================

// Variation 2: Geometric Spiral Signature
export function StrokeSpiral({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes stroke_circle_draw {
          0% { stroke-dashoffset: 600; transform: rotate(0deg); }
          60% { stroke-dashoffset: 0; transform: rotate(180deg); }
          80%, 100% { stroke-dashoffset: -600; transform: rotate(360deg); }
        }
        .spiral-path {
          stroke-dasharray: 600;
          transform-origin: center;
          animation: stroke_circle_draw 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[80px] h-[80px] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={theme === 'dark' ? '#3b82f6' : '#2563eb'} strokeWidth="6" strokeLinecap="round">
          <circle cx="50" cy="50" r="36" className="spiral-path" />
        </svg>
      </div>
    </div>
  );
}

// Variation 3: Waveform Pulse Line
export function StrokeWaveform({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes wave_line_draw {
          0% { stroke-dashoffset: 500; }
          50% { stroke-dashoffset: 0; }
          80%, 100% { stroke-dashoffset: -500; }
        }
        .waveform-path {
          stroke-dasharray: 500;
          animation: wave_line_draw 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[60px] flex items-center justify-center">
        <svg viewBox="0 0 160 80" className="w-full h-full" fill="none" stroke={theme === 'dark' ? '#60a5fa' : '#3b82f6'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <polyline className="waveform-path" points="10,40 40,40 55,15 70,65 85,30 95,50 110,40 150,40" />
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// ROW 5: STACKING BLOCKS (3 VARIATIONS)
// ==========================================

// Variation 2: Tetris L-Block Drop
export function TetrisBlockSettle({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes tetris_drop {
          0% { transform: translateY(-70px) rotate(-15deg); opacity: 0; }
          30% { transform: translateY(0) rotate(4deg); opacity: 1; }
          45% { transform: translateY(-6px) rotate(-2deg); }
          60%, 80% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
        .tetris-piece {
          animation: tetris_drop 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[100px] h-[80px] flex items-end justify-center pb-2">
        {/* Base Foundation Blocks */}
        <div className="flex gap-1">
          <div className="w-[22px] h-[22px] rounded-md bg-blue-700" />
          <div className="w-[22px] h-[22px] rounded-md bg-blue-700" />
          <div className="w-[22px] h-[22px] rounded-md bg-blue-700" />
        </div>
        {/* Falling L-Block */}
        <div className="absolute bottom-[28px] left-[26px] tetris-piece flex flex-col items-start">
          <div className="w-[22px] h-[22px] rounded-md bg-blue-500" />
          <div className="flex gap-1">
            <div className="w-[22px] h-[22px] rounded-md bg-blue-500" />
            <div className="w-[22px] h-[22px] rounded-md bg-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Variation 3: Pyramid Block Build
export function PyramidBlockBuild({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes block_scale_pop {
          0%, 15% { transform: scale(0); opacity: 0; }
          30%, 75% { transform: scale(1); opacity: 1; }
          90%, 100% { transform: scale(0); opacity: 0; }
        }
        .pyramid-base { animation: block_scale_pop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0s infinite both; }
        .pyramid-mid  { animation: block_scale_pop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s infinite both; }
        .pyramid-top  { animation: block_scale_pop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s infinite both; }
      `}</style>
      <div key={activeKey} className="relative flex flex-col items-center gap-1">
        {/* Top Peak */}
        <div className="w-[20px] h-[20px] rounded-md bg-blue-400 pyramid-top" />
        {/* Mid Row */}
        <div className="flex gap-1 pyramid-mid">
          <div className="w-[20px] h-[20px] rounded-md bg-blue-500" />
          <div className="w-[20px] h-[20px] rounded-md bg-blue-500" />
        </div>
        {/* Base Row */}
        <div className="flex gap-1 pyramid-base">
          <div className="w-[20px] h-[20px] rounded-md bg-blue-700" />
          <div className="w-[20px] h-[20px] rounded-md bg-blue-700" />
          <div className="w-[20px] h-[20px] rounded-md bg-blue-700" />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROW 6: FABRIC & SCROLL REVEALS (3 VARIATIONS)
// ==========================================

// Variation 2: Dual-Sided Scroll Unroll
export function ScrollCanvasUnroll({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes scroll_unroll_width {
          0%, 100% { width: 14px; }
          40%, 75% { width: 95px; }
        }
        .scroll-body {
          animation: scroll_unroll_width 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex items-center justify-center h-[65px]">
        {/* Left Roller */}
        <div className="w-[10px] h-[65px] rounded-full bg-neutral-500 z-10" />
        {/* Expanding Scroll Canvas */}
        <div className="h-[52px] scroll-body bg-blue-600 flex items-center justify-center overflow-hidden">
          <div className="w-8 h-2 rounded-full bg-blue-400" />
        </div>
        {/* Right Roller */}
        <div className="w-[10px] h-[65px] rounded-full bg-neutral-500 z-10" />
      </div>
    </div>
  );
}

// Variation 3: Pennant Flag Unfurl
export function FlagPennantUnfurl({
  trigger = 'hover',
  loop = true,
  theme = 'dark',
  className = '',
}: {
  trigger?: 'hover' | 'click';
  loop?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}) {
  const loopFlg = useLoopFlg(true, 3000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes flag_unfurl {
          0%, 100% { transform: scaleX(0); }
          40%, 75% { transform: scaleX(1); }
        }
        .flag-fabric {
          transform-origin: left center;
          animation: flag_unfurl 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[75px] flex items-center justify-start pl-4">
        {/* Flag Pole */}
        <div className="w-[4px] h-[65px] rounded-full bg-neutral-500" />
        {/* Flag Fabric */}
        <div className="w-[70px] h-[45px] flag-fabric bg-blue-500 rounded-r-xl shadow-md -ml-[2px]" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
      </div>
    </div>
  );
}
