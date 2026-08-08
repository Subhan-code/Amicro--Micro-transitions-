import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToggleConfig } from '../../data/toggles';
import { Sun, Moon, Lock, Unlock, Bookmark, Heart, ThumbsDown, Repeat } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

interface AnimatedToggleProps {
  config: ToggleConfig;
  theme: 'dark' | 'light';
}

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({ config, theme }) => {
  const [isOn, setIsOn] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [pillTab, setPillTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [likeCount, setLikeCount] = useState(42);
  const [repostCount, setRepostCount] = useState(18);
  const { trigger: triggerHaptic } = useWebHaptics();

  const isDark = theme === 'dark';

  const handleToggle = () => {
    if (!isInit) setIsInit(true);
    triggerHaptic('medium');
    setIsOn(!isOn);
  };

  switch (config.interactionType) {
    case 'double-bounce-toggle':
      return (
        <button
          onClick={handleToggle}
          data-on={isOn ? 'true' : 'false'}
          className={`t-toggle ${isInit ? 'is-init' : ''} relative w-14 h-8 rounded-full p-1 cursor-pointer border-0 transition-colors ${
            isOn ? 'bg-emerald-500' : isDark ? 'bg-neutral-800' : 'bg-neutral-300'
          }`}
        >
          <span className="t-toggle-thumb block w-6 h-6 bg-white rounded-full shadow-md pointer-events-none" />
        </button>
      );

    case 'solid-switch':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer border-0 ${
            isOn 
              ? (isDark ? 'bg-white text-black' : 'bg-black text-white') 
              : (isDark ? 'bg-neutral-800 border border-white/10' : 'bg-neutral-200 border border-neutral-300')
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 24 : 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`w-6 h-6 rounded-full shadow-sm ${
              isOn ? (isDark ? 'bg-black' : 'bg-white') : (isDark ? 'bg-white' : 'bg-black')
            }`}
          />
        </button>
      );

    case 'rectangle-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-14 h-8 rounded-md p-1 transition-colors duration-200 cursor-pointer border ${
            isOn
              ? 'bg-blue-600 border-blue-500'
              : (isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-neutral-100 border-neutral-300')
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="w-5 h-5 bg-white rounded-sm shadow-md"
          />
        </button>
      );

    case 'circle-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 cursor-pointer border-0 ${
            isOn ? 'bg-indigo-500' : (isDark ? 'bg-neutral-800' : 'bg-neutral-300')
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            className="w-7 h-7 bg-white rounded-full shadow-md"
          />
        </button>
      );

    case 'bookmark-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`p-3 rounded-2xl flex items-center gap-2 font-medium text-xs transition-all cursor-pointer border ${
            isOn
              ? (isDark ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-blue-100 text-blue-600 border-blue-300')
              : (isDark ? 'bg-white/[0.05] text-neutral-400 border-white/10 hover:text-white' : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-black')
          }`}
        >
          <motion.div animate={{ scale: isOn ? [1, 1.3, 1] : 1 }}>
            <Bookmark className={`w-4 h-4 ${isOn ? 'fill-current' : ''}`} />
          </motion.div>
          <span>{isOn ? 'Saved' : 'Bookmark'}</span>
        </button>
      );

    case 'like-toggle':
      return (
        <button
          onClick={() => {
            triggerHaptic('success');
            setLikeCount(prev => (isOn ? prev - 1 : prev + 1));
            setIsOn(!isOn);
          }}
          className={`p-2.5 px-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer border ${
            isOn
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              : (isDark ? 'bg-white/[0.05] text-neutral-400 border-white/10 hover:text-white' : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-black')
          }`}
        >
          <motion.div animate={{ scale: isOn ? [1, 1.4, 1] : 1 }}>
            <Heart className={`w-4 h-4 ${isOn ? 'fill-rose-500 text-rose-500' : ''}`} />
          </motion.div>
          <span>{likeCount}</span>
        </button>
      );

    case 'dislike-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`p-2.5 rounded-2xl flex items-center gap-2 text-xs font-medium transition-all cursor-pointer border ${
            isOn
              ? (isDark ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-amber-100 text-amber-600 border-amber-300')
              : (isDark ? 'bg-white/[0.05] text-neutral-400 border-white/10 hover:text-white' : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-black')
          }`}
        >
          <motion.div animate={{ rotate: isOn ? [0, -15, 0] : 0 }}>
            <ThumbsDown className={`w-4 h-4 ${isOn ? 'fill-current' : ''}`} />
          </motion.div>
          <span>Dislike</span>
        </button>
      );

    case 'repost-toggle':
      return (
        <button
          onClick={() => {
            triggerHaptic('medium');
            setRepostCount(prev => (isOn ? prev - 1 : prev + 1));
            setIsOn(!isOn);
          }}
          className={`p-2.5 px-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer border ${
            isOn
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : (isDark ? 'bg-white/[0.05] text-neutral-400 border-white/10 hover:text-white' : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:text-black')
          }`}
        >
          <motion.div animate={{ rotate: isOn ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <Repeat className="w-4 h-4" />
          </motion.div>
          <span>{repostCount}</span>
        </button>
      );

    case 'pill-tabs':
      return (
        <div className={`relative p-1 rounded-full flex items-center border ${
          isDark ? 'bg-neutral-900 border-white/10' : 'bg-neutral-200/80 border-neutral-300/40'
        }`}>
          {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                triggerHaptic('light');
                setPillTab(tab);
              }}
              className={`relative px-3.5 py-1 text-xs font-semibold rounded-full z-10 transition-colors cursor-pointer border-0 bg-transparent ${
                pillTab === tab
                  ? (isDark ? 'text-white' : 'text-black')
                  : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
              }`}
            >
              {pillTab === tab && (
                <motion.div
                  layoutId="pill-tabs-indicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute inset-0 rounded-full -z-10 shadow-sm ${
                    isDark ? 'bg-neutral-800 border border-white/10' : 'bg-white'
                  }`}
                />
              )}
              {tab}
            </button>
          ))}
        </div>
      );

    case 'morph-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 cursor-pointer border-0 ${
            isOn ? 'bg-indigo-600' : (isDark ? 'bg-neutral-800' : 'bg-neutral-300')
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 28 : 0, rotate: isOn ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-neutral-800"
          >
            {isOn ? <Unlock className="w-4 h-4 text-indigo-600" /> : <Lock className="w-4 h-4 text-neutral-600" />}
          </motion.div>
        </button>
      );

    case 'checkmark-draw':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 cursor-pointer border-0 ${
            isOn ? 'bg-emerald-500' : (isDark ? 'bg-neutral-800' : 'bg-neutral-300')
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 28 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {isOn && (
                <motion.svg
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="w-4 h-4 text-emerald-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      );

    case 'theme-toggle':
      return (
        <button
          onClick={handleToggle}
          className={`relative w-16 h-9 rounded-full p-1 transition-colors duration-300 cursor-pointer border-0 ${
            isOn ? 'bg-indigo-950 border border-indigo-700/50' : 'bg-amber-100 border border-amber-300'
          }`}
        >
          <motion.div
            animate={{ x: isOn ? 28 : 0, rotate: isOn ? 360 : 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center ${
              isOn ? 'bg-indigo-900 text-yellow-300' : 'bg-amber-400 text-white'
            }`}
          >
            {isOn ? <Moon className="w-4 h-4 fill-yellow-300" /> : <Sun className="w-4 h-4 fill-white" />}
          </motion.div>
        </button>
      );

    default:
      return null;
  }
};
