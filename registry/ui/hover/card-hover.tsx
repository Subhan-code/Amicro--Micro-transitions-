import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardHoverProps {
  items: {
    id: string;
    title: string;
    description: string;
    link?: string;
  }[];
  className?: string;
  cardClassName?: string;
}

export function CardHover({
  items,
  className = '',
  cardClassName = '',
}: CardHoverProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 w-full ${className}`}>
      {items.map((item, idx) => (
        <a
          key={item.id}
          href={item.link || '#'}
          className="relative group block p-2 h-full w-full no-underline"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-zinc-800/[0.8] block rounded-3xl -z-10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <div
            className={`rounded-2xl h-full w-full p-5 overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-zinc-800 group-hover:border-slate-350 dark:group-hover:border-zinc-700 relative z-20 transition-colors duration-200 ${cardClassName}`}
          >
            <div className="relative z-50">
              <h4 className="text-zinc-900 dark:text-zinc-100 font-bold tracking-wide mt-2">
                {item.title}
              </h4>
              <p className="mt-2 text-zinc-500 dark:text-zinc-400 tracking-wide leading-relaxed text-sm">
                {item.description}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
