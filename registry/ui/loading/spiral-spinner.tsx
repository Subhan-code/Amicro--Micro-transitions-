import React from 'react';
import { motion } from 'framer-motion';

export const SpiralSpinner = () => {
  return (
    <motion.div
      className="w-10 h-10 border-[3px] border-zinc-800 dark:border-zinc-700 rounded-full border-t-transparent"
      animate={{ rotate: 360, scale: [1, 0.8, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};
