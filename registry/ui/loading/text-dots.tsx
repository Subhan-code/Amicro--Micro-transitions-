import React from 'react';
import { motion } from 'framer-motion';

export const TextDots = () => {
  return (
    <div className="font-medium text-lg text-zinc-900 dark:text-white flex w-24">
      <span>Thinking</span>
      <span className="flex w-6 pl-0.5">
        <motion.span animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}>.</motion.span>
        <motion.span animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, times: [0, 0.6, 0.8, 1] }}>.</motion.span>
      </span>
    </div>
  );
};
