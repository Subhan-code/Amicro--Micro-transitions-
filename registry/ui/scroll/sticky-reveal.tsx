import React, { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';

interface StickyRevealProps {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  className?: string;
}

export function StickyReveal({
  content,
  className = '',
}: StickyRevealProps) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestIndex = cardsBreakpoints.reduce((acc, val, index) => {
      if (latest >= val) {
        return index;
      }
      return acc;
    }, 0);
    setActiveCard(closestIndex);
  });

  return (
    <div
      ref={ref}
      className={`relative flex justify-between gap-10 max-w-5xl mx-auto py-10 px-4 ${className}`}
    >
      <div className="w-1/2 flex flex-col gap-32 py-10">
        {content.map((item, index) => (
          <div key={index} className="min-h-[50vh] flex flex-col justify-center">
            <motion.h2
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              className="text-2xl font-bold mb-4"
            >
              {item.title}
            </motion.h2>
            <motion.p
              animate={{
                opacity: activeCard === index ? 1 : 0.3,
              }}
              className="text-neutral-500 dark:text-neutral-450 leading-relaxed"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>
      
      <div className="sticky top-20 h-[60vh] w-1/2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/10 overflow-hidden flex items-center justify-center">
        {content.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: activeCard === index ? 1 : 0,
              scale: activeCard === index ? 1 : 0.9,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 p-6 flex items-center justify-center"
          >
            {item.content || (
              <div className="text-lg font-semibold text-neutral-400">
                Card {index + 1} Visual
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
