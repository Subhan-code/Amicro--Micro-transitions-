import React from 'react';
import { motion } from 'framer-motion';

export const LineSpinner = () => {
  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-zinc-200 dark:border-zinc-800 rounded-full absolute" />
      <motion.div
        className="w-8 h-1 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
