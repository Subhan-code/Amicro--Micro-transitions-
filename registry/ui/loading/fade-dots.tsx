import React from 'react';
import { motion } from 'framer-motion';

export const FadeDots = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
        />
      ))}
    </div>
  );
};
