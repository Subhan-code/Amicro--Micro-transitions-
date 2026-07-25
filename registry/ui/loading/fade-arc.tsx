import React from 'react';

export const FadeArc = () => {
  return (
    <div className="relative w-9 h-9">
      <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
        <circle
          className="stroke-zinc-200 dark:stroke-zinc-800"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="3.5"
        />
        <circle
          className="stroke-zinc-800 dark:stroke-white"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="3.5"
          strokeDasharray="80"
          strokeDashoffset="28"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
