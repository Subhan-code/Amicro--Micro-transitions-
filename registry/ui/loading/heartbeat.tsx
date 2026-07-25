import React from 'react';
import { motion } from 'framer-motion';

export const Heartbeat = () => {
  return (
    <svg className="w-16 h-8 overflow-visible" viewBox="0 0 64 32">
      <motion.polyline
        points="0,16 16,16 24,4 32,28 40,16 64,16"
        className="stroke-zinc-800 dark:stroke-white fill-none"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="100"
        animate={{ strokeDashoffset: [100, -100] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};
