import React from 'react';
import { motion } from 'framer-motion';

export const FluidBars = () => (
  <div className="flex space-x-1">
    {[0,1,2,3].map(i => (
      <motion.div
        key={i}
        className="w-1.5 h-8 bg-zinc-800 dark:bg-white rounded-full origin-bottom"
        animate={{ rotate: [-15, 15, -15], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      />
    ))}
  </div>
);
