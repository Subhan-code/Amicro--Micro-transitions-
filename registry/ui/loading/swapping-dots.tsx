import React from 'react';
import { motion } from 'framer-motion';

export const SwappingDots = () => {
  return (
    <div className="relative w-12 h-4 flex items-center">
      <motion.div
        className="absolute left-0 w-4 h-4 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ x: [0, 32, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 w-4 h-4 bg-zinc-400 dark:bg-zinc-200 rounded-full"
        animate={{ x: [0, -32, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
