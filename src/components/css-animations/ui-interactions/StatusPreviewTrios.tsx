import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bookmark, Check, ChevronUp, ChevronDown, Layers, LayoutGrid, Info 
} from 'lucide-react';

// ==============================================================
// 18. REPLACEMENT: Segmented Arc Meter (Replaces Radial Progress Ring)
// ==============================================================
export function SegmentedArcMeter({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [level, setLevel] = useState(3);
  const segments = [1, 2, 3, 4];

  return (
    <div
      onClick={() => setLevel((level % 4) + 1)}
      className="flex items-center gap-1.5 cursor-pointer p-2 select-none"
    >
      {segments.map((s) => (
        <div
          key={s}
          className={`w-3 h-8 rounded-full transition-all duration-300 ${
            s <= level ? 'bg-blue-600 scale-y-100' : (theme === 'dark' ? 'bg-neutral-800 scale-y-75' : 'bg-neutral-200 scale-y-75')
          }`}
        />
      ))}
      <span className="text-xs font-mono font-bold ml-1.5">{level * 25}%</span>
    </div>
  );
}

// ==============================================================
// 19. REPLACEMENT: Segmented Stepper Dots (Replaces Pagination Number Bubble)
// ==============================================================
export function SegmentedStepperDots({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [active, setActive] = useState(1);
  const total = 4;

  return (
    <div className={`flex items-center gap-2 p-2 rounded-full border ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-neutral-100 border-neutral-200'
    }`}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = active === i;
        return (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative cursor-pointer border-0 bg-transparent p-0 flex items-center justify-center"
          >
            <motion.div
              animate={{ width: isActive ? 24 : 8, backgroundColor: isActive ? '#0071e3' : (theme === 'dark' ? '#555' : '#ccc') }}
              transition={{ type: 'spring', bounce: 0.25, duration: 0.35 }}
              className="h-2 rounded-full"
            />
          </button>
        );
      })}
    </div>
  );
}

// ==============================================================
// 20. REPLACEMENT: Card Glance Preview (Replaces Speech Bubble Tooltip)
// ==============================================================
export function CardGlancePreview({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            className={`absolute -top-12 px-3 py-2 rounded-xl border text-[11px] shadow-xl flex items-center gap-2 whitespace-nowrap z-20 pointer-events-none ${
              theme === 'dark' ? 'bg-[#1c1c1e] border-neutral-700 text-neutral-200' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Interactive Glance Preview</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`w-10 h-10 rounded-2xl border flex items-center justify-center cursor-pointer shadow-sm ${
          theme === 'dark' ? 'bg-[#1e1e1e] border-neutral-700 text-blue-400' : 'bg-white border-neutral-200 text-blue-600'
        }`}
      >
        <Info className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// ==============================================================
// 21. REPLACEMENT: Vertical Wheel Counter (Replaces Quantity Step Counter)
// ==============================================================
export function VerticalWheelCounter({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [count, setCount] = useState(5);

  return (
    <div className={`flex items-center gap-2 p-1 px-2.5 rounded-2xl border ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-white border-neutral-200'
    }`}>
      {/* Scroll Digit */}
      <div className="w-6 h-7 overflow-hidden relative flex items-center justify-center font-mono font-bold text-sm">
        <motion.span
          key={count}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute"
        >
          {count}
        </motion.span>
      </div>

      {/* Stepper Buttons */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => setCount(count + 1)}
          className="p-0.5 hover:bg-neutral-500/20 rounded cursor-pointer border-0 bg-transparent text-inherit"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setCount(Math.max(1, count - 1))}
          className="p-0.5 hover:bg-neutral-500/20 rounded cursor-pointer border-0 bg-transparent text-inherit"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ==============================================================
// 22. REPLACEMENT: Perspective Layout Switcher (Replaces Grid / List View Toggle)
// ==============================================================
export function PerspectiveLayoutSwitcher({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [layout, setLayout] = useState<'grid' | 'stack'>('grid');

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={() => setLayout(layout === 'grid' ? 'stack' : 'grid')}
      className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-colors ${
        theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <motion.div
        key={layout}
        initial={{ rotate: -45, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {layout === 'grid' ? <LayoutGrid className="w-4 h-4 text-blue-500" /> : <Layers className="w-4 h-4 text-blue-500" />}
      </motion.div>
      <span>{layout === 'grid' ? 'Grid View' : 'Stack View'}</span>
    </motion.button>
  );
}

// ==============================================================
// 23. REPLACEMENT: Bookmark Save Pill (Replaces Follow / Following Pill)
// ==============================================================
export function BookmarkSavePill({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setSaved(!saved)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
        saved
          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
          : (theme === 'dark' ? 'bg-[#1e1e1e] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900')
      }`}
    >
      {saved ? <Check className="w-3.5 h-3.5 text-white" /> : <Bookmark className="w-3.5 h-3.5 text-blue-400" />}
      <span>{saved ? 'Saved' : 'Save Item'}</span>
    </motion.button>
  );
}
