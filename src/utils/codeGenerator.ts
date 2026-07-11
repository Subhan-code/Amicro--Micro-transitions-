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
