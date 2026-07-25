import React from 'react';
import { motion } from 'framer-motion';

export const ClockSpinner = () => {
  return (
    <div className="relative w-10 h-10 border-2 border-zinc-800 dark:border-zinc-700 rounded-full flex items-center justify-center">
      <motion.div
        className="absolute w-0.5 h-3.5 bg-zinc-800 dark:bg-white rounded-full origin-bottom"
        style={{ bottom: "50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-0.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full origin-bottom"
        style={{ bottom: "50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
