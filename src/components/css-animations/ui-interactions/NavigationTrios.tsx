import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';

// ==========================================
// ROW 14: SELECTS & MENUS (VARIATIONS 2 & 3)
// ==========================================

// Variation 2: Floating Filter Tag Pill
export function FilterTagPill({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [selected, setSelected] = useState(0);
  const tags = ['All', 'Featured', 'New'];

  return (
    <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-neutral-100 border-neutral-200'
    }`}>
      {tags.map((tag, idx) => (
        <button
          key={tag}
          onClick={() => setSelected(idx)}
          className="relative px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border-0 bg-transparent"
        >
          {selected === idx && (
            <motion.div
              layoutId="filter-tag-pill"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-600 text-white'}`}
            />
          )}
          <span className={`relative z-10 ${selected === idx ? 'text-white font-bold' : (theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600')}`}>
            {tag}
          </span>
        </button>
      ))}
    </div>
  );
}

// Variation 3: Submenu Flyout
export function SubmenuFlyout({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer ${
          theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <span>View Details</span>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 4 }}
            exit={{ opacity: 0, x: -6 }}
            className={`absolute left-full top-0 ml-1 p-1 rounded-2xl border shadow-xl flex flex-col gap-0.5 z-30 ${
              theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="px-3 py-1.5 text-[11px] rounded-lg hover:bg-blue-600 hover:text-white cursor-pointer whitespace-nowrap">
              Expanded Panel
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// ROW 15: BUTTONS & LINKS (VARIATIONS 2 & 3)
// ==========================================

// Variation 2: Magnetic Icon Slide Button
export function MagneticIconButton({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: 3 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold cursor-pointer ${
        theme === 'dark' ? 'bg-[#1e1e1e] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <span>Explore Docs</span>
      <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
    </motion.button>
  );
}

// Variation 3: Morph Action Expand Pill
export function MorphActionPill({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer ${
        theme === 'dark' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-blue-600 border-blue-500 text-white'
      }`}
    >
      <span>Action</span>
      <AnimatePresence>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="text-[11px] font-normal whitespace-nowrap overflow-hidden"
          >
            → Launch
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==========================================
// ROW 17: PROGRESS & GAUGES (VARIATIONS 2 & 3)
// ==========================================

// Variation 2: Circular Radial Progress Ring
export function RadialProgressRing({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [val, setVal] = useState(75);

  return (
    <div
      onClick={() => setVal(val === 75 ? 100 : 75)}
      className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
    >
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke={theme === 'dark' ? '#2c2c2e' : '#e5e5ea'} strokeWidth="3.5" />
        <motion.circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="#0071e3"
          strokeWidth="3.5"
          strokeDasharray="88"
          animate={{ strokeDashoffset: 88 - (88 * val) / 100 }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-bold">{val}%</span>
    </div>
  );
}

// Variation 3: Segmented Step Bar
export function SegmentedStepBar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [level, setLevel] = useState(2);

  return (
    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setLevel((level % 3) + 1)}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`w-6 h-2 rounded-full transition-colors ${
            i <= level ? 'bg-blue-600' : (theme === 'dark' ? 'bg-neutral-700' : 'bg-neutral-300')
          }`}
        />
      ))}
    </div>
  );
}
