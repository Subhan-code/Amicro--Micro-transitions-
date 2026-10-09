import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation, useInView } from 'motion/react';
import { Check, ArrowUpRight } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { MapleLogo } from './MapleLogo';
import { DiamondAskSlot } from './DiamondAskSlot';
import { StickerBoard } from './StickerBoard';
import { SponsorStats } from './SponsorStats';
import { LiquidMetal } from './ui/liquid-metal';
import { SPONSOR_TIERS } from '../data/tiers';

export interface SponsorSlot {
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

interface SponsorsPageProps {
  theme: 'dark' | 'light';
  sponsors: SponsorSlot[];
  checkoutUrl: string;
  onNavigateHome: () => void;
  showToast?: (message: string) => void;
  stars?: number | null;
  onOpenSponsorForm?: (ctx: { tier: 'diamond' | 'gold' | 'silver'; placement?: string; slotId?: number }) => void;
}

function TierDiamondMark({
  isHovered,
  triggerLandingKey = 0,
  isParentInView = false,
  isDark = true,
}: {
  isHovered: boolean;
  triggerLandingKey?: number;
  isParentInView?: boolean;
  isDark?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.25 });
  const hasLanded = useRef(false);
  const lastKey = useRef(triggerLandingKey);

  const playLandingAnimation = useCallback(() => {
    if (shouldReduceMotion) {
      controls.set({ y: 0, scale: 1, rotateY: 0, rotateX: 0, rotateZ: 0, opacity: 1 });
      return;
    }

    // Initial floating state: dropping from above with dramatic 3D pitch and larger perspective scale
    controls.set({
      y: -54,
      scale: 2.2,
      rotateY: 480,
      rotateX: 55,
      rotateZ: -25,
      opacity: 0,
    });

    // Falling, tumbling flip, impact compression, and settling into resting place
    controls.start({
      y: [-54, 4, -2, 0],
      scale: [2.2, 0.88, 1.05, 1],
      rotateY: [480, 25, -6, 0],
      rotateX: [55, -10, 3, 0],
      rotateZ: [-25, 5, -1, 0],
      opacity: [0, 1, 1, 1],
      transition: {
        duration: 0.95,
        times: [0, 0.65, 0.85, 1],
        ease: [0.16, 1, 0.3, 1],
      },
    }).then(() => {
      hasLanded.current = true;
    });
  }, [controls, shouldReduceMotion]);

  // Trigger landing when either the diamond mark or the parent section enters the viewport
  useEffect(() => {
    if ((isInView || isParentInView) && !hasLanded.current) {
      playLandingAnimation();
    }
  }, [isInView, isParentInView, playLandingAnimation]);

