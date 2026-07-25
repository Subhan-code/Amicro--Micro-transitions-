import React from 'react';
import { motion } from 'framer-motion';

export const SpringHexagon = () => (
  <motion.svg className="w-10 h-10" viewBox="0 0 50 50"
    animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 60] }}
    transition={{ duration: 2, repeat: Infinity, type: "spring", bounce: 0.3 }}
  >
    <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" className="fill-zinc-800 dark:fill-white" />
  </motion.svg>
);
