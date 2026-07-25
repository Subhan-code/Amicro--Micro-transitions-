import React from 'react';
import { motion } from 'framer-motion';

export const SlidingBars = () => (
  <div className="relative w-8 h-8">
    <motion.div
      className="absolute top-0 left-0 w-8 h-1.5 bg-zinc-800 dark:bg-white rounded-full"
      animate={{ y: [0, 24, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute bottom-0 left-0 w-8 h-1.5 bg-zinc-400 dark:bg-zinc-200 rounded-full"
      animate={{ y: [0, -24, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);
