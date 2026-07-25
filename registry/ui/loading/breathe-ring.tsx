import React from 'react';
import { motion } from 'framer-motion';

export const BreatheRing = () => (
  <motion.div
    className="w-10 h-10 rounded-full border-4 border-zinc-800 dark:border-zinc-700"
    animate={{ scale: [0.8, 1.1, 0.8], borderWidth: [6, 2, 6] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
  />
);
