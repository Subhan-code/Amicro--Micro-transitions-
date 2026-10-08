import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { DitherBook } from './dither-charts/DitherBook';
import { CardCarousel } from './cards/CardCarousel';
import { CardCoverFlow } from './cards/CardCoverFlow';
import { CardTimeMachine } from './cards/CardTimeMachine';
import { Copy, Check, Box, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { IconSwap, IconSwapItem } from './IconSwap';

interface ThreeDPageProps {
  theme: 'dark' | 'light';
  embedded?: boolean;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
}

export function ThreeDPage({ theme, embedded = false, showToast, triggerHaptic, onNavigateHome }: ThreeDPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopySnippet = useCallback((id: string, snippet: string, label: string) => {
    navigator.clipboard.writeText(snippet)
      .then(() => {
        if (triggerHaptic) triggerHaptic('success');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        if (showToast) showToast(`Copied ${label} CLI command!`);
      })
      .catch(() => {
        if (triggerHaptic) triggerHaptic('error');
        if (showToast) showToast('Failed to copy command.');
      });
  }, [showToast, triggerHaptic]);

  return (
    <div className={`w-full max-w-[1600px] mx-auto ${embedded ? 'px-0 py-2' : 'px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 2xl:py-12'} flex flex-col gap-8 2xl:gap-12 font-sans`}>
      
      {!embedded && (
        <>
          {/* Top Header Navigation */}
          <div className="flex items-center justify-between w-full">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          {/* Hero Header */}
          <div className="flex flex-col items-center text-center gap-4 max-w-2xl 2xl:max-w-3xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
              theme === 'dark' ? 'bg-white/10 text-neutral-300 border border-white/10' : 'bg-neutral-200 text-neutral-700 border border-neutral-300'
            }`}>
              <Box className="w-3.5 h-3.5 text-indigo-400" />
              <span>3D Motion Lab</span>
            </div>
            <h1 className="text-fluid-h1 font-bold">
              3D Showcase
            </h1>
            <p className={`text-fluid-sub max-w-xl mx-auto ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              High-performance 3D perspective flipbooks, CoverFlow carousels, depth stacks, and spatial card motion.
            </p>
          </div>
        </>
      )}

      {/* 1. Hero Spotlight: 3D Dither Lab Book */}
      <div className={`w-full rounded-[28px] p-6 sm:p-8 border flex flex-col items-center gap-6 shadow-2xl transition-all ${
        theme === 'dark' 
          ? 'bg-[#181818] border-white/10 shadow-black/40' 
          : 'bg-white border-neutral-200 shadow-neutral-200/50'
      }`}>
        <div className="flex flex-col items-center text-center gap-1.5 max-w-lg">
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
            Featured 3D Component
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            3D Dither Lab Book
          </h2>
          <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Interactive 3D page flipping with cream paper texture overlays, customizable image padding, and real-time crease opacity depth controls.
          </p>
        </div>

        {/* 3D Book Container */}
        <div className="w-full flex items-center justify-center min-h-[320px] py-4">
          <DitherBook theme={theme} />
        </div>

        {/* CLI Command & Copy */}
        <div className={`w-full max-w-md flex items-center justify-between p-3 rounded-2xl border text-xs font-mono transition-all ${
          theme === 'dark' ? 'bg-[#0F0F0F] border-white/10 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
        }`}>
          <span className="truncate pr-2 select-all">npx @subhanhq/amicro@latest add dither-book</span>
          <button
            onClick={() => handleCopySnippet('dither-book', 'npx @subhanhq/amicro@latest add dither-book', '3D Dither Lab Book')}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              copiedId === 'dither-book'
                ? (theme === 'dark' ? 'bg-white/20 text-white' : 'bg-neutral-800 text-white')
                : (theme === 'dark' ? 'bg-white/10 text-neutral-300 hover:text-white' : 'bg-neutral-200 text-neutral-700 hover:text-black')
            }`}
          >
            <IconSwap>
              <IconSwapItem key={copiedId === 'dither-book' ? 'check' : 'copy'}>
                {copiedId === 'dither-book' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              </IconSwapItem>
            </IconSwap>
          </button>
        </div>
      </div>

      {/* 2. Additional 3D Spatial Carousels & Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* 3D Arc Carousel */}
        <div className={`rounded-[24px] p-6 border flex flex-col items-center justify-between gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#181818] border-white/5 hover:bg-[#1e1e1e]' : 'bg-white border-neutral-100 hover:shadow-lg'
        }`}>
          <div className="text-center flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-tight">Interactive 3D Carousel</h3>
              <a 
                href="https://x.com/vivitseng_" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium"
              >
                by vivi
              </a>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              An interactive arc-based 3D motion carousel featuring smooth dot indicators and dynamic prev/next controls, inspired by vivi.
            </p>
          </div>

          <div className="w-full h-[220px] flex items-center justify-center overflow-hidden rounded-xl">
            <CardCarousel hovered={true} className="scale-[0.8] origin-center" />
          </div>

          <button
            onClick={() => handleCopySnippet('card-carousel', 'npx @subhanhq/amicro@latest add card-carousel', 'Interactive 3D Carousel')}
            className={`w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy CLI Code</span>
          </button>
        </div>

        {/* 3D CoverFlow */}
        <div className={`rounded-[24px] p-6 border flex flex-col items-center justify-between gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#181818] border-white/5 hover:bg-[#1e1e1e]' : 'bg-white border-neutral-100 hover:shadow-lg'
        }`}>
          <div className="text-center">
            <h3 className="text-sm font-semibold tracking-tight">CoverFlow 3D Carousel</h3>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Premium 3D CoverFlow perspective path card deck.
            </p>
          </div>

          <div className="w-full h-[220px] flex items-center justify-center overflow-hidden rounded-xl">
            <CardCoverFlow hovered={true} className="scale-[0.8] origin-center" />
          </div>

          <button
            onClick={() => handleCopySnippet('card-cover-flow', 'npx @subhanhq/amicro@latest add card-cover-flow', 'CoverFlow 3D')}
            className={`w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy CLI Code</span>
          </button>
        </div>

        {/* 3D Time Machine Stack */}
        <div className={`rounded-[24px] p-6 border flex flex-col items-center justify-between gap-4 transition-all ${
          theme === 'dark' ? 'bg-[#181818] border-white/5 hover:bg-[#1e1e1e]' : 'bg-white border-neutral-100 hover:shadow-lg'
        }`}>
          <div className="text-center">
            <h3 className="text-sm font-semibold tracking-tight">Time Machine Depth Stack</h3>
            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Apple-style 3D perspective depth stack with timeline scrubber.
            </p>
          </div>

          <div className="w-full h-[220px] flex items-center justify-center overflow-hidden rounded-xl">
            <CardTimeMachine hovered={true} className="scale-[0.8] origin-center" />
          </div>

          <button
            onClick={() => handleCopySnippet('card-time-machine', 'npx @subhanhq/amicro@latest add card-time-machine', 'Time Machine Stack')}
            className={`w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy CLI Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}
