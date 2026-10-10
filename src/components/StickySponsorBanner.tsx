import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MapleLogo } from './MapleLogo';

export interface StickySponsorItem {
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

interface StickySponsorBannerProps {
  sponsors: StickySponsorItem[];
  checkoutUrl: string;
  onNavigateSponsors?: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

const SLIDE_DURATION_MS = 4500;

export function StickySponsorBanner({
  sponsors,
  checkoutUrl,
  onNavigateSponsors,
  triggerHaptic,
}: StickySponsorBannerProps) {
  // Always visible on page load
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Active sponsors
  const activeSponsors = useMemo(
    () => sponsors.filter((s) => !s.isAvailable),
    [sponsors]
  );

  // Slides:
  // Slide 0: Active sponsor ad
  // Slide 1: Value sponsor open slide with fluid morph & blur hover transition
  const slides = useMemo(() => {
    const list: Array<{ type: 'sponsor'; data: StickySponsorItem } | { type: 'tiers-info' }> = [];

    if (activeSponsors.length > 0) {
      activeSponsors.forEach((sponsor) => {
        list.push({ type: 'sponsor', data: sponsor });
      });
    } else {
      list.push({
        type: 'sponsor',
        data: {
          id: 1,
          companyName: 'Maple',
          description: 'Open-source observability for AI, fast traces, logs, and metrics.',
          logoType: 'maple',
          siteUrl: 'https://maple.dev/',
          isAvailable: false,
        },
      });
    }

    list.push({ type: 'tiers-info' });
    return list;
  }, [activeSponsors]);

  // Timer: advances slide every SLIDE_DURATION_MS, pauses on hover
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(SLIDE_DURATION_MS);
  const startTimeRef = useRef<number>(Date.now());

  const startTimer = useCallback((duration: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    remainingTimeRef.current = duration;

    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      startTimer(SLIDE_DURATION_MS);
    }, duration);
  }, [slides.length]);

  useEffect(() => {
    if (isDismissed || slides.length <= 1) return;

    if (!isHovered) {
      startTimer(remainingTimeRef.current);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(200, remainingTimeRef.current - elapsed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDismissed, isHovered, slides.length, currentSlide, startTimer]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic?.('light');
    setIsDismissed(true);
  };

  const handleSelectSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic?.('light');
    setCurrentSlide(index);
    remainingTimeRef.current = SLIDE_DURATION_MS;
    if (!isHovered) {
      startTimer(SLIDE_DURATION_MS);
    }
  };

  const handleTiersAction = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic?.('medium');
    if (onNavigateSponsors) {
      onNavigateSponsors();
    } else {
      window.open('/sponsors', '_self');
    }
  };

  if (isDismissed) return null;

  const currentItem = slides[currentSlide] || slides[0];

