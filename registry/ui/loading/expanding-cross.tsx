import React from 'react';
import { motion } from 'framer-motion';

export const ExpandingCross = () => {
  return (
    <div className="relative w-8 h-8">
      <motion.div
        className="absolute top-1/2 left-0 w-full h-1 bg-zinc-800 dark:bg-white -mt-0.5 rounded-full"
        animate={{ scaleX: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-0 h-full w-1 bg-zinc-800 dark:bg-white -ml-0.5 rounded-full"
        animate={{ scaleY: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
      />
    </div>
  );
};
