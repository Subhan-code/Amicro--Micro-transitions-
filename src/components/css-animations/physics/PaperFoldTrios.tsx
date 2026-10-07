import React, { useState } from 'react';
import useLoopFlg from '../../../hooks/useLoopFlg';

// ==========================================
// ROW 1: BOOKMARK & RIBBON FOLDS (3 VARIATIONS)
// ==========================================

// Variation 2: Corner Page Dog-Ear Peel
export function BookmarkCornerPeel({
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
        @keyframes corner_peel_fold {
          0%, 100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          40%, 75% { clip-path: polygon(0 0, 65% 0, 100% 35%, 100% 100%, 0 100%); }
        }
        @keyframes corner_triangle_peel {
          0%, 100% { transform: translate(100%, -100%); opacity: 0; }
          40%, 75% { transform: translate(0, 0); opacity: 1; }
        }
        .peel-card {
          animation: corner_peel_fold 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        .peel-triangle {
          animation: corner_triangle_peel 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[75px] flex items-center justify-center">
        {/* Main Base Card */}
        <div
          className={`absolute inset-0 rounded-2xl peel-card border ${
            theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-white border-[#d2d2d7]'
          }`}
        >
          {/* Inner Accent Content Bar */}
          <div className="absolute top-4 left-3 w-12 h-2 rounded-full bg-blue-500" />
          <div className="absolute top-8 left-3 w-8 h-2 rounded-full bg-blue-400/50" />
        </div>
        {/* Folded Corner Triangle */}
        <div className="absolute top-0 right-0 w-[38px] h-[38px] overflow-hidden pointer-events-none">
          <div className="w-full h-full peel-triangle bg-blue-600 rounded-bl-xl shadow-md" />
        </div>
      </div>
    </div>
  );
}

// Variation 3: Hanging Bookmark Stamp Drop
export function BookmarkStampDrop({
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
        @keyframes stamp_drop_swing {
          0% { transform: translateY(-70px) rotate(15deg); opacity: 0; }
          30% { transform: translateY(0) rotate(-6deg); opacity: 1; }
          45% { transform: translateY(-8px) rotate(4deg); }
          60% { transform: translateY(0) rotate(-2deg); }
          75% { transform: translateY(0) rotate(0deg); opacity: 1; }
          90%, 100% { transform: translateY(-70px) rotate(15deg); opacity: 0; }
        }
        .stamp-ribbon {
          transform-origin: top center;
          animation: stamp_drop_swing 3s cubic-bezier(0.34, 1.56, 0.64, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[85px] flex items-start justify-center pt-2">
        {/* Hanging Ribbon Tail with Stamp Head */}
        <div className="relative flex flex-col items-center stamp-ribbon">
          {/* Top Hanging String */}
          <div className="w-[3px] h-[36px] bg-blue-500 rounded-full" />
          {/* Hanging Ribbon Badge */}
          <div className="w-[42px] h-[48px] -mt-1 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
            <div className="w-4 h-4 rounded-full bg-white/90" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ROW 2: ZIPPER & CURTAIN VARIATIONS (3 VARIATIONS)
// ==========================================

// Variation 2: Horizontal Sliding Shutter
export function ShutterSlide({
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
        @keyframes shutter_left_open {
          0%, 100% { transform: translateX(0); }
          40%, 75% { transform: translateX(-95%); }
        }
        @keyframes shutter_right_open {
          0%, 100% { transform: translateX(0); }
          40%, 75% { transform: translateX(95%); }
        }
        .shutter-panel-left {
          animation: shutter_left_open 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        .shutter-panel-right {
          animation: shutter_right_open 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[120px] h-[75px] rounded-2xl overflow-hidden border border-neutral-700 bg-blue-600 flex items-center justify-center">
        {/* Revealed Inner Content */}
        <span className="text-xs font-bold text-white tracking-wider">OPEN</span>
        {/* Left Shutter */}
        <div className={`absolute top-0 left-0 w-1/2 h-full shutter-panel-left border-r ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`} />
        {/* Right Shutter */}
        <div className={`absolute top-0 right-0 w-1/2 h-full shutter-panel-right border-l ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`} />
      </div>
    </div>
  );
}

// Variation 3: Diagonal Drape Pull
export function DiagonalDrape({
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
        @keyframes diagonal_cloth_draw {
          0%, 100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
          40%, 75% { clip-path: polygon(0 0, 20% 0, 100% 80%, 100% 100%, 0 100%); }
        }
        .drape-cloth {
          animation: diagonal_cloth_draw 3s cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[120px] h-[80px] rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-900 flex items-center justify-center">
        {/* Inner revealed solid blue background */}
        <div className="absolute inset-0 bg-blue-500" />
        {/* Top Drape Cloth Cover */}
        <div className={`absolute inset-0 drape-cloth ${theme === 'dark' ? 'bg-[#1c1c1e]' : 'bg-[#ffffff]'}`} />
        {/* Pull Cord Pin */}
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-400 z-10" />
      </div>
    </div>
  );
}

// ==========================================
// ROW 3: DISPENSERS & SHEETS (3 VARIATIONS)
// ==========================================

// Variation 2: Sticky Note Peel
export function StickyNotePeel({
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
        @keyframes note_peel_lift {
          0% { transform: rotateX(0deg) translateY(0); opacity: 1; }
          35% { transform: perspective(500px) rotateX(65deg) translateY(-12px); opacity: 1; }
          50%, 100% { transform: perspective(500px) rotateX(90deg) translateY(-40px); opacity: 0; }
        }
        .note-sheet {
          transform-origin: top center;
          animation: note_peel_lift 3s cubic-bezier(0.4, 0, 0.2, 1) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[75px] h-[75px] flex items-center justify-center">
        {/* Base Pad Note */}
        <div className="absolute inset-0 rounded-xl bg-blue-600 shadow-sm" />
        {/* Peeling Top Sheet */}
        <div className="absolute inset-0 rounded-xl bg-blue-400 note-sheet shadow-md" />
      </div>
    </div>
  );
}

// Variation 3: Receipt Ticker Tape Print
export function ReceiptTapePrint({
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
        @keyframes receipt_print_step {
          0% { height: 0px; opacity: 0; }
          25% { height: 25px; opacity: 1; }
          50% { height: 55px; opacity: 1; }
          75% { height: 55px; opacity: 1; }
          90%, 100% { height: 0px; opacity: 0; }
        }
        .receipt-paper {
          animation: receipt_print_step 3s steps(4) infinite both;
        }
      `}</style>
      <div key={activeKey} className="relative w-[110px] h-[85px] flex flex-col items-center justify-start pt-2">
        {/* Printer Dispenser Slot */}
        <div className={`w-[90px] h-[18px] rounded-full z-20 flex items-center justify-center border ${
          theme === 'dark' ? 'bg-[#1c1c1e] border-[#2c2c2e]' : 'bg-[#e5e5ea] border-[#d1d1d6]'
        }`}>
          <div className="w-[65px] h-[3px] rounded-full bg-neutral-600" />
        </div>
        {/* Dispensed Receipt Paper */}
        <div className="w-[60px] receipt-paper bg-blue-500 rounded-b-lg shadow-md -mt-1.5 flex flex-col gap-1 p-1">
          <div className="w-full h-1 bg-blue-300/60 rounded-full" />
          <div className="w-3/4 h-1 bg-blue-300/60 rounded-full" />
          <div className="w-1/2 h-1 bg-blue-300/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}
