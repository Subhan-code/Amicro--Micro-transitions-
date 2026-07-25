import React from 'react';
import { motion } from 'framer-motion';

export const SpringTextPop = () => {
  const text = "Loading...";
  return (
    <div className="flex font-medium text-sm tracking-widest text-zinc-800 dark:text-white">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="origin-bottom inline-block"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};
