import { ButtonConfig } from '../data/buttons';

export function getComponentCode(button: ButtonConfig): string {
  const icon1Name = typeof button.icon1 === 'string' ? 'AppleIcon' : (button.icon1.name || button.icon1.displayName || 'Icon');
  const icon2Name = button.icon2 ? (button.icon2.name || button.icon2.displayName || 'Icon') : 'Icon';

  switch (button.interactionType) {
    case 'slide-arrow':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name}, ${icon2Name} } from 'lucide-react';

export default function SlideArrowButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <AnimatePresence mode="popLayout">
        {!isHovered && (
          <motion.div
            key="icon1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            className="flex items-center shrink-0 mr-2.5"
          >
            <${icon1Name} className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="font-medium tracking-tight text-[13px]">${button.label}</span>
      <AnimatePresence mode="popLayout">
        {isHovered && (
          <motion.div
            key="icon2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            className="flex items-center shrink-0 ml-2.5"
          >
            <${icon2Name} className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}`;

    case 'sparkle':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name}, ${icon2Name} } from 'lucide-react';

export default function SparkleButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isHovered ? (
            <motion.div
              key="icon1"
              initial={{ y: -15, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -15, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon1Name} className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="icon2"
              initial={{ y: 15, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon2Name} className="w-4 h-4 text-yellow-400" />
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -45, y: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 45, y: 10 }}
                transition={{ type: "spring", stiffness: 600, damping: 25, delay: 0.05 }}
                className="absolute -top-3 -right-2"
              >
                <svg className="w-2.5 h-2.5 text-yellow-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'morph':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name}, ${icon2Name} } from 'lucide-react';

export default function MorphButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isHovered ? (
            <motion.div
              key="icon1"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon1Name} className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="icon2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon2Name} className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'color-morph':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function ColorMorphButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <${icon1Name} className={\`w-4 h-4 transition-colors duration-300 \${isHovered ? 'text-blue-400 fill-blue-400' : 'text-neutral-300'}\`} />
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'pulse':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function PulseButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <motion.div
          animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <${icon1Name} className="w-4 h-4" />
        </motion.div>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'rotate':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function RotateButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <${icon1Name} className="w-4 h-4" />
        </motion.div>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'shake':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function ShakeButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <motion.div
          animate={{
            y: isHovered ? [0, -2, 0, -2, 0] : 0,
            rotate: isHovered ? [0, -10, 10, -10, 0] : 0
          }}
          transition={{ duration: 0.4 }}
        >
          <${icon1Name} className="w-4 h-4 text-red-400" />
        </motion.div>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5 text-red-400">${button.label}</span>
    </motion.button>
  );
}`;

    case 'ring':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name}, ${icon2Name} } from 'lucide-react';

export default function RingButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <AnimatePresence mode="popLayout" initial={false}>
          {!isHovered ? (
            <motion.div
              key="icon1"
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 15, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon1Name} className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="icon2"
              initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 15, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <${icon2Name} className="w-4 h-4 text-orange-400" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 15, delay: 0.1 }}
                className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
    </motion.button>
  );
}`;

    case 'glare':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function GlareButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer overflow-hidden transition-colors duration-150"
    >
      <${icon1Name} className="w-4 h-4 mr-2.5" />
      <span className="font-medium tracking-tight text-[13px]">${button.label}</span>
      <motion.div
        animate={{ x: isHovered ? ['-150%', '150%'] : '-150%' }}
        transition={{ duration: 0.85, ease: "easeInOut", repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        className="absolute top-0 bottom-0 w-[50px] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"
      />
    </motion.button>
  );
}`;

    case 'text-reveal':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function TextRevealButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0 mr-2.5">
        <motion.div animate={{ rotate: isHovered ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <${icon1Name} className="w-4 h-4" />
        </motion.div>
      </div>
      <div className="relative h-[18px] overflow-hidden">
        <motion.div
          animate={{ y: isHovered ? -18 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex flex-col"
        >
          <span className="block h-[18px] leading-[18px] font-medium tracking-tight text-[13px] whitespace-nowrap text-white">
            ${button.label}
          </span>
          <span className="block h-[18px] leading-[18px] font-medium tracking-tight text-[13px] whitespace-nowrap text-white">
            ${button.label}
          </span>
        </motion.div>
      </div>
    </motion.button>
  );
}`;

    case 'magnetic':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function MagneticButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMouseCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseCoords({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: isHovered ? mouseCoords.x : 0,
        y: isHovered ? mouseCoords.y : 0
      }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <${icon1Name} className="w-4 h-4 mr-2.5" />
      <span className="font-medium tracking-tight text-[13px]">${button.label}</span>
    </motion.button>
  );
}`;

    case 'expand-ring':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ${icon1Name} } from 'lucide-react';

export default function ExpandRingButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className="relative flex items-center justify-center text-white h-[36px] px-6 rounded-[40px] bg-white/[0.04] hover:bg-white/[0.06] border border-white/5 cursor-pointer transition-colors duration-150"
    >
      <div className="relative w-[16px] h-[16px] flex items-center justify-center shrink-0">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <${icon1Name} className="w-4 h-4" />
        </motion.div>
      </div>
      <span className="font-medium tracking-tight text-[13px] ml-2.5">${button.label}</span>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/20"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}`;

    case 'focus-blur':
      return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function FocusBlur({
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
    <div className={\`flex flex-wrap justify-center items-center gap-6 py-6 px-10 cursor-default \${className}\`}>
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
              filter: isInactive ? \`blur(\${blurAmount}px)\` : 'none',
              opacity: isInactive ? opacityAmount : 1,
              color: isHovered ? '#3b82f6' : 'inherit'
            }}
          >
            <span className="relative z-10">{item.label}</span>
            
            {showBrackets && (
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{ opacity: 1, scale: 1.1 }}
                    exit={{ opacity: 0, scale: 1.3 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                    className="absolute inset-0 border-2 border-dashed border-neutral-700 rounded-lg pointer-events-none z-0"
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
}`;

    default:
      return `// No interaction component defined for this type.`;
  }
}

export const ThemeToggleCode = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.classList.toggle('light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors"
      title="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </button>
  );
}`;

import { CardConfig } from '../data/cards';

export function getCardComponentCode(card: CardConfig): string {
  switch (card.interactionType) {
    case 'card-arc-5':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardArc5Props {
  angle?: number;
  gap?: number;
  yOffset?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardArc5({
  angle = 30,
  gap = 70,
  yOffset = 10,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardArc5Props) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = isHovered ? dist * (angle / center) * hoverIntensity : 0;
        const targetX = isHovered ? dist * (gap / center) * hoverIntensity : 0;
        
        let targetY = 0;
        if (isHovered) {
          if (Math.abs(dist) === 2) targetY = yOffset;
          else if (Math.abs(dist) === 1) targetY = -0.2 * yOffset;
          else targetY = -yOffset;
          targetY = targetY * hoverIntensity;
        }

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isHovered ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-arc-7':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardArc7Props {
  angle?: number;
  gap?: number;
  yOffset?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardArc7({
  angle = 45,
  gap = 110,
  yOffset = 30,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardArc7Props) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4, 5, 6];
  const center = 3;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = isHovered ? dist * (angle / center) * hoverIntensity : 0;
        const targetX = isHovered ? dist * (gap / center) * hoverIntensity : 0;
        
        let targetY = 0;
        if (isHovered) {
          if (Math.abs(dist) === 3) targetY = yOffset;
          else if (Math.abs(dist) === 2) targetY = 0.33 * yOffset;
          else if (Math.abs(dist) === 1) targetY = -0.17 * yOffset;
          else targetY = -0.5 * yOffset;
          targetY = targetY * hoverIntensity;
        }

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isHovered ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 4 - Math.abs(dist),
              originX: 0.5,
              originY: 1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-long-arc-5':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardLongArc5Props {
  angle?: number;
  gap?: number;
  yOffset?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardLongArc5({
  angle = 15,
  gap = 140,
  yOffset = 20,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardLongArc5Props) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = isHovered ? dist * (angle / center) * hoverIntensity : 0;
        const targetX = isHovered ? dist * (gap / center) * hoverIntensity : 0;
        
        let targetY = 0;
        if (isHovered) {
          if (Math.abs(dist) === 2) targetY = yOffset;
          else if (Math.abs(dist) === 1) targetY = 0.25 * yOffset;
          else targetY = -0.25 * yOffset;
          targetY = targetY * hoverIntensity;
        }

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isHovered ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-linear-spread':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardLinearSpreadProps {
  gap?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardLinearSpread({
  gap = 90,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardLinearSpreadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetX = isHovered ? dist * (gap / center) * hoverIntensity : 0;

        return (
          <motion.div
            key={i}
            animate={{
              x: targetX,
              scale: isHovered ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist)
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-corner-fan':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardCornerFanProps {
  angle?: number;
  duration?: number;
  hoverIntensity?: number;
  cardClassName?: string;
  className?: string;
}

export default function CardCornerFan({
  angle = 40,
  duration = 0.5,
  hoverIntensity = 1,
  cardClassName = 'bg-neutral-800',
  className = ''
}: CardCornerFanProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const total = cards.length;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const offsetRatio = i / (total - 1);
        const startAngle = -10;
        const targetRotate = isHovered ? (startAngle + offsetRatio * angle) * hoverIntensity : 0;

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              scale: isHovered && i === 2 ? 1.03 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 5 - i,
              originX: 0,
              originY: 1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-stamp-arc':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardStampArcProps {
  arc?: number;
  spread?: number;
  yOffset?: number;
  isColorful?: boolean;
  duration?: number;
  hoverIntensity?: number;
  className?: string;
}

export default function CardStampArc({
  arc = 25,
  spread = 180,
  yOffset = 40,
  isColorful = false,
  duration = 0.5,
  hoverIntensity = 1,
  className = ''
}: CardStampArcProps) {
  const [isHovered, setIsHovered] = useState(false);

  const stamps = [
    { id: 0, color: 'bg-red-500' },
    { id: 1, color: 'bg-blue-500' },
    { id: 2, color: 'bg-emerald-500' },
    { id: 3, color: 'bg-amber-500' },
    { id: 4, color: 'bg-purple-500' }
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {stamps.map((stamp, i) => {
        const dist = i - 2;
        
        let targetRotate = 0;
        let targetX = 0;
        let targetY = 0;

        if (isHovered) {
          if (i === 0) {
            targetRotate = -1 * arc;
            targetX = -1 * spread;
            targetY = yOffset;
          } else if (i === 1) {
            targetRotate = -0.48 * arc;
            targetX = -0.5 * spread;
            targetY = 0.25 * yOffset;
          } else if (i === 2) {
            targetRotate = 0;
            targetX = 0;
            targetY = -0.25 * yOffset;
          } else if (i === 3) {
            targetRotate = 0.48 * arc;
            targetX = 0.5 * spread;
            targetY = 0.25 * yOffset;
          } else if (i === 4) {
            targetRotate = arc;
            targetX = spread;
            targetY = yOffset;
          }

          targetRotate *= hoverIntensity;
          targetX *= hoverIntensity;
          targetY *= hoverIntensity;
        }

        return (
          <motion.div
            key={stamp.id}
            animate={{
              rotate: targetRotate,
              x: targetX,
              y: targetY,
              scale: isHovered ? (dist === 0 ? 1.05 : 1) : 1
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              mass: 0.8,
              duration
            }}
            style={{
              zIndex: 3 - Math.abs(dist),
              originX: 0.5,
              originY: 1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_10px_-2px_rgba(0,0,0,0.15)] border-2 border-dashed border-white/40 \${
              isColorful ? stamp.color : 'bg-neutral-800'
            }\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-cascade-stagger':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardCascadeStaggerProps {
  className?: string;
  cardClassName?: string;
}

export default function CardCascadeStagger({
  className = '',
  cardClassName = 'bg-neutral-800'
}: CardCascadeStaggerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetY = isHovered ? dist * -28 - 14 : dist * 2;
        const targetX = isHovered ? dist * 14 : 0;
        const targetRotate = isHovered ? dist * 6 : 0;

        return (
          <motion.div
            key={i}
            animate={{
              y: targetY,
              x: targetX,
              rotate: targetRotate,
              scale: isHovered ? (dist === 0 ? 1.05 : 0.98) : 1
            }}
            transition={{ type: "spring", stiffness: 200, damping: 22, mass: 0.9 }}
            style={{ zIndex: 5 - Math.abs(dist) }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-scatter-spread':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardScatterSpreadProps {
  className?: string;
  cardClassName?: string;
}

export default function CardScatterSpread({
  className = '',
  cardClassName = 'bg-neutral-850'
}: CardScatterSpreadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];

  const offsets = [
    { x: -75, y: 15, rotate: -14 },
    { x: -35, y: -15, rotate: -6 },
    { x: 0, y: -30, rotate: 2 },
    { x: 35, y: -10, rotate: 8 },
    { x: 75, y: 20, rotate: 15 }
  ];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const targetX = isHovered ? offsets[i].x : 0;
        const targetY = isHovered ? offsets[i].y : 0;
        const targetRotate = isHovered ? offsets[i].rotate : 0;

        return (
          <motion.div
            key={i}
            animate={{
              x: targetX,
              y: targetY,
              rotate: targetRotate,
              scale: isHovered ? (i === 2 ? 1.05 : 0.98) : 1
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.8 }}
            style={{ zIndex: 5 - Math.abs(i - 2) }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-wheel-fan':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CardWheelFanProps {
  className?: string;
  cardClassName?: string;
}

export default function CardWheelFan({
  className = '',
  cardClassName = 'bg-neutral-800'
}: CardWheelFanProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2, 3, 4];
  const center = 2;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`relative w-[8rem] h-[11rem] cursor-pointer flex items-center justify-center \${className}\`}
    >
      {cards.map((i) => {
        const dist = i - center;
        const targetRotate = isHovered ? dist * 18 : 0;
        
        let targetY = 0;
        if (isHovered) {
          if (Math.abs(dist) === 2) targetY = -8;
          else if (Math.abs(dist) === 1) targetY = -22;
          else targetY = -28;
        }

        return (
          <motion.div
            key={i}
            animate={{
              rotate: targetRotate,
              y: targetY,
              scale: isHovered ? (dist === 0 ? 1.05 : 0.98) : 1
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20, mass: 0.8 }}
            style={{
              zIndex: 5 - Math.abs(dist),
              originX: 0.5,
              originY: 1.1
            }}
            className={\`absolute inset-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/5 \${cardClassName}\`}
          />
        );
      })}
    </div>
  );
}`;

    case 'card-carousel':
      return `import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunset Beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    title: 'Misty Mountains',
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    title: 'Forest Trail',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunlight Woods',
  },
  {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    title: 'Green Hills',
  },
];

interface CardCarouselProps {
  className?: string;
  images?: { src: string; title: string }[];
}

export default function CardCarousel({
  className = '',
  images = DEFAULT_ASSETS
}: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const toPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const toNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.min(images.length - 1, prev + 1));
  };

  const toSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  const slideWidth = 160;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none \${className}\`}
    >
      <div 
        className="relative h-[180px] flex items-center justify-start overflow-visible"
        style={{ width: \`\${slideWidth}px\` }}
      >
        <motion.div 
          className="flex w-fit items-center"
          animate={{ x: -activeIndex * slideWidth }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
        >
          {images.map((item, i) => {
            const isActive = activeIndex === i;
            const diff = i - activeIndex;

            const targetRotate = isHovered ? diff * 20 : diff * 5;
            const targetScale = isActive ? 1.05 : (isHovered ? 0.65 : 0.8);
            const targetY = isHovered ? diff * 24 : 0;

            return (
              <motion.div 
                key={i}
                className="shrink-0 flex flex-col items-center gap-1.5 will-change-[transform,scale]"
                style={{ width: \`\${slideWidth}px\` }}
                animate={{ 
                  rotate: targetRotate, 
                  scale: targetScale, 
                  y: targetY 
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
              >
                <div 
                  className={\`text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all duration-300 \${isActive ? 'opacity-100 scale-100 text-white' : 'opacity-0 scale-75 text-neutral-400'}\`} 
                >
                  {item.title}
                </div>

                <img 
                  src={item.src} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-[110px] h-[110px] object-cover rounded-xl shadow-lg border border-white/10 cursor-pointer" 
                  onClick={(e) => toSlide(e, i)} 
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-4 px-1.5 py-0.5 flex items-center gap-2 justify-center text-neutral-400 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/5 shadow-md z-20">
        <button onClick={toPrev} className="p-1 cursor-pointer hover:bg-white/5 rounded-full transition-colors border-0 bg-transparent text-neutral-400 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => toSlide(e, i)}
              className={\`rounded-full cursor-pointer h-1 transition-all duration-300 \${activeIndex === i ? 'w-4 bg-white' : 'w-1 bg-white/30 hover:bg-white/50'}\`}>
            </div>
          ))}
        </div>
        <button onClick={toNext} className="p-1 cursor-pointer hover:bg-white/5 rounded-full transition-colors border-0 bg-transparent text-neutral-400 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}`;

    case 'card-cover-flow':
      return `import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunset Beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    title: 'Misty Mountains',
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    title: 'Forest Trail',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunlight Woods',
  },
  {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    title: 'Green Hills',
  },
];

interface CardCoverFlowProps {
  className?: string;
  images?: { src: string; title: string }[];
}

export default function CardCoverFlow({
  className = '',
  images = DEFAULT_ASSETS
}: CardCoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  const toPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const toNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.min(images.length - 1, prev + 1));
  };

  const toSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <div className={\`w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none bg-zinc-950/40 rounded-2xl \${className}\`} style={{ perspective: '1000px' }}>
      <div className="w-full flex justify-center items-center relative h-[140px] [transform-style:preserve-3d]">
        {images.map((item, i) => {
          const isActive = activeIndex === i;
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          const isPast = i < activeIndex;
          
          return (
            <motion.div 
              key={i}
              className="absolute w-[80px] aspect-[3/4] cursor-pointer"
              initial={false}
              animate={{ 
                x: offset * 32,
                rotateY: isActive ? 0 : (isPast ? 38 : -38),
                z: isActive ? 50 : -absOffset * 50,
                scale: isActive ? 1.1 : 1 - (absOffset * 0.08),
                opacity: absOffset > 2 ? 0 : 1 - (absOffset * 0.25)
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{ zIndex: 100 - absOffset }}
              onClick={(e) => toSlide(e, i)}
            >
              <img 
                src={item.src} 
                alt={item.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10" 
              />
              <motion.div 
                className="absolute -bottom-6 left-[-20px] right-[-20px] text-center text-[10px] font-semibold text-white/80 whitespace-nowrap overflow-hidden text-ellipsis"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -5 }}
              >
                {item.title}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 w-fit px-1.5 py-0.5 flex items-center gap-2 justify-center text-zinc-300 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm z-20">
        <button onClick={toPrev} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => toSlide(e, i)}
              className={\`rounded-full cursor-pointer h-1 transition-all duration-300 \${activeIndex === i ? 'w-4 bg-white' : 'w-1 bg-white/30 hover:bg-white/50'}\`}>
            </div>
          ))}
        </div>
        <button onClick={toNext} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}`;

    case 'card-time-machine':
      return `import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const TIMELINE_DATA = [
  { date: 'Today', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', title: 'Sunset Beach' },
  { date: '1d ago', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', title: 'Misty Mountains' },
  { date: '1w ago', src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80', title: 'Forest Trail' },
  { date: '1m ago', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80', title: 'Sunlight Woods' },
  { date: '1y ago', src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', title: 'Green Hills' },
];

interface CardTimeMachineProps {
  className?: string;
}

export default function CardTimeMachine({
  className = ''
}: CardTimeMachineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleTimelineHover = (index: number) => {
    setHoveredIndex(index);
    setActiveIndex(Math.round(index));
  };

  const timelineNodes = useMemo(() => {
    const nodes: { type: 'main' | 'sub'; index: number; date?: string }[] = [];
    TIMELINE_DATA.forEach((item, i) => {
      nodes.push({ type: 'main', index: i, date: item.date });
      if (i < TIMELINE_DATA.length - 1) {
        for (let j = 0; j < 2; j++) {
          nodes.push({ type: 'sub', index: i + (j + 1) * 0.33 });
        }
      }
    });
    return nodes;
  }, []);

  return (
    <div className={\`w-full h-full bg-[#09090b]/80 flex flex-row items-center justify-center gap-6 relative overflow-hidden rounded-2xl border border-white/5 p-4 \${className}\`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-0 h-0"
        version="1.1"
      >
        <defs>
          <filter id="SkiperSquiCircleFilterLayout">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      <div 
        className="relative flex-1 max-w-[290px] aspect-[4/3] flex items-center justify-center"
        style={{ perspective: '800px' }}
      >
        {TIMELINE_DATA.map((item, i) => {
          const offset = i - activeIndex;
          const isPast = i < activeIndex;

          return (
            <motion.div
              key={i}
              className="absolute rounded-2xl flex h-[135px] w-[220px] origin-center flex-col overflow-hidden pointer-events-none"
              initial={false}
              animate={{
                z: isPast ? 200 : -offset * 60,
                y: isPast ? 300 : -offset * 12,
                rotateX: isPast ? -20 : offset * 2,
                opacity: isPast ? 0 : 1 - Math.abs(offset) * 0.2,
                scale: isPast ? 1.3 : 1,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 250, 
                damping: 25, 
                mass: 0.8 
              }}
              style={{
                zIndex: TIMELINE_DATA.length - i,
                filter: "url(#SkiperSquiCircleFilterLayout)"
              }}
            >
              <img src={item.src} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      <div 
        className="relative flex flex-col items-end z-50 py-2 px-1"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {timelineNodes.map((node, i) => {
          if (node.type === 'main') {
            const index = node.index;
            const isSelected = activeIndex === index;

            return (
              <button
                key={\`main-\${index}\`}
                className="relative inline-flex items-center justify-end py-[1px] w-20 group cursor-pointer border-0 bg-transparent"
                onMouseEnter={() => handleTimelineHover(index)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
              >
                {hoveredIndex === index ? (
                  <motion.span
                    className={\`absolute top-0 right-10 text-[10px] font-semibold whitespace-nowrap \${
                      isSelected
                        ? 'text-blue-500'
                        : 'text-white/90'
                    }\`}
                    initial={{ opacity: 0, filter: \`blur(2px)\`, scale: 0.8 }}
                    animate={{ opacity: 1, filter: \`blur(0px)\`, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {node.date}
                  </motion.span>
                ) : null}
                <motion.div
                  className={\`h-[3px] w-[24px] rounded-full origin-right transition-colors \${
                    isSelected
                      ? 'bg-blue-500'
                      : 'bg-white/50 group-hover:bg-white/80'
                  }\`}
                  animate={{
                    scaleX: hoveredIndex === null ? 1 : (isSelected ? 1.4 : (Math.abs(index - hoveredIndex) < 0.5 ? 1.25 : 1)),
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
            );
          } else {
            const isHoveringNear = hoveredIndex !== null && Math.abs(node.index - hoveredIndex) <= 0.5;

            return (
              <div 
                key={\`sub-\${node.index}\`} 
                className="py-[1px] w-20 flex justify-end cursor-pointer"
                onMouseEnter={() => handleTimelineHover(node.index)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(Math.round(node.index));
                }}
              >
                <motion.div
                  className="h-[3px] w-[24px] rounded-full bg-white/20 origin-right"
                  animate={{
                    scaleX: hoveredIndex === null ? 1 : (isHoveringNear ? 1.15 : 1),
                    opacity: hoveredIndex === null ? 0.3 : (isHoveringNear ? 0.5 : 0.3)
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}`;

    case 'card-carousel-mono':
      return `import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunset Beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    title: 'Misty Mountains',
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    title: 'Forest Trail',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunlight Woods',
  },
  {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    title: 'Green Hills',
  },
];

interface CardCarouselProps {
  className?: string;
  images?: { src: string; title: string }[];
  isMonochrome?: boolean;
}

export default function CardCarousel({
  className = '',
  images = DEFAULT_ASSETS,
  isMonochrome = true
}: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const toPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const toNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.min(images.length - 1, prev + 1));
  };

  const toSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  const slideWidth = 160;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={\`w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none \${className}\`}
    >
      <div 
        className="relative h-[180px] flex items-center justify-start overflow-visible"
        style={{ width: \`\${slideWidth}px\` }}
      >
        <motion.div 
          className="flex w-fit items-center"
          animate={{ x: -activeIndex * slideWidth }}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
        >
          {images.map((item, i) => {
            const isActive = activeIndex === i;
            const diff = i - activeIndex;

            const targetRotate = isHovered ? diff * 20 : diff * 5;
            const targetScale = isActive ? 1.05 : (isHovered ? 0.65 : 0.8);
            const targetY = isHovered ? diff * 24 : 0;

            return (
              <motion.div 
                key={i}
                className="shrink-0 flex flex-col items-center gap-1.5 will-change-[transform,scale]"
                style={{ width: \`\${slideWidth}px\` }}
                animate={{ 
                  rotate: targetRotate, 
                  scale: targetScale, 
                  y: targetY 
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
              >
                <div 
                  className={\`text-[10px] md:text-xs font-semibold whitespace-nowrap transition-all duration-300 \${isActive ? 'opacity-100 scale-100 text-white' : 'opacity-0 scale-75 text-neutral-400'}\`} 
                >
                  {isMonochrome ? \`Card \${i + 1}\` : item.title}
                </div>

                {isMonochrome ? (
                  <div 
                    onClick={(e) => toSlide(e, i)}
                    className="w-[110px] h-[110px] rounded-xl bg-neutral-400 dark:bg-neutral-800 border border-neutral-200/20 shadow-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-bold text-sm cursor-pointer"
                  >
                    {i + 1}
                  </div>
                ) : (
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-[110px] h-[110px] object-cover rounded-xl shadow-lg border border-white/10 cursor-pointer" 
                    onClick={(e) => toSlide(e, i)} 
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="mt-4 px-1.5 py-0.5 flex items-center gap-2 justify-center text-neutral-400 rounded-full bg-neutral-900/60 backdrop-blur-md border border-white/5 shadow-md z-20">
        <button onClick={toPrev} className="p-1 cursor-pointer hover:bg-white/5 rounded-full transition-colors border-0 bg-transparent text-neutral-400 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => toSlide(e, i)}
              className={\`rounded-full cursor-pointer h-1 transition-all duration-300 \${activeIndex === i ? 'w-4 bg-white' : 'w-1 bg-white/30 hover:bg-white/50'}\`}>
            </div>
          ))}
        </div>
        <button onClick={toNext} className="p-1 cursor-pointer hover:bg-white/5 rounded-full transition-colors border-0 bg-transparent text-neutral-400 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}`;

    case 'card-cover-flow-mono':
      return `import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_ASSETS = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunset Beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    title: 'Misty Mountains',
  },
  {
    src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80',
    title: 'Forest Trail',
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80',
    title: 'Sunlight Woods',
  },
  {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    title: 'Green Hills',
  },
];

interface CardCoverFlowProps {
  className?: string;
  images?: { src: string; title: string }[];
  isMonochrome?: boolean;
}

export default function CardCoverFlow({
  className = '',
  images = DEFAULT_ASSETS,
  isMonochrome = true
}: CardCoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  const toPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const toNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.min(images.length - 1, prev + 1));
  };

  const toSlide = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <div className={\`w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none bg-zinc-950/40 rounded-2xl \${className}\`} style={{ perspective: '1000px' }}>
      <div className="w-full flex justify-center items-center relative h-[140px] [transform-style:preserve-3d]">
        {images.map((item, i) => {
          const isActive = activeIndex === i;
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          const isPast = i < activeIndex;
          
          return (
            <motion.div 
              key={i}
              className="absolute w-[80px] aspect-[3/4] cursor-pointer"
              initial={false}
              animate={{ 
                x: offset * 32,
                rotateY: isActive ? 0 : (isPast ? 38 : -38),
                z: isActive ? 50 : -absOffset * 50,
                scale: isActive ? 1.1 : 1 - (absOffset * 0.08),
                opacity: absOffset > 2 ? 0 : 1 - (absOffset * 0.25)
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{ zIndex: 100 - absOffset }}
              onClick={(e) => toSlide(e, i)}
            >
              {isMonochrome ? (
                <div 
                  className="w-full h-full rounded-xl bg-neutral-400 dark:bg-neutral-800 border border-neutral-200/20 shadow-2xl flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-bold text-sm"
                >
                  {i + 1}
                </div>
              ) : (
                <img 
                  src={item.src} 
                  alt={item.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10" 
                />
              )}
              <motion.div 
                className="absolute -bottom-6 left-[-20px] right-[-20px] text-center text-[10px] font-semibold text-white/80 whitespace-nowrap overflow-hidden text-ellipsis"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -5 }}
              >
                {isMonochrome ? \`Card \${i + 1}\` : item.title}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-6 w-fit px-1.5 py-0.5 flex items-center gap-2 justify-center text-zinc-300 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm z-20">
        <button onClick={toPrev} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => toSlide(e, i)}
              className={\`rounded-full cursor-pointer h-1 transition-all duration-300 \${activeIndex === i ? 'w-4 bg-white' : 'w-1 bg-white/30 hover:bg-white/50'}\`}>
            </div>
          ))}
        </div>
        <button onClick={toNext} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}`;

    case 'card-time-machine-mono':
      return `import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const TIMELINE_DATA = [
  { date: 'Today', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', title: 'Sunset Beach' },
  { date: '1d ago', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', title: 'Misty Mountains' },
  { date: '1w ago', src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80', title: 'Forest Trail' },
  { date: '1m ago', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80', title: 'Sunlight Woods' },
  { date: '1y ago', src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', title: 'Green Hills' },
];

interface CardTimeMachineProps {
  className?: string;
  isMonochrome?: boolean;
}

export default function CardTimeMachine({
  className = '',
  isMonochrome = true
}: CardTimeMachineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleTimelineHover = (index: number) => {
    setHoveredIndex(index);
    setActiveIndex(Math.round(index));
  };

  const timelineNodes = useMemo(() => {
    const nodes: { type: 'main' | 'sub'; index: number; date?: string }[] = [];
    TIMELINE_DATA.forEach((item, i) => {
      nodes.push({ type: 'main', index: i, date: item.date });
      if (i < TIMELINE_DATA.length - 1) {
        for (let j = 0; j < 2; j++) {
          nodes.push({ type: 'sub', index: i + (j + 1) * 0.33 });
        }
      }
    });
    return nodes;
  }, []);

  return (
    <div className={\`w-full h-full bg-[#09090b]/80 flex flex-row items-center justify-center gap-6 relative overflow-hidden rounded-2xl border border-white/5 p-4 \${className}\`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-0 h-0"
        version="1.1"
      >
        <defs>
          <filter id="SkiperSquiCircleFilterLayout">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      <div 
        className="relative flex-1 max-w-[290px] aspect-[4/3] flex items-center justify-center"
        style={{ perspective: '800px' }}
      >
        {TIMELINE_DATA.map((item, i) => {
          const offset = i - activeIndex;
          const isPast = i < activeIndex;

          return (
            <motion.div
              key={i}
              className="absolute rounded-2xl flex h-[135px] w-[220px] origin-center flex-col overflow-hidden pointer-events-none"
              initial={false}
              animate={{
                z: isPast ? 200 : -offset * 60,
                y: isPast ? 300 : -offset * 12,
                rotateX: isPast ? -20 : offset * 2,
                opacity: isPast ? 0 : 1 - Math.abs(offset) * 0.2,
                scale: isPast ? 1.3 : 1,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 250, 
                damping: 25, 
                mass: 0.8 
              }}
              style={{
                zIndex: TIMELINE_DATA.length - i,
                filter: "url(#SkiperSquiCircleFilterLayout)"
              }}
            >
              {isMonochrome ? (
                <div 
                  className="w-full h-full rounded-2xl bg-neutral-400 dark:bg-neutral-800 border border-neutral-200/20 shadow-lg flex items-center justify-center text-neutral-600 dark:text-neutral-400 font-bold text-sm"
                >
                  {i + 1}
                </div>
              ) : (
                <img src={item.src} alt={item.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      <div 
        className="relative flex flex-col items-end z-50 py-2 px-1"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {timelineNodes.map((node, i) => {
          if (node.type === 'main') {
            const index = node.index;
            const isSelected = activeIndex === index;

            return (
              <button
                key={\`main-\${index}\`}
                className="relative inline-flex items-center justify-end py-[1px] w-20 group cursor-pointer border-0 bg-transparent"
                onMouseEnter={() => handleTimelineHover(index)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                }}
              >
                {hoveredIndex === index ? (
                  <motion.span
                    className={\`absolute top-0 right-10 text-[10px] font-semibold whitespace-nowrap \${
                      isSelected
                        ? 'text-blue-500'
                        : 'text-white/90'
                    }\`}
                    initial={{ opacity: 0, filter: \`blur(2px)\`, scale: 0.8 }}
                    animate={{ opacity: 1, filter: \`blur(0px)\`, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    {node.date}
                  </motion.span>
                ) : null}
                <motion.div
                  className={\`h-[3px] w-[24px] rounded-full origin-right transition-colors \${
                    isSelected
                      ? 'bg-blue-500'
                      : 'bg-white/50 group-hover:bg-white/80'
                  }\`}
                  animate={{
                    scaleX: hoveredIndex === null ? 1 : (isSelected ? 1.4 : (Math.abs(index - hoveredIndex) < 0.5 ? 1.25 : 1)),
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </button>
            );
          } else {
            const isHoveringNear = hoveredIndex !== null && Math.abs(node.index - hoveredIndex) <= 0.5;

            return (
              <div 
                key={\`sub-\${node.index}\`} 
                className="py-[1px] w-20 flex justify-end cursor-pointer"
                onMouseEnter={() => handleTimelineHover(node.index)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(Math.round(node.index));
                }}
              >
                <motion.div
                  className="h-[3px] w-[24px] rounded-full bg-white/20 origin-right"
                  animate={{
                    scaleX: hoveredIndex === null ? 1 : (isHoveringNear ? 1.15 : 1),
                    opacity: hoveredIndex === null ? 0.3 : (isHoveringNear ? 0.5 : 0.3)
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}`;

    default:
      return `// No card interaction defined.`;
  }
}
