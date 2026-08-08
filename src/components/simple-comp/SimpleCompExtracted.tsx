/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Settings2, X } from 'lucide-react';
import { cn } from './lib/utils';

import { ChartCard } from './ChartCard';
import { PaymentsChart } from './PaymentsChart';
import { MembersGrowthChart } from './MembersGrowthChart';

const PAGES = [
  { id: '1', title: 'SKETCH 01', src: 'https://i.pinimg.com/736x/9a/63/20/9a632012291e49436b7695f50d8aa20e.jpg' },
  { id: '2', title: 'SKETCH 02', src: 'https://i.pinimg.com/736x/0c/e1/6e/0ce16e5cfb36927669b7421c670035e0.jpg' },
  { id: '3', title: 'SKETCH 03', src: 'https://i.pinimg.com/736x/63/16/b2/6316b20446639cd7f923882cc0d5b0a5.jpg' },
  { id: '4', title: 'SKETCH 04', src: 'https://i.pinimg.com/736x/8b/36/b9/8b36b9f128dd0a65dc260e323ac5e333.jpg' },
  { id: '5', title: 'SKETCH 05', src: 'https://i.pinimg.com/736x/10/b6/bf/10b6bfda558137d1fd3fe5089c36ad9c.jpg' },
  { id: '6', title: 'SKETCH 06', src: 'https://i.pinimg.com/736x/f9/a7/d1/f9a7d15098baeb3ea28d7232f4ac86ea.jpg' },
];

const SbArrowLeft = () => (
  <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
    <polyline points="11,3 3,22 11,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></polyline>
  </svg>
);

const SbArrowRight = () => (
  <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
    <polyline points="3,3 11,22 3,41" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"></polyline>
  </svg>
);

