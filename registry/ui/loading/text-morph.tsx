import React from 'react';
import { motion } from 'framer-motion';

export const TextMorph = () => (
  <div className="relative h-6 w-24 flex items-center justify-center font-medium text-sm text-zinc-900 dark:text-white overflow-hidden">
    <motion.div
      className="absolute"
      animate={{ opacity: [1, 0, 0, 1], y: [0, -16, 16, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      Loading
    </motion.div>
    <motion.div
      className="absolute"
      animate={{ opacity: [0, 1, 1, 0], y: [16, 0, 0, -16] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      Wait
    </motion.div>
  </div>
);
