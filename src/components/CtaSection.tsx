import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AnimatedStarCounter } from './AnimatedStarCounter';

interface CtaSectionProps {
  theme: 'dark' | 'light';
  stars: number | null;
  onBrowseComponents: () => void;
  showToast?: (msg: string) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export function CtaSection({
  theme,
  stars,
  onBrowseComponents,
  triggerHaptic,
}: CtaSectionProps) {
  return (
    <section className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 my-6 sm:my-8 select-none">
      <div
        className={`relative w-full rounded-[24px] sm:rounded-[32px] py-9 sm:py-12 md:py-14 px-6 sm:px-10 border overflow-hidden transition-all duration-300 flex flex-col items-center text-center ${
          theme === 'dark'
            ? 'bg-[#09090b] border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.65)] text-white'
            : 'bg-[#0c0c0e] border-neutral-800 shadow-[0_8px_32px_rgba(0,0,0,0.2)] text-white'
        }`}
      >
        {/* Halftone texture background from amicro cta .jpg */}
        <img
          src="/amicro-cta.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 mix-blend-screen pointer-events-none select-none"
        />

        {/* Dark overlay for optimal typography contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/50 pointer-events-none"
        />

        {/* 1. Title */}
        <h2 className="relative z-10 text-[26px] sm:text-[38px] lg:text-[44px] font-semibold tracking-[-0.03em] leading-[1.12] max-w-xl mx-auto mb-3 sm:mb-3.5 text-white">
          Ready to make your interface feel alive?
        </h2>

        {/* 2. Sub Para */}
        <p className="relative z-10 text-[14px] sm:text-[15.5px] leading-[22px] sm:leading-[25px] max-w-[500px] mx-auto font-normal tracking-[-0.01em] mb-7 sm:mb-8 text-neutral-300">
          160+ copy-paste React components for spring physics, card spreads, fluid loaders, and UI effects. Free and open-source.
        </p>

        {/* 3. Two Buttons Only (Clean, Quiet, No Neon/Gradient, Steady Borders) */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          {/* Primary CTA: Browse Components */}
          <motion.button
            type="button"
            onClick={() => {
              triggerHaptic?.('light');
              onBrowseComponents();
            }}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="inline-flex items-center justify-center gap-2 h-[40px] px-5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors duration-200 bg-[#ededed] text-[#09090b] border border-transparent hover:bg-white shadow-xs"
          >
            <span>Browse Components</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          {/* Secondary CTA: GitHub */}
          <motion.a
            href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic?.('medium')}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="inline-flex items-center justify-center gap-2 h-[40px] px-4 rounded-full text-[13px] font-medium no-underline transition-colors duration-200 cursor-pointer border bg-[#141417] border-white/[0.12] hover:bg-[#1a1a1f] text-neutral-200 hover:text-white shadow-xs"
          >
            <svg
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 shrink-0 block"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                transform="scale(64)"
                fill="#EDEDED"
              />
            </svg>
            <span>GitHub</span>
            <span className="text-[12px] font-semibold tracking-[-0.02em] opacity-90">
              (<AnimatedStarCounter value={stars} fallback={2492} />)
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
