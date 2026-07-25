import React from 'react';
import { motion } from 'framer-motion';

export const TripleDotSpinner = () => {
  return (
    <motion.div 
      className="relative w-10 h-10"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute top-0 left-1/2 w-2 h-2 bg-zinc-800 dark:bg-white rounded-full -ml-1 origin-[4px_20px]"
          style={{ transform: `rotate(${i * 120}deg)` }}
        />
      ))}
    </motion.div>
  );
};
