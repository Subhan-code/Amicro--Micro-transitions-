import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, ExternalLink, Plus, Minus, Sun, Moon, 
  X, ChevronLeft, ChevronRight 
} from 'lucide-react';

// 1. Category Select / Dropdown
export function CategorySelect({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Category 1');
  const options = ['Category 1', 'Category 2', 'Category 3'];

  return (
    <div className="relative flex flex-col items-center select-none">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border text-xs font-semibold shadow-sm transition-all cursor-pointer ${
          theme === 'dark' 
            ? 'bg-[#181818] border-white/10 text-white hover:bg-neutral-800' 
            : 'bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50'
        }`}
      >
        <span>{selected}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-full z-30 w-36 p-1 rounded-2xl border shadow-xl flex flex-col gap-0.5 ${
              theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-200'
            }`}
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSelected(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border-0 ${
                  selected === opt
                    ? (theme === 'dark' ? 'bg-white/10 text-white font-semibold' : 'bg-neutral-100 text-black font-semibold')
                    : (theme === 'dark' ? 'text-neutral-400 hover:text-white hover:bg-white/5' : 'text-neutral-600 hover:text-black hover:bg-neutral-50')
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 2. Hover Link Card
export function HoverLinkCard({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Floating Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-7 px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/15 text-[10px] font-mono text-indigo-300 shadow-xl whitespace-nowrap z-20 pointer-events-none"
          >
            https://amicro.dev
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 border-r border-b border-white/15 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pill Button */}
      <motion.a
        href="https://amicro.dev"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-semibold shadow-md transition-shadow duration-200 no-underline cursor-pointer ${
          theme === 'dark' 
            ? 'bg-[#1e1e1e] border-white/10 text-white hover:shadow-indigo-500/10' 
            : 'bg-white border-neutral-200 text-neutral-900 hover:shadow-neutral-300/60'
        }`}
      >
        <span>Portfolio</span>
        <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
      </motion.a>
    </div>
  );
}

// 3. Plus / Minus Toggle Buttons
export function PlusMinusToggle({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [activeBtn, setActiveBtn] = useState<'plus' | 'minus'>('plus');

  return (
    <div className="flex items-center gap-3">
      {/* Plus button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setActiveBtn('plus')}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
          activeBtn === 'plus'
            ? (theme === 'dark' ? 'bg-neutral-200 text-neutral-900 border-white shadow-md' : 'bg-neutral-900 text-white border-neutral-900 shadow-md')
            : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white' : 'bg-white text-neutral-600 border-neutral-200 hover:text-black')
        }`}
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      {/* Minus button */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setActiveBtn('minus')}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
          activeBtn === 'minus'
            ? (theme === 'dark' ? 'bg-neutral-200 text-neutral-900 border-white shadow-md' : 'bg-neutral-900 text-white border-neutral-900 shadow-md')
            : (theme === 'dark' ? 'bg-neutral-900 text-neutral-400 border-white/10 hover:text-white' : 'bg-white text-neutral-600 border-neutral-200 hover:text-black')
        }`}
      >
        <Minus className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// 4. Light / Dark Mode Toggle
export function LightDarkMorphToggle({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isDark, setIsDark] = useState(theme === 'dark');

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsDark(!isDark)}
      className={`relative w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-md ${
        isDark ? 'bg-[#181818] border-white/15' : 'bg-amber-50/80 border-amber-200'
      }`}
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0, scale: [0.85, 1.05, 1] }}
        transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.5)]" />
        ) : (
          <Sun className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
        )}
      </motion.div>
    </motion.button>
  );
}

// 5. Progress Stepper / Timeline
export function ProgressStepper({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [step, setStep] = useState(2);
  const steps = [1, 2, 3];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-between w-48">
        {/* Background track */}
        <div className={`absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full ${
          theme === 'dark' ? 'bg-neutral-800' : 'bg-neutral-200'
        }`} />
        {/* Filled active track */}
        <motion.div
          animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-indigo-500"
        />

        {/* Step nodes */}
        {steps.map((s) => {
          const isDone = s <= step;
          const isCurrent = s === step;
          return (
            <motion.button
              key={s}
              whileTap={{ scale: 0.9 }}
              onClick={() => setStep(s)}
              animate={{ scale: isCurrent ? 1.2 : 1 }}
              className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors cursor-pointer ${
                isDone
                  ? 'bg-indigo-500 border-indigo-400 text-white shadow-md'
                  : (theme === 'dark' ? 'bg-[#181818] border-neutral-700 text-neutral-500' : 'bg-white border-neutral-300 text-neutral-400')
              }`}
            >
              {s}
            </motion.button>
          );
        })}
      </div>
      <span className="text-[11px] font-mono text-neutral-400">
        STEP {step} of 3
      </span>
    </div>
  );
}

