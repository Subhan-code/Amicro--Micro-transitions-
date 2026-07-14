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

    case 'card-3d-tilt':
      return `import React, { useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function Card3DTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(0, { stiffness: 120, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 15 });
  const glareX = useSpring(50, { stiffness: 120, damping: 15 });
  const glareY = useSpring(50, { stiffness: 120, damping: 15 });
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const rx = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 18;
    const ry = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 18;

    rotateX.set(rx);
    rotateY.set(ry);

    glareX.set(((e.clientX - rect.left) / rect.width) * 100);
    glareY.set(((e.clientY - rect.top) / rect.height) * 100);
    glareOpacity.set(0.65);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
      className="relative w-[128px] h-[176px] cursor-pointer"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 overflow-hidden p-4 flex flex-col justify-between"
      >
        <div style={{ transform: 'translateZ(20px)' }} className="w-6 h-6 rounded-full bg-white/20 border border-white/20 shadow-inner" />
        <div style={{ transform: 'translateZ(10px)' }} className="space-y-1" { ...{ className: "space-y-1" } }>
          <div className="h-2 w-12 rounded bg-white/30" />
          <div className="h-1.5 w-8 rounded bg-white/20" />
        </div>
        <motion.div
          style={{
            opacity: glareOpacity,
            background: \`radial-gradient(circle 75px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.3), transparent)\`
          }}
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
          ref={(node) => {
            if (node) {
              glareX.on("change", (val) => node.style.setProperty("--glare-x", \`\${val}%\`));
              glareY.on("change", (val) => node.style.setProperty("--glare-y", \`\${val}%\`));
            }
          }}
        />
      </motion.div>
    </div>
  );
}`;

    case 'card-stack-deck':
      return `import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CardStackDeck() {
  const [isHovered, setIsHovered] = useState(false);
  const cards = [0, 1, 2];

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-[128px] h-[176px] cursor-pointer flex items-center justify-center"
    >
      {cards.map((i) => {
        const dist = i - 1;
        return (
          <motion.div
            key={i}
            animate={{
              y: isHovered ? dist * 32 : dist * 4,
              rotate: isHovered ? dist * 6 : 0,
              scale: isHovered && dist === 0 ? 1.03 : 1
            }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            style={{ zIndex: 3 - Math.abs(dist) }}
            className="absolute inset-0 rounded-2xl bg-neutral-800 border border-white/10"
          />
        );
      })}
    </div>
  );
}`;

    case 'card-border-glow':
      return `import React, { useState, useRef } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CardBorderGlow() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const glowX = useSpring(50, { stiffness: 150, damping: 20 });
  const glowY = useSpring(50, { stiffness: 150, damping: 20 });
  const glowOpacity = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    glowX.set(((e.clientX - rect.left) / rect.width) * 100);
    glowY.set(((e.clientY - rect.top) / rect.height) * 100);
    glowOpacity.set(1);
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); glowOpacity.set(0); }}
      onMouseMove={handleMouseMove}
      className="relative w-[128px] h-[176px] rounded-2xl overflow-hidden p-[1.5px] cursor-pointer bg-white/5"
    >
      <motion.div
        style={{
          opacity: glowOpacity,
          background: \`radial-gradient(circle 50px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(99, 102, 241, 0.8), rgba(236, 72, 153, 0.4), transparent)\`
        }}
        className="absolute inset-0 pointer-events-none z-0"
        ref={(node) => {
          if (node) {
            glowX.on("change", (val) => node.style.setProperty("--glow-x", \`\${val}%\`));
            glowY.on("change", (val) => node.style.setProperty("--glow-y", \`\${val}%\`));
          }
        }}
      />
      <div className="relative z-10 w-full h-full rounded-[14px] bg-neutral-900 p-4 flex flex-col justify-between">
        <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] font-bold text-indigo-400">G</div>
        <div className="space-y-1.5">
          <div className="h-2 w-12 rounded bg-indigo-400/30" />
          <div className="h-1.5 w-8 rounded bg-indigo-400/15" />
        </div>
      </div>
    </div>
  );
}`;

    default:
      return `// No card interaction defined.`;
  }
}
