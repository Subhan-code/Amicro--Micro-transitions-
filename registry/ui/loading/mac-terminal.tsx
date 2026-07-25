import React from 'react';
import { motion } from 'framer-motion';

export const MacTerminal = () => (
  <div className="flex items-center text-zinc-900 dark:text-white font-mono text-sm">
    <span>~ %</span>
    <motion.span
      className="ml-1.5 w-2 h-4 bg-zinc-900 dark:bg-white inline-block"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);
