import React from 'react';
import { motion } from 'framer-motion';

export const DashRing = () => {
  return (
    <svg className="w-12 h-12" viewBox="0 0 50 50">
      <motion.circle
        cx="25" cy="25" r="20"
        className="stroke-zinc-800 dark:stroke-white fill-none"
        strokeWidth="3"
        strokeDasharray="8 8"
        animate={{ rotate: 360 }}
        style={{ transformOrigin: 'center' }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};
