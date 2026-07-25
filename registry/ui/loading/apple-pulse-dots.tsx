import React from 'react';
import { motion } from 'framer-motion';

export const ApplePulseDots = () => (
  <div className="flex space-x-2">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full"
        animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
  </div>
);
