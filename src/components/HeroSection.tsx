import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AnimatedStarCounter } from './AnimatedStarCounter';
import { DiaTextReveal, BLUE_SHADES_PALETTE } from './DiaTextReveal';


interface HeroSectionProps {
  theme: 'dark' | 'light';
  stars: number | null;
  onBrowseComponents: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export function HeroSection({
  theme,
  stars,
  onBrowseComponents,
  triggerHaptic,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle mouse tracking physics for headline
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const headlineRotateX = useTransform(smoothY, [-0.5, 0.5], [1.5, -1.5]);
  const headlineRotateY = useTransform(smoothX, [-0.5, 0.5], [-2, 2]);
  const headlineX = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const headlineY = useTransform(smoothY, [-0.5, 0.5], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const words = [
    { text: 'Small', trailing: ' ' },
    { text: 'motion.', trailing: ' ' },
    { text: 'Big', trailing: ' ' },
    { text: 'difference.', trailing: '' },
  ];

  const displayStars = stars !== null ? stars.toLocaleString('en-US') : '2,492';

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 flex flex-col items-start text-left sm:items-center sm:text-center select-none"
    >
      {/* Eyebrow: Backed by Vercel OSS Program - Increased Size */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 sm:mb-8 inline-flex items-center self-start sm:self-auto"
      >
        <motion.a
          href="https://vercel.com/oss"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic?.('light')}
          whileHover={{ y: -1.5, scale: 1.025 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 450, damping: 24 }}
          className={`group inline-flex items-center gap-2.5 py-1.5 sm:py-2 px-4 sm:px-5 rounded-full border transition-all duration-200 no-underline cursor-pointer ${
            theme === 'dark'
              ? 'bg-[#121214] border-white/[0.1] hover:border-white/[0.22] text-neutral-200 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.4)]'
              : 'bg-white border-neutral-200/90 hover:border-neutral-300 text-neutral-800 hover:text-black shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
          }`}
        >
          {/* Vercel icon */}
          <span className="flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 76 65" fill="currentColor" className="w-full h-full block">
              <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
            </svg>
          </span>
          <span className="tracking-tight text-[13px] sm:text-[13.5px] font-medium">
            Backed by Vercel OSS Program
          </span>
        </motion.a>
      </motion.div>

      {/* Main Headline with Micro Spring Physics */}
      <motion.div
        style={{
          x: headlineX,
          y: headlineY,
          rotateX: headlineRotateX,
          rotateY: headlineRotateY,
          transformPerspective: 1000,
        }}
        className="relative w-full"
      >
        <h1
          className={`text-[36px] sm:text-[54px] lg:text-[66px] font-semibold tracking-[-0.035em] leading-[1.08] mb-4 sm:mb-5 max-w-4xl text-left sm:text-center sm:mx-auto transition-colors duration-300 ${
            theme === 'dark' ? 'text-[#ededed]' : 'text-[#0a0a0c]'
          }`}
        >
          <span className="block sm:inline">
            <DiaTextReveal
              text="Small motion."
              textColor={theme === 'dark' ? '#ededed' : '#0a0a0c'}
              colors={BLUE_SHADES_PALETTE}
              duration={1.6}
              delay={0.1}
            />
          </span>{' '}
          <span className="block sm:inline">
            <DiaTextReveal
              text="Big difference."
              textColor={theme === 'dark' ? '#ededed' : '#0a0a0c'}
              colors={BLUE_SHADES_PALETTE}
              duration={1.6}
              delay={0.35}
            />
          </span>
        </h1>
      </motion.div>

      {/* Supporting Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className={`text-[15px] sm:text-[17px] leading-[25px] sm:leading-[27px] max-w-[560px] text-left sm:text-center sm:mx-auto font-normal tracking-[-0.012em] transition-colors duration-300 ${
          theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
        }`}
      >
        160+ copy-paste React components for motion, transitions &amp; UI effects.
      </motion.p>

      {/* Hero CTAs: Primary Explore Components, Secondary GitHub */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-row items-center justify-start sm:justify-center gap-2 sm:gap-3.5 mt-8 sm:mt-10 w-full max-w-md px-0 sm:px-2"
      >
        {/* Primary CTA: Explore Components with Micro-Spring (Rectangle with rounded corners) */}
        <motion.button
          type="button"
          onClick={() => {
            triggerHaptic?.('light');
            onBrowseComponents();
          }}
          initial="initial"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          variants={{
            initial: { y: 0, scale: 1 },
            hover: {
              y: -2,
              scale: 1.02,
              transition: { type: 'spring', stiffness: 450, damping: 22 },
            },
          }}
          className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2.5 h-[40px] px-3.5 sm:px-5 rounded-xl sm:rounded-xl text-[12px] sm:text-[13.5px] font-semibold border border-transparent cursor-pointer transition-colors duration-200 shadow-xs shrink-0 whitespace-nowrap ${
            theme === 'dark'
              ? 'bg-[#ededed] text-[#08080a] hover:bg-white'
              : 'bg-[#09090b] text-white hover:bg-neutral-800'
          }`}
        >
          <motion.div
            variants={{
              initial: { rotate: 0, scale: 1 },
              hover: { rotate: [0, -10, 10, -5, 0], scale: 1.15 },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center shrink-0"
          >
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] block shrink-0" fill="currentColor" aria-hidden="true">
              <mask id="hero-browse-components-mask">
                <rect width="24" height="24" rx="6.5" fill="white" />
                <rect x="5.5" y="6" width="7" height="2.5" rx="1.25" fill="black" />
                <rect x="5.5" y="10.75" width="13" height="2.5" rx="1.25" fill="black" />
                <rect x="5.5" y="15.5" width="7" height="2.5" rx="1.25" fill="black" />
              </mask>
              <rect width="24" height="24" rx="6.5" mask="url(#hero-browse-components-mask)" fill="currentColor" />
            </svg>
          </motion.div>
          <span>Explore Components</span>
        </motion.button>

        {/* Secondary CTA: GitHub Repo with Animated Stars and Steady Hairline Border */}
        <motion.a
          href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => triggerHaptic?.('medium')}
          initial="initial"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          variants={{
            initial: { y: 0, scale: 1 },
            hover: {
              y: -2,
              scale: 1.02,
              transition: { type: 'spring', stiffness: 450, damping: 22 },
            },
          }}
          className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2.5 h-[40px] px-3 sm:px-4 rounded-xl sm:rounded-xl text-[12px] sm:text-[13.5px] font-medium no-underline cursor-pointer border transition-colors duration-200 shadow-xs shrink-0 whitespace-nowrap ${
            theme === 'dark'
              ? 'bg-[#121214] border-white/[0.1] hover:bg-[#18181c] text-[#ededed]'
              : 'bg-white border-neutral-200/90 hover:bg-neutral-50 text-neutral-900'
          }`}
        >
          {/* GitHub SVG with interactive hover physics */}
          <motion.div
            variants={{
              initial: { rotate: 0, scale: 1 },
              hover: { rotate: [0, -8, 8, 0], scale: 1.15 },
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center shrink-0"
          >
            <svg
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 shrink-0 block"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                transform="scale(64)"
                fill={theme === 'dark' ? '#ededed' : '#181717'}
              />
            </svg>
          </motion.div>
          <span>GitHub Repo</span>
          {/* Animated star roll pill */}
          <span
            className={`text-[12px] font-semibold tracking-[-0.02em] px-2 py-0.5 rounded-full ml-0.5 ${
              theme === 'dark'
                ? 'bg-white/[0.08] text-white border border-white/8'
                : 'bg-black/[0.05] text-neutral-900 border border-black/[0.06]'
            }`}
          >
            <AnimatedStarCounter value={stars} fallback={2492} />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}
