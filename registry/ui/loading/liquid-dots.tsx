import React from 'react';
import { motion } from 'framer-motion';

export const LiquidDots = () => {
  return (
    <div className="relative w-16 h-8 flex items-center justify-center" style={{ filter: "url(#goo)" }}>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="absolute w-6 h-6 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ x: [-16, 16, -16] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-6 h-6 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ x: [16, -16, 16] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
