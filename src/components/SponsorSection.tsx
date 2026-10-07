import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapleLogo } from './MapleLogo';
import { DiamondAskSlot } from './DiamondAskSlot';

export interface SponsorItem {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  logoUrl?: string;
  siteUrl?: string;
  isAvailable: boolean;
  tier?: 'diamond' | 'gold' | 'silver';
  price?: string;
}

interface SponsorSectionProps {
  theme: 'dark' | 'light';
  sponsors: SponsorItem[];
  checkoutUrl: string;
  onNavigateSponsors?: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}



/* -------------------------------------------------------------
 * Unified Tier Rectangle Slot for Gold & Silver
 * With "+" icon and blur hover transition
 * ----------------------------------------------------------- */
interface TierRectangleSlotProps {
  key?: React.Key;
  slot: SponsorItem;
  tier: 'gold' | 'silver';
  isFirstEmpty: boolean;
  theme: 'dark' | 'light';
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  onNavigateSponsors?: () => void;
}

function TierRectangleSlot({
  slot,
  tier,
  isFirstEmpty,
  theme,
  triggerHaptic,
  onNavigateSponsors,
}: TierRectangleSlotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';
  const isGold = tier === 'gold';

  const heightClass = isGold ? 'h-[78px] sm:h-[84px]' : 'h-[72px] sm:h-[78px]';
  const occupiedPaddingClass = isGold ? 'px-3 sm:px-4 py-2 sm:py-2.5' : 'px-2.5 sm:px-3 py-1.5 sm:py-2';
  const occupiedLogoClass = isGold ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6 sm:w-7 sm:h-7';
  const occupiedTitleClass = isGold ? 'text-[15px] sm:text-[16px]' : 'text-[14px] sm:text-[15px]';

  // Occupied Slot (No description as requested!)
  if (!slot.isAvailable) {
    const isMaple =
      slot.logoType === 'maple' ||
      slot.companyName.toLowerCase() === 'maple';

    return (
      <motion.a
        href={slot.siteUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => triggerHaptic?.('light')}
        whileHover={{ y: -2, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        className={`group relative ${heightClass} w-full rounded-2xl border flex items-center justify-center ${occupiedPaddingClass} no-underline transition-all duration-200 ${
          isDark
            ? 'bg-[#151413] border-white/10 hover:border-white/20 text-white'
            : 'bg-white border-neutral-200 hover:border-neutral-300 text-black'
        }`}
      >
        {isMaple ? (
          <div className="flex items-center justify-center gap-2.5">
            <MapleLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 group-hover:scale-105 transition-transform duration-200" />
            <span className="text-[17px] sm:text-[18.5px] font-bold tracking-[-0.035em] text-[#F5F2EC]">
              Maple
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2.5">
            {slot.logoUrl ? (
              <img
                src={slot.logoUrl}
                alt={slot.companyName}
                className={`${occupiedLogoClass} rounded-lg object-contain shrink-0`}
              />
            ) : (
              <span
                className={`${occupiedLogoClass} rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs shrink-0 text-white`}
              >
                {slot.companyName.charAt(0)}
              </span>
            )}
            <span className={`${occupiedTitleClass} font-bold tracking-tight truncate ${isDark ? 'text-white' : 'text-black'}`}>
              {slot.companyName}
            </span>
          </div>
        )}
      </motion.a>
    );
  }

  // Empty Slot with blur hover transition
  const emptyLabel = isFirstEmpty
    ? `Become the first ${isGold ? 'Gold' : 'Silver'} sponsor`
    : 'Your logo here';

  return (
    <motion.button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        triggerHaptic?.('medium');
        onNavigateSponsors?.();
      }}
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`group relative ${heightClass} w-full rounded-2xl border border-dashed flex flex-col items-center justify-center p-2.5 text-center transition-all duration-200 cursor-pointer overflow-hidden ${
        isDark
          ? 'bg-[#121214]/40 hover:bg-[#121214]/80 border-white/[0.1] hover:border-white/[0.24] text-neutral-400 hover:text-white'
          : 'bg-neutral-50/50 hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400 text-neutral-600 hover:text-black'
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
            className="flex flex-col items-center justify-center gap-0.5 w-full"
          >
            <span className="text-[17px] sm:text-[19px] font-light leading-none text-neutral-400 group-hover:text-white transition-colors">
              +
            </span>
            <span className={`text-[11px] sm:text-[12px] font-medium tracking-tight px-1 transition-colors truncate max-w-full ${
              isDark ? 'text-neutral-400 group-hover:text-white' : 'text-neutral-600 group-hover:text-black'
            }`}>
              {emptyLabel}
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
            <span className="text-[12px] sm:text-[12.5px] font-medium text-white tracking-tight">
              take this slot &lt;3
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* -------------------------------------------------------------
 * Main SponsorSection (Diamond, Gold, Silver cells)
 * ----------------------------------------------------------- */
export function SponsorSection({
  theme,
  sponsors,
  onNavigateSponsors,
  triggerHaptic,
}: SponsorSectionProps) {
  const isDark = theme === 'dark';

  // Extract Diamond slots (2 cards)
  const diamondSlots = sponsors.filter((s) => s.tier === 'diamond');
  const finalDiamond =
    diamondSlots.length >= 2
      ? diamondSlots.slice(0, 2)
      : [
          ...diamondSlots,
          ...sponsors.filter((s) => s.id === 1 || s.id === 2),
        ].slice(0, 2);

  // Extract Gold slots (4 cards)
  const goldSlots = sponsors.filter((s) => s.tier === 'gold');
  const finalGold =
    goldSlots.length >= 4
      ? goldSlots.slice(0, 4)
      : [
          ...goldSlots,
          ...sponsors.filter((s) => s.tier !== 'diamond').slice(0, 4),
        ].slice(0, 4);

  // Extract Silver slots (4 cards)
  const silverSlots = sponsors.filter((s) => s.tier === 'silver');
  const finalSilver =
    silverSlots.length >= 4
      ? silverSlots.slice(0, 4)
      : [
          ...silverSlots,
          ...sponsors.filter((s) => s.tier !== 'diamond' && s.tier !== 'gold').slice(0, 4),
        ].slice(0, 4);

  // Fallbacks if lists are short
  while (finalDiamond.length < 2) {
    finalDiamond.push({
      id: 901 + finalDiamond.length,
      companyName: 'Available Slot',
      description: '',
      isAvailable: true,
      tier: 'diamond',
      price: '$250',
    });
  }

  while (finalGold.length < 4) {
    finalGold.push({
      id: 911 + finalGold.length,
      companyName: 'Available Slot',
      description: '',
      isAvailable: true,
      tier: 'gold',
      price: '$150',
    });
  }

  while (finalSilver.length < 4) {
    finalSilver.push({
      id: 921 + finalSilver.length,
      companyName: 'Available Slot',
      description: '',
      isAvailable: true,
      tier: 'silver',
      price: '$99',
    });
  }

  let firstEmptyGoldFound = false;
  let firstEmptySilverFound = false;

  return (
    <section
      id="sponsors"
      aria-label="Amicro Sponsors"
      className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-4 sm:pb-6 select-none"
    >
      <div className="flex flex-col items-center text-center">
        {/* Eyebrow Heading */}
        <span
          className={`text-[12px] sm:text-[13px] font-semibold tracking-[0.25em] uppercase mb-5 sm:mb-7 transition-colors ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}
        >
          SPONSORED BY
        </span>

        {/* Tier 1: Diamond Tier Header (Title on left) */}
        <div className="w-full max-w-[1140px] flex items-center justify-start mb-2.5 px-1">
          <span className={`text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Diamond
          </span>
        </div>

        {/* Tier 1: Diamond Tier (No description, exact Maple reference card, enlarged) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-[1140px] mb-4 sm:mb-5 items-stretch">
          {finalDiamond.map((slot) => {
            if (!slot.isAvailable) {
              const isMaple =
                slot.logoType === 'maple' ||
                slot.companyName.toLowerCase() === 'maple';

              return (
                <motion.a
                  key={slot.id}
                  href={slot.siteUrl || 'https://maple.dev/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => triggerHaptic?.('light')}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  className={`group relative w-full h-full min-h-[148px] rounded-2xl sm:rounded-3xl border flex items-center justify-center p-5 sm:p-7 no-underline transition-all duration-200 ${
                    isMaple
                      ? isDark
                        ? 'bg-[#151413] border-white/10 hover:border-white/20'
                        : 'bg-[#fffaf5] border-orange-200 hover:border-orange-300'
                      : isDark
                      ? 'bg-[#121215] border-white/10 hover:border-white/20 text-white'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 text-black'
                  }`}
                >
                  {/* Exact Maple reference card styling: orange tree emblem beside wordmark, NO description */}
                  {isMaple ? (
                    <div className="flex items-center justify-center gap-3 sm:gap-3.5">
                      <MapleLogo className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 group-hover:scale-105 transition-transform duration-200" />
                      <span className="text-[24px] sm:text-[28px] font-bold tracking-[-0.035em] text-[#F5F2EC]">
                        Maple
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 sm:gap-3.5">
                      {slot.logoUrl ? (
                        <img
                          src={slot.logoUrl}
                          alt={slot.companyName}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg text-white shrink-0">
                          {slot.companyName.charAt(0)}
                        </div>
                      )}
                      <span className="text-[20px] sm:text-[24px] font-bold tracking-tight text-white truncate">
                        {slot.companyName}
                      </span>
                    </div>
                  )}
                </motion.a>
              );
            }

            return (
              <DiamondAskSlot
                key={slot.id}
                triggerHaptic={triggerHaptic}
                onClick={() => {
                  if (onNavigateSponsors) {
                    onNavigateSponsors();
                  }
                }}
              />
            );
          })}
        </div>

        {/* Tier 2: Gold Tier Header (Title on left) */}
        <div className="w-full max-w-[1140px] flex items-center justify-start mt-4 sm:mt-5 mb-2 px-1">
          <span className={`text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Gold
          </span>
        </div>

        {/* Tier 2: Gold Tier (No description, clean minimal cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-[1140px] mb-2.5 sm:mb-3.5">
          {finalGold.map((slot) => {
            const isFirstEmpty = slot.isAvailable && !firstEmptyGoldFound;
            if (isFirstEmpty) firstEmptyGoldFound = true;

            return (
              <TierRectangleSlot
                key={slot.id}
                slot={slot}
                tier="gold"
                isFirstEmpty={isFirstEmpty}
                theme={theme}
                triggerHaptic={triggerHaptic}
                onNavigateSponsors={onNavigateSponsors}
              />
            );
          })}
        </div>

        {/* Tier 3: Silver Tier Header (Title on left) */}
        <div className="w-full max-w-[1140px] flex items-center justify-start mt-4 sm:mt-5 mb-2 px-1">
          <span className={`text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Silver
          </span>
        </div>

        {/* Tier 3: Silver Tier (No description, clean minimal cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 w-full max-w-[1140px]">
          {finalSilver.map((slot) => {
            const isFirstEmpty = slot.isAvailable && !firstEmptySilverFound;
            if (isFirstEmpty) firstEmptySilverFound = true;

            return (
              <TierRectangleSlot
                key={slot.id}
                slot={slot}
                tier="silver"
                isFirstEmpty={isFirstEmpty}
                theme={theme}
                triggerHaptic={triggerHaptic}
                onNavigateSponsors={onNavigateSponsors}
              />
            );
          })}
        </div>

        {/* Tiers quick link */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            if (onNavigateSponsors) {
              onNavigateSponsors();
            } else {
              window.location.href = '/sponsors';
            }
          }}
          className={`mt-6 sm:mt-8 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-colors cursor-pointer bg-transparent border-0 p-0 ${
            isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
          }`}
        >
          <span>View all sponsorship tiers &amp; perks</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
