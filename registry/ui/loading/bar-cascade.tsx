import React from 'react';
import { motion } from 'framer-motion';

export const BarCascade = () => {
  return (
    <div className="flex space-x-1 items-center h-8">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ height: ["8px", "24px", "8px"] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
