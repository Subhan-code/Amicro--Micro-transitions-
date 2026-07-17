import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ButtonConfig } from '../data/buttons';
import { FocusBlur } from './cards/FocusBlur';

interface AnimatedButtonProps {
  config: ButtonConfig;
  layoutMode: 'list' | 'grid' | 'matrix';
  theme?: 'dark' | 'light';
}

export const AnimatedButton = React.memo(function AnimatedButton({ config, layoutMode, theme = 'dark' }: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (config.interactionType === 'focus-blur') {
    return (
      <FocusBlur 
        items={[
          { label: '@X', href: '#' },
          { label: '@Threads', href: '#' },
          { label: '@GitHub', href: '#' }
        ]} 
        showBrackets={true} 
        className={layoutMode === 'matrix' ? "scale-[0.5] origin-center text-[10px] gap-1 px-1 py-1" : "text-sm gap-4"} 
      />
    );
  }

  const Icon1 = config.icon1 as React.ElementType;
  const Icon2 = config.icon2 as React.ElementType;

  const isMatrix = layoutMode === 'matrix';
  const isLightTheme = theme === 'light';

  // State specific for one-time interactions
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    // Only hover on devices supporting hover to prevent sticky mobile states
    if (window.matchMedia('(hover: hover)').matches) {
      setIsHovered(true);
    }
    if (config.interactionType === 'morph' && (config.id === '4' || config.id === '21' || config.id === '22' || config.id === '24' || config.id === '25')) {
      setHasInteracted(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (config.interactionType === 'magnetic') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMouseCoords({ x: x * 0.35, y: y * 0.35 });
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsHovered(false);
    }
    if (config.interactionType === 'magnetic') {
      setMouseCoords({ x: 0, y: 0 });
    }
    if (hasInteracted) {
      setTimeout(() => setHasInteracted(false), 500);
    }
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    if (config.interactionType === 'morph' && (config.id === '4' || config.id === '21' || config.id === '22' || config.id === '24' || config.id === '25')) {
      setHasInteracted(true);
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsHovered(false);
      if (hasInteracted) {
        setTimeout(() => setHasInteracted(false), 500);
      }
    }, 500);
  };

  const showIcon2 = hasInteracted || isHovered;

  const renderIconContent = () => {
    switch (config.interactionType) {
      case 'slide-arrow':
        return (
          <>
            <AnimatePresence mode="popLayout">
              {!isHovered && (
                <motion.div
                  key="icon1"
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                  className={`flex items-center shrink-0 ${!isMatrix ? 'mr-2.5' : ''}`}
                >
                  <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
                </motion.div>
              )}
            </AnimatePresence>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap">{config.label}</motion.span>}
            <AnimatePresence mode="popLayout">
              {isHovered && (
                <motion.div
                  key="icon2"
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ type: "spring", stiffness: 600, damping: 25 }}
                  className={`flex items-center shrink-0 ${!isMatrix ? 'ml-2.5' : ''}`}
                >
                  {Icon2 && <Icon2 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );

      case 'sparkle':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {!isHovered ? (
                  <motion.div
                    key="icon1"
                    initial={{ y: -15, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -15, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon2"
                    initial={{ y: 15, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 15, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {Icon2 && <Icon2 className={`w-[16px] h-[16px] ${config.icon2Color || (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />}
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: -45, y: 10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: 45, y: 10 }}
                      transition={{ type: "spring", stiffness: 600, damping: 25, delay: 0.05 }}
                      className="absolute -top-3 -right-2"
                    >
                      <svg className="w-2.5 h-2.5 text-yellow-200" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
                      </svg>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0, rotate: 45, x: 10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: -45, x: 10 }}
                      transition={{ type: "spring", stiffness: 600, damping: 25, delay: 0.1 }}
                      className="absolute -top-1 -left-3"
                    >
                      <svg className="w-1.5 h-1.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">{config.label}</motion.span>}
          </>
        );

      case 'morph':
      case 'color-morph':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {!showIcon2 ? (
                  <motion.div
                    key="icon1"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Icon1 className={`w-[16px] h-[16px] ${isHovered && config.icon1Color ? config.icon1Color : (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {Icon2 && <Icon2 className={`w-[16px] h-[16px] ${config.icon2Color || (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">
              {config.id === '4' && showIcon2 ? 'Copied' : config.label}
            </motion.span>}
          </>
        );

      case 'pulse':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <motion.div
                animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Icon1 className={`w-[16px] h-[16px] transition-colors duration-300 ${isHovered && config.icon1Color ? `${config.icon1Color} fill-current` : (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />
              </motion.div>
            </div>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">{config.label}</motion.span>}
          </>
        );

      case 'rotate':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <motion.div animate={{ rotate: isHovered ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
              </motion.div>
            </div>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">{config.label}</motion.span>}
          </>
        );

      case 'shake':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <motion.div
                animate={{ 
                  y: isHovered ? [0, -2, 0, -2, 0] : 0,
                  rotate: isHovered ? [0, -10, 10, -10, 0] : 0
                }}
                transition={{ duration: 0.4 }}
              >
                <Icon1 className={`w-[16px] h-[16px] transition-colors duration-300 ${isHovered && config.icon1Color ? config.icon1Color : (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />
              </motion.div>
            </div>
            {!isMatrix && <motion.span layout className={`font-medium tracking-tight text-[13px] whitespace-nowrap transition-colors duration-300 ml-2.5 ${isHovered && config.icon1Color ? config.icon1Color : (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`}>{config.label}</motion.span>}
          </>
        );

      case 'ring':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {!isHovered ? (
                  <motion.div
                    key="icon1"
                    initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 15, scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon2"
                    initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 15, scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 600, damping: 25 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {Icon2 && <Icon2 className={`w-[16px] h-[16px] ${config.icon2Color || (isLightTheme ? 'text-black' : 'text-[#e3e3e3]')}`} />}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 600, damping: 15, delay: 0.1 }}
                      className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-transparent" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isMatrix && <motion.span layout className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">{config.label}</motion.span>}
          </>
        );

      case 'glare':
        return (
          <>
            <Icon1 className={`w-[16px] h-[16px] ${!isMatrix ? 'mr-2.5' : ''} ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
            {!isMatrix && <span className="font-medium tracking-tight text-[13px] whitespace-nowrap">{config.label}</span>}
            <motion.div
              animate={{ x: isHovered ? ['-150%', '150%'] : '-150%' }}
              transition={{ duration: 0.85, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
              className={`absolute top-0 bottom-0 w-[50px] skew-x-[-20deg] pointer-events-none z-10`}
              style={{
                background: isLightTheme 
                  ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.12), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)'
              }}
            />
          </>
        );

      case 'text-reveal':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0 mr-2.5">
              <motion.div animate={{ rotate: isHovered ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
              </motion.div>
            </div>
            {!isMatrix && (
              <div className="relative h-[18px] overflow-hidden">
                <motion.div
                  animate={{ y: isHovered ? -18 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex flex-col"
                >
                  <span className={`block h-[18px] leading-[18px] font-medium tracking-tight text-[13px] whitespace-nowrap ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`}>
                    {config.label}
                  </span>
                  <span className={`block h-[18px] leading-[18px] font-medium tracking-tight text-[13px] whitespace-nowrap ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`}>
                    {config.label}
                  </span>
                </motion.div>
              </div>
            )}
          </>
        );

      case 'magnetic':
        return (
          <>
            <Icon1 className={`w-[16px] h-[16px] ${!isMatrix ? 'mr-2.5' : ''} ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
            {!isMatrix && <span className="font-medium tracking-tight text-[13px] whitespace-nowrap">{config.label}</span>}
          </>
        );

      case 'expand-ring':
        return (
          <>
            <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon1 className={`w-[16px] h-[16px] ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`} />
              </motion.div>
            </div>
            {!isMatrix && <span className="font-medium tracking-tight text-[13px] whitespace-nowrap ml-2.5">{config.label}</span>}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  key="expand-ring-div"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`absolute inset-0 rounded-[40px] pointer-events-none border ${isLightTheme ? 'border-black/25' : 'border-white/25'}`}
                />
              )}
            </AnimatePresence>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <motion.button
      layout
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{ 
        paddingLeft: isMatrix ? 0 : (isHovered ? 28 : 24), 
        paddingRight: isMatrix ? 0 : (isHovered ? 28 : 24),
        x: isHovered && config.interactionType === 'magnetic' ? mouseCoords.x : 0,
        y: isHovered && config.interactionType === 'magnetic' ? mouseCoords.y : 0,
        backgroundColor: isLightTheme
          ? ((hasInteracted && config.id === '4') ? "rgba(0,0,0,0.08)" : (isHovered ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.04)"))
          : ((hasInteracted && config.id === '4') ? "rgba(255,255,255,0.08)" : (isHovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"))
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`relative flex items-center justify-center rounded-[40px] border-0 cursor-pointer shadow-none transition-colors duration-150 ${isMatrix ? 'w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] px-0' : 'h-[36px] min-w-[75px]'} ${config.interactionType === 'glare' ? 'overflow-hidden' : ''} ${isLightTheme ? 'text-black' : 'text-[#e3e3e3]'}`}
    >
      <motion.div layout transition={{ type: "spring", stiffness: 500, damping: 25 }} className={`flex items-center justify-center w-full ${isMatrix ? 'scale-100 sm:scale-[1.15] origin-center' : ''}`}>
        {renderIconContent()}
      </motion.div>
    </motion.button>
  );
});