  // Re-trigger landing when triggerLandingKey increments (e.g. hero "Become a Sponsor" clicked)
  useEffect(() => {
    if (triggerLandingKey !== lastKey.current && triggerLandingKey > 0) {
      lastKey.current = triggerLandingKey;
      const timer = setTimeout(() => {
        playLandingAnimation();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [triggerLandingKey, playLandingAnimation]);

  // Interactive 3D flip on card hover once landed
  useEffect(() => {
    if (!shouldReduceMotion && hasLanded.current) {
      if (isHovered) {
        controls.start({
          rotateY: 180,
          scale: 1.15,
          y: -1,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        });
      } else {
        controls.start({
          rotateY: 0,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          },
        });
      }
    }
  }, [isHovered, controls, shouldReduceMotion]);

  return (
    <div
      ref={ref}
      className="shrink-0 flex items-center justify-center [perspective:1000px] pointer-events-none"
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
    >
      <motion.svg
        width="20"
        height="18"
        viewBox="0 0 100 88"
        fill="none"
        className={`shrink-0 pointer-events-none transition-colors ${isDark ? 'text-white/90' : 'text-neutral-900'
          }`}
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
        initial={{
          y: shouldReduceMotion ? 0 : -54,
          scale: shouldReduceMotion ? 1 : 2.2,
          rotateY: shouldReduceMotion ? 0 : 480,
          rotateX: shouldReduceMotion ? 0 : 55,
          rotateZ: shouldReduceMotion ? 0 : -25,
          opacity: shouldReduceMotion ? 1 : 0,
        }}
        animate={controls}
      >
        <path
          d="M79.8287 2.5L19.5428 2.5L2.5 27.6619L50.0673 84.8982L97.1259 27.6619L79.8287 2.5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}

function DiamondSlotCard({
  slot,
  checkoutUrl,
  isDark = true,
  triggerHaptic,
  onOpenCheckout,
}: {
  slot: SponsorSlot;
  checkoutUrl: string;
  isDark?: boolean;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  onOpenCheckout?: (url: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (!slot.isAvailable) {
    const isMaple =
      slot.logoType === 'maple' || slot.companyName.toLowerCase() === 'maple';

    return (
      <a
        href={slot.siteUrl || 'https://maple.dev/'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => triggerHaptic?.('light')}
        className={`relative w-full h-full min-h-[200px] sm:min-h-[220px] rounded-[16px] flex flex-col justify-center items-center p-6 text-center no-underline transition-colors ${isMaple
          ? isDark
            ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03]'
            : 'bg-[#FBF8F1] border border-stone-200/80 shadow-xs'
          : isDark
            ? 'bg-white/[0.08] hover:bg-white/[0.11] outline -outline-offset-1 outline-white/[0.03]'
            : 'bg-white hover:bg-neutral-50 border border-neutral-200/80 shadow-xs'
          }`}
      >
        {isMaple ? (
          <div className="flex items-center justify-center gap-3.5 my-auto">
            <MapleLogo className="w-11 h-11 sm:w-12 sm:h-12 shrink-0" />
            <span
              className={`text-[28px] sm:text-[32px] font-bold tracking-[-0.035em] ${isDark ? 'text-[#F5F2EC]' : 'text-neutral-900'
                }`}
            >
              Maple
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3.5 my-auto">
            {slot.logoUrl ? (
              <img
                src={slot.logoUrl}
                alt={slot.companyName}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-black/10 shrink-0"
              />
            ) : (
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
              >
                {slot.companyName.charAt(0)}
              </div>
            )}
            <span
              className={`text-[22px] sm:text-[24px] font-bold tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'
                }`}
            >
              {slot.companyName}
            </span>
          </div>
        )}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        triggerHaptic?.('medium');
        const elem = document.getElementById('sponsorship-tiers');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (onOpenCheckout) {
          onOpenCheckout(checkoutUrl);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full min-h-[200px] sm:min-h-[220px] rounded-[16px] flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer border-0 ${isDark
        ? 'bg-white/[0.04] hover:bg-white/[0.08] outline -outline-offset-1 outline-white/[0.03]'
        : 'bg-black/[0.02] hover:bg-black/[0.05] border border-black/10'
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
            className="flex flex-col items-center justify-center gap-3 w-full"
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-[20px] sm:text-[22px] font-light leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
              >
                +
              </span>
              <svg
                viewBox="0 0 100 88"
                className={`w-8 h-7 sm:w-9 sm:h-8 shrink-0 ${isDark ? 'text-white' : 'text-neutral-800'
                  }`}
                fill="none"
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
            </div>
            <span
              className={`text-[13.5px] sm:text-[14.5px] font-medium text-center ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
            >
              Been waiting for your logo to be placed here
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
            <span
              className={`text-[14px] sm:text-[15.5px] font-medium tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'
                }`}
            >
              take this slot &lt;3
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function GoldSlotCard({
  slot,
  checkoutUrl,
  isDark = true,
  triggerHaptic,
  onOpenCheckout,
}: {
  key?: React.Key;
  slot: SponsorSlot;
  checkoutUrl: string;
  isDark?: boolean;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  onOpenCheckout?: (url: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (!slot.isAvailable) {
    const isMaple =
      slot.logoType === 'maple' || slot.companyName.toLowerCase() === 'maple';

    return (
      <a
        href={slot.siteUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => triggerHaptic?.('light')}
        className={`relative w-full flex-1 min-h-[100px] sm:min-h-[108px] rounded-[16px] flex items-center justify-center p-4 no-underline transition-colors ${isMaple
          ? isDark
            ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03]'
            : 'bg-[#FBF8F1] border border-stone-200/80'
          : isDark
            ? 'bg-white/[0.08] hover:bg-white/[0.11] outline -outline-offset-1 outline-white/[0.03]'
            : 'bg-white hover:bg-neutral-50 border border-neutral-200/80'
          }`}
      >
        {isMaple ? (
          <div className="flex items-center justify-center gap-2.5">
            <MapleLogo className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" />
            <span
              className={`text-[17px] sm:text-[18.5px] font-bold tracking-[-0.035em] ${isDark ? 'text-[#F5F2EC]' : 'text-neutral-900'
                }`}
            >
              Maple
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 my-auto">
            {slot.logoUrl ? (
              <img
                src={slot.logoUrl}
                alt={slot.companyName}
                className="w-8 h-8 rounded-lg object-contain bg-black/10 shrink-0"
              />
            ) : (
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-neutral-200 text-neutral-800'
                  }`}
              >
                {slot.companyName.charAt(0)}
              </span>
            )}
            <span
              className={`text-[14px] font-bold tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'
                }`}
            >
              {slot.companyName}
            </span>
          </div>
        )}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        triggerHaptic?.('medium');
        const elem = document.getElementById('sponsorship-tiers');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (onOpenCheckout) {
          onOpenCheckout(checkoutUrl);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full flex-1 min-h-[100px] sm:min-h-[108px] rounded-[16px] flex flex-col items-center justify-center p-3.5 text-center transition-colors cursor-pointer border-0 ${isDark
        ? 'bg-white/[0.04] hover:bg-white/[0.08] outline -outline-offset-1 outline-white/[0.03]'
        : 'bg-black/[0.02] hover:bg-black/[0.05] border border-black/10'
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
            className="flex items-center justify-center gap-2.5"
          >
            <span
              className={`text-[17px] sm:text-[19px] font-light leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
            >
              +
            </span>
            <span
              className={`text-[13px] sm:text-[13.5px] font-medium tracking-tight ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
            >
              Gold Slot
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
            <span
              className={`text-[12px] sm:text-[12.5px] font-medium tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'
                }`}
            >
              take this slot &lt;3
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

function SilverSlotCard({
  slot,
  checkoutUrl,
  isDark = true,
  triggerHaptic,
  onOpenCheckout,
}: {
  key?: React.Key;
  slot: SponsorSlot;
  checkoutUrl: string;
  isDark?: boolean;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  onOpenCheckout?: (url: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (!slot.isAvailable) {
    return (
      <a
        href={slot.siteUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => triggerHaptic?.('light')}
        className={`relative w-full flex-1 min-h-[90px] sm:min-h-[96px] rounded-[16px] flex items-center justify-center p-3.5 no-underline transition-colors ${isDark
          ? 'bg-white/[0.06] hover:bg-white/[0.09] outline -outline-offset-1 outline-white/[0.03]'
          : 'bg-white hover:bg-neutral-50 border border-neutral-200/80'
          }`}
      >
        <div className="flex items-center justify-center gap-2.5 my-auto">
          {slot.logoUrl ? (
            <img
              src={slot.logoUrl}
              alt={slot.companyName}
              className="w-7 h-7 rounded-lg object-contain bg-black/10 shrink-0"
            />
          ) : (
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isDark ? 'bg-white/10 text-white' : 'bg-neutral-200 text-neutral-800'
                }`}
            >
              {slot.companyName.charAt(0)}
            </span>
          )}
          <span
            className={`text-[13.5px] font-bold tracking-tight ${isDark ? 'text-neutral-100' : 'text-neutral-900'
              }`}
          >
            {slot.companyName}
          </span>
        </div>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        triggerHaptic?.('medium');
        const elem = document.getElementById('sponsorship-tiers');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (onOpenCheckout) {
          onOpenCheckout(checkoutUrl);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full flex-1 min-h-[90px] sm:min-h-[96px] rounded-[16px] flex flex-col items-center justify-center p-3 text-center transition-colors cursor-pointer border-0 ${isDark
        ? 'bg-white/[0.03] hover:bg-white/[0.07] outline -outline-offset-1 outline-white/[0.03]'
        : 'bg-black/[0.02] hover:bg-black/[0.05] border border-black/10'
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
            className="flex items-center justify-center gap-2"
          >
            <span
              className={`text-[16px] sm:text-[18px] font-light leading-none ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
            >
              +
            </span>
            <span
              className={`text-[12.5px] sm:text-[13px] font-medium tracking-tight ${isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
            >
              Silver Slot
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
            <span
              className={`text-[12px] sm:text-[12.5px] font-medium tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'
                }`}
            >
              take this slot &lt;3
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function SponsorsPage({
  theme,
  sponsors,
  checkoutUrl,
  stars,
  onOpenSponsorForm,
}: SponsorsPageProps) {
  const { trigger: triggerHaptic } = useWebHaptics();
  const [viewMode, setViewMode] = useState<'stickers' | 'grid'>('stickers');
  const [isDiamondCardHovered, setIsDiamondCardHovered] = useState(false);
  const [landingTriggerKey, setLandingTriggerKey] = useState(0);
  const tiersSectionRef = useRef<HTMLElement>(null);
  const isTiersInView = useInView(tiersSectionRef, { amount: 0.15 });

  useEffect(() => {
    const handleHashScroll = () => {
      if (window.location.hash === '#sponsorship-tiers') {
        const scrollToTiers = () => {
          const elem = document.getElementById('sponsorship-tiers');
          if (elem) {
            elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };
        setTimeout(scrollToTiers, 80);
        setTimeout(scrollToTiers, 250);
      }
    };

    handleHashScroll();
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, []);

  const openCheckout = (url: string) => {
    triggerHaptic?.('medium');
    window.location.href = url;
  };

  // Diamond slots: Maple (slot 1) + 1 Available Diamond slot (slot 2)
  const diamondSlots: SponsorSlot[] = [
    sponsors.find((s) => s.id === 1) || {
      id: 1,
      companyName: 'Maple',
      description: 'Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.',
      logoType: 'maple',
      siteUrl: 'https://maple.dev/',
      isAvailable: false,
      tier: 'diamond',
      price: '$250',
    },
    sponsors.find((s) => s.id === 2)
      ? { ...sponsors.find((s) => s.id === 2)!, tier: 'diamond', price: '$250' }
      : {
        id: 2,
        companyName: 'Available Slot',
        description: 'Advertise your product here.',
        isAvailable: true,
        tier: 'diamond',
        price: '$250',
      },
  ];

  // Gold slots: 3 slots total
  const defaultGold: SponsorSlot[] = [
    { id: 3, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150' },
    { id: 4, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150' },
    { id: 5, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'gold', price: '$150' },
  ];

  const goldSlots: SponsorSlot[] = [
    sponsors.find((s) => s.id === 3)
      ? { ...sponsors.find((s) => s.id === 3)!, tier: 'gold', price: '$150' }
      : defaultGold[0],
    sponsors.find((s) => s.id === 4)
      ? { ...sponsors.find((s) => s.id === 4)!, tier: 'gold', price: '$150' }
      : defaultGold[1],
    sponsors.find((s) => s.id === 5)
      ? { ...sponsors.find((s) => s.id === 5)!, tier: 'gold', price: '$150' }
      : defaultGold[2],
  ];

  // Silver slots: 4 slots total
  const defaultSilver: SponsorSlot[] = [
    { id: 6, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99' },
    { id: 7, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99' },
    { id: 8, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99' },
    { id: 9, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true, tier: 'silver', price: '$99' },
  ];

  const silverSlots: SponsorSlot[] = [
    sponsors.find((s) => s.id === 6)
      ? { ...sponsors.find((s) => s.id === 6)!, tier: 'silver', price: '$99' }
      : defaultSilver[0],
    sponsors.find((s) => s.id === 7)
      ? { ...sponsors.find((s) => s.id === 7)!, tier: 'silver', price: '$99' }
      : defaultSilver[1],
    sponsors.find((s) => s.id === 8)
      ? { ...sponsors.find((s) => s.id === 8)!, tier: 'silver', price: '$99' }
      : defaultSilver[2],
    sponsors.find((s) => s.id === 9)
      ? { ...sponsors.find((s) => s.id === 9)!, tier: 'silver', price: '$99' }
      : defaultSilver[3],
  ];

  const scrollToTiers = () => {
    triggerHaptic?.('medium');
    setLandingTriggerKey((prev) => prev + 1);
    const elem = document.getElementById('sponsorship-tiers');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTiersAndSelectDiamond = () => {
    triggerHaptic?.('medium');
    scrollToTiers();
    if (onOpenSponsorForm) {
      onOpenSponsorForm({ tier: 'diamond', placement: 'diamond-2', slotId: 2 });
    }
  };

  const isDark = theme === 'dark';
  const displayStars = stars ? `${(stars / 1000).toFixed(1)}K` : '2.6K';

  return (
    <div
      className={`w-full min-h-dvh pb-28 font-sans select-none transition-colors ${isDark ? 'bg-black text-neutral-50' : 'bg-[#FAFAFA] text-neutral-900'
        }`}
    >
      {/* 1. Hero Section: Morphic pricing header */}
      <section className="flex flex-col items-center justify-center pt-[60px] pb-10 px-4 sm:pt-[120px] 2xl:pt-[140px] sm:pb-[40px] w-full max-w-[1240px] 2xl:max-w-[1360px] mx-auto">
        <h1
          className={`w-full text-left sm:text-center text-fluid-h1 font-bold tracking-tighter m-0 sm:whitespace-nowrap ${isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}
        >
          Sponsor Amicro.
        </h1>
        <p
          className={`mt-3 m-0 w-full sm:w-auto text-left sm:text-center text-fluid-sub font-medium max-w-full sm:max-w-[480px] 2xl:max-w-[560px] ${isDark ? 'text-white/60' : 'text-neutral-600'
            }`}
        >
          Put your product in front of the people building the interface.
        </p>
        <button
          type="button"
          onClick={() => {
            triggerHaptic?.('medium');
            scrollToTiers();
          }}
          className={`mt-8 h-10 rounded-full px-[18px] text-base font-medium transition-colors flex items-center justify-center cursor-pointer border-0 select-none ${isDark
            ? 'bg-neutral-50 text-black hover:bg-neutral-300'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
        >
          Become a Sponsor
        </button>
      </section>

      {/* 2. Container: Live Placements & Placement Preview */}
      <section className="mt-16 sm:mt-20 w-full max-w-[1140px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-4 mb-6 text-center">
          <h3
            className={`text-[22px] leading-[28px] sm:text-[24px] sm:leading-[30px] font-semibold tracking-[-0.5px] m-0 ${isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}
          >
            Sticker board &amp; placement preview.
          </h3>

          {/* View Mode Toggle */}
          <div
            className={`flex items-center rounded-full p-1 border ${isDark ? 'bg-white/[0.06] border-white/[0.08]' : 'bg-black/[0.04] border-black/[0.08]'
              }`}
          >
            <button
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setViewMode('stickers');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border-0 ${viewMode === 'stickers'
                ? isDark
                  ? 'bg-white/[0.14] text-white shadow-sm'
                  : 'bg-white text-neutral-900 shadow-sm'
                : isDark
                  ? 'bg-transparent text-white/50 hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Sticker Canvas
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                setViewMode('grid');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border-0 ${viewMode === 'grid'
                ? isDark
                  ? 'bg-white/[0.14] text-white shadow-sm'
                  : 'bg-white text-neutral-900 shadow-sm'
                : isDark
                  ? 'bg-transparent text-white/50 hover:text-white'
                  : 'bg-transparent text-neutral-500 hover:text-neutral-900'
                }`}
            >
              Grid View
            </button>
          </div>
        </div>

        {/* Canvas or Grid display */}
        <div>
          {viewMode === 'stickers' ? (
            <div className="w-full flex justify-center">
              <StickerBoard
                isDark={isDark}
                triggerHaptic={triggerHaptic}
                onScrollToTiers={scrollToTiersAndSelectDiamond}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-full max-w-[840px] space-y-8 flex flex-col items-center">
                {/* Diamond Placements */}
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center justify-center mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider text-center ${isDark ? 'text-white/40' : 'text-neutral-500'
                        }`}
                    >
                      Diamond Placements
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-center">
                    <DiamondSlotCard
                      slot={diamondSlots[0]}
                      checkoutUrl={checkoutUrl}
                      isDark={isDark}
                      triggerHaptic={triggerHaptic}
                      onOpenCheckout={openCheckout}
                    />
                    <DiamondAskSlot
                      variant="default"
                      isDark={isDark}
                      triggerHaptic={triggerHaptic}
                      onClick={() => scrollToTiersAndSelectDiamond()}
                    />
                  </div>
                </div>

                {/* Gold Placements */}
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center justify-center mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider text-center ${isDark ? 'text-white/40' : 'text-neutral-500'
                        }`}
                    >
                      Gold Placements
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    <div className="w-full sm:w-[240px] flex justify-center">
                      <GoldSlotCard
                        slot={goldSlots[0]}
                        checkoutUrl={checkoutUrl}
                        isDark={isDark}
                        triggerHaptic={triggerHaptic}
                        onOpenCheckout={openCheckout}
                      />
                    </div>
                    {goldSlots.slice(1).filter((s) => !s.isAvailable).map((slot) => (
                      <div key={slot.id} className="w-full sm:w-[240px] flex justify-center">
                        <GoldSlotCard
                          slot={slot}
                          checkoutUrl={checkoutUrl}
                          isDark={isDark}
                          triggerHaptic={triggerHaptic}
                          onOpenCheckout={openCheckout}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Silver Placements */}
                <div className="w-full flex flex-col items-center">
                  <div className="flex items-center justify-center mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider text-center ${isDark ? 'text-white/40' : 'text-neutral-500'
                        }`}
                    >
                      Silver Placements
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                    <div className="w-full sm:w-[190px] flex justify-center">
                      <SilverSlotCard
                        slot={silverSlots[0]}
                        checkoutUrl={checkoutUrl}
                        isDark={isDark}
                        triggerHaptic={triggerHaptic}
                        onOpenCheckout={openCheckout}
                      />
                    </div>
                    {silverSlots.slice(1).filter((s) => !s.isAvailable).map((slot) => (
                      <div key={slot.id} className="w-full sm:w-[190px] flex justify-center">
                        <SilverSlotCard
                          key={slot.id}
                          slot={slot}
                          checkoutUrl={checkoutUrl}
                          isDark={isDark}
                          triggerHaptic={triggerHaptic}
                          onOpenCheckout={openCheckout}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. Plan: Tiers shell */}
      <section
        ref={tiersSectionRef}
        id="sponsorship-tiers"
        className="mt-20 w-full max-w-[1140px] mx-auto px-4 sm:px-6 scroll-mt-24 sm:scroll-mt-28"
      >
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-10">
          <h2
            className={`text-fluid-h2 font-semibold tracking-[-0.6px] m-0 ${isDark ? 'text-neutral-50' : 'text-neutral-900'
              }`}
          >
            Sponsorship Tiers
          </h2>
          <p
            className={`mt-2.5 text-[15px] sm:text-[16px] 2xl:text-[17px] leading-relaxed max-w-lg m-0 ${isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}
          >
            Choose the right tier to showcase your brand, reach thousands of developers, and support open-source craft.
          </p>
        </div>

        <div
          className={`relative overflow-hidden rounded-[16px] outline -outline-offset-1 ${isDark ? 'outline-white/[0.03]' : 'outline-black/[0.06]'
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-3 p-3">
            {/* Diamond Tier (Only highlighted card) */}
            <motion.div
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setIsDiamondCardHovered(true)}
              onMouseLeave={() => setIsDiamondCardHovered(false)}
              onClick={() => {
                triggerHaptic?.('medium');
                if (onOpenSponsorForm) {
                  onOpenSponsorForm({ tier: 'diamond', placement: 'diamond-2', slotId: 2 });
                } else {
                  openCheckout(SPONSOR_TIERS[0].checkoutUrl);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerHaptic?.('medium');
                  if (onOpenSponsorForm) {
                    onOpenSponsorForm({ tier: 'diamond', placement: 'diamond-2', slotId: 2 });
                  } else {
                    openCheckout(SPONSOR_TIERS[0].checkoutUrl);
                  }
                }
              }}
              className={`relative text-left grid grid-rows-[22px_auto_auto_1fr] rounded-[16px] px-5 pt-[18px] pb-5 cursor-pointer focus:outline-none group select-none border-0 transition-all duration-200 overflow-hidden ${
                isDark
                  ? 'bg-white/[0.08] outline outline-white/20 hover:outline-white/30 focus-visible:outline-white/40'
                  : 'bg-white border border-neutral-200 outline outline-neutral-300 hover:outline-neutral-400 focus-visible:outline-neutral-500'
              }`}
            >
              {/* Liquid Metal Border Stroke (Edge Perimeter Only) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 rounded-[16px] overflow-hidden"
                style={{
                  padding: '2px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                }}
              >
                <LiquidMetal
                  colorBack={isDark ? (isDiamondCardHovered ? '#646470' : '#33333c') : (isDiamondCardHovered ? '#8e8e96' : '#b2b2ba')}
                  colorTint="#ffffff"
                  speed={isDiamondCardHovered ? 0.75 : 0.4}
                  repetition={4}
                  distortion={0.12}
                  scale={1}
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Row 1 is the name row, exactly 22px */}
              <div className="relative z-10 h-[22px] flex items-center justify-between">
                <span
                  className={`text-[16px] leading-[22px] font-medium m-0 ${
                    isDark ? 'text-neutral-50' : 'text-neutral-900'
                  }`}
                >
                  Diamond
                </span>
                <TierDiamondMark
                  isHovered={isDiamondCardHovered}
                  triggerLandingKey={landingTriggerKey}
                  isParentInView={isTiersInView}
                  isDark={isDark}
                />
              </div>

              {/* Row 2 is the price, mt-3.5 */}
              <div className="relative z-10 flex items-baseline gap-1.5 mt-3.5">
                <span
                  className={`text-[36px] leading-[43px] font-bold tracking-[-1.44px] font-sans ${
                    isDark ? 'text-neutral-100' : 'text-neutral-900'
                  }`}
                >
                  $250
                </span>
                <span
                  className={`text-[16px] leading-[22px] font-medium ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  / month
                </span>
              </div>

              {/* Row 3 is the button, mt-6, h-10 w-full rounded-[9px] */}
              <div
                className={`relative z-10 mt-6 w-full h-10 rounded-[9px] text-sm font-medium transition-colors flex items-center justify-center select-none ${
                  isDark
                    ? 'bg-neutral-50 text-black group-hover:bg-neutral-200'
                    : 'bg-neutral-900 text-white group-hover:bg-neutral-800'
                }`}
              >
                Sponsor Diamond
              </div>

              {/* Row 4 is the checks, mt-7, gap 10px, 15/22 medium */}
              <div className="relative z-10 mt-7 flex flex-col gap-2.5">
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${
                    isDark ? 'text-neutral-100' : 'text-neutral-800'
                  }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Homepage &amp; premium site placement</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${
                    isDark ? 'text-neutral-100' : 'text-neutral-800'
                  }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Dedicated spotlight &amp; X shoutout</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${
                    isDark ? 'text-neutral-100' : 'text-neutral-800'
                  }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Featured sponsor card &amp; README logo</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${
                    isDark ? 'text-neutral-100' : 'text-neutral-800'
                  }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Category placement &amp; sponsors page</span>
                </div>
              </div>
            </motion.div>

            {/* Gold Tier */}
            <motion.div
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                triggerHaptic?.('medium');
                if (onOpenSponsorForm) {
                  onOpenSponsorForm({ tier: 'gold', placement: 'gold-slot' });
                } else {
                  openCheckout(SPONSOR_TIERS[1].checkoutUrl);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerHaptic?.('medium');
                  if (onOpenSponsorForm) {
                    onOpenSponsorForm({ tier: 'gold', placement: 'gold-slot' });
                  } else {
                    openCheckout(SPONSOR_TIERS[1].checkoutUrl);
                  }
                }
              }}
              className={`relative text-left grid grid-rows-[22px_auto_auto_1fr] rounded-[16px] px-5 pt-[18px] pb-5 cursor-pointer focus:outline-none group select-none border-0 transition-colors duration-200 ${isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-white/40'
                : 'bg-white hover:bg-neutral-50/80 border border-neutral-200 outline outline-neutral-200 hover:outline-neutral-300 focus-visible:outline-neutral-400'
                }`}
            >
              {/* Row 1 is the name row, exactly 22px */}
              <div className="h-[22px] flex items-center">
                <span
                  className={`text-[16px] leading-[22px] font-medium m-0 ${isDark ? 'text-neutral-50' : 'text-neutral-900'
                    }`}
                >
                  Gold
                </span>
              </div>

              {/* Row 2 is the price, mt-3.5 */}
              <div className="flex items-baseline gap-1.5 mt-3.5">
                <span
                  className={`text-[36px] leading-[43px] font-bold tracking-[-1.44px] font-sans ${isDark ? 'text-neutral-100' : 'text-neutral-900'
                    }`}
                >
                  $150
                </span>
                <span
                  className={`text-[16px] leading-[22px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                >
                  / month
                </span>
              </div>

              {/* Row 3 is the button, mt-6, h-10 w-full rounded-[9px] */}
              <div
                className={`mt-6 w-full h-10 rounded-[9px] font-medium text-sm transition-colors flex items-center justify-center select-none ${isDark
                  ? 'bg-white/[0.08] group-hover:bg-white/[0.12] text-neutral-100'
                  : 'bg-neutral-100 group-hover:bg-neutral-200 text-neutral-900'
                  }`}
              >
                Select Gold
              </div>

              {/* Row 4 is the checks, mt-7, gap 10px, 15/22 medium */}
              <div className="mt-7 flex flex-col gap-2.5">
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-800'
                    }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Featured sponsor card &amp; category placement</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-800'
                    }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Dedicated X shoutout</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-800'
                    }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Sponsors page &amp; README logo</span>
                </div>
              </div>
            </motion.div>

            {/* Silver Tier */}
            <motion.div
              role="button"
              tabIndex={0}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                triggerHaptic?.('medium');
                if (onOpenSponsorForm) {
                  onOpenSponsorForm({ tier: 'silver', placement: 'silver-slot' });
                } else {
                  openCheckout(SPONSOR_TIERS[2].checkoutUrl);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerHaptic?.('medium');
                  if (onOpenSponsorForm) {
                    onOpenSponsorForm({ tier: 'silver', placement: 'silver-slot' });
                  } else {
                    openCheckout(SPONSOR_TIERS[2].checkoutUrl);
                  }
                }
              }}
              className={`relative text-left grid grid-rows-[22px_auto_auto_1fr] rounded-[16px] px-5 pt-[18px] pb-5 cursor-pointer focus:outline-none group select-none border-0 transition-colors duration-200 ${isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-white/40'
                : 'bg-white hover:bg-neutral-50/80 border border-neutral-200 outline outline-neutral-200 hover:outline-neutral-300 focus-visible:outline-neutral-400'
                }`}
            >
              {/* Row 1 is the name row, exactly 22px */}
              <div className="h-[22px] flex items-center">
                <span
                  className={`text-[16px] leading-[22px] font-medium m-0 ${isDark ? 'text-neutral-50' : 'text-neutral-900'
                    }`}
                >
                  Silver
                </span>
              </div>

              {/* Row 2 is the price, mt-3.5 */}
              <div className="flex items-baseline gap-1.5 mt-3.5">
                <span
                  className={`text-[36px] leading-[43px] font-bold tracking-[-1.44px] font-sans ${isDark ? 'text-neutral-100' : 'text-neutral-900'
                    }`}
                >
                  $99
                </span>
                <span
                  className={`text-[16px] leading-[22px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                    }`}
                >
                  / month
                </span>
              </div>

              {/* Row 3 is the button, mt-6, h-10 w-full rounded-[9px] */}
              <div
                className={`mt-6 w-full h-10 rounded-[9px] font-medium text-sm transition-colors flex items-center justify-center select-none ${isDark
                  ? 'bg-white/[0.08] group-hover:bg-white/[0.12] text-neutral-100'
                  : 'bg-neutral-100 group-hover:bg-neutral-200 text-neutral-900'
                  }`}
              >
                Select Silver
              </div>

              {/* Row 4 is the checks, mt-7, gap 10px, 15/22 medium */}
              <div className="mt-7 flex flex-col gap-2.5">
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-800'
                    }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Sponsors page &amp; README logo</span>
                </div>
                <div
                  className={`flex items-center gap-2.5 text-[15px] leading-[22px] font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-800'
                    }`}
                >
                  <Check
                    className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#F5F5F5]' : 'text-neutral-700'}`}
                    strokeWidth={1.5}
                  />
                  <span>Category directory placement</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. Stats */}
        <section className="mt-10 w-full max-w-[1140px] mx-auto px-4 sm:px-6">
          <SponsorStats stars={stars} isDark={isDark} />
        </section>

        {/* Contact line & Polar Payments note centered under the shell */}
        <div className="mt-8 flex flex-col items-center justify-center gap-2.5 text-center text-[14px]">
          <div
            className={`flex flex-wrap items-center justify-center gap-1.5 text-[13px] ${isDark ? 'text-white/40' : 'text-neutral-500'
              }`}
          >
            <span>Payment is handled by Polar Payments. Questions?</span>
            <a
              href="mailto:subhanprsnl@gmail.com"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic?.('light');
              }}
              className={`font-medium underline underline-offset-4 transition-colors ${isDark
                ? 'text-white/70 hover:text-white decoration-white/20 hover:decoration-white/50'
                : 'text-neutral-700 hover:text-black decoration-neutral-300 hover:decoration-neutral-600'
                }`}
            >
              subhanprsnl@gmail.com
            </a>
          </div>
          <div
            className={`flex flex-wrap items-center justify-center gap-2 ${isDark ? 'text-white/45' : 'text-neutral-500'
              }`}
          >
            <span>Questions, custom packages, or partnerships?</span>
            <a
              href="https://x.com/SubhanHQ"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic?.('light');
              }}
              className={`font-medium underline underline-offset-4 transition-colors ${isDark
                ? 'text-white/70 hover:text-white decoration-white/20 hover:decoration-white/50'
                : 'text-neutral-700 hover:text-black decoration-neutral-300 hover:decoration-neutral-600'
                }`}
            >
              DM on X
            </a>
            <span className={`select-none ${isDark ? 'text-white/20' : 'text-neutral-300'}`}>·</span>
            <a
              href="mailto:subhanprsnl@gmail.com"
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic?.('light');
              }}
              className={`font-medium underline underline-offset-4 transition-colors ${isDark
                ? 'text-white/70 hover:text-white decoration-white/20 hover:decoration-white/50'
                : 'text-neutral-700 hover:text-black decoration-neutral-300 hover:decoration-neutral-600'
                }`}
            >
              Mail
            </a>
          </div>


        </div>
      </section>

      {/* 5. Groups list & cards (Table style on mobile, 3-column Hero cards on desktop) */}
      <section className="mt-20 mb-24 w-full max-w-[640px] md:max-w-[1020px] lg:max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Mobile View: Clean compact table list style */}
        <div className="flex md:hidden flex-col gap-[28px]">
          {/* Group 1: Backed by */}
          <div>
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Backed by
            </div>
            <div>
              <a
                href="https://vercel.com/oss"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                className={`flex items-center gap-3 py-3.5 border-t last:border-b no-underline group ${isDark
                  ? 'border-white/[0.04] last:border-b-white/[0.04]'
                  : 'border-black/[0.06] last:border-b-black/[0.06]'
                  }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 76 65"
                    fill="currentColor"
                    className={`w-5 h-5 shrink-0 ${isDark ? 'text-white' : 'text-neutral-900'}`}
                  >
                    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                  </svg>
                </div>
                <span
                  className={`text-[16px] leading-[22px] font-medium transition-colors shrink-0 ${isDark
                    ? 'text-neutral-100 group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Vercel
                </span>
                <span
                  className={`ml-auto text-right text-[14px] leading-[20px] ${isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}
                >
                  Open-source program.
                </span>
              </a>

              <a
                href="https://mintlify.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                className={`flex items-center gap-3 py-3.5 border-t last:border-b no-underline group ${isDark
                  ? 'border-white/[0.04] last:border-b-white/[0.04]'
                  : 'border-black/[0.06] last:border-b-black/[0.06]'
                  }`}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center shrink-0 ${isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                >
                  <svg viewBox="74 30.5 40 40" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path
                      fillOpacity="0.85"
                      d="M104.73 46.01v-9.49c0-1.02-.82-1.83-1.82-1.83H93.44c-1.49 0-2.96.29-4.33.86a11.2 11.2 0 0 0-3.67 2.46l-.07.07a11.2 11.2 0 0 0-2.87 5.06 11.6 11.6 0 0 1 2.75-.37c2.47-.03 4.9.77 6.87 2.26A11.16 11.16 0 0 1 96 50.3c.77 2.14.85 4.47.28 6.67a11.26 11.26 0 0 0 5.05-2.88l.07-.07a11.5 11.5 0 0 0 2.46-3.67c.57-1.37.85-2.85.85-4.34z"
                    />
                    <path d="M82.22 45.85a11.24 11.24 0 0 1 3.21-7.79l-7.87 7.89c-.03.03-.06.04-.09.07a11.24 11.24 0 0 0-3.27 7.17 11.3 11.3 0 0 1 1.89 7.11c.14.2.5.27.7.07l4.82-4.82c1.51-1.51 1.98-3.76 1.26-5.78a11.2 11.2 0 0 1-.66-3.94M101.36 54.02a11.27 11.27 0 0 1-5.45 2.97 11.3 11.3 0 0 1-6.2-.38h-.03c-2.01-.72-4.25-.25-5.76 1.25l-4.82 4.82a.45.45 0 0 0 .07.7 11.32 11.32 0 0 0 7.1 1.9A11.22 11.22 0 0 0 93.41 62l.07-.07 7.87-7.89z" />
                  </svg>
                </div>
                <span
                  className={`text-[16px] leading-[22px] font-medium transition-colors shrink-0 ${isDark
                    ? 'text-neutral-100 group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Mintlify
                </span>
                <span
                  className={`ml-auto text-right text-[14px] leading-[20px] ${isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}
                >
                  Open-source program.
                </span>
              </a>
            </div>
          </div>

          {/* Group 2: Listed in */}
          <div>
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Listed in
            </div>
            <div>
              <a
                href="http://ui.shadcn.com/docs/directory?q=amicro"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                className={`flex items-center gap-3 py-3.5 border-t last:border-b no-underline group ${isDark
                  ? 'border-white/[0.04] last:border-b-white/[0.04]'
                  : 'border-black/[0.06] last:border-b-black/[0.06]'
                  }`}
              >
                <div
                  className={`w-5 h-5 flex items-center justify-center shrink-0 ${isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                >
                  <svg viewBox="0 0 256 256" className="w-5 h-5 shrink-0" fill="none">
                    <line
                      x1="208"
                      y1="128"
                      x2="128"
                      y2="208"
                      stroke="currentColor"
                      strokeWidth="26"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="192"
                      y1="40"
                      x2="40"
                      y2="192"
                      stroke="currentColor"
                      strokeWidth="26"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  className={`text-[16px] leading-[22px] font-medium transition-colors shrink-0 ${isDark
                    ? 'text-neutral-100 group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  shadcn/ui
                </span>
                <span
                  className={`ml-auto text-right text-[14px] leading-[20px] ${isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}
                >
                  Registry listing.
                </span>
              </a>

              <a
                href="https://ossium.in/home/repos/Subhan-code/Amicro--Micro-transitions-"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                className={`flex items-center gap-3 py-3.5 border-t last:border-b no-underline group ${isDark
                  ? 'border-white/[0.04] last:border-b-white/[0.04]'
                  : 'border-black/[0.06] last:border-b-black/[0.06]'
                  }`}
              >
                <div className="w-5 h-5 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src="https://ossium.in/_next/image?url=%2Fossium_logo.webp&w=256&q=75"
                    alt="Ossium"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span
                  className={`text-[16px] leading-[22px] font-medium transition-colors shrink-0 ${isDark
                    ? 'text-neutral-100 group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Ossium
                </span>
                <span
                  className={`ml-auto text-right text-[14px] leading-[20px] ${isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}
                >
                  Directory listing.
                </span>
              </a>
            </div>
          </div>

          {/* Group 3: Analytics */}
          <div>
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Analytics
            </div>
            <div>
              <a
                href="https://tracwell.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic?.('light')}
                className={`flex items-center gap-3 py-3.5 border-t last:border-b no-underline group ${isDark
                  ? 'border-white/[0.04] last:border-b-white/[0.04]'
                  : 'border-black/[0.06] last:border-b-black/[0.06]'
                  }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <img
                    src="https://tracwell.app/brand/downloads/tracwell-icon-dark.svg"
                    alt="Tracwell"
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span
                  className={`text-[16px] leading-[22px] font-medium transition-colors shrink-0 ${isDark
                    ? 'text-neutral-100 group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Tracwell
                </span>
                <span
                  className={`ml-auto text-right text-[14px] leading-[20px] ${isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}
                >
                  Visitor analytics.
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop View: 3 Columns with Maple-style Cards */}
        <div className="hidden md:grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {/* Column 1: Backed by */}
          <div className="flex flex-col gap-3.5">
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 text-center select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Backed by
            </div>

            {/* Vercel Card */}
            <motion.a
              href="https://vercel.com/oss"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`group relative w-full min-h-[124px] sm:min-h-[132px] rounded-[16px] flex flex-col items-center justify-between py-3.5 px-4 sm:py-4 sm:px-5 text-center no-underline transition-all duration-200 ${isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] hover:outline-white/10 hover:bg-[#181716]'
                : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:bg-neutral-50/50'
                }`}
            >
              <div className="flex-1 w-full flex items-center justify-center gap-3.5 my-auto">
                <svg
                  viewBox="0 0 76 65"
                  fill="currentColor"
                  className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                >
                  <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                </svg>
                <span
                  className={`text-[22px] sm:text-[25px] font-bold tracking-[-0.035em] transition-colors ${isDark
                    ? 'text-[#F5F2EC] group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Vercel
                </span>
              </div>
              <p
                className={`text-[12px] sm:text-[13px] leading-[18px] font-medium text-center max-w-[260px] transition-colors pb-0.5 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}
              >
                Open-source program.
              </p>
            </motion.a>

            {/* Mintlify Card */}
            <motion.a
              href="https://mintlify.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`group relative w-full min-h-[124px] sm:min-h-[132px] rounded-[16px] flex flex-col items-center justify-between py-3.5 px-4 sm:py-4 sm:px-5 text-center no-underline transition-all duration-200 ${isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] hover:outline-white/10 hover:bg-[#181716]'
                : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:bg-neutral-50/50'
                }`}
            >
              <div className="flex-1 w-full flex items-center justify-center gap-3.5 my-auto">
                <svg
                  viewBox="74 30.5 40 40"
                  fill="currentColor"
                  className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                >
                  <path
                    fillOpacity="0.85"
                    d="M104.73 46.01v-9.49c0-1.02-.82-1.83-1.82-1.83H93.44c-1.49 0-2.96.29-4.33.86a11.2 11.2 0 0 0-3.67 2.46l-.07.07a11.2 11.2 0 0 0-2.87 5.06 11.6 11.6 0 0 1 2.75-.37c2.47-.03 4.9.77 6.87 2.26A11.16 11.16 0 0 1 96 50.3c.77 2.14.85 4.47.28 6.67a11.26 11.26 0 0 0 5.05-2.88l.07-.07a11.5 11.5 0 0 0 2.46-3.67c.57-1.37.85-2.85.85-4.34z"
                  />
                  <path d="M82.22 45.85a11.24 11.24 0 0 1 3.21-7.79l-7.87 7.89c-.03.03-.06.04-.09.07a11.24 11.24 0 0 0-3.27 7.17 11.3 11.3 0 0 1 1.89 7.11c.14.2.5.27.7.07l4.82-4.82c1.51-1.51 1.98-3.76 1.26-5.78a11.2 11.2 0 0 1-.66-3.94M101.36 54.02a11.27 11.27 0 0 1-5.45 2.97 11.3 11.3 0 0 1-6.2-.38h-.03c-2.01-.72-4.25-.25-5.76 1.25l-4.82 4.82a.45.45 0 0 0 .07.7 11.32 11.32 0 0 0 7.1 1.9A11.22 11.22 0 0 0 93.41 62l.07-.07 7.87-7.89z" />
                </svg>
                <span
                  className={`text-[22px] sm:text-[25px] font-bold tracking-[-0.035em] transition-colors ${isDark
                    ? 'text-[#F5F2EC] group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Mintlify
                </span>
              </div>
              <p
                className={`text-[12px] sm:text-[13px] leading-[18px] font-medium text-center max-w-[260px] transition-colors pb-0.5 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}
              >
                Open-source program.
              </p>
            </motion.a>
          </div>

          {/* Column 2: Listed in */}
          <div className="flex flex-col gap-3.5">
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 text-center select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Listed in
            </div>

            {/* shadcn/ui Card */}
            <motion.a
              href="http://ui.shadcn.com/docs/directory?q=amicro"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`group relative w-full min-h-[124px] sm:min-h-[132px] rounded-[16px] flex flex-col items-center justify-between py-3.5 px-4 sm:py-4 sm:px-5 text-center no-underline transition-all duration-200 ${isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] hover:outline-white/10 hover:bg-[#181716]'
                : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:bg-neutral-50/50'
                }`}
            >
              <div className="flex-1 w-full flex items-center justify-center gap-3.5 my-auto">
                <svg
                  viewBox="0 0 256 256"
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  fill="none"
                >
                  <line
                    x1="208"
                    y1="128"
                    x2="128"
                    y2="208"
                    stroke="currentColor"
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="192"
                    y1="40"
                    x2="40"
                    y2="192"
                    stroke="currentColor"
                    strokeWidth="26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className={`text-[22px] sm:text-[25px] font-bold tracking-[-0.035em] transition-colors ${isDark
                    ? 'text-[#F5F2EC] group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  shadcn/ui
                </span>
              </div>
              <p
                className={`text-[12px] sm:text-[13px] leading-[18px] font-medium text-center max-w-[260px] transition-colors pb-0.5 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}
              >
                Featured as Trusted Registry.
              </p>
            </motion.a>

            {/* Ossium Card */}
            <motion.a
              href="https://ossium.in/home/repos/Subhan-code/Amicro--Micro-transitions-"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`group relative w-full min-h-[124px] sm:min-h-[132px] rounded-[16px] flex flex-col items-center justify-between py-3.5 px-4 sm:py-4 sm:px-5 text-center no-underline transition-all duration-200 ${isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] hover:outline-white/10 hover:bg-[#181716]'
                : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:bg-neutral-50/50'
                }`}
            >
              <div className="flex-1 w-full flex items-center justify-center gap-3.5 my-auto">
                <img
                  src="https://ossium.in/_next/image?url=%2Fossium_logo.webp&w=256&q=75"
                  alt="Ossium"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 rounded-md transition-transform duration-200 group-hover:scale-105"
                />
                <span
                  className={`text-[22px] sm:text-[25px] font-bold tracking-[-0.035em] transition-colors ${isDark
                    ? 'text-[#F5F2EC] group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Ossium
                </span>
              </div>
              <p
                className={`text-[12px] sm:text-[13px] leading-[18px] font-medium text-center max-w-[260px] transition-colors pb-0.5 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}
              >
                Directory listing.
              </p>
            </motion.a>
          </div>

          {/* Column 3: Analytics */}
          <div className="flex flex-col gap-3.5">
            <div
              className={`text-[13px] leading-[18px] font-medium mb-1 text-center select-none ${isDark ? 'text-white/35' : 'text-neutral-500'
                }`}
            >
              Analytics
            </div>

            {/* Tracwell Card */}
            <motion.a
              href="https://tracwell.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic?.('light')}
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 450, damping: 25 }}
              className={`group relative w-full min-h-[124px] sm:min-h-[132px] rounded-[16px] flex flex-col items-center justify-between py-3.5 px-4 sm:py-4 sm:px-5 text-center no-underline transition-all duration-200 ${isDark
                ? 'bg-[#141312] outline -outline-offset-1 outline-white/[0.03] hover:outline-white/10 hover:bg-[#181716]'
                : 'bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs hover:bg-neutral-50/50'
                }`}
            >
              <div className="flex-1 w-full flex items-center justify-center gap-3.5 my-auto">
                <img
                  src="https://tracwell.app/brand/downloads/tracwell-icon-dark.svg"
                  alt="Tracwell"
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                <span
                  className={`text-[22px] sm:text-[25px] font-bold tracking-[-0.035em] transition-colors ${isDark
                    ? 'text-[#F5F2EC] group-hover:text-white'
                    : 'text-neutral-900 group-hover:text-black'
                    }`}
                >
                  Tracwell
                </span>
              </div>
              <p
                className={`text-[12px] sm:text-[13px] leading-[18px] font-medium text-center max-w-[260px] transition-colors pb-0.5 ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-neutral-500 group-hover:text-neutral-700'
                  }`}
              >
                Visitor analytics.
              </p>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}
