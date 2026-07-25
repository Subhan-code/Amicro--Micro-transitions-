import React from 'react';
import { motion } from 'framer-motion';

export const RotatingTriangle = () => {
  return (
    <svg className="w-10 h-10 overflow-visible" viewBox="0 0 50 50">
      <motion.polygon
        points="25,5 45,40 5,40"
        className="stroke-zinc-800 dark:stroke-white fill-none origin-center"
        strokeWidth="4"
        strokeLinejoin="round"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};
