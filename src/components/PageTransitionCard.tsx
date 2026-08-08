import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { TransitionPreset } from '../data/transitions';
import { PageTransitionOverlay } from './PageTransitionOverlay';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { IconSwap, IconSwapItem } from './IconSwap';

interface PageTransitionCardProps {
  preset: TransitionPreset;
  theme: 'dark' | 'light';
  showToast: (msg: string) => void;
}

export const PageTransitionCard: React.FC<PageTransitionCardProps> = ({
  preset,
  theme,
  showToast,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<'A' | 'B'>('A');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { trigger: triggerHaptic } = useWebHaptics();

  // Play animation ON HOVER ONLY for performance efficiency
  const handleMouseEnter = () => {
    if (isAnimating) return;
    triggerHaptic('light');
    setIsAnimating(true);

    setTimeout(() => {
      setActivePage((prev) => (prev === 'A' ? 'B' : 'A'));
    }, 380);

    setTimeout(() => {
      setIsAnimating(false);
    }, 850);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(preset.code);
    triggerHaptic('success');
    setIsCopied(true);
    showToast(`Copied ${preset.name} transition code!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isDark = theme === 'dark';

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      className={`relative w-full max-w-[320px] sm:w-[320px] h-[220px] sm:h-[268px] rounded-[24px] transition-all duration-300 group cursor-pointer ${
        isDark
          ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]'
          : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)] border border-neutral-100/85 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] text-black'
      }`}
    >
      {/* Inner Preview Stage Canvas */}
      <div 
        className={`absolute left-[12px] top-[12px] right-[12px] bottom-[68px] rounded-[14px] flex items-center justify-center overflow-hidden transition-colors duration-300 ${
          isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'
        }`}
      >
        <div className={`absolute inset-0 rounded-[14px] pointer-events-none z-10 ${
          isDark ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]' : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.03)]'
        }`} />

        {/* Minimalist Webpage Layout Mockup Inside Stage Canvas */}
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none relative transition-colors duration-300 ${
          activePage === 'A'
            ? (isDark ? 'bg-[#121212] text-white' : 'bg-[#ffffff] text-black')
            : (isDark ? 'bg-[#181818] text-white' : 'bg-[#f8f9fa] text-black')
        }`}>
          {/* Header Bar */}
          <div className="flex items-center justify-between z-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activePage === 'A' ? (isDark ? 'bg-white' : 'bg-black') : (isDark ? 'bg-neutral-500' : 'bg-neutral-400')}`} />
              <span className={`text-[10px] font-medium tracking-tight ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {activePage === 'A' ? 'Page A' : 'Page B'}
              </span>
            </div>
            <div className={`h-1.5 w-10 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          </div>

          {/* Center Minimal Body */}
          <div className="my-auto z-0 flex flex-col gap-1.5 items-center text-center">
            <div className={`text-[12px] font-semibold tracking-tight ${isDark ? 'text-[#ededed]' : 'text-black'}`}>
              Amicro Motion
            </div>
            <div className={`text-[10px] max-w-[180px] leading-snug line-clamp-1 ${isDark ? 'text-[#767676]' : 'text-black/60'}`}>
              {preset.description}
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="flex items-center justify-between z-0">
            <div className={`h-1.5 w-12 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
            <div className={`h-1.5 w-6 rounded-full ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
          </div>
        </div>

        {/* Live Transition Overlay Component */}
        <PageTransitionOverlay
          transitionId={preset.id}
          isAnimating={isAnimating}
          theme={theme}
          speedMultiplier={1}
        />
      </div>

      {/* Card Footer Bar */}
      <div className="absolute left-[20px] bottom-[14px] w-[calc(100%-80px)] flex flex-col gap-[2px]">
        <div className={`text-[13px] font-semibold leading-[18px] transition-colors ${
          isDark ? 'text-[#ededed]' : 'text-black'
        }`}>
          {preset.name}
        </div>
        <div className={`text-[11px] font-normal leading-[13px] transition-colors capitalize ${
          isDark ? 'text-[#767676]' : 'text-black opacity-70'
        }`}>
          {preset.category} transition
        </div>
      </div>

      {/* Standard Round Copy Button */}
      <button 
        onClick={handleCopyCode}
        type="button" 
        className={`absolute right-[20px] bottom-[12px] w-[32px] h-[32px] rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 focus-visible:outline focus-visible:outline-2 ${
          isDark
            ? 'bg-white/[0.08] hover:bg-white/[0.12] text-[#ededed]/60 hover:text-[#ededed]'
            : 'bg-neutral-100 hover:bg-neutral-200 text-black hover:text-black'
        }`} 
        aria-label="Copy transition code"
      >
        <IconSwap>
          <IconSwapItem key={isCopied ? "check" : "copy"}>
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />}
          </IconSwapItem>
        </IconSwap>
      </button>
    </div>
  );
};
