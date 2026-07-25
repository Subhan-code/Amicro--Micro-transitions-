import React from 'react';
import { motion } from 'framer-motion';

export const AccordionLoader = () => {
  return (
    <div className="flex flex-col space-y-1.5 w-10 h-10 justify-center">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="w-full h-1 bg-zinc-800 dark:bg-white rounded-full origin-left"
          animate={{ scaleX: [1, 0.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
    </div>
  );
};
