/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface BookPage {
  id: string;
  title: string;
  src: string;
}

export interface BookSettings {
  padding: number;
  imageRadius: number;
  creaseOpacity: number;
  paperColor: string;
  shadowIntensity: number;
}

export const PAGES: BookPage[] = [
  { id: '1', title: 'SKETCH 01', src: 'https://i.pinimg.com/736x/9a/63/20/9a632012291e49436b7695f50d8aa20e.jpg' },
  { id: '2', title: 'SKETCH 02', src: 'https://i.pinimg.com/736x/0c/e1/6e/0ce16e5cfb36927669b7421c670035e0.jpg' },
  { id: '3', title: 'SKETCH 03', src: 'https://i.pinimg.com/736x/63/16/b2/6316b20446639cd7f923882cc0d5b0a5.jpg' },
  { id: '4', title: 'SKETCH 04', src: 'https://i.pinimg.com/736x/8b/36/b9/8b36b9f128dd0a65dc260e323ac5e333.jpg' },
  { id: '5', title: 'SKETCH 05', src: 'https://i.pinimg.com/736x/10/b6/bf/10b6bfda558137d1fd3fe5089c36ad9c.jpg' },
  { id: '6', title: 'SKETCH 06', src: 'https://i.pinimg.com/736x/f9/a7/d1/f9a7d15098baeb3ea28d7232f4ac86ea.jpg' },
];

export function Book({ 
  pages = PAGES, 
  currentIndex, 
  isFlipping, 
  direction, 
  onFlipComplete, 
  settings, 
  isIntro,
  onPrevPage,
  onNextPage
}: any) {
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const [flipState, setFlipState] = useState<{ active: boolean, from: number, to: number, dir: number }>({ active: false, from: 0, to: 0, dir: 1 });

  const animDuration = isIntro ? 0.14 : 0.45;
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
  
  const PaperTexture = () => (
    <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" 
         style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>
    </div>
  );

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

  const creaseLeft = "absolute inset-y-0 right-0 w-12 pointer-events-none mix-blend-multiply z-20";
  const creaseRight = "absolute inset-y-0 left-0 w-12 pointer-events-none mix-blend-multiply z-20";
  
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
    <div className="relative w-full max-w-lg aspect-[16/10] mx-auto perspective-[2400px] select-none">
      <motion.div 
        className="w-full h-full relative shadow-xl rounded-md"
        initial={{ rotateX: 12, rotateY: -10, rotateZ: -2, scale: 0.95 }}
        animate={{ rotateX: 6, rotateY: -4, rotateZ: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Base Left Page (Click to turn backward) */}
        <div 
          onClick={onPrevPage}
          className="absolute top-0 left-0 w-1/2 h-full overflow-hidden rounded-l-md border-y border-l border-r border-black/10 shadow-[2px_0_15px_rgba(0,0,0,0.2)] cursor-pointer group"
          title="Click to turn page back"
        >
          <PageContent index={leftIndex} />
          <div className={creaseLeft} style={creaseLeftStyle} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-start pl-3">
            <ChevronLeft className="w-5 h-5 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Base Right Page (Click to turn forward) */}
        <div 
          onClick={onNextPage}
          className="absolute top-0 right-0 w-1/2 h-full overflow-hidden rounded-r-md border-y border-r border-l border-black/10 shadow-[-2px_0_15px_rgba(0,0,0,0.2)] cursor-pointer group"
          title="Click to turn page forward"
        >
          <PageContent index={rightIndex} />
          <div className={creaseRight} style={creaseRightStyle} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-end pr-3">
            <ChevronRight className="w-5 h-5 text-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
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

export function DitherBook({ theme = 'dark', compact = false }: { theme?: 'dark' | 'light'; compact?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Smooth opening 10-page sequence to the right on mount
  const [introFlips, setIntroFlips] = useState(10);
  const isIntro = introFlips > 0;

  useEffect(() => {
    if (introFlips > 0 && !isFlipping) {
      const timer = setTimeout(() => {
        setDirection(1);
        setIsFlipping(true);
        setCurrentIndex(i => (i + 1) % PAGES.length);
        setIntroFlips(f => f - 1);
      }, introFlips === 10 ? 300 : 70);
      return () => clearTimeout(timer);
    }
  }, [introFlips, isFlipping]);

  const [settings, setSettings] = useState<BookSettings>({
    padding: compact ? 6 : 10,
    imageRadius: compact ? 8 : 20,
    creaseOpacity: 11,
    paperColor: '#fcfbf9',
    shadowIntensity: compact ? 10 : 24
  });

  const next = () => {
    if (!isFlipping) {
      setDirection(1);
      setIsFlipping(true);
      setCurrentIndex(i => (i + 1) % PAGES.length);
    }
  };

  const prev = () => {
    if (!isFlipping) {
      setDirection(-1);
      setIsFlipping(true);
      setCurrentIndex(i => (i - 1 + PAGES.length) % PAGES.length);
    }
  };

  const handleFlipComplete = () => {
    setIsFlipping(false);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center relative p-1 sm:p-2 font-sans">
      <Book 
        pages={PAGES} 
        currentIndex={currentIndex} 
        isFlipping={isFlipping} 
        direction={direction} 
        onFlipComplete={handleFlipComplete}
        settings={settings}
        isIntro={isIntro}
        onPrevPage={prev}
        onNextPage={next}
      />

      {/* Minimalist Controls Bar */}
      <div className="flex items-center justify-between w-full max-w-lg mt-3 px-1">
        <button 
          onClick={prev} 
          disabled={isFlipping} 
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
            theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-black'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        <span className={`text-[11px] font-semibold tracking-widest uppercase ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {PAGES[currentIndex].title}
        </span>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-black'
            }`}
            title="Book Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={next} 
            disabled={isFlipping} 
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-200 hover:bg-neutral-300 text-black'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`mt-3 w-full max-w-sm rounded-xl p-4 shadow-xl border ${
              theme === 'dark' ? 'bg-[#1e1e1e] border-white/15 text-white' : 'bg-white border-neutral-200 text-black'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Book Controls</h4>
              <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-[11px]">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Image Padding</span>
                  <span>{settings.padding}px</span>
                </div>
                <input 
                  type="range" min="0" max="30" value={settings.padding}
                  onChange={(e) => setSettings({...settings, padding: parseInt(e.target.value)})}
                  className="w-full cursor-pointer accent-white"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Image Radius</span>
                  <span>{settings.imageRadius}px</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={settings.imageRadius}
                  onChange={(e) => setSettings({...settings, imageRadius: parseInt(e.target.value)})}
                  className="w-full cursor-pointer accent-white"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Crease Opacity</span>
                  <span>{settings.creaseOpacity}%</span>
                </div>
                <input 
                  type="range" min="0" max="40" value={settings.creaseOpacity}
                  onChange={(e) => setSettings({...settings, creaseOpacity: parseInt(e.target.value)})}
                  className="w-full cursor-pointer accent-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
