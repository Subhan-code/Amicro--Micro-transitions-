import React from 'react';
import { motion } from 'framer-motion';

export const FluidDotOrbit = () => (
  <div className="relative w-10 h-10 flex items-center justify-center">
    <div className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full" />
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-2 h-2 bg-zinc-500 dark:bg-zinc-350 rounded-full absolute top-1 left-1/2 -ml-1" />
    </motion.div>
  </div>
);
