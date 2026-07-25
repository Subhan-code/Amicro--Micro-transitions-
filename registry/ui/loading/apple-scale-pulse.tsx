import React from 'react';
import { motion } from 'framer-motion';

export const AppleScalePulse = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <motion.div
      className="absolute w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full"
      animate={{ scale: [0, 1], opacity: [1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
    />
    <motion.div
      className="absolute w-full h-full bg-zinc-200 dark:bg-zinc-800 rounded-full"
      animate={{ scale: [0, 1], opacity: [1, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
    />
    <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full z-10" />
  </div>
);
