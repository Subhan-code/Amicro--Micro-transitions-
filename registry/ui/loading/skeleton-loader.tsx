import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader = () => {
  return (
    <div className="w-full max-w-[120px] space-y-2">
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-8 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
      </div>
      <motion.div
        className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.div
        className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full w-4/5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
    </div>
  );
};
