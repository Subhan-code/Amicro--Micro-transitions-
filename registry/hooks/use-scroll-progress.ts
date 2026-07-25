import { useEffect, useState, RefObject } from 'react';

export function useScrollProgress(ref?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref && ref.current) {
        const element = ref.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        if (totalHeight === 0) {
          setProgress(0);
        } else {
          setProgress(element.scrollTop / totalHeight);
        }
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight === 0) {
          setProgress(0);
        } else {
          setProgress(window.scrollY / totalHeight);
        }
      }
    };

    const target = ref && ref.current ? ref.current : window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return progress;
}
