import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapleLogo } from './MapleLogo';
import { SponsorItem } from './SponsorSection';

interface HeroSponsorBarProps {
  theme: 'dark' | 'light';
  sponsors: SponsorItem[];
  onNavigateSponsors: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

function HeroEmptySlot({
  label,
  onNavigateSponsors,
  triggerHaptic,
  isDark,
}: {
  key?: React.Key;
  label: string;
  onNavigateSponsors: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  isDark: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        triggerHaptic?.('medium');
        onNavigateSponsors();
      }}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`group relative h-[78px] sm:h-[84px] rounded-2xl border border-dashed flex flex-col items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer overflow-hidden ${
        isDark
          ? 'bg-[#0e0e11]/60 hover:bg-[#0e0e11] border-white/10 hover:border-white/25 text-neutral-400 hover:text-white'
          : 'bg-neutral-50/60 hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:text-black'
      }`}
    >
      <AnimatePresence mode="wait">
        {!isHovered ? (
          <motion.div
            key="default"
            initial={{ opacity: 0, filter: 'blur(6px)', y: 2 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-1 w-full"
          >
            <span className="text-[18px] sm:text-[20px] font-light leading-none text-neutral-400 group-hover:text-white transition-colors">
              +
            </span>
            <span className="text-[11.5px] sm:text-[12px] font-medium tracking-tight text-neutral-400 group-hover:text-white transition-colors px-1 truncate max-w-full">
              {label}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="hovered"
            initial={{ opacity: 0, filter: 'blur(6px)', y: 2 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center w-full px-2"
          >
            <span className="text-[12.5px] sm:text-[13px] font-medium text-white tracking-tight">
              take this slot &lt;3
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function HeroSponsorBar({
  theme,
  sponsors,
  onNavigateSponsors,
  triggerHaptic,
}: HeroSponsorBarProps) {
  const isDark = theme === 'dark';

  // Get active sponsor or fallback to Maple
  const activeSponsors = sponsors.filter((s) => !s.isAvailable);
  const primarySponsor: SponsorItem = activeSponsors[0] || {
    id: 1,
    companyName: 'Maple',
    description: '',
    isAvailable: false,
    logoType: 'maple',
    logoUrl: '',
    siteUrl: 'https://maple.dev/',
  };

  const slots = [
    { type: 'occupied' as const, data: primarySponsor },
    { type: 'empty' as const, label: 'Become the first sponsor' },
    { type: 'empty' as const, label: 'Your logo here' },
    { type: 'empty' as const, label: 'Your logo here' },
  ];

  return (
    <section className="w-full max-w-[1040px] lg:max-w-[1160px] 2xl:max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 sm:pb-14 2xl:pb-16 select-none">
      {/* Centered "Sponsored by" heading matching screenshot */}
      <p
        className={`text-[12px] sm:text-[13px] font-medium tracking-[0.02em] text-center mb-3 sm:mb-3.5 transition-colors ${
          isDark ? 'text-neutral-400' : 'text-neutral-500'
        }`}
      >
        Sponsored by
      </p>

      {/* 4 Cards Grid Row matching screenshot */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
        {slots.map((slot, idx) => {
          if (slot.type === 'occupied' && slot.data) {
            const isMaple =
              slot.data.logoType === 'maple' ||
              slot.data.companyName.toLowerCase() === 'maple';

            return (
              <motion.a
                key={`hero-sponsor-${idx}`}
                href={slot.data.siteUrl || 'https://maple.dev/'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                className={`group relative h-[78px] sm:h-[84px] rounded-2xl border flex items-center justify-center gap-3 p-3.5 no-underline transition-all duration-200 ${
                  isDark
                    ? 'bg-[#151413] border-white/10 hover:border-white/20'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Maple Logo matching reference: pure orange tree emblem directly beside wordmark */}
                {isMaple ? (
                  <div className="flex items-center justify-center gap-2.5">
                    <MapleLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 group-hover:scale-105 transition-transform duration-200" />
                    <span className={`text-[20px] sm:text-[22px] font-bold tracking-[-0.035em] ${
                      isDark ? 'text-[#F5F2EC]' : 'text-neutral-900'
                    }`}>
                      Maple
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2.5">
                    {slot.data.logoUrl ? (
                      <img
                        src={slot.data.logoUrl}
                        alt={slot.data.companyName}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain shrink-0"
                      />
                    ) : (
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-neutral-100 border-neutral-200 text-neutral-900'
                      }`}>
                        {slot.data.companyName.charAt(0)}
                      </div>
                    )}
                    <span className={`text-[16px] sm:text-[17px] font-bold tracking-tight truncate ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {slot.data.companyName}
                    </span>
                  </div>
                )}
              </motion.a>
            );
          }

          // Empty Slot with blur hover transition
          return (
            <HeroEmptySlot
              key={`hero-empty-${idx}`}
              label={slot.label}
              onNavigateSponsors={onNavigateSponsors}
              triggerHaptic={triggerHaptic}
              isDark={isDark}
            />
          );
        })}
      </div>
    </section>
  );
}
