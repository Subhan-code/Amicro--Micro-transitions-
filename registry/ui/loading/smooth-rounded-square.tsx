import React from 'react';
import { motion } from 'framer-motion';

export const SmoothRoundedSquare = () => (
  <motion.div
    className="w-10 h-10 border-[3px] border-zinc-800 dark:border-zinc-700"
    animate={{ borderRadius: ["10%", "50%", "10%"] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  />
);
