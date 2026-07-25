import React from 'react';
import { motion } from 'framer-motion';

export const TerminalLoader = () => {
  return (
    <div className="bg-zinc-900 dark:bg-white text-zinc-100 font-mono text-[10px] p-3 rounded-md w-full h-16 flex flex-col justify-end overflow-hidden shadow-sm">
      <div className="flex text-zinc-500 dark:text-zinc-300 mb-1 leading-none">
        <span>$</span>
        <span className="ml-2">loading...</span>
      </div>
      <div className="flex items-center leading-none">
        <span className="text-emerald-400">&gt;</span>
        <motion.span
          className="ml-2 w-1.5 h-2.5 bg-zinc-100 dark:bg-zinc-800 block"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};
