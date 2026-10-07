import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronRight, Moon, Sun, Github, Star, Sparkles } from 'lucide-react';

export interface AmicroNavbarProps {
  initialOpen?: boolean;
  onExploreClick?: () => void;
  onSelectComponent?: (name: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: (theme?: 'dark' | 'light') => void;
  stars?: number | null;
  onSelectNav?: (key: string) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

const COMPONENTS = [
  'Buttons',
  'Accordion',
  'Dialogs',
  'Tooltips',
  'Tabs',
  'Sliders',
  'Switches',
  'Badges',
  'Dropdowns',
  'Drawers',
];

export const AmicroNavbar: React.FC<AmicroNavbarProps> = ({
  initialOpen = false,
  onExploreClick,
  onSelectComponent,
  theme: controlledTheme,
  onToggleTheme,
  stars: controlledStars,
  onSelectNav,
  isOpen: controlledIsOpen,
  onToggleOpen,
}) => {
  // Navigation states
  const [internalIsOpen, setInternalIsOpen] = useState(initialOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleIsOpen = () => {
    if (onToggleOpen) {
      onToggleOpen();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const [componentsExpanded, setComponentsExpanded] = useState(false);
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');
  const theme = controlledTheme ?? internalTheme;
  const [starsCount, setStarsCount] = useState(controlledStars || 2642);
  const [hasStarred, setHasStarred] = useState(false);
  const [showStarFlyout, setShowStarFlyout] = useState(false);

  const isDark = theme === 'dark';

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setInternalTheme(newTheme);
    onToggleTheme?.(newTheme);
  };

  // Star celebration handler
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasStarred) {
      setStarsCount((prev) => prev + 1);
      setHasStarred(true);
      setShowStarFlyout(true);
      setTimeout(() => setShowStarFlyout(false), 2000);
    } else {
      setStarsCount((prev) => prev - 1);
      setHasStarred(false);
    }
  };

  return (
    <div className="w-full max-w-[392px] mx-auto select-none">
      {/* Floating Menu Island Container */}
      <motion.nav
        layout
        transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full transition-colors duration-300 overflow-hidden ${
          isOpen
            ? isDark
              ? 'bg-[#131417] rounded-[32px] sm:rounded-[36px] shadow-2xl border border-white/10'
              : 'bg-[#f8f9fa] rounded-[32px] sm:rounded-[36px] shadow-2xl border border-zinc-200'
            : isDark
            ? 'bg-[#131417] rounded-2xl sm:rounded-3xl shadow-lg border border-white/10'
            : 'bg-white rounded-2xl sm:rounded-3xl shadow-md border border-zinc-200'
        }`}
      >
        {/* Main Navbar Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4">
          {/* Brand Wordmark */}
          <div
            className="cursor-pointer"
            onClick={() => {
              if (onSelectNav) onSelectNav('home');
              else if (onExploreClick) onExploreClick();
            }}
          >
            <span
              className={`text-[22px] font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-zinc-950'
              }`}
            >
              Amicro
            </span>
          </div>

          {/* Right Header Controls: GitHub Button + Menu Toggle */}
          <div className="flex items-center gap-2.5">
            {/* GitHub Pill Button with Icon & Stars */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleStarClick}
              title="Star on GitHub"
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 active:bg-white/15 border-white/10 text-white'
                  : 'bg-black/5 hover:bg-black/10 active:bg-black/15 border-black/10 text-zinc-900 shadow-xs'
              }`}
            >
              {/* Star Particle Pop */}
              <AnimatePresence>
                {showStarFlyout && (
                  <motion.div
                    initial={{ opacity: 1, y: 0, scale: 0.9 }}
                    animate={{ opacity: 0, y: -24, scale: 1.25 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-5 font-bold text-[11px] text-amber-400 flex items-center gap-1 pointer-events-none whitespace-nowrap z-30"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>+1 Star!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Github className="w-3.5 h-3.5" />
              <span className="font-semibold tracking-tight">GitHub</span>
              <span className={`h-3 w-[1px] ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <span className="flex items-center gap-1 text-[11px] opacity-90 tabular-nums">
                <Star
                  className={`w-3 h-3 transition-colors ${
                    hasStarred ? 'fill-amber-400 text-amber-400' : 'fill-amber-400 text-amber-400'
                  }`}
                />
                <span>{(starsCount / 1000).toFixed(1)}k</span>
              </span>
            </motion.button>

            {/* Morphing Toggle: 2 lines when closed, 1 line when open */}
            <button
              onClick={toggleIsOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className={`p-2 -mr-1.5 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
                isDark ? 'hover:bg-white/5 active:bg-white/10' : 'hover:bg-black/5 active:bg-black/10'
              }`}
            >
              <div className="w-7 h-5 flex flex-col justify-center items-end relative overflow-visible">
                <motion.span
                  animate={{
                    width: '28px',
                    y: isOpen ? 0 : -3.5,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-[2.5px] rounded-full block ${isDark ? 'bg-white' : 'bg-zinc-900'}`}
                />
                <motion.span
                  animate={{
                    width: isOpen ? '0px' : '20px',
                    opacity: isOpen ? 0 : 1,
                    y: isOpen ? 0 : 3.5,
                    scaleX: isOpen ? 0.3 : 1,
                  }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-[2.5px] rounded-full block origin-right ${
                    isDark ? 'bg-white' : 'bg-zinc-900'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Collapsible Dropdown Body with Continuous Smooth Height Collapse */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.3, delay: 0.04 },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2, ease: 'easeOut' },
                },
              }}
              className="overflow-hidden"
            >
              <div className="px-5 pt-1 pb-6 space-y-3.5">
                {/* 1. Components Accordion Card */}
                <div
                  className={`rounded-[22px] transition-colors border ${
                    isDark
                      ? 'bg-[#1d1e22] border-white/5'
                      : 'bg-[#eeeff2] border-black/5 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setComponentsExpanded((prev) => !prev)}
                    className="w-full flex items-center justify-between px-6 py-4.5 cursor-pointer"
                  >
                    <span
                      className={`text-[19px] font-semibold tracking-tight ${
                        isDark ? 'text-white' : 'text-zinc-950'
                      }`}
                    >
                      Components
                    </span>
                    <motion.div
                      animate={{ rotate: componentsExpanded ? 0 : 180 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-zinc-900'}
                    >
                      <ChevronUp className="w-6 h-6 stroke-[2.5]" />
                    </motion.div>
                  </button>

                  {/* 2-Column Component List */}
                  <AnimatePresence initial={false}>
                    {componentsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.26, delay: 0.03 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.16, ease: 'easeOut' },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1">
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                            {COMPONENTS.map((item) => (
                              <div
                                key={item}
                                onClick={() => {
                                  onSelectComponent?.(item);
                                  if (onSelectNav) onSelectNav('components');
                                }}
                                className={`cursor-pointer py-0.5 select-none transition-colors duration-200 ${
                                  isDark
                                    ? 'text-[#71717a] hover:text-white'
                                    : 'text-zinc-500 hover:text-zinc-950'
                                }`}
                              >
                                <span className="text-[15px] font-medium tracking-tight">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Sponsors Card */}
                <div
                  onClick={() => {
                    if (onSelectNav) onSelectNav('sponsors');
                  }}
                  className={`rounded-[22px] px-6 py-4.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border ${
                    isDark
                      ? 'bg-[#1d1e22] border-white/5 hover:bg-[#222328]'
                      : 'bg-[#eeeff2] border-black/5 hover:bg-[#e6e7eb] shadow-xs'
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold tracking-tight ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    Sponsors
                  </span>
                  <ChevronRight
                    className={`w-6 h-6 stroke-[2.5] ${isDark ? 'text-white' : 'text-zinc-900'}`}
                  />
                </div>

                {/* 3. Skills Card */}
                <div
                  onClick={() => {
                    if (onSelectNav) onSelectNav('skills');
                  }}
                  className={`rounded-[22px] px-6 py-4.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border ${
                    isDark
                      ? 'bg-[#1d1e22] border-white/5 hover:bg-[#222328]'
                      : 'bg-[#eeeff2] border-black/5 hover:bg-[#e6e7eb] shadow-xs'
                  }`}
                >
                  <span
                    className={`text-[18px] font-semibold tracking-tight ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    Skills
                  </span>
                  <ChevronRight
                    className={`w-6 h-6 stroke-[2.5] ${isDark ? 'text-white' : 'text-zinc-900'}`}
                  />
                </div>

                {/* 4. Apple-Style Appearance Segmented Switch */}
                <div className="px-2 py-1.5 flex items-center justify-between">
                  <span
                    className={`text-[18px] font-semibold tracking-tight ${
                      isDark ? 'text-white' : 'text-zinc-950'
                    }`}
                  >
                    Appearance
                  </span>

                  <div
                    className={`p-1 rounded-full flex items-center border ${
                      isDark
                        ? 'bg-[#18191d] border-[#292a30]'
                        : 'bg-[#e7e8ec] border-[#d8d9de]'
                    }`}
                  >
                    <button
                      onClick={() => handleSetTheme('dark')}
                      className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        isDark ? 'text-white' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {isDark && (
                        <motion.div
                          layoutId="pill"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          className="absolute inset-0 rounded-full bg-[#27282e] shadow-sm border border-white/10"
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Dark</span>
                      </span>
                    </button>

                    <button
                      onClick={() => handleSetTheme('light')}
                      className={`relative px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        !isDark ? 'text-zinc-950' : 'text-[#71717a] hover:text-zinc-300'
                      }`}
                    >
                      {!isDark && (
                        <motion.div
                          layoutId="pill"
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                          className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/5"
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Light</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* 5. Primary Action Button */}
                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                    onClick={() => {
                      if (onExploreClick) onExploreClick();
                      else if (onSelectNav) onSelectNav('components');
                    }}
                    className={`w-full py-4.5 rounded-[20px] font-bold text-[18px] tracking-tight transition-shadow shadow-md cursor-pointer ${
                      isDark
                        ? 'bg-[#f4f4f5] text-[#09090b] hover:bg-white active:bg-zinc-200'
                        : 'bg-[#09090b] text-white hover:bg-zinc-800 active:bg-zinc-900'
                    }`}
                  >
                    Explore Components
                  </motion.button>
                </div>

                {/* 6. Footer Text */}
                <div className="pt-2 text-center">
                  <a
                    href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-block text-[14px] font-normal transition-colors cursor-pointer no-underline ${
                      isDark ? 'text-[#82838a] hover:text-white' : 'text-zinc-500 hover:text-zinc-950'
                    }`}
                  >
                    Github with {(starsCount / 1000).toFixed(1)}k stars
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};
