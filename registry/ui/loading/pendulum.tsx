import React from 'react';
import { motion } from 'framer-motion';

export const Pendulum = () => {
  return (
    <div className="relative w-16 h-12 flex items-start justify-center">
      <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full rounded-b-none absolute top-0" />
      <motion.div
        className="absolute top-0 w-1 bg-zinc-800 dark:bg-white origin-top flex flex-col items-center"
        animate={{ rotate: [-45, 45, -45] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-1 h-8 bg-zinc-800 dark:bg-white" />
        <div className="w-4 h-4 bg-zinc-800 dark:bg-white rounded-full" />
      </motion.div>
    </div>
  );
};
