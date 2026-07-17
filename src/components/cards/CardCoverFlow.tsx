import React, { useState } from "react";
import { motion } from "motion/react";
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
    title: 'Sunlight in Woods',
  },
  {
    src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
    title: 'Green Hills',
  },
];

interface CardCoverFlowProps {
  hovered?: boolean;
  className?: string;
  images?: { src: string; title: string }[];
  isMonochrome?: boolean;
}

export const CardCoverFlow = React.memo(function CardCoverFlow({
  hovered,
  className = '',
  images = DEFAULT_ASSETS,
  isMonochrome = false
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
    <div className={`w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none bg-zinc-950/40 rounded-2xl ${className}`} style={{ perspective: '1000px' }}>
      {/* carousel wrapper */}
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
                {isMonochrome ? `Card ${i + 1}` : item.title}
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* controls */}
      <div className="mt-6 w-fit px-1.5 py-0.5 flex items-center gap-2 justify-center text-zinc-300 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm z-20">
        <button onClick={toPrev} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex justify-center items-center gap-1">
          {images.map((_, i) => (
            <div 
              key={i} 
              onClick={(e) => toSlide(e, i)}
              className={`rounded-full cursor-pointer h-1 transition-all duration-300 ${activeIndex === i ? 'w-4 bg-white' : 'w-1 bg-white/30 hover:bg-white/50'}`}>
            </div>
          ))}
        </div>
        <button onClick={toNext} className="p-1 cursor-pointer hover:bg-white/10 rounded-full transition-colors border-0 bg-transparent text-neutral-300 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
