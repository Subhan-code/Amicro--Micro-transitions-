import React from 'react';
import { motion } from 'framer-motion';

export const WatchSpinner = () => (
  <div className="relative w-12 h-12 flex items-center justify-center">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="absolute rounded-full border-[3px] border-transparent border-t-zinc-800 dark:border-t-white"
        style={{ width: 44 - i * 12, height: 44 - i * 12 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}
  </div>
);
