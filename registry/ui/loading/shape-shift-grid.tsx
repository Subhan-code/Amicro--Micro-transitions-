import React from 'react';
import { motion } from 'framer-motion';

export const ShapeShiftGrid = () => (
  <div className="grid grid-cols-2 gap-1 w-8 h-8">
    {[0,1,2,3].map(i => (
      <motion.div
        key={i}
        className="w-full h-full bg-zinc-800 dark:bg-white"
        animate={{ borderRadius: ["10%", "50%", "10%"], scale: [1, 0.8, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
      />
    ))}
  </div>
);
