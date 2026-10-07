import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, ChevronRight, Moon, Sun } from 'lucide-react';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: (theme?: 'dark' | 'light') => void;
  stars: number | null;
  onSelectNav: (key: any) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
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

export function MobileMenuOverlay({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  stars,
  onSelectNav,
  triggerHaptic,
}: MobileMenuOverlayProps) {
  // All accordion menu options initially closed when opened
  const [componentsExpanded, setComponentsExpanded] = useState(false);
  const isDark = theme === 'dark';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-14 sm:top-16 inset-x-0 bottom-0 z-40 sm:hidden flex flex-col justify-start pointer-events-auto">
          {/* Blurred backdrop below navbar: blurs background on open */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => {
              triggerHaptic?.('light');
              onClose();
            }}
          />

          {/* Opened Menu Panel: starts directly from navbar bottom edge, unfolds top-to-bottom */}
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 320,
              mass: 0.85,
            }}
            className={`relative z-10 w-full max-h-[calc(100dvh-64px)] overflow-y-auto rounded-b-[28px] sm:rounded-b-[32px] border-b shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] select-none transition-colors duration-300 ${
              isDark
                ? 'bg-[#08080a]/98 backdrop-blur-2xl border-white/[0.08] text-[#ededed]'
                : 'bg-[#f8f9fa]/98 backdrop-blur-2xl border-black/[0.08] text-[#09090b]'
            }`}
          >
            {/* Menu Body: Proportioned text & website style */}
            <div className="px-4 pt-3.5 pb-6 flex flex-col gap-2.5 max-w-[600px] mx-auto w-full">
              {/* 1. Components Accordion Card */}
              <div
                className={`rounded-2xl transition-colors border overflow-hidden ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08]'
                    : 'bg-black/[0.03] border-black/[0.06]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic?.('light');
                    setComponentsExpanded((prev) => !prev);
                  }}
                  className="w-full flex items-center justify-between px-4.5 py-3.5 cursor-pointer text-left"
                >
                  <span
                    className={`text-[15px] font-medium tracking-tight ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    Components
                  </span>
                  <motion.div
                    animate={{ rotate: componentsExpanded ? 0 : 180 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={isDark ? 'text-white/80' : 'text-neutral-700'}
                  >
                    <ChevronUp className="w-4 h-4 stroke-[2]" />
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
                          height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.22, delay: 0.02 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.14, ease: 'easeOut' },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-4.5 pb-4 pt-0">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {COMPONENTS.map((item) => (
                            <div
                              key={item}
                              onClick={() => {
                                triggerHaptic?.('light');
                                onSelectNav('components');
                                onClose();
                              }}
                              className={`cursor-pointer py-1 select-none transition-colors duration-150 ${
                                isDark
                                  ? 'text-neutral-400 hover:text-white'
                                  : 'text-neutral-600 hover:text-black'
                              }`}
                            >
                              <span className="text-[13.5px] font-normal tracking-tight">
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
                  triggerHaptic?.('light');
                  onSelectNav('sponsors');
                  onClose();
                }}
                className={`rounded-2xl px-4.5 py-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]'
                    : 'bg-black/[0.03] border-black/[0.06] hover:bg-black/[0.05]'
                }`}
              >
                <span
                  className={`text-[15px] font-medium tracking-tight ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  Sponsors
                </span>
                <ChevronRight
                  className={`w-4 h-4 stroke-[2] ${isDark ? 'text-white/80' : 'text-neutral-700'}`}
                />
              </div>

              {/* 3. Skills Card */}
              <div
                onClick={() => {
                  triggerHaptic?.('light');
                  onSelectNav('skills');
                  onClose();
                }}
                className={`rounded-2xl px-4.5 py-3.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] border ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07]'
                    : 'bg-black/[0.03] border-black/[0.06] hover:bg-black/[0.05]'
                }`}
              >
                <span
                  className={`text-[15px] font-medium tracking-tight ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                >
                  Skills
                </span>
                <ChevronRight
                  className={`w-4 h-4 stroke-[2] ${isDark ? 'text-white/80' : 'text-neutral-700'}`}
                />
              </div>

              {/* 4. Appearance Switcher */}
              <div className="px-1 py-1 flex items-center justify-between">
                <span
                  className={`text-[14px] font-medium tracking-tight ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  Appearance
                </span>

                <div
                  className={`p-0.5 rounded-full flex items-center border ${
                    isDark
                      ? 'bg-white/[0.06] border-white/10'
                      : 'bg-black/[0.05] border-black/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic?.('light');
                      if (!isDark) onToggleTheme('dark');
                    }}
                    className={`relative px-3 py-1 rounded-full flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                      isDark ? 'text-white' : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {isDark && (
                      <motion.div
                        layoutId="overlay-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-white/[0.12] shadow-xs border border-white/15"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      <Moon className="w-3 h-3 stroke-[2]" />
                      <span>Dark</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic?.('light');
                      if (isDark) onToggleTheme('light');
                    }}
                    className={`relative px-3 py-1 rounded-full flex items-center gap-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                      !isDark ? 'text-neutral-950' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {!isDark && (
                      <motion.div
                        layoutId="overlay-pill"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-white shadow-xs border border-black/10"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      <Sun className="w-3 h-3 stroke-[2]" />
                      <span>Light</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* 5. Primary Action Button */}
              <div className="pt-1">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={() => {
                    triggerHaptic?.('medium');
                    onSelectNav('components');
                    onClose();
                  }}
                  className={`w-full h-11 rounded-full font-medium text-[14px] tracking-tight transition-all cursor-pointer shadow-md flex items-center justify-center ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300'
                      : 'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900'
                  }`}
                >
                  Explore Components
                </motion.button>
              </div>

              {/* 6. Footer Text */}
              <div className="pt-1 text-center">
                <a
                  href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block text-[12px] font-normal transition-colors cursor-pointer no-underline ${
                    isDark ? 'text-neutral-500 hover:text-neutral-300' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Github with {stars ? (stars / 1000).toFixed(1) : '2.6'}k stars
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
