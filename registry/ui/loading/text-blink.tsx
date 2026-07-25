import React from 'react';
import { motion } from 'framer-motion';

export const TextBlink = () => {
  return (
    <motion.div
      className="text-zinc-900 dark:text-white font-medium text-lg"
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      Thinking
    </motion.div>
  );
};
