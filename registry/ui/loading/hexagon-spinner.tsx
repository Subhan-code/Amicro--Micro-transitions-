import React from 'react';
import { motion } from 'framer-motion';

export const HexagonSpinner = () => {
  return (
    <svg className="w-10 h-10" viewBox="0 0 50 50">
      <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" className="stroke-zinc-200 dark:stroke-zinc-800 fill-none" strokeWidth="4" />
      <motion.polygon
        points="25,5 45,15 45,35 25,45 5,35 5,15"
        className="stroke-zinc-800 dark:stroke-white fill-none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="120"
        animate={{ strokeDashoffset: [120, -120] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};
