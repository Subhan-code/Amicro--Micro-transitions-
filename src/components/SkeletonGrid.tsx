import React from 'react';

interface SkeletonGridProps {
  count?: number;
  theme?: 'dark' | 'light';
}

export function SkeletonGrid({ count = 6, theme = 'dark' }: SkeletonGridProps) {
  const isDark = theme === 'dark';

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          {/* Card canvas skeleton */}
          <div
            className={`w-full aspect-[16/10] rounded-2xl sm:rounded-3xl border ${
              isDark
                ? 'bg-zinc-900/60 border-white/[0.06]'
                : 'bg-zinc-100 border-zinc-200/80'
            }`}
          />
          {/* Label & Description Skeleton */}
          <div className="flex items-center justify-between px-1">
            <div className="flex-1 space-y-2">
              <div
                className={`h-4 w-1/2 rounded-md ${
                  isDark ? 'bg-zinc-800' : 'bg-zinc-200'
                }`}
              />
              <div
                className={`h-3 w-3/4 rounded-md ${
                  isDark ? 'bg-zinc-800/60' : 'bg-zinc-200/70'
                }`}
              />
            </div>
            <div
              className={`size-8 rounded-lg shrink-0 ${
                isDark ? 'bg-zinc-800/80' : 'bg-zinc-200'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
