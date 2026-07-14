import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FocusBlurItem {
  label: string;
  href?: string;
}

interface FocusBlurProps {
  items?: FocusBlurItem[];
  blurAmount?: number;
  opacityAmount?: number;
  showBrackets?: boolean;
  className?: string;
}

export function FocusBlur({
  items = [
    { label: '@Twitter', href: '#' },
    { label: '@Threads', href: '#' },
    { label: '@Instagram', href: '#' },
    { label: '@GitHub', href: '#' }
  ],
  blurAmount = 4,
  opacityAmount = 0.4,
  showBrackets = true,
  className = ''
}: FocusBlurProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-wrap justify-center items-center gap-6 py-6 px-10 cursor-default ${className}`}>
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const isAnyHovered = hoveredIndex !== null;
        const isInactive = isAnyHovered && !isHovered;

        return (
          <a
            key={index}
            href={item.href || '#'}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative font-semibold text-lg sm:text-2xl no-underline transition-all duration-300 select-none outline-none"
            style={{
              filter: isInactive ? `blur(${blurAmount}px)` : 'none',
              opacity: isInactive ? opacityAmount : 1,
              color: isHovered ? 'var(--color-blue-500, #3b82f6)' : 'inherit'
            }}
          >
            <span className="relative z-10">{item.label}</span>
            
            {/* Focus brackets on hover */}
            {showBrackets && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="absolute inset-0 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg pointer-events-none z-0"
                    style={{ margin: '-4px -8px' }}
                  />
                )}
              </AnimatePresence>
            )}
          </a>
        );
      })}
    </div>
  );
}
