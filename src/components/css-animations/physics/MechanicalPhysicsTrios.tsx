import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// ==============================================================
// 1. REPLACEMENT: Card Stack Peel (Replaces Bookmark Ribbon Fold)
// ==============================================================
export function CardStackPeel({
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
        @keyframes card_peel_drop {
          0%, 100% { transform: translateY(0) rotateX(0deg); opacity: 1; }
          40%, 75% { transform: perspective(400px) translateY(24px) rotateX(25deg); opacity: 0.9; }
        }
        .card-top-sheet {
          transform-origin: top center;
          animation: card_peel_drop 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[75px] flex items-center justify-center">
        {/* Under Card */}
        <div className={`absolute w-[100px] h-[65px] rounded-2xl border ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-[#d2d2d7]'
        }`}>
          <div className="absolute top-3 left-3 w-10 h-1.5 rounded-full bg-blue-500" />
        </div>
        {/* Top Peeling Card */}
        <div className="absolute w-[100px] h-[65px] rounded-2xl card-top-sheet bg-blue-600 shadow-md flex items-center justify-center">
          <div className="w-12 h-2 rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 2. REPLACEMENT: Elastic Tag Snap (Replaces Hanging Stamp Drop)
// ==============================================================
export function ElasticTagSnap({
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
        @keyframes tag_bungee_snap {
          0%, 100% { transform: translateY(0) scaleY(1); }
          30% { transform: translateY(28px) scaleY(1.2); }
          50% { transform: translateY(-8px) scaleY(0.9); }
          70% { transform: translateY(4px) scaleY(1.05); }
          85% { transform: translateY(0) scaleY(1); }
        }
        .bungee-tag {
          transform-origin: top center;
          animation: tag_bungee_snap 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[85px] flex items-start justify-center pt-1">
        <div className="bungee-tag flex flex-col items-center">
          <div className="w-[3px] h-[28px] rounded-full bg-neutral-500" />
          <div className="w-[48px] h-[40px] rounded-xl bg-blue-600 shadow-md flex items-center justify-center -mt-1">
            <div className="w-5 h-5 rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 3. REPLACEMENT: Split Gate Reveal (Replaces Zipper Curtain Pull)
// ==============================================================
export function SplitGateReveal({
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
        @keyframes gate_left_split {
          0%, 100% { transform: translateY(0); }
          40%, 75% { transform: translateY(-75%); }
        }
        @keyframes gate_right_split {
          0%, 100% { transform: translateY(0); }
          40%, 75% { transform: translateY(75%); }
        }
        .gate-panel-top    { animation: gate_left_split 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both; }
        .gate-panel-bottom { animation: gate_right_split 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both; }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[75px] rounded-2xl overflow-hidden border border-neutral-700 bg-blue-600 flex items-center justify-center">
        <span className="text-xs font-mono font-bold text-white tracking-widest">AMICRO</span>
        <div className={`absolute top-0 left-0 w-full h-1/2 gate-panel-top border-b ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`} />
        <div className={`absolute bottom-0 left-0 w-full h-1/2 gate-panel-bottom border-t ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`} />
      </div>
    </div>
  );
}

// ==============================================================
// 4. REPLACEMENT: Origami Envelope Unfold (Replaces Diagonal Drape Pull)
// ==============================================================
export function OrigamiEnvelopeUnfold({
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
        @keyframes envelope_flap_flip {
          0%, 100% { transform: perspective(400px) rotateX(0deg); }
          40%, 75% { transform: perspective(400px) rotateX(180deg); }
        }
        .envelope-flap {
          transform-origin: top center;
          animation: envelope_flap_flip 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[100px] h-[65px] rounded-xl bg-blue-700 border border-neutral-600 flex items-center justify-center">
        {/* Inner Message Card */}
        <div className="w-[80px] h-[45px] rounded-lg bg-blue-400 flex items-center justify-center">
          <div className="w-8 h-1.5 rounded-full bg-white" />
        </div>
        {/* Front Folding Flap */}
        <div className="absolute top-0 left-0 w-full h-full envelope-flap pointer-events-none" style={{ clipPath: 'polygon(0 0, 50% 50%, 100% 0)' }}>
          <div className="w-full h-full bg-blue-500" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 5. REPLACEMENT: Smart Card Dispenser (Replaces Pop-Up Tissue Box)
// ==============================================================
export function SmartCardDispenser({
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
        @keyframes card_eject_push {
          0%, 100% { transform: translateY(0); }
          40%, 75% { transform: translateY(-38px); }
        }
        .dispenser-card {
          animation: card_eject_push 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[85px] flex flex-col items-center justify-end pb-1">
        {/* Ejected Card */}
        <div className="w-[70px] h-[45px] rounded-xl bg-blue-500 dispenser-card shadow-md flex items-center justify-between px-3">
          <div className="w-3 h-3 rounded-full bg-white/80" />
          <div className="w-8 h-1.5 rounded-full bg-white/60" />
        </div>
        {/* Base Dispenser Slot */}
        <div className={`w-[95px] h-[34px] -mt-4 rounded-xl z-20 flex items-center justify-center border ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`}>
          <div className="w-[75px] h-[3px] rounded-full bg-neutral-600" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 6. REPLACEMENT: Circuit Trace Draw (Replaces Calligraphy Line Stroke)
// ==============================================================
export function CircuitTraceDraw({
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
        @keyframes circuit_trace_anim {
          0% { stroke-dashoffset: 400; }
          50% { stroke-dashoffset: 0; }
          80%, 100% { stroke-dashoffset: -400; }
        }
        .circuit-line {
          stroke-dasharray: 400;
          animation: circuit_trace_anim 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[65px] flex items-center justify-center">
        <svg viewBox="0 0 140 70" className="w-full h-full" fill="none" stroke={theme === 'dark' ? '#3b82f6' : '#0071e3'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <polyline className="circuit-line" points="10,35 40,35 60,15 90,15 110,50 130,50" />
          <circle cx="10" cy="35" r="4" fill={theme === 'dark' ? '#3b82f6' : '#0071e3'} />
          <circle cx="130" cy="50" r="4" fill={theme === 'dark' ? '#3b82f6' : '#0071e3'} />
        </svg>
      </div>
    </div>
  );
}

// ==============================================================
// 7. REPLACEMENT: Hexagon Lattice Draw (Replaces Geometric Spiral Loop)
// ==============================================================
export function HexagonLatticeDraw({
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
        @keyframes hex_draw_loop {
          0% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 0; }
          80%, 100% { stroke-dashoffset: -300; }
        }
        .hex-path {
          stroke-dasharray: 300;
          animation: hex_draw_loop 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[75px] h-[75px] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke={theme === 'dark' ? '#60a5fa' : '#2563eb'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <polygon className="hex-path" points="50,10 85,30 85,70 50,90 15,70 15,30" />
        </svg>
      </div>
    </div>
  );
}

// ==============================================================
// 8. REPLACEMENT: Prism Block Stack (Replaces Stacking Geometry Blocks)
// ==============================================================
export function PrismBlockStack({
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
        @keyframes prism_drop {
          0% { transform: translateY(-60px) rotate(15deg); opacity: 0; }
          30% { transform: translateY(0) rotate(0deg); opacity: 1; }
          75% { opacity: 1; transform: translateY(0); }
          100% { transform: translateY(60px); opacity: 0; }
        }
        .prism-1 { animation: prism_drop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0s infinite both; }
        .prism-2 { animation: prism_drop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s infinite both; }
        .prism-3 { animation: prism_drop 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s infinite both; }
      `}</style>
      <div key={activeKey} className="relative flex flex-col items-center gap-1.5">
        <div className="w-10 h-4 rounded-md bg-blue-400 prism-3 shadow-sm" />
        <div className="w-14 h-4 rounded-md bg-blue-500 prism-2 shadow-sm" />
        <div className="w-18 h-4 rounded-md bg-blue-700 prism-1 shadow-sm" />
      </div>
    </div>
  );
}

// ==============================================================
// 9. REPLACEMENT: Modular Tile Snap (Replaces Tetris Block Settle)
// ==============================================================
export function ModularTileSnap({
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
        @keyframes tile_snap_anim {
          0%, 100% { transform: scale(0.6) rotate(15deg); opacity: 0; }
          35%, 75% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .snap-tile-1 { animation: tile_snap_anim 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0s infinite both; }
        .snap-tile-2 { animation: tile_snap_anim 3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s infinite both; }
      `}</style>
      <div key={activeKey} className="relative flex items-center gap-1.5">
        <div className="w-9 h-9 rounded-xl bg-blue-500 snap-tile-1 flex items-center justify-center shadow-md">
          <div className="w-3 h-3 rounded-full bg-white/90" />
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-700 snap-tile-2 flex items-center justify-center shadow-md">
          <div className="w-3 h-3 rounded-md bg-white/90" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 10. REPLACEMENT: Roller Blind Drop (Replaces Fabric Cloth Reveal)
// ==============================================================
export function RollerBlindDrop({
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
        @keyframes blind_roll_drop {
          0%, 100% { height: 8px; }
          40%, 75% { height: 55px; }
        }
        .roller-cloth {
          animation: blind_roll_drop 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[100px] flex flex-col items-center">
        {/* Top Roller Bar */}
        <div className="w-full h-2.5 rounded-full bg-neutral-600 z-10" />
        {/* Dropping Roller Cloth */}
        <div className="w-[88px] roller-cloth bg-blue-600 rounded-b-xl flex items-end justify-center pb-1 shadow-md">
          <div className="w-10 h-1 rounded-full bg-blue-400" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 11. REPLACEMENT: Ribbon Banner Slide (Replaces Pennant Flag Unfurl)
// ==============================================================
export function RibbonBannerSlide({
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
        @keyframes banner_slide_expand {
          0%, 100% { width: 12px; }
          40%, 75% { width: 95px; }
        }
        .ribbon-banner {
          animation: banner_slide_expand 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex items-center justify-center h-[45px]">
        <div className="h-[36px] ribbon-banner bg-blue-500 rounded-xl flex items-center justify-between px-3 overflow-hidden shadow-md">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-10 h-1.5 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 12. REPLACEMENT: Geometric Iris Shutter (Replaces Radial Aperture Diaphragm)
// ==============================================================
export function GeometricIrisShutter({
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
        @keyframes iris_blade_open {
          0%, 100% { transform: rotate(0deg) scale(0.3); }
          40%, 75% { transform: rotate(60deg) scale(1); }
        }
        .iris-blade {
          animation: iris_blade_open 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[75px] h-[75px] rounded-2xl border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
        <div className="w-[50px] h-[50px] rounded-xl bg-blue-600 iris-blade flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-blue-300" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 13. REPLACEMENT: Pendulum Bubble Level (Replaces Balance Beam Tilt)
// ==============================================================
export function PendulumBubbleLevel({
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
        @keyframes bubble_level_shift {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-24px); }
          50% { transform: translateX(24px); }
          75% { transform: translateX(-8px); }
        }
        .bubble-core {
          animation: bubble_level_shift 3s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[28px] rounded-full border-2 border-neutral-700 bg-neutral-900 flex items-center justify-center px-1">
        {/* Center Target Indicator Lines */}
        <div className="absolute w-[2px] h-full bg-neutral-600 left-1/2 -translate-x-1/2" />
        {/* Floating Fluid Bubble */}
        <div className="w-5 h-5 rounded-full bg-blue-400 bubble-core shadow-md" />
      </div>
    </div>
  );
}

// ==============================================================
// 14. REPLACEMENT: Kinetic Ticking Metronome (Replaces Newton's Pendulum Cradle)
// ==============================================================
export function KineticTickingMetronome({
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
  const loopFlg = useLoopFlg(true, 2000);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes metronome_tick {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(35deg); }
        }
        .metronome-arm {
          transform-origin: bottom center;
          animation: metronome_tick 1s ease-in-out infinite alternate both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[80px] h-[75px] flex flex-col items-center justify-end pb-1">
        <div className="w-[3px] h-[52px] bg-neutral-500 metronome-arm flex flex-col items-center">
          <div className="w-4 h-4 rounded-md bg-blue-500 shadow-md -mt-1" />
        </div>
        <div className="w-12 h-2 rounded-full bg-neutral-700 mt-1" />
      </div>
    </div>
  );
}

// ==============================================================
// 15. REPLACEMENT: Nested Orbital Gimbal (Replaces Gyroscope Concentric Rings)
// ==============================================================
export function NestedOrbitalGimbal({
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
        @keyframes gimbal_spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .gimbal-outer { animation: gimbal_spin 4s linear infinite; }
        .gimbal-inner { animation: gimbal_spin 2s linear infinite reverse; }
      `}</style>
      <div key={activeKey} className="relative w-[70px] h-[70px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-600 gimbal-outer" />
        <div className="absolute w-[44px] h-[44px] rounded-full border-2 border-blue-400 gimbal-inner" />
        <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
      </div>
    </div>
  );
}

// ==============================================================
// 16. REPLACEMENT: Dual Magnet Dipole (Replaces Magnetic Orbit Particle)
// ==============================================================
export function DualMagnetDipole({
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
  const loopFlg = useLoopFlg(true, 2400);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes dipole_snap {
          0%, 100% { transform: scale(1); gap: 28px; }
          40%, 70% { transform: scale(1.1); gap: 4px; }
        }
        .dipole-cluster {
          animation: dipole_snap 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative flex items-center justify-center dipole-cluster">
        <div className="w-7 h-7 rounded-xl bg-blue-500 shadow-md flex items-center justify-center font-bold text-xs text-white">N</div>
        <div className="w-7 h-7 rounded-xl bg-blue-700 shadow-md flex items-center justify-center font-bold text-xs text-white">S</div>
      </div>
    </div>
  );
}

// ==============================================================
// 17. REPLACEMENT: Compass Needle Deflect (Replaces Magnetic Grid Repel)
// ==============================================================
export function CompassNeedleDeflect({
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
  const loopFlg = useLoopFlg(true, 2600);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes compass_swing {
          0%, 100% { transform: rotate(0deg); }
          30% { transform: rotate(65deg); }
          60% { transform: rotate(-45deg); }
          80% { transform: rotate(15deg); }
        }
        .compass-dial {
          animation: compass_swing 2.6s ease-in-out infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[70px] h-[70px] rounded-full border-2 border-neutral-700 flex items-center justify-center">
        <div className="w-[6px] h-[48px] compass-dial flex flex-col items-center justify-between">
          <div className="w-[6px] h-[22px] bg-blue-500 rounded-t-full" />
          <div className="w-[6px] h-[22px] bg-neutral-500 rounded-b-full" />
        </div>
      </div>
    </div>
  );
}
