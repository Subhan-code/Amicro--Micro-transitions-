import React from 'react';
import { motion } from 'framer-motion';

export const ArcTracer = () => {
  return (
    <svg className="w-10 h-10" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" className="stroke-zinc-200 dark:stroke-zinc-800 fill-none" strokeWidth="4" />
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        className="stroke-zinc-800 dark:stroke-white fill-none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="125"
        animate={{ strokeDashoffset: [125, 0, -125] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
};
