import React from 'react';
import { motion } from 'framer-motion';

export const MorphingRing = () => (
  <motion.div
    className="w-10 h-10 border-[3px] border-zinc-800 dark:border-zinc-700"
    animate={{
      rotate: 180,
      borderRadius: ["10%", "50%", "10%"]
    }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  />
);
