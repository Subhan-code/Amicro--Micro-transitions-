import React from 'react';
import { motion } from 'framer-motion';

export const DotSpinner = () => {
  return (
    <div className="relative w-10 h-10">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-1/2 w-2 h-2 bg-zinc-800 dark:bg-white rounded-full -ml-1 origin-[4px_20px]"
          style={{ rotate: i * 45 }}
          animate={{ opacity: [1, 0.2] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.125, ease: "linear" }}
        />
      ))}
    </div>
  );
};
