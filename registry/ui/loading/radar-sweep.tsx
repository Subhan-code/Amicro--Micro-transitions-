import React from 'react';
import { motion } from 'framer-motion';

export const RadarSweep = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div className="relative w-12 h-12 rounded-full border border-zinc-800/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
      {/* Concentric rings */}
      <div className="absolute w-8 h-8 rounded-full border border-zinc-800/5 dark:border-white/5" />
      <div className="absolute w-4 h-4 rounded-full border border-zinc-800/5 dark:border-white/5" />
      
      {/* Center dot */}
      <div className="absolute w-1.5 h-1.5 rounded-full bg-zinc-800/80 dark:bg-white/80" />

      {/* Sweep hand */}
      <motion.div
        className="absolute inset-0 origin-center"
        style={{
          background: isDark
            ? "conic-gradient(from 0deg, transparent 50%, rgba(255,255,255,0.02) 65%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0.55) 100%)"
            : "conic-gradient(from 0deg, transparent 50%, rgba(39,39,42,0.02) 65%, rgba(39,39,42,0.1) 85%, rgba(39,39,42,0.45) 100%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
