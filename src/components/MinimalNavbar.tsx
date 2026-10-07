import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { AnimatedStarCounter } from './AnimatedStarCounter';
import { MobileMenuOverlay } from './MobileMenuOverlay';

export type NavItemKey = 'components' | 'anime' | 'cli' | 'skills' | 'blogs' | 'sponsors';

interface MinimalNavbarProps {
  theme: 'dark' | 'light';
  activeItem: NavItemKey;
  isScrolled: boolean;
  stars: number | null;
  mobileMenuOpen: boolean;
  onSelectNav: (key: NavItemKey) => void;
  onNavigateHome: () => void;
  onToggleTheme: () => void;
  onToggleMobileMenu: () => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
  onBack?: () => void;
}

export function MinimalNavbar({
  theme,
  activeItem,
  isScrolled,
  stars,
  mobileMenuOpen,
  onSelectNav,
  onNavigateHome,
  onToggleTheme,
  onToggleMobileMenu,
  triggerHaptic,
  onBack,
}: MinimalNavbarProps) {
  const [hoveredNav, setHoveredNav] = useState<NavItemKey | null>(null);

  const setActiveItem = (key: NavItemKey) => {
    triggerHaptic?.('light');
    onSelectNav(key);
  };

  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('nav[aria-label="Main Navigation"] a');
      if (target && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
        e.preventDefault();
      }
    };
    document.addEventListener('click', handleNavClick);
    return () => document.removeEventListener('click', handleNavClick);
  }, []);

  const navItems: { key: NavItemKey; label: string; href: string }[] = [
    { key: 'components', label: 'Components', href: '/buttons' },
    { key: 'cli', label: 'CLI', href: '/cli' },
    { key: 'skills', label: 'Skills', href: '/skills' },
    { key: 'blogs', label: 'Blogs', href: '/blog' },
    { key: 'sponsors', label: 'Sponsors', href: '/sponsors' },
  ];

  return (
    <>
      {/* Morphic-inspired Linear Blur Layer: Fixed behind navbar, feathers out downwards */}
      {!onBack && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-40 h-[112px] sm:h-[120px] w-full select-none"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maskImage: 'linear-gradient(to bottom, #000 40%, #0000 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 40%, #0000 100%)',
          }}
        />
      )}

      {/* Sticky Navbar (Logo, Name, GitHub Stars, Menu) with Morphic Transparent Gradient */}
      <header
        className={`sticky top-0 z-50 w-full h-16 select-none transition-colors duration-200 ${onBack
            ? 'bg-transparent border-b-0 shadow-none'
            : theme === 'dark'
              ? 'bg-gradient-to-b from-black/40 to-transparent'
              : 'bg-gradient-to-b from-white/65 to-transparent'
          }`}
      >
        <div className="relative h-full flex items-center justify-between max-w-[1240px] mx-auto px-4 sm:px-6">

          {/* Left: Back Arrow (when in component detail) + Amicro Logo + Wordmark */}
          <div className="z-20 flex items-center gap-1.5 sm:gap-2">
            {onBack && (
              <button
                type="button"
                tabIndex={0}
                id="base-ui-_R_slfmbqktb_"
                aria-label="Go back"
                title="Go back"
                onClick={(e) => {
                  e.preventDefault();
                  triggerHaptic?.('light');
                  onBack();
                }}
                className="inline-flex items-center justify-center w-7 h-7 rounded-none border-0 bg-transparent text-white/50 hover:text-white cursor-pointer shrink-0 transition-colors p-0"
              >
                <span className="inline-flex items-center justify-center">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    overflow="visible"
                    aria-hidden="true"
                    focusable="false"
                    className="transform-gpu"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </span>
              </button>
            )}

            <motion.a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  triggerHaptic?.('light');
                  onNavigateHome();
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="inline-flex items-center gap-2.5 no-underline transition-opacity duration-200 cursor-pointer select-none text-foreground hover:opacity-85"
              title="Amicro — Home"
            >
              <span className="inline-flex items-center justify-center size-6 sm:size-6.5 rounded-full overflow-hidden shrink-0 border border-white/15 dark:border-white/15 border-black/10 shadow-xs">
                <img src="/favicon.jpg" alt="Amicro" className="w-full h-full object-cover" />
              </span>
              <span className={`text-[16px] sm:text-[17px] font-semibold tracking-[-0.025em] leading-none ${theme === 'dark' ? 'text-white' : 'text-neutral-950'
                }`}>
                Amicro
              </span>
            </motion.a>
        </div>

        {/* Center: Apple-style Minimal Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center">
          <nav
            aria-label="Main Navigation"
            onMouseLeave={() => setHoveredNav(null)}
            className={`flex items-center gap-0.5 select-none rounded-full p-1 ${
              theme === "dark"
                ? "bg-black shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                : "bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
            }`}
          >
            {navItems.map((item) => {
              const isActive = activeItem === item.key;

              return (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onMouseEnter={() => setHoveredNav(item.key)}
                  onClick={() => setActiveItem(item.key)}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className={`relative px-3.5 py-1.5 text-sm font-medium leading-none cursor-pointer transition-colors duration-150 border-0 bg-transparent no-underline select-none ${
                    isActive
                      ? onBack
                        ? "text-neutral-50 font-semibold"
                        : theme === "dark"
                          ? "text-white font-semibold tracking-[-0.01em]"
                          : "text-neutral-950 font-semibold tracking-[-0.01em]"
                      : theme === "dark"
                        ? "text-white/55 hover:text-white"
                        : "text-neutral-500 hover:text-neutral-950"
                  }`}
                >
                  {/* Active Button: Dark matte pill matching Figma specs */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      initial={false}
                      className={`box-border absolute inset-0 rounded-[34px] z-0 pointer-events-none ${
                        theme === "dark"
                          ? "bg-[#171717]"
                          : "bg-white border border-black/[0.08] shadow-xs"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 24, mass: 0.7 }}
                    />
                  )}

                  {/* Hover Pill Background for inactive items */}
                  {hoveredNav === item.key && !isActive && (
                    <motion.span
                      layoutId="nav-hover"
                      className={`absolute inset-0 rounded-full z-0 pointer-events-none ${
                        theme === "dark" ? "bg-white/[0.06]" : "bg-neutral-950/[0.05]"
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.a>
              );
            })}
          </nav>
        </div>

          {/* Right: GitHub Stars, X, Theme Toggle, Mobile Hamburger */}
          <div className="z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* GitHub Button - matching active central island pill style */}
            <motion.a
              href="https://github.com/Subhan-code/Amicro--Micro-transitions-"
              target="_blank"
              rel="noopener noreferrer"
              title="Amicro on GitHub"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`group inline-flex items-center gap-1.5 sm:gap-2 h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-full text-[12px] sm:text-[12.5px] font-medium no-underline transition-colors duration-200 cursor-pointer select-none border-0 ${theme === 'dark'
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-200 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'bg-black/[0.05] hover:bg-black/[0.08] text-neutral-800 hover:text-black'
                }`}
            >
              <motion.div
                className="flex items-center shrink-0"
                whileHover={{ rotate: -12, scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
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
                    fill={theme === 'dark' ? '#ededed' : '#181717'}
                  />
                </svg>
              </motion.div>
              <span className="font-semibold tracking-[-0.02em] text-[12px] transition-colors duration-200">
                <AnimatedStarCounter value={stars} fallback={2492} />
              </span>
            </motion.a>

            {/* X / Twitter - matching active central island pill style */}
            <motion.a
              href="https://x.com/SubhanHQ"
              target="_blank"
              rel="noopener noreferrer"
              title="Syed Subhan on X"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`hidden sm:inline-flex items-center justify-center size-8 sm:size-8.5 rounded-full transition-colors duration-200 cursor-pointer select-none group border-0 ${theme === 'dark'
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-200 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'bg-black/[0.05] hover:bg-black/[0.08] text-neutral-700 hover:text-black'
                }`}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                className="flex items-center justify-center"
              >
                <svg viewBox="0 0 16 17" fill="currentColor" className="w-3 h-3">
                  <path d="M12.4041 1.39726H14.6953L9.69087 7.2591L15.5781 15.2368H10.9696L7.35741 10.3996L3.22921 15.2368H0.934687L6.28641 8.96575L0.642598 1.39726H5.36795L8.62962 5.81859L12.4041 1.39726ZM11.5992 13.8329H12.8682L4.67667 2.72798H3.31359L11.5992 13.8329Z" />
                </svg>
              </motion.div>
            </motion.a>

            {/* Theme Toggle Button - matching active central island pill style */}
            <motion.button
              type="button"
              onClick={() => {
                triggerHaptic?.('light');
                onToggleTheme();
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={`group hidden sm:inline-flex items-center justify-center size-8 sm:size-8.5 rounded-full transition-colors duration-200 cursor-pointer select-none border-0 ${theme === 'dark'
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-neutral-200 hover:text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'bg-black/[0.05] hover:bg-black/[0.08] text-neutral-700 hover:text-black'
                }`}
              title="Toggle theme (dark / light)"
              aria-label="Toggle theme"
            >
              <motion.div
                whileHover={{ rotate: 180, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white transition-colors" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-neutral-700 group-hover:text-black transition-colors" />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Toggle Button - matching active central island pill style */}
            <motion.button
              id="mobile-menu-toggle-btn"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                triggerHaptic?.('light');
                onToggleMobileMenu();
              }}
              className={`inline-flex sm:hidden items-center justify-center size-8 sm:size-8.5 rounded-full transition-colors cursor-pointer border-0 select-none ${theme === 'dark'
                  ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                  : 'bg-black/[0.05] hover:bg-black/[0.08] text-neutral-900'
                }`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-4 h-3.5 flex flex-col justify-center items-end relative overflow-visible">
                <motion.span
                  animate={{
                    width: '18px',
                    y: mobileMenuOpen ? 0 : -3,
                  }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-[2px] rounded-full block ${theme === 'dark' ? 'bg-white' : 'bg-zinc-900'}`}
                />
                <motion.span
                  animate={{
                    width: mobileMenuOpen ? '0px' : '12px',
                    opacity: mobileMenuOpen ? 0 : 1,
                    y: mobileMenuOpen ? 0 : 3,
                  }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-[2px] rounded-full block origin-right ${theme === 'dark' ? 'bg-white' : 'bg-zinc-900'}`}
                />
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with backdrop blur & subtle margin */}
      <MobileMenuOverlay
        isOpen={mobileMenuOpen}
        onClose={onToggleMobileMenu}
        theme={theme}
        onToggleTheme={onToggleTheme}
        stars={stars}
        onSelectNav={onSelectNav}
        triggerHaptic={triggerHaptic}
      />
    </>
  );
}
