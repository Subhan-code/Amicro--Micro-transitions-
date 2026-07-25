import React from 'react';
import { motion } from 'framer-motion';

export const WanderingCube = () => {
  return (
    <div className="relative w-10 h-10">
      <motion.div
        className="absolute top-0 left-0 w-4 h-4 bg-zinc-800 dark:bg-white rounded-sm"
        animate={{ 
          x: [0, 24, 24, 0, 0],
          y: [0, 0, 24, 24, 0],
          rotate: [0, -90, -180, -270, -360]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
