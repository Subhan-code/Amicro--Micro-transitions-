import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// ==============================================================
// 1. NEON SIGN DRAW & CLEAR (ネオンサイン)
// ==============================================================
export function NeonSignDraw({
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
  const loopFlg = useLoopFlg(true, 2800);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes neon_draw_line {
          0% { opacity: 0; stroke-dasharray: 0 240px; }
          20%, 100% { opacity: 1; stroke-dasharray: 240px 240px; }
        }
        @keyframes neon_clear_line {
          0%, 65% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -240px; opacity: 0; }
        }
        .neon-stroke-path {
          --sl: 240px;
          stroke-dasharray: 240px 240px;
          animation: 
            neon_draw_line 1.2s ease-in-out 0s both, 
            neon_clear_line 1.2s ease-in-out 1.4s forwards;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[65px] flex items-center justify-center">
        <svg viewBox="0 0 160 80" className="w-full h-full" fill="none" stroke={theme === 'dark' ? '#0a84ff' : '#0071e3'} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <polyline className="neon-stroke-path" points="15,40 50,40 70,18 90,62 110,40 145,40" />
        </svg>
      </div>
    </div>
  );
}

// ==============================================================
// 2. SUDDEN BRAKE SKID (急ブレーキ)
// ==============================================================
export function SuddenBrake({
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
  const loopFlg = useLoopFlg(true, 2800);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes brake_translate {
          0% { transform: translateX(180px); }
          100% { transform: translateX(0); }
        }
        @keyframes brake_rotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-18deg); }
          55% { transform: rotate(4deg); }
          75% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }
        .brake-car-wrapper {
          animation: brake_translate 0.75s cubic-bezier(0, 0.7, 0.6, 1) 0s both;
        }
        .brake-car-body {
          transform-origin: left bottom;
          animation: brake_rotate 0.9s ease-in-out 0.65s both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[75px] flex items-center justify-center overflow-hidden">
        <div className="brake-car-wrapper">
          <div className="brake-car-body flex flex-col items-center">
            {/* Speed Skidding Block */}
            <div className="w-[52px] h-[34px] rounded-xl bg-blue-600 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-md bg-white/90" />
            </div>
            {/* Base Wheels */}
            <div className="flex justify-between w-[44px] -mt-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-700 border-2 border-neutral-500" />
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-700 border-2 border-neutral-500" />
            </div>
          </div>
        </div>
        {/* Skid Track Line */}
        <div className="absolute bottom-3 left-3 right-3 h-[2px] rounded-full bg-neutral-700/60" />
      </div>
    </div>
  );
}

// ==============================================================
// 3. ROLLING TUMBLE PHYSICS (転がる)
// ==============================================================
export function RollingTumble({
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
        @keyframes rolling_box_step {
          0% { transform: translateX(-40px) rotate(0deg); }
          30% { transform: translateX(-10px) rotate(90deg); }
          60% { transform: translateX(20px) rotate(180deg); }
          85%, 100% { transform: translateX(45px) rotate(270deg); }
        }
        .rolling-cube {
          transform-origin: center center;
          animation: rolling_box_step 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[75px] flex items-center justify-center">
        {/* Rolling Solid Box */}
        <div className="w-[34px] h-[34px] rounded-xl bg-blue-500 rolling-cube shadow-md flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
        </div>
        {/* Ground Floor */}
        <div className="absolute bottom-4 left-4 right-4 h-[2px] rounded-full bg-neutral-700/60" />
      </div>
    </div>
  );
}

// ==============================================================
// 4. PAGE TURN CURL (ページめくり)
// ==============================================================
export function PageTurnCurl({
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
        @keyframes page_curl_rise {
          0%, 100% { transform: translateY(60px) rotateX(45deg); opacity: 0; border-radius: 4px 4px 28px 28px; }
          40%, 75% { transform: translateY(0) rotateX(0deg); opacity: 1; border-radius: 16px; }
        }
        .page-sheet {
          transform-origin: bottom center;
          animation: page_curl_rise 3s cubic-bezier(0.78, 0, 0.2, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[100px] h-[75px] flex items-center justify-center">
        {/* Base Page */}
        <div className={`absolute w-[80px] h-[60px] rounded-2xl border ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-[#d2d2d7]'
        }`}>
          <div className="absolute bottom-2.5 left-3 w-8 h-1.5 rounded-full bg-neutral-600" />
        </div>
        {/* Curled Rising Page */}
        <div className="absolute w-[80px] h-[60px] page-sheet bg-blue-600 shadow-lg flex flex-col items-center justify-center gap-1.5 p-2">
          <div className="w-10 h-2 rounded-full bg-white/90" />
          <div className="w-6 h-1.5 rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// 5. SHUTTER STEP BLOCKS (シャッター・ブロック) - pure css inertia blocks
// ==============================================================
export function ShutterStepBlocks({
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
  const loopFlg = useLoopFlg(true, 2800);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes shutter_step_slice {
          0%, 100% { transform: scaleX(0); }
          40%, 75% { transform: scaleX(1); }
        }
        .shutter-slice {
          transform-origin: left center;
          animation: shutter_step_slice 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[100px] h-[65px] flex flex-col justify-between py-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-[11px] rounded-md shutter-slice ${
              i % 2 === 0 ? 'bg-blue-600' : 'bg-blue-400'
            }`}
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ==============================================================
// 6. INERTIA SKID STOP (慣性スキッド)
// ==============================================================
export function InertiaSkidStop({
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
  const loopFlg = useLoopFlg(true, 2800);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes inertia_slide {
          0% { transform: translateX(-80px) skewX(20deg); }
          50% { transform: translateX(10px) skewX(-15deg); }
          75% { transform: translateX(-4px) skewX(5deg); }
          100% { transform: translateX(0) skewX(0deg); }
        }
        .inertia-block {
          animation: inertia_slide 2.8s cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[130px] h-[75px] flex items-center justify-center">
        <div className="w-[50px] h-[32px] rounded-xl bg-blue-500 inertia-block shadow-md flex items-center justify-center">
          <div className="w-8 h-1.5 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}
