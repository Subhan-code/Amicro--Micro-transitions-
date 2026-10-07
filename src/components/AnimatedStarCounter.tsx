import React, { useEffect, useState } from 'react';
import { animate } from 'motion/react';

interface AnimatedStarCounterProps {
  value: number | null;
  fallback?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * AnimatedStarCounter:
 * Animates the star count from (current - 50) up to current upon mounting,
 * providing a subtle, organic number-roll micro-interaction.
 */
export function AnimatedStarCounter({
  value,
  fallback = 2492,
  className = '',
  prefix = '',
  suffix = '',
}: AnimatedStarCounterProps) {
  const target = value !== null && value > 0 ? value : fallback;
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo: fast kickoff, smooth deceleration at the end
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [target]);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {displayValue.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
