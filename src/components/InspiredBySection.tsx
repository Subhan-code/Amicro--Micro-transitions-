import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface InspiredItem {
  number: string;
  name: string;
  url: string;
  description: string;
}

const inspiredItems: InspiredItem[] = [
  {
    number: '01',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'Utility-first CSS framework powering rapid, fluid UI construction.',
  },
  {
    number: '02',
    name: 'shadcn/ui',
    url: 'https://ui.shadcn.com',
    description: 'The golden standard of copy-paste, accessible design architecture.',
  },
  {
    number: '03',
    name: 'Vercel',
    url: 'https://vercel.com',
    description: 'Hyper-minimalist design ethos, dark mode mastery, and edge speed.',
  },
  {
    number: '04',
    name: 'Evil Charts',
    url: 'https://evil-charts.edr.design',
    description: 'Experimental data-visualization physics and unconventional charts.',
  },
  {
    number: '05',
    name: 'Devouring Details',
    url: 'https://devouringdetails.com',
    description: 'Deep micro-interaction breakdowns and subtle visual delight.',
  },
  {
    number: '06',
    name: 'Skiper UI',
    url: 'https://skiper-ui.com',
    description: 'Creative animations, spring transitions, and interactive components.',
  },
  {
    number: '07',
    name: 'Making Software',
    url: 'https://makingsoftware.com',
    description: 'Craftsmanship, software aesthetics, and high-standard design engineering.',
  },
  {
    number: '08',
    name: 'shadcncraft',
    url: 'https://shadcncraft.com',
    description: 'Community-driven component craftsmanship and modular block patterns.',
  },
];

interface InspiredBySectionProps {
  theme: 'dark' | 'light';
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  className?: string;
}

export function InspiredBySection({ theme, triggerHaptic, className = '' }: InspiredBySectionProps) {
  const isDark = theme === 'dark';

  return (
    <section
      id="inspired-by"
      aria-label="Inspired by"
      className={`relative z-10 w-full max-w-[1240px] mx-auto py-10 select-none ${className}`}
    >
      <div className="flex flex-col items-start mb-8 sm:mb-10">
        <span
          className={`text-[11px] font-mono font-medium tracking-[0.2em] uppercase mb-2 ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          GENEALOGY &amp; CRAFT
        </span>
        <h2
          className={`text-2xl sm:text-3xl font-semibold tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-950'
          }`}
        >
          Inspired by
        </h2>
        <p
          className={`text-[14px] sm:text-[15px] max-w-xl mt-1.5 leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}
        >
          Standing on the shoulders of thoughtful design systems, creative coders, and tools
          that elevated the modern web experience.
        </p>
      </div>

      {/* 8-item numbered grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {inspiredItems.map((item) => (
          <motion.a
            key={item.number}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic?.('light')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border no-underline transition-colors duration-200 ${
              isDark
                ? 'bg-[#0f0f12] border-white/[0.08] hover:border-white/[0.18] hover:bg-[#141418] text-white'
                : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/60 text-zinc-900 shadow-xs'
            }`}
          >
            <div>
              {/* Top Row: Number & External Arrow */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`font-mono text-[12px] font-semibold tracking-wider ${
                    isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-zinc-400 group-hover:text-zinc-600'
                  }`}
                >
                  {item.number}
                </span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-700'
                  }`}
                />
              </div>

              {/* Title */}
              <h3
                className={`text-[15px] font-semibold tracking-[-0.01em] transition-colors ${
                  isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'
                }`}
              >
                {item.name}
              </h3>

              {/* Description */}
              <p
                className={`text-[12px] sm:text-[12.5px] leading-[18px] mt-1.5 transition-colors line-clamp-2 ${
                  isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-700'
                }`}
              >
                {item.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