  return (
    <>
      <style>{`
        @keyframes amicroVerticalDotnavProgress {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
      `}</style>

      <div
        className="fixed bottom-3 inset-x-0 mx-auto sm:inset-x-auto sm:bottom-5 sm:right-5 z-40 select-none font-sans group/banner flex justify-center pointer-events-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.82, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.85, filter: 'blur(12px)' }}
            transition={{ type: 'spring', stiffness: 340, damping: 24, mass: 0.8 }}
            className="pointer-events-auto relative w-[326px] max-w-[calc(100vw-24px)] sm:max-w-[calc(100vw-32px)] h-[76px] sm:h-[112px] rounded-[18px] sm:rounded-[22px] bg-[#141416]/95 backdrop-blur-xl border border-white/10 overflow-hidden"
            aria-label="Amicro Sponsor Ad Banner"
          >
            {/* Right Controls Column: Close Cross on top + Vertical Slider Progress below it */}
            <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col items-center gap-1.5 sm:gap-2 z-30 pointer-events-auto">
              {/* Minimal Close cross button */}
              <button
                type="button"
                onClick={handleDismiss}
                title="Dismiss sponsor banner"
                aria-label="Dismiss sponsor banner"
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] rounded-full bg-white/10 hover:bg-white text-zinc-400 hover:text-black active:scale-90 transition-all flex items-center justify-center cursor-pointer border-0 p-0 shadow-xs opacity-60 group-hover/banner:opacity-100"
              >
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" className="sm:w-[9px] sm:h-[9px]">
                  <path
                    d="M2 2L8 8M8 2L2 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              {/* Vertical Dotnav Slider Progress below the cross */}
              <ul
                role="tablist"
                aria-label="Sponsor gallery navigation"
                className="dotnav-items flex flex-col items-center gap-1 sm:gap-1.5 p-0 m-0 list-none"
              >
                {slides.map((_, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <li
                      key={idx}
                      role="presentation"
                      className="dotnav-item flex items-center justify-center"
                    >
                      <motion.button
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={(e) => handleSelectSlide(idx, e)}
                        animate={{
                          height: isActive ? 18 : 5,
                          width: 4,
                          opacity: isActive ? 1 : 0.35,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 28,
                        }}
                        className="rounded-full relative overflow-hidden bg-white/25 cursor-pointer p-0 border-0 focus:outline-none"
                      >
                        {isActive && (
                          <div
                            key={`progress-${currentSlide}`}
                            className="absolute inset-0 bg-white origin-top rounded-full"
                            style={{
                              animation: `amicroVerticalDotnavProgress ${SLIDE_DURATION_MS}ms linear forwards`,
                              animationPlayState: isHovered ? 'paused' : 'running',
                            }}
                          />
                        )}
                      </motion.button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Slide Content Area: Fully centered vertically utilizing card height */}
            <div className="h-full pl-3.5 sm:pl-4 pr-8 sm:pr-10 flex items-center">
              <AnimatePresence mode="wait">
                {currentItem.type === 'sponsor' ? (
                  <motion.div
                    key={`sponsor-${currentItem.data.id}-${currentSlide}`}
                    initial={{ opacity: 0, filter: 'blur(4px)', y: 3 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', y: -3 }}
                    transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                    className="w-full"
                  >
                    <a
                      href={currentItem.data.siteUrl || 'https://maple.dev/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerHaptic?.('light')}
                      className="flex items-center gap-2.5 sm:gap-3 w-full group/ad no-underline text-inherit cursor-pointer"
                    >
                      {/* Left: Sponsor Logo */}
                      <div className="shrink-0 flex items-center justify-center">
                        {currentItem.data.logoType === 'maple' ||
                        currentItem.data.companyName.toLowerCase() === 'maple' ? (
                          <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center shrink-0 group-hover/ad:scale-105 transition-transform duration-200">
                            <MapleLogo className="w-7 h-7 sm:w-8.5 sm:h-8.5 shrink-0" />
                          </div>
                        ) : currentItem.data.logoUrl ? (
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/10 shrink-0 overflow-hidden">
                            <img src={currentItem.data.logoUrl} alt={currentItem.data.companyName} className="w-full h-full object-contain p-1" />
                          </div>
                        ) : (
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/10 shrink-0 font-bold text-xs text-white">
                            {currentItem.data.companyName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Right: Name + Sponsor Badge (right edge on desktop) + Description */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 sm:gap-1">
                        {/* Top row: Name on left + Sponsor Badge on right edge */}
                        <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full">
                          <span className="text-[14px] sm:text-[16px] font-bold text-white tracking-tight leading-none truncate group-hover/ad:text-neutral-200 transition-colors">
                            {currentItem.data.companyName}
                          </span>

                          <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10 leading-none shrink-0 sm:ml-auto">
                            SPONSOR
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] sm:text-[11px] leading-[13px] sm:leading-[15px] text-zinc-400 line-clamp-1 sm:line-clamp-2 m-0 group-hover/ad:text-zinc-200 transition-colors">
                          {currentItem.data.description}
                        </p>
                      </div>
                    </a>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`tiers-${currentSlide}`}
                    initial={{ opacity: 0, filter: 'blur(4px)', y: 3 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    exit={{ opacity: 0, filter: 'blur(4px)', y: -3 }}
                    transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                    className="w-full h-full flex items-center"
                    onClick={handleTiersAction}
                  >
                    <div className="w-full cursor-pointer">
                      <AnimatePresence mode="wait">
                        {!isHovered ? (
                          <motion.div
                            key="tier-default"
                            initial={{ opacity: 0, filter: 'blur(4px)', y: 2 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(4px)', y: -2 }}
                            transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                              <span className="text-[13.5px] sm:text-[15px] font-semibold text-white tracking-tight leading-tight">
                                Sponsor Amicro
                              </span>
                              <span className="text-[10px] sm:text-[11px] text-zinc-400 leading-snug line-clamp-1">
                                Showcase your tool to frontend creators.
                              </span>
                            </div>

                            {/* Minimal Tag that morphs into button on hover */}
                            <motion.div
                              layoutId="sponsor-action-morph"
                              transition={{ type: 'spring', stiffness: 550, damping: 28 }}
                              className="shrink-0 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-white/[0.08] border border-white/10 text-[9.5px] sm:text-[10.5px] font-medium text-zinc-300 shadow-xs"
                            >
                              <span>Open</span>
                            </motion.div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="tier-hovered"
                            initial={{ opacity: 0, filter: 'blur(4px)', y: 2 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(4px)', y: -2 }}
                            transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                              <span className="text-[13.5px] sm:text-[15px] font-semibold text-white tracking-tight leading-tight">
                                Partner with Amicro
                              </span>
                              <span className="text-[9.5px] sm:text-[10.5px] text-zinc-400 font-mono tracking-tight leading-snug">
                                Diamond • Gold • Silver
                              </span>
                            </div>

                            {/* Fast Morphed Button (no arrow) */}
                            <motion.div
                              layoutId="sponsor-action-morph"
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              transition={{ type: 'spring', stiffness: 550, damping: 28 }}
                              className="shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-semibold shadow-md hover:bg-neutral-100 transition-colors"
                            >
                              <span>View Tiers</span>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </AnimatePresence>
      </div>
    </>
  );
}
