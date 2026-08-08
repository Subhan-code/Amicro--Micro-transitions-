import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TextAnimationConfig } from '../../data/textAnimations';
import { RefreshCw } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

interface AnimatedTextProps {
  config: TextAnimationConfig;
  theme: 'dark' | 'light';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ config, theme }) => {
  const [keyIndex, setKeyIndex] = useState(0);
  const { trigger: triggerHaptic } = useWebHaptics();

  const isDark = theme === 'dark';

  const replay = () => {
    triggerHaptic('light');
    setKeyIndex(prev => prev + 1);
  };

  const samplePhrase = "AMICRO UI";
  const sampleWords = ["Design", "Motion", "Amicro"];

  return (
    <div 
      onClick={replay}
      className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer select-none px-4 group"
      title="Click to replay animation"
    >
      <div className="flex items-center justify-center w-full min-h-[60px] text-center">
        {(() => {
          switch (config.interactionType) {

            /* --- FEATURED --- */
            case 'dia-text-reveal':
              return (
                <div key={keyIndex} className="relative overflow-hidden font-black text-2xl tracking-tighter">
                  <motion.div
                    initial={{ clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)', filter: 'blur(8px)' }}
                    animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', filter: 'blur(0px)' }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className={isDark ? 'text-white' : 'text-black'}
                  >
                    DIA REVEAL
                  </motion.div>
                </div>
              );

            /* --- REVEALS --- */
            case 'blur-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ filter: 'blur(12px)', opacity: 0, scale: 0.9 }}
                  animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
                >
                  BLUR REVEAL
                </motion.div>
              );

            case 'shimmer-text':
              return (
                <div className={`font-extrabold text-2xl bg-gradient-to-r ${
                  isDark 
                    ? 'from-neutral-400 via-white to-neutral-400' 
                    : 'from-neutral-600 via-black to-neutral-600'
                } bg-clip-text text-transparent animate-pulse`}>
                  SHIMMER TEXT
                </div>
              );

            case 'typewriter-text':
              return (
                <div key={keyIndex} className="flex items-center font-mono text-lg font-bold">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 'auto' }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className={`overflow-hidden whitespace-nowrap border-r-2 ${
                      isDark ? 'text-emerald-400 border-emerald-400' : 'text-emerald-600 border-emerald-600'
                    }`}
                  >
                    TYPEWRITER
                  </motion.span>
                </div>
              );

            case 'reveal-text':
              return (
                <div key={keyIndex} className="relative overflow-hidden font-bold text-2xl">
                  <motion.div
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: 'inset(0 0 0 0)' }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    className={isDark ? 'text-white' : 'text-black'}
                  >
                    CINEMATIC
                  </motion.div>
                </div>
              );

            case 'fade-in-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'fade-in-word':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.15 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'fade-in-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
                >
                  FADE IN TEXT
                </motion.div>
              );

            case 'blur-up-word':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                      className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'blur-up-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            /* --- SLIDE & DROP --- */
            case 'stagger-text':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-up-char':
              return (
                <div key={keyIndex} className="flex overflow-hidden font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-up-word':
              return (
                <div key={keyIndex} className="flex gap-2 overflow-hidden font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-up-text':
              return (
                <div key={keyIndex} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
                  >
                    SLIDE UP TEXT
                  </motion.div>
                </div>
              );

            case 'slide-down-char':
              return (
                <div key={keyIndex} className="flex overflow-hidden font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: '-100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-down-word':
              return (
                <div key={keyIndex} className="flex gap-2 overflow-hidden font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: '-100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-left-char':
              return (
                <div key={keyIndex} className="flex overflow-hidden font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'slide-right-char':
              return (
                <div key={keyIndex} className="flex overflow-hidden font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'drop-in-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25, delay: i * 0.04 }}
                      className={isDark ? 'text-cyan-400' : 'text-cyan-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'rise-up-word':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ y: 30, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22, delay: i * 0.12 }}
                      className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'bounce-in-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={isDark ? 'text-pink-400' : 'text-pink-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            /* --- SCALE & ZOOM --- */
            case 'scale-in-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 450, damping: 22, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'scale-in-word':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.12 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'scale-in-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}
                >
                  SCALE IN TEXT
                </motion.div>
              );

            case 'zoom-in-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-extrabold text-2xl ${isDark ? 'text-amber-400' : 'text-amber-600'}`}
                >
                  ZOOM IN
                </motion.div>
              );

            case 'zoom-out-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ scale: 1.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-extrabold text-2xl ${isDark ? 'text-amber-400' : 'text-amber-600'}`}
                >
                  ZOOM OUT
                </motion.div>
              );

            /* --- 3D & ROTATE --- */
            case 'flip-y-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl [perspective:1000px]">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'flip-x-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl [perspective:1000px]">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ rotateX: 90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={isDark ? 'text-indigo-400' : 'text-indigo-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'rotate-in-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'swing-word':
              return (
                <div key={keyIndex} className="flex gap-2 font-bold text-xl [perspective:800px]">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18, delay: i * 0.12 }}
                      className={isDark ? 'text-purple-400' : 'text-purple-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            /* --- DISTORTION & SPACING --- */
            case 'stretch-x-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleX: 2.5, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'stretch-y-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleY: 2.5, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'skew-x-char':
              return (
                <div key={keyIndex} className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ skewX: -30, opacity: 0 }}
                      animate={{ skewX: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'tracking-in-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ letterSpacing: '0.6em', opacity: 0 }}
                  animate={{ letterSpacing: '0.05em', opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-black text-xl uppercase ${isDark ? 'text-white' : 'text-black'}`}
                >
                  TRACKING IN
                </motion.div>
              );

            case 'tracking-out-text':
              return (
                <motion.div
                  key={keyIndex}
                  initial={{ letterSpacing: '-0.2em', opacity: 0 }}
                  animate={{ letterSpacing: '0.1em', opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-black text-xl uppercase ${isDark ? 'text-white' : 'text-black'}`}
                >
                  TRACKING OUT
                </motion.div>
              );

            /* --- HOVER & INTERACTIVE --- */
            case 'spring-text':
            case 'hover-lift-char':
              return (
                <div className="flex font-bold text-2xl cursor-pointer">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ y: -8, scale: 1.2, color: '#6366f1' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'hover-lift-word':
              return (
                <div className="flex gap-2 font-bold text-xl cursor-pointer">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ y: -6, color: '#3b82f6' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      className={isDark ? 'text-white' : 'text-black'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'hover-scale-char':
              return (
                <div className="flex font-bold text-2xl cursor-pointer">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.4 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className={isDark ? 'text-pink-400' : 'text-pink-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'hover-scale-word':
              return (
                <div className="flex gap-2 font-bold text-xl cursor-pointer">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.25 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={isDark ? 'text-pink-400' : 'text-pink-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            /* --- CONTINUOUS --- */
            case 'float-char':
              return (
                <div className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                      className={isDark ? 'text-cyan-400' : 'text-cyan-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'float-word':
              return (
                <div className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                      className={isDark ? 'text-cyan-400' : 'text-cyan-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'pulse-char':
              return (
                <div className="flex font-bold text-2xl">
                  {samplePhrase.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.08 }}
                      className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </div>
              );

            case 'pulse-word':
              return (
                <div className="flex gap-2 font-bold text-xl">
                  {sampleWords.map((word, i) => (
                    <motion.span
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.25 }}
                      className={isDark ? 'text-emerald-400' : 'text-emerald-600'}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              );

            case 'glow-text':
              return (
                <motion.div
                  animate={{ textShadow: isDark ? ['0 0 10px rgba(99,102,241,0.5)', '0 0 25px rgba(99,102,241,0.9)', '0 0 10px rgba(99,102,241,0.5)'] : ['0 0 10px rgba(79,70,229,0.3)', '0 0 20px rgba(79,70,229,0.6)', '0 0 10px rgba(79,70,229,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`font-black text-3xl tracking-tight ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}
                >
                  GLOW TEXT
                </motion.div>
              );

            default:
              return (
                <div className={`font-bold text-2xl ${isDark ? 'text-white' : 'text-black'}`}>
                  {config.label}
                </div>
              );
          }
        })()}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/20 text-white/70">
        <RefreshCw className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
