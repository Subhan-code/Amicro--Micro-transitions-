import React from 'react';
import { motion } from 'framer-motion';

export const Hourglass = () => {
  return (
    <motion.div
      className="w-8 h-10 flex flex-col items-center justify-between"
      animate={{ rotate: [0, 180, 180, 360, 360] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="w-8 h-0 border-t-[16px] border-t-zinc-800 dark:border-t-white border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent origin-bottom" />
      <div className="w-8 h-0 border-b-[16px] border-b-zinc-800 dark:border-b-white border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent origin-top" />
    </motion.div>
  );
};
