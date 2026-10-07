import React from 'react';

interface SponsorStatsProps {
  isDark?: boolean;
  stars?: number | null;
}

export const SponsorStats: React.FC<SponsorStatsProps> = ({ isDark = true, stars }) => {
  const displayStars = stars ? `${(stars / 1000).toFixed(1)}K` : '2.5K';

  const stats = [
    {
      value: '5M+',
      label: 'X Impressions',
    },
    {
      value: '160+',
      label: 'Components',
    },
    {
      value: displayStars,
      label: 'GitHub Stars',
    },
    {
      value: '50K+',
      label: 'Monthly Visitors',
    },
  ];

  return (
    <section className="w-full max-w-[1140px] mx-auto px-0 select-none">
      {/* Four cards, grid-cols-2 md:grid-cols-4 gap-3 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-[16px] px-5 py-5 flex flex-col justify-center select-none ${
              isDark
                ? 'bg-white/[0.08]'
                : 'bg-white border border-neutral-200/90'
            }`}
          >
            <span className={`text-[28px] leading-[34px] font-bold tracking-[-1px] font-sans ${
              isDark ? 'text-neutral-50' : 'text-neutral-900'
            }`}>
              {s.value}
            </span>
            <span className={`text-[14px] leading-[20px] font-medium mt-1 ${
              isDark ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