// 6. Tab Bar with Close Buttons
export function MultiTabCloseBar({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [tabs, setTabs] = useState(['Tab 1', 'Tab 2']);
  const [activeTab, setActiveTab] = useState(0);

  const addTab = () => {
    if (tabs.length < 4) {
      setTabs([...tabs, `Tab ${tabs.length + 1}`]);
      setActiveTab(tabs.length);
    }
  };

  const removeTab = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length > 1) {
      const next = tabs.filter((_, i) => i !== index);
      setTabs(next);
      setActiveTab(Math.max(0, activeTab - 1));
    }
  };

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-2xl border max-w-[280px] overflow-x-auto ${
      theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-neutral-100 border-neutral-200'
    }`}>
      <AnimatePresence mode="popLayout">
        {tabs.map((t, idx) => {
          const isActive = activeTab === idx;
          return (
            <motion.div
              layout
              key={t}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors border ${
                isActive
                  ? (theme === 'dark' ? 'bg-neutral-800 border-white/10 text-white shadow-sm' : 'bg-white border-neutral-200 text-black shadow-sm')
                  : 'bg-transparent border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <span>{t}</span>
              <button
                onClick={(e) => removeTab(idx, e)}
                className="hover:bg-rose-500/20 p-0.5 rounded-md text-neutral-400 hover:text-rose-400 border-0 bg-transparent cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {tabs.length < 4 && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={addTab}
          className={`p-1.5 rounded-xl border border-transparent transition-colors cursor-pointer ${
            theme === 'dark' ? 'hover:bg-white/10 text-neutral-400 hover:text-white' : 'hover:bg-neutral-200 text-neutral-600 hover:text-black'
          }`}
          title="New Tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </div>
  );
}

// 7. Date Selector
export function DatePositionSelector({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [selectedDay, setSelectedDay] = useState('25th');
  const days = ['24th', '25th', '26th'];

  return (
    <div className={`flex items-center gap-2 p-1.5 rounded-full border shadow-inner ${
      theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-neutral-100 border-neutral-200'
    }`}>
      {days.map((day) => {
        const isSelected = selectedDay === day;
        return (
          <motion.button
            key={day}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedDay(day)}
            className="relative px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-0 bg-transparent"
          >
            {isSelected && (
              <motion.div
                layoutId="day-pill"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                className={`absolute inset-0 rounded-full shadow-md ${
                  theme === 'dark' ? 'bg-neutral-200' : 'bg-neutral-900'
                }`}
              />
            )}
            <span className={`relative z-10 ${
              isSelected 
                ? (theme === 'dark' ? 'text-neutral-900 font-bold' : 'text-white font-bold') 
                : (theme === 'dark' ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-black')
            }`}>
              {day}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

// 8. Pagination Numbered Bubble
export function PaginationNumberedBubble({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [page, setPage] = useState(2);
  const pages = [1, 2, 3, 4];

  return (
    <div className={`relative flex items-center gap-1 p-1.5 rounded-2xl border ${
      theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-neutral-100 border-neutral-200'
    }`}>
      {pages.map((p) => {
        const isActive = page === p;
        return (
          <button
            key={p}
            onClick={() => setPage(p)}
            className="relative w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold cursor-pointer border-0 bg-transparent"
          >
            {isActive && (
              <motion.div
                layoutId="page-bubble"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
                className={`absolute inset-0 -top-1.5 rounded-xl shadow-lg ${
                  theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-neutral-900 text-white'
                }`}
              />
            )}
            <span className={`relative z-10 ${
              isActive ? 'text-white font-bold' : (theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500')
            }`}>
              {p}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// 9. Back / Forward Navigation Buttons
export function BackForwardNav({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.88 }}
        className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
          theme === 'dark' 
            ? 'bg-[#181818] border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
        }`}
        title="Back"
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.88 }}
        className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
          theme === 'dark' 
            ? 'bg-[#181818] border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
            : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-black'
        }`}
        title="Forward"
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
