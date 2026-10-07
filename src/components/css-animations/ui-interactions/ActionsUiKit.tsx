import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Edit3, Trash2, HelpCircle, Download, Check, 
  Layers, Plus, Minus, Grid, List, MoreHorizontal, LayoutGrid, LayoutList
} from 'lucide-react';

// 10. Context Menu
export function ContextMenuEditDelete({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-2xl border text-xs font-semibold shadow-sm cursor-pointer ${
          theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        Actions Menu
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 6 }}
            exit={{ opacity: 0, scale: 0.88, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full z-30 w-32 p-1 rounded-2xl border shadow-xl flex flex-col gap-0.5 ${
              theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-white border-neutral-200'
            }`}
          >
            <button
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-medium cursor-pointer border-0 ${
                theme === 'dark' ? 'text-white hover:bg-neutral-800' : 'text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 cursor-pointer border-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 11. Tooltip
export function QuestionTooltip({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.35 }}
            className={`absolute -top-9 px-3 py-1.5 rounded-xl border text-[11px] shadow-xl whitespace-nowrap z-20 pointer-events-none ${
              theme === 'dark' ? 'bg-[#222] border-neutral-700 text-neutral-200' : 'bg-neutral-900 border-neutral-800 text-white'
            }`}
          >
            Helpful tooltip preview text
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b ${
              theme === 'dark' ? 'bg-[#222] border-neutral-700' : 'bg-neutral-900 border-neutral-800'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer shadow-md ${
          theme === 'dark' ? 'bg-[#1e1e1e] border-neutral-700 text-[#0a84ff]' : 'bg-white border-neutral-200 text-[#0071e3]'
        }`}
      >
        <HelpCircle className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// 12. Download Icons
export function DownloadAnimatedIcons({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Icon 1: Bouncing Download Arrow */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsDownloading(true);
          setTimeout(() => setIsDownloading(false), 2000);
        }}
        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md cursor-pointer ${
          theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        <motion.div
          animate={isDownloading ? { y: [0, 4, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.6 }}
        >
          <Download className="w-5 h-5 text-[#0a84ff]" />
        </motion.div>
      </motion.button>

      {/* Icon 2: Success Check on Download */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md cursor-pointer ${
          isDownloading 
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
            : (theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-neutral-300' : 'bg-white border-neutral-200 text-neutral-700')
        }`}
      >
        {isDownloading ? <Check className="w-5 h-5" /> : <Download className="w-5 h-5" />}
      </motion.button>
    </div>
  );
}

// 13. Picture-in-Picture Icons (PiP)
export function PipModeIcons({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isPip, setIsPip] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => setIsPip(!isPip)}
      className={`relative w-16 h-12 rounded-2xl border-2 flex items-center justify-center shadow-md cursor-pointer transition-colors ${
        isPip
          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
          : (theme === 'dark' ? 'bg-[#1e1e1e] border-neutral-700 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-600')
      }`}
    >
      <Layers className="w-5 h-5" />
      <AnimatePresence>
        {isPip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 5, y: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute bottom-1.5 right-1.5 w-4 h-3 rounded-sm bg-blue-500 border border-white shadow-sm"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// 14. Simple Plus / Minus Buttons
export function SimplePlusMinusBtn({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [count, setCount] = useState(1);

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setCount(Math.max(0, count - 1))}
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-sm cursor-pointer ${
          theme === 'dark' ? 'bg-neutral-900 border-neutral-700 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
        }`}
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setCount(count + 1)}
        className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-md cursor-pointer ${
          theme === 'dark' ? 'bg-neutral-200 border-white text-neutral-900' : 'bg-neutral-900 border-neutral-900 text-white'
        }`}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

// 15. A / B Tabs
export function SegmentedABTabs({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [tab, setTab] = useState<'A' | 'B'>('A');

  return (
    <div className={`relative flex items-center p-1 rounded-2xl border shadow-inner ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-neutral-100 border-neutral-200'
    }`}>
      {(['A', 'B'] as const).map((item) => {
        const isSelected = tab === item;
        return (
          <button
            key={item}
            onClick={() => setTab(item)}
            className="relative px-6 py-2 rounded-xl text-xs font-bold cursor-pointer border-0 bg-transparent"
          >
            {isSelected && (
              <motion.div
                layoutId="ab-tab-pill"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                className={`absolute inset-0 rounded-xl shadow-md ${
                  theme === 'dark' ? 'bg-neutral-200' : 'bg-neutral-900'
                }`}
              />
            )}
            <span className={`relative z-10 ${
              isSelected 
                ? (theme === 'dark' ? 'text-neutral-900' : 'text-white') 
                : (theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400')
            }`}>
              {item}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// 16. Quantity Counter
export function QuantityCounter({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [num, setNum] = useState(3);

  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border shadow-sm ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-white border-neutral-200'
    }`}>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setNum(Math.max(1, num - 1))}
        className="w-7 h-7 rounded-full bg-neutral-500/15 flex items-center justify-center cursor-pointer border-0 text-inherit hover:bg-neutral-500/25"
      >
        <Minus className="w-3.5 h-3.5" />
      </motion.button>

      <motion.span
        key={num}
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-xs font-mono font-bold w-4 text-center"
      >
        {num}
      </motion.span>

      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setNum(num + 1)}
        className="w-7 h-7 rounded-full bg-neutral-500/15 flex items-center justify-center cursor-pointer border-0 text-inherit hover:bg-neutral-500/25"
      >
        <Plus className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}

