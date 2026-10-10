import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'motion/react';

export interface InViewRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  margin?: string;
  active?: boolean;
}

/**
 * High-performance viewport and page visibility orchestrator.
 * 
 * Ensures animated previews ONLY mount when:
 * 1. Their preview / catalog tab is currently active (active === true)
 * 2. They are in or close to the viewport (IntersectionObserver with margin)
 * 3. The browser tab itself is visible (Page Visibility API: document.visibilityState === 'visible')
 * 
 * Automatically unmounts when scrolled far off-screen or when tab is hidden,
 * preventing hundreds of concurrent animations, RAF loops, and canvas draws.
 */
export function InViewRender({
  children,
  fallback = null,
  className = "w-full h-full flex items-center justify-center",
  margin = "200px",
  active = true,
}: InViewRenderProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track viewport intersection without once: true so offscreen items unmount
  const isInView = useInView(ref, { margin: margin as any });
  
  // Track Page Visibility API (tab switched or minimized)
  const [isTabVisible, setIsTabVisible] = useState<boolean>(() => {
    return typeof document !== 'undefined' ? document.visibilityState === 'visible' : true;
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const shouldRender = active && isInView && isTabVisible;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}
