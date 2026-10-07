import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DiamondAskSlotProps {
  variant?: 'default' | 'canvas';
  className?: string;
  isDark?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

function DiamondIcon({ size = 28, isDark = true }: { size?: number; isDark?: boolean }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 88) / 100)}
      viewBox="0 0 100 88"
      fill="none"
      className={`shrink-0 pointer-events-none transition-colors ${
        isDark ? 'text-white/80 group-hover:text-white' : 'text-neutral-800 group-hover:text-black'
      }`}
      aria-hidden="true"
    >
      <path
        d="M79.8287 2.5L19.5428 2.5L2.5 27.6619L50.0673 84.8982L97.1259 27.6619L79.8287 2.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const DiamondAskSlot: React.FC<DiamondAskSlotProps> = ({
  variant = 'default',
  className = '',
  isDark = true,
  onClick,
  triggerHaptic,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCanvas = variant === 'canvas';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerHaptic?.('medium');
    if (onClick) {
      onClick(e);
      return;
    }

    const elem = document.getElementById('sponsorship-tiers');
    if (elem) {
      e.preventDefault();
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isCanvas) {
    return (
      <a
        href="/sponsors#sponsorship-tiers"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`px-4 py-2.5 sm:py-3 rounded-[14px] border border-dotted flex items-center gap-2.5 transition-colors select-none no-underline cursor-pointer whitespace-nowrap group ${
          isDark
            ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/20 hover:border-white/40 text-neutral-300 hover:text-white'
            : 'bg-black/[0.03] hover:bg-black/[0.06] border-black/20 hover:border-black/40 text-neutral-700 hover:text-neutral-900'
        } ${className}`}
      >
        <motion.div
          animate={isHovered ? { rotateY: 360, scale: 1.15 } : { rotateY: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-[22px] h-[22px] flex items-center justify-center shrink-0 [perspective:600px]"
        >
          <DiamondIcon size={20} isDark={isDark} />
        </motion.div>
        <span className="text-[14px] sm:text-[15px] leading-[20px] font-semibold tracking-tight">
          {isHovered ? 'take this slot <3' : 'Your logo'}
        </span>
      </a>
    );
  }

  return (
    <a
      href="/sponsors#sponsorship-tiers"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-center justify-center text-center rounded-[16px] border-2 border-dotted transition-all no-underline cursor-pointer select-none group w-full h-full min-h-[148px] p-6 ${
        isDark
          ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/20 hover:border-white/40'
          : 'bg-black/[0.02] hover:bg-black/[0.05] border-black/15 hover:border-black/30'
      } ${className}`}
    >
      <div className="flex items-center justify-center gap-3.5 my-auto">
        <motion.div
          className="shrink-0 flex items-center justify-center [perspective:800px]"
          animate={isHovered ? { rotateY: 360, scale: 1.15 } : { rotateY: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <DiamondIcon size={30} isDark={isDark} />
        </motion.div>

        <div className="relative flex items-center justify-center min-w-[160px]">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.span
                key="default"
                initial={{ opacity: 0, filter: 'blur(6px)', y: 2 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(6px)', y: -2 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[22px] sm:text-[26px] font-bold tracking-tight transition-colors ${
                  isDark ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-700 group-hover:text-black'
                }`}
              >
                Your logo here
              </motion.span>
            ) : (
              <motion.span
                key="hovered"
                initial={{ opacity: 0, filter: 'blur(6px)', y: 2 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(6px)', y: -2 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[22px] sm:text-[26px] font-bold tracking-tight transition-colors ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                take this slot &lt;3
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </a>
  );
};
