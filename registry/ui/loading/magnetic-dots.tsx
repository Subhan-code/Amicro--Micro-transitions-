import React from 'react';
import { motion } from 'framer-motion';

export const MagneticDots = () => (
  <div className="flex space-x-1.5" style={{ filter: "url(#goo)" }}>
    <svg width="0" height="0" className="absolute hidden">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
      </defs>
    </svg>
    <motion.div
      className="w-4 h-4 bg-zinc-800 dark:bg-white rounded-full"
      animate={{ x: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="w-4 h-4 bg-zinc-800 dark:bg-white rounded-full"
      animate={{ x: [0, -8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);
