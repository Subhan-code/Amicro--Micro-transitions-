import React from 'react';
import { motion } from 'framer-motion';

export const RingSweep = () => {
  return (
    <motion.div
      className="w-10 h-10 border-[3px] border-zinc-200 dark:border-zinc-800 rounded-full border-t-zinc-800 dark:border-t-white"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};
