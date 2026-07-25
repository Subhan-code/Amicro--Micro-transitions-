import React, { useRef } from 'react';
import { useInView } from 'framer-motion';

export function InViewRender({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "400px" });

  return (
    <div ref={ref} className="w-full h-full flex items-center justify-center">
      {isInView ? children : null}
    </div>
  );
}
