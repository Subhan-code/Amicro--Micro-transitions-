import React from 'react';
import { motion } from 'framer-motion';

export const SquareAccordion = () => {
  return (
    <div className="flex space-x-1 w-12 h-12 justify-center items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 bg-zinc-800 dark:bg-white rounded-sm"
          animate={{ height: [12, 32, 12] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
