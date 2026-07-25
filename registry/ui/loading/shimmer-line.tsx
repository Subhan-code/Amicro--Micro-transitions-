import React from 'react';
import { motion } from 'framer-motion';

export const ShimmerLine = () => {
  return (
    <div className="w-24 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-1/3 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
