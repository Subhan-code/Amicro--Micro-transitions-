import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// 1. Accordion Blind Pull
export function BlindPull({
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
        @keyframes blind_slat_expand {
          0% { transform: translateY(0) scaleY(0.2); opacity: 0.4; }
          45% { transform: translateY(var(--ty)) scaleY(1); opacity: 1; }
          55% { transform: translateY(calc(var(--ty) * 0.95)) scaleY(1); opacity: 1; }
          80% { transform: translateY(var(--ty)) scaleY(1); opacity: 1; }
          100% { transform: translateY(0) scaleY(0.2); opacity: 0.4; }
        }
        @keyframes blind_cord_pull {
          0%, 100% { height: 20px; }
          45%, 80% { height: 95px; }
        }
        .blind-cord {
          animation: blind_cord_pull 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        .blind-slat {
          animation: blind_slat_expand 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative w-[110px] h-[100px] flex flex-col items-center">
          {/* Top header bar */}
          <div className={`w-[110px] h-[8px] rounded-full z-20 ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-400'}`} />

          {/* Blind slats */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`absolute top-0 w-[100px] h-[7px] rounded-full blind-slat z-10 ${
                theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
              }`}
              style={
                {
                  '--ty': `${i * 17}px`,
                  animationDelay: `${i * 0.04}s`,
                } as React.CSSProperties
              }
            />
          ))}

          {/* Cord */}
          <div
            className={`absolute top-[4px] right-[10px] w-[2px] blind-cord ${
              theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-300'
            }`}
          >
            <div
              className={`absolute -bottom-1.5 -left-1 w-2.5 h-2.5 rounded-full ${
                theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Balance Beam Tilt
export function BalanceScale({
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
  const loopFlg = useLoopFlg(true, 3200);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes beam_tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-14deg); }
          50% { transform: rotate(14deg); }
          75% { transform: rotate(-6deg); }
          85% { transform: rotate(3deg); }
        }
        @keyframes weight_drop_left {
          0% { transform: translateY(-40px); opacity: 0; }
          20% { transform: translateY(0); opacity: 1; }
          75% { opacity: 1; }
          90%, 100% { transform: translateY(-40px); opacity: 0; }
        }
        @keyframes weight_drop_right {
          0%, 25% { transform: translateY(-40px); opacity: 0; }
          45% { transform: translateY(0); opacity: 1; }
          75% { opacity: 1; }
          90%, 100% { transform: translateY(-40px); opacity: 0; }
        }
        .balance-beam {
          transform-origin: center center;
          animation: beam_tilt 3.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite both;
        }
        .weight-left {
          animation: weight_drop_left 3.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
        .weight-right {
          animation: weight_drop_right 3.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative w-[120px] h-[80px] flex flex-col items-center justify-center">
          {/* Tilting Beam with weights */}
          <div className="relative w-[110px] h-[8px] flex items-center justify-between balance-beam">
            {/* Left Weight Block */}
            <div className={`w-[22px] h-[22px] rounded-lg -mt-7 weight-left ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} />
            {/* Beam Bar */}
            <div className={`absolute inset-0 rounded-full ${theme === 'dark' ? 'bg-neutral-600' : 'bg-neutral-400'}`} />
            {/* Right Weight Block */}
            <div className={`w-[22px] h-[22px] rounded-lg -mt-7 weight-right ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-700'}`} />
          </div>

          {/* Fulcrum Triangle */}
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[18px] border-b-neutral-500 mt-1" />
          <div className={`w-[50px] h-[4px] rounded-full mt-1 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
        </div>
      </div>
    </div>
  );
}

// 3. Gelatin Cube Wobble
export function GelatinWobble({
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
  const loopFlg = useLoopFlg(true, 2200);
  const [hoverKey, setHoverKey] = useState(0);
  const activeKey = loop ? `${loopFlg}-${hoverKey}` : `${hoverKey}`;

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes jelly_drop_wobble {
          0% { transform: translateY(-70px) scale(0.8, 1.25); opacity: 0; }
          30% { transform: translateY(0) scale(1.4, 0.6); opacity: 1; }
          45% { transform: translateY(-16px) scale(0.85, 1.2); }
          60% { transform: translateY(0) scale(1.15, 0.85); }
          75% { transform: translateY(-4px) scale(0.95, 1.05); }
          88% { transform: translateY(0) scale(1.02, 0.98); }
          95%, 100% { transform: translateY(0) scale(1, 1); }
        }
        .jelly-box {
          transform-origin: center bottom;
          animation: jelly_drop_wobble 2.2s cubic-bezier(0.25, 1, 0.5, 1) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative flex flex-col items-center">
          {/* Wobbling solid jelly cube */}
          <div
            className={`w-[48px] h-[48px] rounded-2xl jelly-box ${
              theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'
            }`}
          />
          {/* Base plate */}
          <div className={`w-[72px] h-[5px] rounded-full mt-2 ${theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
        </div>
      </div>
    </div>
  );
}

// 4. Domino Cascade Fall
export function DominoChain({
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
        @keyframes domino_tip {
          0%, 15% { transform: rotate(0deg); }
          35%, 80% { transform: rotate(72deg); }
          95%, 100% { transform: rotate(0deg); }
        }
        .domino-tile {
          transform-origin: bottom right;
          animation: domino_tip 3s cubic-bezier(0.6, -0.28, 0.735, 0.045) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative w-[130px] h-[60px] flex items-end justify-between px-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-[10px] h-[36px] rounded-[3px] domino-tile ${
                theme === 'dark'
                  ? (i % 2 === 0 ? 'bg-blue-400' : 'bg-neutral-300')
                  : (i % 2 === 0 ? 'bg-blue-600' : 'bg-neutral-700')
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
          {/* Ground bar */}
          <div className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-full ${theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
        </div>
      </div>
    </div>
  );
}

// 5. Magnetic Snap Disks
export function MagneticDisks({
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
        @keyframes disk_left_snap {
          0%, 100% { transform: translateX(-35px) scale(1, 1); }
          35% { transform: translateX(-20px) scale(1.2, 0.85); }
          50% { transform: translateX(0) scale(0.85, 1.25); }
          65% { transform: translateX(0) scale(1, 1); }
          80% { transform: translateX(-35px) scale(0.9, 1.1); }
        }
        @keyframes disk_right_snap {
          0%, 100% { transform: translateX(35px) scale(1, 1); }
          35% { transform: translateX(20px) scale(1.2, 0.85); }
          50% { transform: translateX(0) scale(0.85, 1.25); }
          65% { transform: translateX(0) scale(1, 1); }
          80% { transform: translateX(35px) scale(0.9, 1.1); }
        }
        .disk-left {
          animation: disk_left_snap 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
        .disk-right {
          animation: disk_right_snap 2.4s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative w-[120px] h-[50px] flex items-center justify-center">
          <div
            className={`absolute w-[28px] h-[28px] rounded-full disk-left ${
              theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
            }`}
          />
          <div
            className={`absolute w-[28px] h-[28px] rounded-full disk-right ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-800'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// 6. Origami Fan Expand
export function FanFold({
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

  const blades = [-40, -20, 0, 20, 40];

  return (
    <div
      className={`relative w-full h-full rounded-2xl overflow-hidden flex justify-center items-center cursor-pointer transition-all duration-300 bg-transparent ${className}`}
      onMouseEnter={trigger === 'hover' ? () => setHoverKey((k) => k + 1) : undefined}
      onClick={trigger === 'click' ? () => setHoverKey((k) => k + 1) : undefined}
    >
      <style>{`
        @keyframes fan_blade_spread {
          0%, 100% { transform: rotate(0deg); opacity: 0.6; }
          40%, 75% { transform: rotate(var(--deg)); opacity: 1; }
        }
        .fan-blade {
          transform-origin: center bottom;
          animation: fan_blade_spread 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div key={activeKey} className="relative w-[100px] h-[70px] flex items-end justify-center">
          {blades.map((deg, idx) => (
            <div
              key={idx}
              className={`absolute bottom-0 w-[14px] h-[55px] rounded-t-full fan-blade ${
                theme === 'dark'
                  ? (idx % 2 === 0 ? 'bg-blue-400' : 'bg-blue-600')
                  : (idx % 2 === 0 ? 'bg-blue-600' : 'bg-blue-800')
              }`}
              style={{ '--deg': `${deg}deg` } as React.CSSProperties}
            />
          ))}
          {/* Base pivot rivet */}
          <div className="absolute -bottom-1 w-3 h-3 rounded-full bg-blue-300 z-10" />
        </div>
      </div>
    </div>
  );
}
