import React from 'react';
import { motion } from 'framer-motion';

export const AppleIconMorph = () => (
  <motion.div
    className="w-8 h-8 bg-zinc-800 dark:bg-white"
    animate={{
      borderRadius: ["20%", "50%", "50%", "20%"],
      rotate: [0, 90, 180, 270]
    }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  />
);
