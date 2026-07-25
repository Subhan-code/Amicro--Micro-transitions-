import { useEffect, useState, RefObject } from 'react';

export interface MousePosition {
  x: number;
  y: number;
  elementX: number;
  elementY: number;
}

export function useMousePosition(ref?: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      let elementX = 0;
      let elementY = 0;

      if (ref && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        elementX = event.clientX - rect.left;
        elementY = event.clientY - rect.top;
      }

      setPosition({
        x: event.clientX,
        y: event.clientY,
        elementX,
        elementY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ref]);

  return position;
}
