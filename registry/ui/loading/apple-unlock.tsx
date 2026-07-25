import React from 'react';
import { motion } from 'framer-motion';

export const AppleUnlock = ({ theme = 'light' }: { theme?: 'light' | 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div className="relative font-medium text-sm tracking-wide select-none">
      <span className="text-zinc-400 dark:text-zinc-600">
        Slide to unlock
      </span>
      <motion.div
        className="absolute inset-0 text-zinc-950 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-transparent via-current to-transparent"
        style={{
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      >
        Slide to unlock
      </motion.div>
    </div>
  );
};