// 17. List / Column View Toggle
export function ListColumnToggle({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [view, setView] = useState<'list' | 'grid'>('grid');

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-sm cursor-pointer transition-colors ${
        theme === 'dark' 
          ? 'bg-[#181818] border-neutral-700 text-white hover:bg-neutral-800' 
          : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50'
      }`}
    >
      <motion.div
        key={view}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {view === 'grid' ? <Grid className="w-4 h-4 text-[#0a84ff]" /> : <List className="w-4 h-4 text-[#0a84ff]" />}
      </motion.div>
      <span>{view === 'grid' ? 'Grid View' : 'List View'}</span>
    </motion.button>
  );
}

// 18. Follow Button
export function FollowCheckButton({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [following, setFollowing] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => setFollowing(!following)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold shadow-md transition-all cursor-pointer ${
        following
          ? (theme === 'dark' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700')
          : (theme === 'dark' ? 'bg-neutral-200 border-white text-neutral-900' : 'bg-neutral-900 border-neutral-900 text-white')
      }`}
    >
      {following ? <Check className="w-3.5 h-3.5 text-[#0a84ff]" /> : <Plus className="w-3.5 h-3.5" />}
      <span>{following ? 'Following' : '+ Follow'}</span>
    </motion.button>
  );
}

// 19. Menu Dots
export function MenuDotsExpand({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [pulse, setPulse] = useState(false);

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
      }}
      className={`w-11 h-11 rounded-2xl border flex items-center justify-center shadow-md cursor-pointer ${
        theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
      }`}
    >
      <motion.div
        animate={pulse ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <MoreHorizontal className="w-5 h-5 text-neutral-400 hover:text-white" />
      </motion.div>
    </motion.button>
  );
}

// 20. Compact Mode Switch
export function CompactModeSwitch({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [mode, setMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className={`relative flex items-center p-1 rounded-2xl border ${
      theme === 'dark' ? 'bg-[#181818] border-neutral-700' : 'bg-neutral-100 border-neutral-200'
    }`}>
      <button
        onClick={() => setMode('grid')}
        className="relative p-2 rounded-xl cursor-pointer border-0 bg-transparent"
      >
        {mode === 'grid' && (
          <motion.div
            layoutId="mode-switch-pill"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white shadow-sm'}`}
          />
        )}
        <LayoutGrid className={`relative z-10 w-4 h-4 ${mode === 'grid' ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-neutral-400'}`} />
      </button>

      <button
        onClick={() => setMode('list')}
        className="relative p-2 rounded-xl cursor-pointer border-0 bg-transparent"
      >
        {mode === 'list' && (
          <motion.div
            layoutId="mode-switch-pill"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            className={`absolute inset-0 rounded-xl ${theme === 'dark' ? 'bg-neutral-700' : 'bg-white shadow-sm'}`}
          />
        )}
        <LayoutList className={`relative z-10 w-4 h-4 ${mode === 'list' ? (theme === 'dark' ? 'text-white' : 'text-black') : 'text-neutral-400'}`} />
      </button>
    </div>
  );
}