function Book({ pages, currentIndex, isFlipping, direction, onFlipComplete, settings, isIntro }: any) {
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const [flipState, setFlipState] = useState<{ active: boolean, from: number, to: number, dir: number }>({ active: false, from: 0, to: 0, dir: 1 });

  const animDuration = isIntro ? 0.12 : 0.45;
  const animEase = isIntro ? "linear" : [0.33, 1, 0.68, 1];

  useEffect(() => {
    if (currentIndex !== localIndex) {
      setFlipState({
        active: true,
        from: localIndex,
        to: currentIndex,
        dir: direction
      });
    }
  }, [currentIndex, localIndex, direction]);

  const handleAnimationComplete = () => {
    setLocalIndex(flipState.to);
    setFlipState({ active: false, from: flipState.to, to: flipState.to, dir: 1 });
    if (onFlipComplete) onFlipComplete();
  };

  const getIndex = (index: number) => ((index % pages.length) + pages.length) % pages.length;
  
  const PageContent = ({ index }: { index: number }) => (
    <>
      <div className="absolute inset-0" style={{ backgroundColor: settings.paperColor }} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ padding: `${settings.padding}px` }}>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat shadow-inner" 
          style={{ 
            backgroundImage: `url(${pages[getIndex(index)].src})`,
            borderRadius: `${settings.imageRadius}px`,
            boxShadow: `0 4px ${settings.shadowIntensity}px rgba(0,0,0,0.15)`
          }} 
        />
      </div>
      <PaperTexture />
    </>
  );

  const PaperTexture = () => (
    <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" 
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
    </div>
  );

  const creaseLeft = "absolute inset-y-0 right-0 w-16 pointer-events-none mix-blend-multiply z-20";
  const creaseRight = "absolute inset-y-0 left-0 w-16 pointer-events-none mix-blend-multiply z-20";
  
  const creaseLeftStyle = { 
    background: `linear-gradient(to left, rgba(0,0,0,${settings.creaseOpacity / 100}), rgba(0,0,0,${settings.creaseOpacity / 400}), transparent)`, 
    boxShadow: `inset -4px 0 10px rgba(0,0,0,0.1)` 
  };
  const creaseRightStyle = { 
    background: `linear-gradient(to right, rgba(0,0,0,${settings.creaseOpacity / 100}), rgba(0,0,0,${settings.creaseOpacity / 400}), transparent)`, 
    boxShadow: `inset 4px 0 10px rgba(0,0,0,0.1)` 
  };

  // Static Base pages:
  const leftIndex = flipState.active 
    ? (flipState.dir === 1 ? flipState.from - 1 : flipState.to - 1)
    : localIndex - 1;
  const rightIndex = flipState.active
    ? (flipState.dir === 1 ? flipState.to : flipState.from)
    : localIndex;

  // Flipping page:
  const frontIndex = flipState.dir === 1 ? flipState.from : flipState.to;
  const backIndex = flipState.dir === 1 ? flipState.to - 1 : flipState.from - 1;

  return (
    <div className="relative w-full max-w-2xl aspect-[16/9] mx-auto perspective-[3000px]">
      <motion.div 
        className="w-full h-full relative shadow-2xl rounded-md"
        initial={{ rotateX: 20, rotateY: -15, rotateZ: -5, scale: 0.8, y: 100 }}
        animate={{ rotateX: 8, rotateY: -6, rotateZ: 0, scale: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Base Left Page */}
        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-md border-y border-l border-r border-black/10 shadow-[2px_0_15px_rgba(0,0,0,0.2)]">
          <PageContent index={leftIndex} />
          <div className={creaseLeft} style={creaseLeftStyle} />
        </div>

        {/* Base Right Page */}
        <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden rounded-r-md border-y border-r border-l border-black/10 shadow-[-2px_0_15px_rgba(0,0,0,0.2)]">
          <PageContent index={rightIndex} />
          <div className={creaseRight} style={creaseRightStyle} />
        </div>

        {/* Flipping Page */}
        {flipState.active && (
          <motion.div
            className="absolute top-0 w-1/2 h-full origin-left bg-[#fcfbf9] z-30"
            style={{ 
              left: '50%',
              transformStyle: 'preserve-3d',
            }}
            initial={{ rotateY: flipState.dir === 1 ? 0 : -180 }}
            animate={{ rotateY: flipState.dir === 1 ? -180 : 0 }}
            transition={{ duration: animDuration, ease: animEase }}
            onAnimationComplete={handleAnimationComplete}
          >
            {/* Front of flipping page (Right side of 'from' page) */}
            <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-md border-y border-r border-l border-black/10" style={{ backfaceVisibility: 'hidden' }}>
              <PageContent index={frontIndex} />
              <div className={creaseRight} style={creaseRightStyle} />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent to-black"
                initial={{ opacity: flipState.dir === 1 ? 0 : 0.4 }}
                animate={{ opacity: flipState.dir === 1 ? 0.4 : 0 }}
                transition={{ duration: animDuration, ease: animEase }}
              />
            </div>

            {/* Back of flipping page (Left side of 'to' page) */}
            <div 
              className="absolute inset-0 backface-hidden overflow-hidden rounded-l-md border-y border-l border-r border-black/10"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            >
              <PageContent index={backIndex} />
              <div className={creaseLeft} style={creaseLeftStyle} />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-l from-transparent to-black"
                initial={{ opacity: flipState.dir === 1 ? 0.4 : 0 }}
                animate={{ opacity: flipState.dir === 1 ? 0 : 0.4 }}
                transition={{ duration: animDuration, ease: animEase }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export function SimpleCompExtracted() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [introFlips, setIntroFlips] = useState(10);
  const isIntro = introFlips > 0;
  const hasStarted = !isIntro;
  
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    padding: 14,
    imageRadius: 32,
    creaseOpacity: 11,
    paperColor: '#fcfbf9',
    shadowIntensity: 34
  });

  // Initial fast opening animation to the middle
  useEffect(() => {
    if (introFlips > 0 && !isFlipping) {
      const timer = setTimeout(() => {
        setDirection(1);
        setIsFlipping(true);
        setCurrentIndex(i => (i + 1) % PAGES.length);
      }, introFlips === 10 ? 800 : 20); 
      return () => clearTimeout(timer);
    }
  }, [introFlips, isFlipping]);

  const handleFlipComplete = () => {
    setIsFlipping(false);
    if (introFlips > 0) {
      setIntroFlips(f => f - 1);
    }
  };

  const next = () => {
    if (!isFlipping && hasStarted) {
      setDirection(1);
      setIsFlipping(true);
      setCurrentIndex(i => (i + 1) % PAGES.length);
    }
  };
  
  const prev = () => {
    if (!isFlipping && hasStarted) {
      setDirection(-1);
      setIsFlipping(true);
      setCurrentIndex(i => (i - 1 + PAGES.length) % PAGES.length);
    }
  };

  const handleGlobalClick = (e: React.MouseEvent) => {
    if (!hasStarted || isFlipping) return;
    if ((e.target as HTMLElement).closest('button')) return;

    if (e.clientX > window.innerWidth / 2) {
      next();
    } else {
      prev();
    }
  };

  return (
    <div 
      className="relative min-h-[700px] w-full rounded-3xl bg-[#f4f5f7] overflow-hidden text-slate-800 font-sans flex flex-col cursor-pointer my-4 border border-black/10 shadow-xl p-6 sm:p-8"
      onClick={handleGlobalClick}
    >
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="text-[20vw] sm:text-[15vw] font-bold text-blue-600/10 blur-[6px] sm:blur-[10px] whitespace-nowrap select-none tracking-tighter mix-blend-multiply">
          Matthew Yu
        </h1>
      </div>

      {/* Row 1: Book occupying full top row */}
      <main className="relative z-10 w-full flex flex-col items-center justify-center pt-8 pb-10 pointer-events-none">
        
        {/* Book Container with Navigation */}
        <div className="relative flex items-center justify-center w-full max-w-[90rem] gap-4 sm:gap-12 pointer-events-auto">
          <button 
            onClick={prev}
            disabled={isFlipping || !hasStarted}
            className="p-4 sm:p-6 text-slate-400 hover:text-black disabled:opacity-0 disabled:hover:text-slate-400 transition-opacity duration-300 z-20 focus:outline-none hidden sm:block cursor-pointer"
            aria-label="Previous page"
          >
            <SbArrowLeft />
          </button>

          <div className="flex-1 w-full max-w-2xl relative">
            <Book 
              pages={PAGES} 
              currentIndex={currentIndex} 
              isFlipping={isFlipping}
              direction={direction}
              settings={settings}
              isIntro={isIntro}
              onFlipComplete={handleFlipComplete}
            />
          </div>

          <button 
            onClick={next}
            disabled={isFlipping || !hasStarted}
            className="p-4 sm:p-6 text-slate-400 hover:text-black disabled:opacity-0 disabled:hover:text-slate-400 transition-opacity duration-300 z-20 focus:outline-none hidden sm:block cursor-pointer"
            aria-label="Next page"
          >
            <SbArrowRight />
          </button>
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex sm:hidden items-center justify-between w-full max-w-sm mt-8 px-8 z-20 pointer-events-auto">
          <button 
            onClick={prev}
            disabled={isFlipping || !hasStarted}
            className="p-4 text-slate-400 hover:text-black disabled:opacity-0 transition-opacity focus:outline-none cursor-pointer"
          >
            <SbArrowLeft />
          </button>
          
          <div className="flex items-center justify-center min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] tracking-[0.2em] text-slate-500 font-medium uppercase text-center"
              >
                {PAGES[currentIndex].title}
              </motion.div>
            </AnimatePresence>
          </div>

          <button 
            onClick={next}
            disabled={isFlipping || !hasStarted}
            className="p-4 text-slate-400 hover:text-black disabled:opacity-0 transition-opacity focus:outline-none cursor-pointer"
          >
            <SbArrowRight />
          </button>
        </div>

        {/* Desktop Caption */}
        <div className="hidden sm:flex mt-8 h-6 items-center justify-center z-20">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] tracking-[0.2em] text-slate-500 font-medium uppercase"
            >
              {PAGES[currentIndex].title}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Row 2: 3 Dither Components arranged side-by-side beneath the book */}
      <div className="relative z-20 pointer-events-auto w-full pt-8 border-t border-black/10">
        <div className="text-center mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600">Dither Graph Components</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start justify-items-center w-full max-w-7xl mx-auto">
          <div className="w-full flex justify-center">
            <ChartCard />
          </div>
          <div className="w-full flex justify-center">
            <PaymentsChart />
          </div>
          <div className="w-full flex justify-center">
            <MembersGrowthChart />
          </div>
        </div>
      </div>

      {/* Settings Toggle */}
      <button 
        className="absolute top-6 right-6 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:bg-white text-slate-500 hover:text-black transition-all z-50 pointer-events-auto"
        onClick={(e) => { e.stopPropagation(); setShowSettings(true); }}
      >
        <Settings2 size={20} />
      </button>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-6 right-6 w-80 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 z-50 pointer-events-auto border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold tracking-wider text-slate-800 uppercase">Theme Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-black">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
                  <span>Image Padding</span>
                  <span>{settings.padding}px</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={settings.padding}
                  onChange={(e) => setSettings({...settings, padding: parseInt(e.target.value)})}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
                  <span>Image Radius</span>
                  <span>{settings.imageRadius}px</span>
                </div>
                <input 
                  type="range" min="0" max="32" value={settings.imageRadius}
                  onChange={(e) => setSettings({...settings, imageRadius: parseInt(e.target.value)})}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
                  <span>Crease Opacity</span>
                  <span>{settings.creaseOpacity}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={settings.creaseOpacity}
                  onChange={(e) => setSettings({...settings, creaseOpacity: parseInt(e.target.value)})}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 uppercase tracking-wider">
                  <span>Shadow Intensity</span>
                  <span>{settings.shadowIntensity}px</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={settings.shadowIntensity}
                  onChange={(e) => setSettings({...settings, shadowIntensity: parseInt(e.target.value)})}
                  className="w-full accent-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Chevron */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center z-20 animate-bounce text-slate-400">
        <ChevronDown strokeWidth={1} size={24} />
      </div>
    </div>
  );
}
