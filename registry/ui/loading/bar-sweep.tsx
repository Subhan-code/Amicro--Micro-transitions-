import React from 'react';
import { motion } from 'framer-motion';

export const BarSweep = () => {
  return (
    <div className="w-12 h-6 border-2 border-zinc-800 dark:border-zinc-700 rounded-full p-1 relative flex items-center overflow-hidden">
      <motion.div
        className="w-4 h-4 bg-zinc-800 dark:bg-white rounded-full absolute"
        animate={{ x: [0, 24, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
