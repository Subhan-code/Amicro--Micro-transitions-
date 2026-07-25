import React from 'react';
import { motion } from 'framer-motion';

export const NewtonsCradle = () => {
  return (
    <div className="flex items-center justify-center space-x-0.5">
      <motion.div
        className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full origin-top"
        animate={{ rotate: [25, 0, 0, 0, 0, 25] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full" />
      <div className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full" />
      <motion.div
        className="w-3 h-3 bg-zinc-800 dark:bg-white rounded-full origin-top"
        animate={{ rotate: [0, 0, 0, -25, 0, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
