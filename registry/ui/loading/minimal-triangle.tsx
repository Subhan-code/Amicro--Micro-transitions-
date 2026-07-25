import React from 'react';
import { motion } from 'framer-motion';

export const MinimalTriangle = () => (
  <svg className="w-10 h-10 overflow-visible" viewBox="0 0 50 50">
    <polygon points="25,5 45,40 5,40" className="stroke-zinc-200 dark:stroke-zinc-800 fill-none" strokeWidth="3" />
    <motion.polygon
      points="25,5 45,40 5,40"
      className="stroke-zinc-800 dark:stroke-white fill-none"
      strokeWidth="3"
      strokeDasharray="120"
      animate={{ strokeDashoffset: [120, 0, -120] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </svg>
);
