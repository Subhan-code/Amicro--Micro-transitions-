import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Type, Copy, Check, Terminal, ArrowLeft, RefreshCw, Sparkles 
} from 'lucide-react';
import { IconSwap, IconSwapItem } from './IconSwap';
import { ScrambleHover, ScrambleHoverDemo } from './css-animations/ScrambleHover';
import { FocusBlurDemo } from './css-animations/FocusBlur';
import { FocusBlur } from './cards/FocusBlur';

export interface TextAnimationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  cliCommand: string;
  componentCode: string;
}

export const textAnimationsData: TextAnimationItem[] = [
  {
    id: 'scramble-text',
    name: 'Scramble Text Decoder',
    category: 'matrix-fx',
    description: 'Matrix-style text decoding scrambler with custom character sets, intervals, and direction.',
    cliCommand: 'npx @subhanhq/amicro@latest add scramble-text',
    componentCode: `// Scramble decoder component using character randomization and interval reveals.`
  },
  {
    id: 'focus-blur',
    name: 'Focus Blur Links',
    category: 'hover-focus',
    description: 'Interactive sibling focus-blur depth hierarchy with spring-animated dashed bracket targeting.',
    cliCommand: 'npx @subhanhq/amicro@latest add focus-blur',
    componentCode: `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function FocusBlur() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const items = [
    { label: '@Twitter', href: '#' },
    { label: '@Threads', href: '#' },
    { label: '@Instagram', href: '#' },
    { label: '@GitHub', href: '#' }
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 py-6 px-10">
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        const isAnyHovered = hoveredIndex !== null;
        const isInactive = isAnyHovered && !isHovered;

        return (
          <a
            key={index}
            href={item.href}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative font-semibold text-lg sm:text-2xl no-underline transition-all duration-300 select-none outline-none"
            style={{
              filter: isInactive ? 'blur(4px)' : 'none',
              opacity: isInactive ? 0.4 : 1,
              color: isHovered ? 'var(--color-blue-500, #3b82f6)' : 'inherit'
            }}
          >
            <span className="relative z-10">{item.label}</span>
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
          </a>
        );
      })}
    </div>
  );
}`
  },
  {
    id: 'wave-reveal',
    name: 'Staggered Wave Reveal',
    category: 'reveal',
    description: 'Per-letter vertical spring entrance with staggered letter delay and 3D rotation settle.',
    cliCommand: 'npx @subhanhq/amicro@latest add wave-reveal',
    componentCode: `// Staggered letter animation with translateY(-20px) spring physics.`
  },
  {
    id: 'gradient-shimmer',
    name: 'Ambient Gradient Shimmer',
    category: 'gradient',
    description: 'Continuous metallic light beam sweeping across typography with background-clip: text.',
    cliCommand: 'npx @subhanhq/amicro@latest add gradient-shimmer',
    componentCode: `// Shimmering background-clip text with linear-gradient sweep keyframes.`
  },
  {
    id: 'typewriter-cursor',
    name: 'Mechanical Typewriter',
    category: 'typing',
    description: 'Stepping character-by-character typewriter effect with blinking vertical cursor line.',
    cliCommand: 'npx @subhanhq/amicro@latest add typewriter-text',
    componentCode: `// Stepped typewriter typing animation with CSS blink cursor.`
  },
  {
    id: 'perspective-flip',
    name: '3D Perspective Word Flip',
    category: '3d-fx',
    description: 'Rolling 3D cube face rotation switching between multiple keywords on hover.',
    cliCommand: 'npx @subhanhq/amicro@latest add perspective-flip',
    componentCode: `// 3D rotateX cube face rotation with preserve-3d transform style.`
  }
];

interface TextAnimationsPageProps {
  theme: 'dark' | 'light';
  embedded?: boolean;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
}

