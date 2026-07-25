import React from 'react';
import { motion } from 'framer-motion';

export const OffsetRings = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    <motion.div
      className="absolute w-12 h-12 border-2 border-zinc-800 dark:border-zinc-700 border-x-transparent rounded-full"
      animate={{ rotate: [0, 180, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-8 h-8 border-2 border-zinc-500 border-y-transparent rounded-full"
      animate={{ rotate: [0, -180, -360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
  </div>
);
