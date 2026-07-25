import { useMemo } from 'react';

interface StaggerOptions {
  baseDelay?: number;
  staggerDelay?: number;
  from?: 'first' | 'last' | 'center' | number;
}

export function useStagger(count: number, options: StaggerOptions = {}) {
  const { baseDelay = 0, staggerDelay = 0.05, from = 'first' } = options;

  const delays = useMemo(() => {
    const list = Array.from({ length: count });
    
    let centerIndex = 0;
    if (from === 'center') {
      centerIndex = (count - 1) / 2;
    } else if (from === 'last') {
      centerIndex = count - 1;
    } else if (typeof from === 'number') {
      centerIndex = from;
    }

    return list.map((_, index) => {
      let distance = 0;
      if (from === 'first') {
        distance = index;
      } else if (from === 'last') {
        distance = count - 1 - index;
      } else {
        distance = Math.abs(index - centerIndex);
      }
      return baseDelay + distance * staggerDelay;
    });
  }, [count, baseDelay, staggerDelay, from]);

  return delays;
}
