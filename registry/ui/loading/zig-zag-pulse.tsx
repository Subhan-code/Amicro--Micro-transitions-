import React from 'react';
import { motion } from 'framer-motion';

export const ZigZagPulse = () => {
  return (
    <div className="grid grid-cols-3 gap-2 w-12 h-12">
      {[
        [0, 0], [1, 1], [2, 0],
        [0, 2], [1, 1], [2, 2]
      ].map(([col, row], i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 bg-zinc-800 dark:bg-white rounded-full"
          style={{ gridColumn: col + 1, gridRow: row + 1 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};
