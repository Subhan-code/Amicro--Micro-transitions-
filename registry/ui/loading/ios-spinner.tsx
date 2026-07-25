import React from 'react';
import { motion } from 'framer-motion';

export const IOSSpinner = () => (
  <div className="relative w-8 h-8">
    {Array.from({ length: 12 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-full h-full"
        style={{ rotate: i * 30 }}
      >
        <motion.div
          className="w-[2px] h-[7px] bg-zinc-800 dark:bg-white rounded-full mx-auto"
          animate={{ opacity: [1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * (1/12), ease: "linear" }}
        />
      </motion.div>
    ))}
  </div>
);