export function TextAnimationsPage({
  theme,
  embedded = false,
  showToast,
  triggerHaptic,
  onNavigateHome,
}: TextAnimationsPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleCopyCode = useCallback(
    (item: TextAnimationItem) => {
      const codeToCopy = item.componentCode || item.cliCommand;
      navigator.clipboard
        .writeText(codeToCopy)
        .then(() => {
          if (triggerHaptic) triggerHaptic('success');
          setCopiedId(item.id);
          setTimeout(() => setCopiedId(null), 2000);
          if (showToast) showToast(`Copied ${item.name} code!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy code.');
        });
    },
    [showToast, triggerHaptic]
  );

  const handleCopyCli = useCallback(
    (command: string, name: string) => {
      navigator.clipboard
        .writeText(command)
        .then(() => {
          if (triggerHaptic) triggerHaptic('success');
          if (showToast) showToast(`Copied ${name} CLI command!`);
        })
        .catch(() => {
          if (triggerHaptic) triggerHaptic('error');
          if (showToast) showToast('Failed to copy CLI command.');
        });
    },
    [showToast, triggerHaptic]
  );

  const renderLiveTextEffect = (id: string) => {
    switch (id) {
      case 'scramble-text':
        return (
          <div className="w-full flex items-center justify-center px-4 text-center">
            <div className={`text-base sm:text-lg font-bold font-mono ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <ScrambleHover text="DECODE_REACT" />
            </div>
          </div>
        );
      case 'focus-blur':
        return (
          <div className="w-full flex items-center justify-center p-2">
            <FocusBlur 
              items={[
                { label: '@Twitter', href: '#' },
                { label: '@Threads', href: '#' },
                { label: '@Instagram', href: '#' },
                { label: '@GitHub', href: '#' }
              ]} 
              showBrackets={true} 
              className="text-base sm:text-xl gap-4 sm:gap-6 py-2 px-2" 
            />
          </div>
        );
      case 'wave-reveal':
        return (
          <div className="flex items-center justify-center gap-1 font-bold text-base select-none">
            {'ELEVATE'.split('').map((char, i) => (
              <motion.span
                key={`${i}-${refreshKey}`}
                animate={{ y: [0, -8, 0], color: theme === 'dark' ? ['#fff', '#818cf8', '#fff'] : ['#111', '#6366f1', '#111'] }}
                transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.12 }}
                className="cursor-pointer"
              >
                {char}
              </motion.span>
            ))}
          </div>
        );
      case 'gradient-shimmer':
        return (
          <div className="flex items-center justify-center">
            <style>{`
              @keyframes text_shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .shimmer-text {
                background: linear-gradient(90deg, ${theme === 'dark' ? '#555 0%, #fff 50%, #555 100%' : '#888 0%, #000 50%, #888 100%'});
                background-size: 200% auto;
                color: transparent;
                -webkit-background-clip: text;
                background-clip: text;
                animation: text_shimmer 3s linear infinite;
              }
            `}</style>
            <span className="text-xl sm:text-2xl font-black tracking-widest shimmer-text select-none uppercase">
              SHIMMER_FX
            </span>
          </div>
        );
      case 'typewriter-cursor':
        return (
          <div className="flex items-center justify-center font-mono font-bold text-sm sm:text-base">
            <style>{`
              @keyframes blink_cursor {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .blink-bar { animation: blink_cursor 0.9s infinite; }
            `}</style>
            <span className={theme === 'dark' ? 'text-neutral-200' : 'text-neutral-900'}>
              npm create amicro
            </span>
            <span className={`w-2 h-4 ml-1 blink-bar ${theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600'}`} />
          </div>
        );
      case 'perspective-flip':
        return (
          <div className="flex items-center justify-center h-8 overflow-hidden select-none font-bold text-sm sm:text-base">
            <motion.div
              animate={{ y: [0, -32, -64, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, times: [0, 0.33, 0.66, 1], ease: 'easeInOut' }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}>FAST</span>
              <span className={theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}>FLUID</span>
              <span className={theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}>PREMIUM</span>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full max-w-[1600px] mx-auto ${embedded ? 'px-0 py-2' : 'px-4 sm:px-8 lg:px-12 2xl:px-16 py-8 2xl:py-12'} flex flex-col gap-8 2xl:gap-12 font-sans`}>
      {!embedded ? (
        <>
          {/* Top Header Back Navigation */}
          <div className="flex items-center justify-between w-full">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  theme === 'dark' 
                    ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}
          </div>

          {/* Hero Header */}
          <div className="flex flex-col items-center text-center gap-4 max-w-3xl 2xl:max-w-4xl mx-auto">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
              theme === 'dark' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Typography & Text Motion</span>
            </div>
            
            <h1 className="text-fluid-h1 font-bold tracking-tight">
              Text Animations
            </h1>
            
            <p className={`text-fluid-sub max-w-xl 2xl:max-w-2xl ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              A curated collection of {textAnimationsData.length} interactive text decoders, focus blur depth selectors, and pure-CSS kinetic typography effects.
            </p>
          </div>
        </>
      ) : null}

      {/* Featured Spotlight: Scramble Text Sandbox */}
      <div className={`rounded-[28px] p-6 sm:p-8 border flex flex-col justify-between items-center text-center gap-4 shadow-xl transition-all ${
        theme === 'dark' ? 'bg-[#181818] border-white/10 shadow-black/30' : 'bg-white border-neutral-200 shadow-neutral-200/50'
      }`}>
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-400">
            Interactive Spotlight
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            Scramble Text Decoder
          </h2>
          <p className={`text-xs sm:text-sm mt-1 max-w-md ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Hover over the buttons below or test custom text decode algorithms with live speed and character scrambling.
          </p>
        </div>

        <div className="py-6 w-full flex items-center justify-center">
          <ScrambleHoverDemo theme={theme} />
        </div>

        <button
          onClick={() => handleCopyCli('npx @subhanhq/amicro@latest add scramble-text', 'Scramble Text Decoder')}
          className={`max-w-xs w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            theme === 'dark' ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10' : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Copy CLI Command</span>
        </button>
      </div>

      {/* Main Catalog Grid (Strictly 3 in a row) */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Text FX Library ({textAnimationsData.length})
          </h2>
          <span className={`text-xs ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Hover cards to trigger typography physics
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-8 transition-opacity duration-200 sm:grid-cols-2 lg:gap-x-6 lg:gap-y-10 xl:grid-cols-3 xl:gap-x-7 2xl:grid-cols-4 2xl:gap-x-8 2xl:gap-y-12">
          {textAnimationsData.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <article key={item.id} className="group/card relative">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-black flex items-center justify-center p-4">
                  {renderLiveTextEffect(item.id)}
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 px-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-[17px] font-semibold tracking-[-0.015em] text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-medium text-muted-foreground truncate capitalize mt-0.5">
                      {item.category.replace('-', ' ')}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleCopyCode(item)}
                    className={`size-8 rounded-lg transition-all duration-200 cursor-pointer border border-border/80 bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 ${
                      isCopied ? 'opacity-100 bg-white/10 border-white/30 text-white' : ''
                    }`}
                    title="Copy component code"
                  >
                    <IconSwap>
                      <IconSwapItem key={isCopied ? 'check' : 'copy'}>
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </IconSwapItem>
                    </IconSwap>
                  </motion.button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
