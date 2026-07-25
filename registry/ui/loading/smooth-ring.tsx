import React from 'react';

export const SmoothRing = () => (
  <div className="w-9 h-9">
    <svg className="w-full h-full animate-spin" viewBox="0 0 32 32">
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        strokeWidth="3"
        className="stroke-zinc-200 dark:stroke-zinc-800"
      />
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        strokeWidth="3"
        className="stroke-zinc-800 dark:stroke-white"
        strokeDasharray="38 80"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
