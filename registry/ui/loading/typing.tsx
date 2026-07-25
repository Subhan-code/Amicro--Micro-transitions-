import React from 'react';
import { motion } from 'framer-motion';

export const Typing = () => {
  return (
    <div className="flex items-center text-zinc-900 dark:text-white font-medium text-lg w-20">
      Loading
      <motion.span
        className="w-1.5 h-4 bg-zinc-900 dark:bg-white ml-1 inline-block"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
