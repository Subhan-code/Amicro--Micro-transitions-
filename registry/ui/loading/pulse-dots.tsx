import React from 'react';
import { motion } from 'framer-motion';

export const PulseDots = () => {
  return (
    <div className="flex space-x-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};
