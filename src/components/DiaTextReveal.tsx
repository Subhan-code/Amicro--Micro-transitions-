import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
  type AnimationPlaybackControls,
  type HTMLMotionProps,
} from 'motion/react';

export const BLUE_SHADES_PALETTE = [
  '#bfdbfe', // blue-200
  '#60a5fa', // blue-400
  '#38bdf8', // sky-400
  '#3b82f6', // blue-500
  '#2563eb', // blue-600
  '#1d4ed8', // blue-700
  '#0284c7', // sky-600
  '#93c5fd', // blue-300
];

const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;
  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }
  const count = colors.length;
  const parts: string[] = [];
  if (bandStart > 0) {
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);
  }
  colors.forEach((color, index) => {
    const pct = count === 1 ? pos : bandStart + (index / (count - 1)) * BAND_HALF * 2;
    parts.push(`${color} ${pct.toFixed(2)}%`);
  });
  if (bandEnd < 100) {
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, 'transparent 100%');
  }
  return `linear-gradient(90deg, ${parts.join(', ')})`;
}

export interface DiaTextRevealProps extends Omit<HTMLMotionProps<'span'>, 'children'> {
  text: string | string[];
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  triggerOnView?: boolean;
  once?: boolean;
  className?: string;
  fixedWidth?: boolean;
}

export function DiaTextReveal({
  text,
  colors = BLUE_SHADES_PALETTE,
  textColor = 'currentColor',
  duration = 1.6,
  delay = 0.1,
  repeat = false,
  repeatDelay = 0.5,
  triggerOnView = true,
  once = true,
  className = '',
  fixedWidth = false,
  style,
  ...props
}: DiaTextRevealProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);
  const hasPlayedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const controlsRef = useRef<AnimationPlaybackControls | undefined>(undefined);

  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const textKey = useMemo(() => texts.join('\0'), [texts]);
  const isMulti = texts.length > 1;

  const sweepPos = useMotionValue(SWEEP_START);
  const prefersReducedMotion = useReducedMotion();
  const inView = useInView(spanRef, { once, amount: 0.1 });
  const shouldAnimate = triggerOnView ? inView : true;

  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, colors, textColor)
  );

  const clearCycle = () => {
    controlsRef.current?.stop();
    controlsRef.current = undefined;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  const play = () => {
    clearCycle();
    sweepPos.set(SWEEP_START);
    controlsRef.current = animate(sweepPos, SWEEP_END, {
      duration,
      delay,
      ease: sweepEase,
      onComplete() {
        if (!repeat || texts.length === 0) return;
        timerRef.current = setTimeout(() => {
          setActiveIndex((prev) => (prev + 1) % texts.length);
          play();
        }, repeatDelay * 1000);
      },
    });
  };

  // Reset when text changes
  useEffect(() => {
    hasPlayedRef.current = false;
    clearCycle();
    sweepPos.set(SWEEP_START);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey]);

  // Width measurement for multi-text rotation
  useEffect(() => {
    const element = spanRef.current;
    if (!element || !isMulti) {
      setMeasuredWidths([]);
      return;
    }
    const ghost = element.cloneNode() as HTMLElement;
    Object.assign(ghost.style, {
      position: 'absolute',
      visibility: 'hidden',
      pointerEvents: 'none',
      width: 'auto',
      whiteSpace: 'nowrap',
    });
    element.parentElement?.appendChild(ghost);
    const widths = texts.map((t) => {
      ghost.textContent = t;
      return ghost.getBoundingClientRect().width;
    });
    ghost.remove();
    setMeasuredWidths(widths);
  }, [elementRefMeasure(spanRef), isMulti, texts]);

  // Play animation when in view or mounted
  useEffect(() => {
    if (prefersReducedMotion) {
      clearCycle();
      sweepPos.set(SWEEP_END);
      return;
    }

    if (!shouldAnimate) {
      if (!once) {
        hasPlayedRef.current = false;
      }
      return;
    }

    if (once && hasPlayedRef.current) {
      return;
    }

    hasPlayedRef.current = true;
    play();

    return () => {
      clearCycle();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAnimate, prefersReducedMotion, once]);

  const fixedW = isMulti && fixedWidth && measuredWidths.length > 0 ? Math.max(...measuredWidths) : undefined;
  const animatedW = isMulti && !fixedWidth && measuredWidths[activeIndex] != null ? measuredWidths[activeIndex] : undefined;

  return (
    <motion.span
      ref={spanRef}
      className={`inline-block leading-[1.08] select-none ${className}`}
      style={{
        transform: 'translateY(-1px)',
        color: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        backgroundSize: '100% 100%',
        backgroundImage,
        ...(isMulti && {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          verticalAlign: 'text-bottom',
          ...(fixedW != null && { width: fixedW }),
        }),
        ...style,
      }}
      animate={animatedW != null ? { width: animatedW } : undefined}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {texts[activeIndex]}
    </motion.span>
  );
}

function elementRefMeasure(ref: React.RefObject<HTMLElement | null>) {
  return ref.current ? 1 : 0;
}
