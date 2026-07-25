import React from 'react';
import { motion } from 'framer-motion';

export const MorphingBars = () => (
  <motion.div
    className="flex space-x-1 h-8 items-center"
    animate={{ gap: ['4px', '0px', '4px'] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    {[0,1,2].map(i => (
      <motion.div
        key={i}
        className="w-2 h-8 bg-zinc-800 dark:bg-white rounded-sm"
        animate={{ height: [32, 16, 32] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </motion.div>
);
