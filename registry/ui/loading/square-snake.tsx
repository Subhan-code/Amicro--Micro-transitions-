import React from 'react';
import { motion } from 'framer-motion';

export const SquareSnake = () => {
  return (
    <div className="grid grid-cols-3 gap-1 w-10 h-10">
      {[
        [0,0], [1,0], [2,0],
        [0,1], [1,1], [2,1],
        [0,2], [1,2], [2,2]
      ].map(([x,y], i) => (
        <motion.div
          key={i}
          className="bg-zinc-800 dark:bg-white rounded-sm w-full h-full"
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: (x + y) * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
