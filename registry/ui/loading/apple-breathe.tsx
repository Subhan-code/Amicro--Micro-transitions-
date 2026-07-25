import React from 'react';
import { motion } from 'framer-motion';

export const AppleBreathe = () => {
  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
        // Alternating color teal-blue palette
        const bgClass = idx % 2 === 0 
          ? 'bg-teal-400/35 dark:bg-teal-400/40' 
          : 'bg-cyan-400/35 dark:bg-cyan-400/40';
        return (
          <motion.div
            key={angle}
            className={`absolute w-3.5 h-3.5 rounded-full ${bgClass}`}
            style={{ transformOrigin: 'center' }}
            animate={{
              scale: [1, 1.75, 1],
              x: [0, Math.cos(angle * Math.PI / 180) * 11, 0],
              y: [0, Math.sin(angle * Math.PI / 180) * 11, 0]
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
};
