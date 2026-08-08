import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MetricConfig } from '../../data/metrics';
import { TrendingUp, Zap, Activity, Heart, ShieldCheck, Wifi, Cpu, Layers, Check, ArrowUpRight, Share2, MoreHorizontal, ChevronDown, Star, Crown, ArrowUp, ArrowDown, HelpCircle, DollarSign } from 'lucide-react';
import { useWebHaptics } from '../../hooks/useWebHaptics';

interface AnimatedMetricCardProps {
  config: MetricConfig;
  theme: 'dark' | 'light';
}

export const AnimatedMetricCard: React.FC<AnimatedMetricCardProps> = ({ config, theme }) => {
  const [stockRange, setStockRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');
  const [viewsRange, setViewsRange] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [salesAnalyticsRange, setSalesAnalyticsRange] = useState<'Monthly' | 'Weekly'>('Weekly');
  const [salesTargetRange, setSalesTargetRange] = useState<'Monthly' | 'Yearly'>('Yearly');
  const [timerActive, setTimerActive] = useState(false);
  const [decibelLevel, setDecibelLevel] = useState<40 | 60>(40);
  const { trigger: triggerHaptic } = useWebHaptics();

  const isDark = theme === 'dark';
  const containerClasses = `w-full h-full p-4 flex flex-col justify-between select-none font-sans transition-colors duration-300 ${
    isDark ? 'text-white' : 'text-black'
  }`;

  switch (config.interactionType) {
    // --- CACHEABLE BANDWIDTH COST CARD ---
    case 'cacheable-bandwidth-cost':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          {/* Top header readout */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">90.5 GB</span>
              <span className="text-base font-bold text-neutral-400 font-normal">(69.8%)</span>
            </div>

            {/* Subtitle row with cost */}
            <div className="flex items-center justify-between text-xs font-semibold mt-1">
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span>Cacheable Bandwidth</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 font-bold">
                <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-white/15 text-[10px] flex items-center justify-center font-black">$</span>
                <span>$9.50</span>
                <HelpCircle className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Multi-segment horizontal progress bar */}
          <div className="my-2">
            <div className="w-full h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full flex items-center p-0.5 overflow-hidden gap-0.5">
              {/* Segment 1: Non-Cacheable (Dark Purple) */}
              <div className="h-full w-[25%] bg-[#1E1B4B] dark:bg-[#312E81] rounded-l-full" />
              {/* Segment 2: Cached (Light Purple) */}
              <div className="h-full w-[20%] bg-[#A855F7]" />
              {/* Segment 3: Remaining Threshold (Vertical Stripes) */}
              <div className="h-full flex-1 rounded-r-full bg-[#F3E8FF] dark:bg-[#2E1065] relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="bandwidth-stripes" width="8" height="8" patternTransform="rotate(90 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#A855F7" strokeWidth="4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bandwidth-stripes)" />
                </svg>
              </div>
            </div>
          </div>

          {/* Breakdown list */}
          <div className="space-y-1.5 text-xs font-semibold">
            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span>Cached <strong className="text-black dark:text-white font-bold">12.8 GB</strong> <span className="text-neutral-400 font-normal">(9.8%)</span></span>
              </div>
            </div>

            <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E1B4B] dark:bg-white" />
                <span>Non-Cacheable <strong className="text-black dark:text-white font-bold">26.3 GB</strong> <span className="text-neutral-400 font-normal">(20.3%)</span></span>
              </div>
            </div>

            <div className="pt-1 border-t border-neutral-100 dark:border-white/10 text-neutral-500 font-medium">
              Total <strong className="text-black dark:text-white font-bold">129.6 GB</strong>
            </div>
          </div>
        </div>
      );

    // --- OTHER IMAGE COMPONENTS ---
    case 'sales-analytics-dual-bars':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#F9FAFB] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Sales analytics</div>
              <div className="text-[11px] text-neutral-400 font-medium mt-1">Total units sold</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight">345</span>
                <span className="text-sm font-bold text-neutral-400">/500</span>
              </div>
            </div>
            <div className={`flex items-center p-0.5 rounded-full border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
            }`}>
              {(['Monthly', 'Weekly'] as const).map((r) => (
                <button
                  key={r}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    setSalesAnalyticsRange(r);
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer border-0 ${
                    salesAnalyticsRange === r
                      ? (isDark ? 'bg-white text-black' : 'bg-white text-black shadow-xs')
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className={`p-3 rounded-2xl border flex flex-col justify-between h-36 mt-1 ${
            isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-neutral-100 shadow-xs'
          }`}>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-xs bg-[#EA580C]" />
                <span>Total Sales</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-xs bg-[#FDBA74]" />
                <span>Total Earnings</span>
              </span>
            </div>
            <div className="flex items-end justify-between px-2 h-20">
              <div className="w-6 bg-neutral-200/50 dark:bg-neutral-800/40 rounded-lg h-[40%]" />
              <div className="flex items-end gap-1 h-full">
                <motion.div initial={{ height: 0 }} animate={{ height: '75%' }} transition={{ duration: 0.6 }} className="w-6 bg-[#EA580C] rounded-lg shadow-sm" />
                <motion.div initial={{ height: 0 }} animate={{ height: '90%' }} transition={{ duration: 0.6, delay: 0.1 }} className="w-6 bg-[#FDBA74] rounded-lg shadow-sm" />
              </div>
              <div className="w-6 bg-neutral-200/50 dark:bg-neutral-800/40 rounded-lg h-[55%]" />
              <div className="w-6 bg-neutral-200/50 dark:bg-neutral-800/40 rounded-lg h-[45%]" />
            </div>
            <div className="flex justify-between px-2 text-[9px] font-bold text-neutral-400 uppercase">
              <span>Sep</span>
              <span className="text-black dark:text-white font-black">Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      );

    case 'sales-target-segmented-arc':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#F9FAFB] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight">Sales target</span>
            <div className={`flex items-center p-0.5 rounded-full border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
            }`}>
              {(['Monthly', 'Yearly'] as const).map((r) => (
                <button
                  key={r}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    setSalesTargetRange(r);
                  }}
                  className={`px-3 py-1 text-[10px] font-bold rounded-full transition-colors cursor-pointer border-0 ${
                    salesTargetRange === r
                      ? (isDark ? 'bg-white text-black' : 'bg-white text-black shadow-xs')
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className={`p-3 rounded-2xl border flex flex-col items-center justify-between h-44 mt-1 relative overflow-hidden ${
            isDark ? 'bg-[#121214] border-white/5' : 'bg-white border-neutral-100 shadow-xs'
          }`}>
            <div className="flex items-center gap-3 text-[10px] font-bold w-full justify-start">
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-[#FDBA74]" />
                <span>Property listed</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
                <span>Property delivered</span>
              </span>
            </div>
            <div className="relative w-52 h-28 flex items-center justify-center mt-2">
              <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = -180 + i * (180 / 15);
                  const isListed = i < 5;
                  const isDelivered = i >= 5 && i < 12;
                  return (
                    <g key={i} transform={`rotate(${angle} 100 100)`}>
                      <rect
                        x="93" y="10" width="14" height="28" rx="4"
                        fill={isListed ? '#FDBA74' : isDelivered ? '#EA580C' : isDark ? '#26262B' : '#E5E7EB'}
                      />
                    </g>
                  );
                })}
              </svg>
              <div className="absolute bottom-1 flex flex-col items-center">
                <span className="text-3xl font-black tracking-tight">70%</span>
                <span className="text-[10px] font-semibold text-neutral-400">Achieved</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'sales-overview-radial-dashboard':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight">Sales Overview</span>
            <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-neutral-500 dark:text-neutral-300" />
            </div>
          </div>
          <div className="bg-[#F3F0FF] dark:bg-[#2E1A47] text-[#6D28D9] dark:text-[#DDD6FE] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 my-1">
            <Crown className="w-4 h-4 fill-[#6D28D9] dark:fill-[#DDD6FE]" />
            <span>You're the top <strong className="text-[#4C1D95] dark:text-white">17%</strong> of performers</span>
          </div>
          <div className="relative w-48 h-24 flex items-center justify-center mx-auto my-1">
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              {Array.from({ length: 14 }).map((_, i) => {
                const angle = -180 + i * (180 / 13);
                const isActive = i < 9;
                return (
                  <g key={i} transform={`rotate(${angle} 100 100)`}>
                    <rect
                      x="93" y="10" width="14" height="28" rx="4"
                      fill={isActive ? '#6366F1' : isDark ? '#26262B' : '#E5E7EB'}
                    />
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-2xl font-black tracking-tight">67.2%</span>
              <span className="text-[9px] font-semibold text-neutral-400">sales goals</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-neutral-500">Number of Sales</span>
                <span className="px-1.5 py-0.5 rounded-md bg-[#6366F1]/15 text-[#6366F1] text-[9px] font-bold">3.5% ↗</span>
              </div>
              <div className="text-xl font-black tracking-tight mt-1">1,304</div>
            </div>
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-white border-neutral-200/80 shadow-xs'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-neutral-500">Total Revenue</span>
                <span className="px-1.5 py-0.5 rounded-md bg-neutral-900 text-white text-[9px] font-bold">4.5% ↘</span>
              </div>
              <div className="text-xl font-black tracking-tight mt-1">$21.1K</div>
            </div>
          </div>
        </div>
      );

    case 'users-growth-pill-progress':
      return (
        <div className="w-full h-full p-4 flex flex-col justify-between select-none font-sans bg-[#0E0E10] text-white rounded-[24px] border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-white text-white" />
              <span className="text-sm font-bold tracking-tight">Users growth</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-neutral-700 overflow-hidden border border-white/20">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-bold text-[#818CF8]">↗</span>
            <span className="text-4xl font-black tracking-tight">+88.3%</span>
            <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-0.5">
              +1.78% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div className="space-y-2 my-1">
            <div className="w-full h-9 bg-[#1A1A1E] rounded-full flex items-center p-1">
              <div className="w-[45%] h-full bg-white text-black rounded-full flex items-center px-3 text-xs font-bold">
                12.01
              </div>
            </div>
            <div className="w-full h-9 bg-[#1A1A1E] rounded-full flex items-center p-1">
              <div className="w-[78%] h-full bg-white text-black rounded-full flex items-center px-3 text-xs font-bold">
                13.01
              </div>
            </div>
            <div className="w-full h-9 bg-gradient-to-r from-[#2E284A] to-[#A5B4FC] rounded-full flex items-center px-3 text-xs font-bold text-white shadow-md">
              14.01
            </div>
          </div>
        </div>
      );

    case 'overview-bar-scrubber-card':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight">Overview</span>
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border cursor-pointer ${
              isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-white border-neutral-200 text-neutral-700 shadow-xs'
            }`}>
              <span>Last Month</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 my-0.5">
            <div>
              <div className="text-[10px] text-neutral-400 font-semibold uppercase">Avg Per month</div>
              <div className="text-2xl font-black tracking-tight">1,860<span className="text-neutral-400 font-normal text-base">/3K</span></div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-bold flex items-center gap-0.5">
              50,2% ▲
            </span>
          </div>
          <div className="relative w-full h-28 my-1 flex items-end justify-between px-1">
            {[
              { month: 'Apr', h: '45%' },
              { month: 'May', h: '30%' },
              { month: 'Jun', h: '75%' },
              { month: 'Jul', h: '50%' },
              { month: 'Aug', h: '85%', active: true },
              { month: 'Sep', h: '40%' },
              { month: 'Oct', h: '60%' },
              { month: 'Nov', h: '70%' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 relative">
                {item.active && (
                  <div className="absolute -top-11 z-20 flex flex-col items-center">
                    <div className="bg-[#1E1E22] text-white text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xl border border-white/10 text-center">
                      <div>August 2025</div>
                      <div className="text-neutral-300">120 pcs</div>
                    </div>
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#1E1E22]" />
                  </div>
                )}
                <div 
                  className={`w-7 rounded-2xl relative overflow-hidden flex items-start justify-center ${
                    item.active 
                      ? 'bg-[#27272A] border-2 border-white/20 shadow-md' 
                      : 'bg-neutral-200/60 dark:bg-neutral-800/40'
                  }`} 
                  style={{ height: item.h }}
                >
                  <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id={`stripe-${i}`} width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="16" stroke="#FFFFFF" strokeWidth="8" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#stripe-${i})`} />
                  </svg>
                  {item.active && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#27272A] mt-1 z-10" />
                  )}
                </div>
                <span className={`text-[9px] font-bold ${item.active ? 'text-black dark:text-white font-black' : 'text-neutral-400'}`}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'network-telemetry-matrix':
      return (
        <div className="w-full h-full p-4 flex flex-col justify-between select-none font-mono bg-[#0B0D0E] text-white rounded-[24px] border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-sans font-bold tracking-tight">Network Telemetry</span>
            <div className="flex items-center gap-2 text-neutral-500">
              <Share2 className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
              <MoreHorizontal className="w-3.5 h-3.5 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 my-1">
            <div>
              <div className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Average Finality</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-sans">1.8s</span>
                <span className="text-[9px] font-bold text-[#22C55E] flex items-center gap-0.5">↑ 14.6%</span>
              </div>
            </div>
            <div>
              <div className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Intents Finalized</div>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black font-sans">312,134</span>
                <span className="text-[9px] font-bold text-[#22C55E] flex items-center gap-0.5">↑ 11.5%</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-bold text-neutral-500 tracking-wider">
              <span>AUGUST / TESTNET V0</span>
              <span>12,430 INTENTS</span>
            </div>
            <div className="grid grid-cols-16 gap-0.5 h-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full rounded-[1px] ${
                    [3, 7, 12, 18, 22, 29, 34, 41, 45].includes(i) ? 'bg-[#22C55E]' : 'bg-[#142319]'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-bold text-neutral-500 tracking-wider">
              <span>SEPTEMBER / V1 SEQUENCER</span>
              <span>18,916 INTENTS</span>
            </div>
            <div className="grid grid-cols-16 gap-0.5 h-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full h-full rounded-[1px] ${
                    [2, 6, 11, 15, 24, 31, 38, 43, 47].includes(i) ? 'bg-[#22C55E]' : 'bg-[#142319]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      );

    case 'progress-indicator-piano':
      return (
        <div className="w-full h-full p-4 flex flex-col justify-between select-none font-sans bg-[#0E0E10] text-white rounded-[24px] border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Progress Indicator</span>
            <MoreHorizontal className="w-4 h-4 text-neutral-500 cursor-pointer" />
          </div>
          <div className="text-[11px] text-neutral-400 font-medium my-0.5">
            You are on track to finish the goal three days early
          </div>
          <div className="w-full h-px bg-white/10 my-1" />
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-3xl font-black tracking-tight">66%</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-bold border border-white/15 flex items-center gap-1">
              <span>↗ 71 avg</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">vs. the last period</span>
          </div>
          <div className="flex items-center gap-1 h-12 w-full mt-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-full rounded-xs transition-colors ${
                  i < 18 ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-[#26262B]'
                }`}
              />
            ))}
          </div>
        </div>
      );

    case 'server-performance-step-bars':
      return (
        <div className="w-full h-full p-4 flex flex-col justify-between select-none font-sans bg-[#0E0E10] text-white rounded-[24px] border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Server Performance Metrics</span>
            <ArrowUpRight className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-4xl font-black tracking-tight my-1">+45%</div>
          <div className="flex items-end justify-between gap-1.5 h-20 mt-2 px-1">
            {[15, 22, 30, 45, 58, 72, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-[#222226] rounded-t-sm relative overflow-hidden flex flex-col justify-end" style={{ height: `${h}%` }}>
                <div className="w-full h-1 bg-white" />
              </div>
            ))}
          </div>
        </div>
      );

    case 'credit-score-barcode-meter':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-[#FAFAFA] text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Credit Score</div>
              <div className="text-[11px] text-neutral-400 font-medium">Your current credit rating.</div>
            </div>
            <div className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border cursor-pointer ${
              isDark ? 'bg-white/10 border-white/15 text-white' : 'bg-white border-neutral-200 text-neutral-700 shadow-xs'
            }`}>
              <span>Weekly</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-4xl font-black tracking-tight">88<span className="text-neutral-400 font-normal text-2xl">/100</span></span>
            <span className="text-[11px] font-bold text-[#22C55E]">▲ 13.6%</span>
            <span className="text-[11px] text-neutral-400 font-medium">vs last month</span>
          </div>
          <div className="flex items-center justify-between gap-1 h-9 w-full mt-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 h-full rounded-full ${
                  i < 36 ? 'bg-[#22C55E]' : isDark ? 'bg-white/10' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      );

    case 'views-hourly-wave-chart':
      return (
        <div className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] border transition-colors duration-300 ${
          isDark ? 'bg-[#18181A] text-white border-white/10' : 'bg-white text-neutral-900 border-neutral-200 shadow-sm'
        }`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-bold tracking-tight">Views</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black tracking-tight">12.7K</span>
                <span className="text-[10px] font-bold text-[#22C55E]">↗ 2.6%</span>
                <span className="text-[9px] text-neutral-400 font-bold uppercase">VS PREV. DAY</span>
              </div>
            </div>
            <div className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
            }`}>
              {(['Day', 'Week', 'Month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    setViewsRange(p);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer border-0 ${
                    viewsRange === p
                      ? (isDark ? 'bg-white text-black' : 'bg-white text-black shadow-xs')
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full h-20 my-1">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
              <text x="92" y="18" fill="#F59E0B" fontSize="4" fontWeight="bold">AVG</text>
              <path d="M0,25 Q15,30 25,12 T50,15 T75,18 T100,28 L100,40 L0,40 Z" fill="url(#blue-wave-grad)" opacity="0.25" />
              <motion.path
                d="M0,25 Q15,30 25,12 T50,15 T75,18 T100,28"
                fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <defs>
                <linearGradient id="blue-wave-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-[9px] font-bold text-neutral-400 uppercase px-1">
            <span>12 AM</span>
            <span>4 AM</span>
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
          </div>
        </div>
      );

    case 'timer-preparation-segmented':
      return (
        <div className="w-full h-full p-4 flex flex-col justify-between select-none font-sans bg-[#12141A] text-white rounded-[24px]">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl font-black tracking-tight leading-none font-sans">25:04</div>
              <div className="text-xs font-semibold text-neutral-400 mt-1">Left for preparation</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1A3660] text-[#3B82F6] flex items-center justify-center border border-[#2563EB]/30">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          </div>
          <div className="relative pt-6">
            <div className="absolute top-0 right-3 transform -translate-y-full flex flex-col items-center">
              <div className="bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-white text-[#2563EB] text-[9px] font-black flex items-center justify-center">1</span>
                <span>Preparation</span>
              </div>
              <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#2563EB]" />
            </div>
            <div className="relative w-full h-11 bg-[#1A2333] rounded-xl p-1 flex items-center justify-between gap-1 overflow-hidden">
              {[1, 2, 3].map((seg) => (
                <div key={seg} className="flex-1 h-full bg-[#121B2B] rounded-lg" />
              ))}
              <div className="relative flex-1 h-full bg-[#2563EB] rounded-lg overflow-hidden flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern id="stripes" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                      <line x1="0" y1="0" x2="0" y2="20" stroke="#FFFFFF" strokeWidth="10" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#stripes)" />
                </svg>
              </div>
              <div className="absolute top-0 bottom-0 right-10 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10" />
            </div>
          </div>
        </div>
      );

    case 'noise-decibel-level':
      return (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic('light');
            setDecibelLevel(decibelLevel === 40 ? 60 : 40);
          }}
          className={`w-full h-full p-4 flex flex-col justify-between select-none font-sans rounded-[24px] cursor-pointer transition-colors duration-300 ${
            isDark ? 'bg-[#18181A] text-white border border-white/10' : 'bg-[#EAEBED] text-neutral-900'
          }`}
        >
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-neutral-400">Current noise level</span>
            <div className="flex items-end gap-1 h-4">
              <div className={`w-1 rounded-full ${decibelLevel === 40 ? 'h-2 bg-[#22C55E]' : 'h-2 bg-[#EAB308]'}`} />
              <div className={`w-1 rounded-full ${decibelLevel === 40 ? 'h-3 bg-[#22C55E]' : 'h-3 bg-[#EAB308]'}`} />
              <div className={`w-1 rounded-full ${decibelLevel === 40 ? 'h-4 bg-[#22C55E]' : 'h-4 bg-[#EAB308]'}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-5xl font-black tracking-tight leading-none font-sans">{decibelLevel}</span>
            <span className="text-base font-bold text-neutral-400">dB</span>
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-neutral-400 px-0.5 mb-1">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`relative flex-1 h-12 rounded-2xl flex items-center justify-start px-4 overflow-hidden ${
              decibelLevel === 40 ? 'bg-[#22C55E] text-white shadow-md' : 'bg-[#EAB308] text-white shadow-md'
            }`}>
              <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="db-stripes" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="16" stroke="#FFFFFF" strokeWidth="8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#db-stripes)" />
              </svg>
              <span className="relative z-10 text-base font-black font-sans">{decibelLevel}</span>
            </div>
            <div className="w-1 h-8 bg-neutral-400/40 rounded-full" />
            <div className={`flex-1 h-12 rounded-2xl flex items-center justify-end px-4 font-black text-base font-sans ${
              isDark ? 'bg-white/10 text-neutral-400' : 'bg-neutral-300/80 text-neutral-500'
            }`}>
              120
            </div>
          </div>
        </div>
      );

    // --- MONOCHROMATIC COMPONENTS ---
    case 'mono-stock':
      return (
        <div className={containerClasses}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-[10px] tracking-wider uppercase opacity-60">
                <span>AAPL</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <div className="text-2xl font-black tracking-tight mt-0.5">$182.40</div>
              <div className="flex items-center gap-1 text-[10px] font-bold opacity-80 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+$4.15 (+2.33%)</span>
              </div>
            </div>
            <div className={`flex items-center p-0.5 rounded-full border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-neutral-100 border-black/10'}`}>
              {(['1D', '1W', '1M', '1Y'] as const).map((r) => (
                <button
                  key={r}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic('light');
                    setStockRange(r);
                  }}
                  className={`px-2 py-0.5 text-[9px] font-bold rounded-full transition-colors cursor-pointer border-0 ${
                    stockRange === r
                      ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                      : (isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black')
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full h-16 mt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0,30 Q15,10 30,25 T60,15 T90,5 L100,2 L100,40 L0,40 Z" fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} />
              <motion.path
                d="M0,30 Q15,10 30,25 T60,15 T90,5 L100,2"
                fill="none" stroke={isDark ? "#FFFFFF" : "#000000"} strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
              <circle cx="100" cy="2" r="3" fill={isDark ? "#FFFFFF" : "#000000"} />
            </svg>
          </div>
        </div>
      );

    case 'mono-revenue':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold opacity-50 uppercase tracking-wider">Revenue Stream</div>
              <div className="text-2xl font-black mt-0.5">$94,820.00</div>
            </div>
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="relative w-full h-16 mt-2">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0,35 Q20,10 40,20 T80,5 L100,12 L100,40 L0,40 Z" fill={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"} />
              <motion.path
                d="M0,35 Q20,10 40,20 T80,5 L100,12"
                fill="none" stroke={isDark ? "#FFFFFF" : "#000000"} strokeWidth="2.5" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }}
              />
            </svg>
          </div>
        </div>
      );

    case 'mono-credit':
      return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center select-none font-sans">
          <div className="relative w-24 h-24 flex items-center justify-center mb-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <motion.path
                className={isDark ? "text-white" : "text-black"} strokeWidth="3.5" strokeDasharray="78, 100" strokeLinecap="round" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: "78, 100" }} transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>785</span>
              <span className="text-[8px] font-bold opacity-60 uppercase">Score</span>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-black border-black/20'}`}>
            Excellent Tier
          </span>
        </div>
      );

    case 'mono-wallet':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Wallet Balance</span>
            <span className="text-xs font-bold">$24,500.00</span>
          </div>
          <div className="grid grid-cols-2 gap-2 my-1">
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'}`}>
              <div className="text-[9px] font-medium opacity-50">Inflow</div>
              <div className="text-base font-black">+$8,240</div>
            </div>
            <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.03] border-black/10'}`}>
              <div className="text-[9px] font-medium opacity-50">Outflow</div>
              <div className="text-base font-black">-$2,150</div>
            </div>
          </div>
          <div className="text-[10px] opacity-60">Auto-save enabled · 4 cards linked</div>
        </div>
      );

    case 'mono-savings':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Savings Goal</span>
            <span className="text-xs font-bold">$12,400</span>
          </div>
          <div className="my-2">
            <div className="text-[10px] opacity-60">Target: New House ($15,000)</div>
            <div className={`w-full h-2 rounded-full mt-1.5 overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-neutral-200'}`}>
              <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 0.7 }} className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-black'}`} />
            </div>
          </div>
          <div className="text-[10px] font-medium opacity-60">+ $800 auto-deposit / mo</div>
        </div>
      );

    case 'mono-heatmap':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Activity Heatmap</span>
            <span className="text-[10px] font-mono font-bold">342 Commits</span>
          </div>
          <div className="grid grid-cols-7 gap-1 my-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                className={`w-full aspect-square rounded-xs ${
                  i % 5 === 0 
                    ? (isDark ? 'bg-white' : 'bg-black') 
                    : i % 3 === 0 
                    ? (isDark ? 'bg-neutral-500' : 'bg-neutral-400') 
                    : (isDark ? 'bg-neutral-800' : 'bg-neutral-200')
                }`}
              />
            ))}
          </div>
          <div className="text-[10px] opacity-50">High Activity Matrix</div>
        </div>
      );

    case 'mono-activity-ring':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Activity Rings</span>
            <span className="text-xs font-bold">3 Goals Hit</span>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto my-1">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="42" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="4" stroke="currentColor" fill="none" />
              <motion.circle cx="50" cy="50" r="42" className={isDark ? "text-white" : "text-black"} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" strokeDasharray="263.8" strokeDashoffset="52.7" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="32" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="4" stroke="currentColor" fill="none" />
              <motion.circle cx="50" cy="50" r="32" className={isDark ? "text-neutral-400" : "text-neutral-600"} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" strokeDasharray="201" strokeDashoffset="40.2" />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="22" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="4" stroke="currentColor" fill="none" />
              <motion.circle cx="50" cy="50" r="22" className={isDark ? "text-neutral-600" : "text-neutral-400"} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" strokeDasharray="138.2" strokeDashoffset="27.6" />
            </svg>
            <span className="text-xs font-black">88%</span>
          </div>
          <div className="flex justify-around text-[10px] font-semibold opacity-70">
            <span>Move</span> · <span>Exercise</span> · <span>Stand</span>
          </div>
        </div>
      );

    case 'mono-users':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Active Users (MAU)</span>
            <span className="text-xs font-bold">+12.4%</span>
          </div>
          <div className="text-3xl font-black">48.2k</div>
          <div className="flex items-center gap-1 text-[10px] opacity-70">
            <span className={`px-1.5 py-0.5 rounded font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>US 54%</span>
            <span className={`px-1.5 py-0.5 rounded font-semibold ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>EU 32%</span>
          </div>
        </div>
      );

    case 'mono-kfactor':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Viral K-Factor Arc</span>
            <span className="text-xs font-bold">K = 1.42</span>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto my-1">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="14" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="3.5" stroke="currentColor" fill="none" />
              <motion.circle
                cx="18" cy="18" r="14" className={isDark ? "text-white" : "text-black"} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none"
                strokeDasharray="88" strokeDashoffset="26"
                initial={{ strokeDashoffset: 88 }} animate={{ strokeDashoffset: 26 }} transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-lg font-black">1.42x</span>
              <span className="text-[8px] font-bold opacity-60 uppercase">Growth</span>
            </div>
          </div>
          <div className="text-[10px] text-center opacity-60">Exponential referral multiplier</div>
        </div>
      );

    case 'mono-latency':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Latency P99</span>
            <span className="text-xs font-mono font-bold">1.8ms</span>
          </div>
          <div className="my-1">
            <div className="text-2xl font-black">1.8s Avg</div>
            <div className="text-[10px] opacity-50">P99: 3.6s · P95: 0.4s</div>
          </div>
          <div className="h-10 w-full mt-1">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d="M0,20 L20,25 L40,15 L60,25 L80,10 L100,5" fill="none" stroke={isDark ? "#FFFFFF" : "#000000"} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      );

    case 'mono-bandwidth':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Bandwidth Speed Dial</span>
            <span className="text-xs font-mono font-bold">1.2 Gbps</span>
          </div>
          <div className="relative w-full h-16 flex items-center justify-center my-1">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={isDark ? "#262626" : "#E5E5E5"} strokeWidth="8" strokeLinecap="round" />
              <motion.path
                d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={isDark ? "#FFFFFF" : "#000000"} strokeWidth="8" strokeLinecap="round"
                strokeDasharray="125.6" strokeDashoffset="25"
                initial={{ strokeDashoffset: 125.6 }} animate={{ strokeDashoffset: 25 }} transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-lg font-black">840 Mbps</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] font-mono opacity-60">
            <span>Latency: 1.2ms</span>
            <span>Packet Loss: 0%</span>
          </div>
        </div>
      );

    case 'mono-server':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Dual Arc Server Gauge</span>
            <span className="text-xs font-bold">Normal</span>
          </div>
          <div className="flex items-center justify-around my-1">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path
                  className={isDark ? "text-white" : "text-black"} strokeWidth="4" strokeDasharray="32, 100" strokeLinecap="round" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: "32, 100" }} transition={{ duration: 0.8 }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-black">32%</span>
                <span className="text-[8px] font-bold opacity-60 uppercase">CPU</span>
              </div>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <motion.path
                  className={isDark ? "text-neutral-400" : "text-neutral-600"} strokeWidth="4" strokeDasharray="64, 100" strokeLinecap="round" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: "64, 100" }} transition={{ duration: 0.8, delay: 0.1 }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-sm font-black">64%</span>
                <span className="text-[8px] font-bold opacity-60 uppercase">RAM</span>
              </div>
            </div>
          </div>
          <div className="flex justify-around text-[10px] font-mono opacity-60">
            <span>Nodes: 8 Active</span>
            <span>Heap: 4.2 GB</span>
          </div>
        </div>
      );

    case 'mono-progress':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Circular Build Ring</span>
            <span className="text-xs font-bold">Building...</span>
          </div>
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto my-1">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="14" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="3" stroke="currentColor" fill="none" />
              <motion.circle
                cx="18" cy="18" r="14" className={isDark ? "text-white" : "text-black"} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none"
                strokeDasharray="88" strokeDashoffset="22"
                initial={{ strokeDashoffset: 88 }} animate={{ strokeDashoffset: 22 }} transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-black">75%</span>
              <span className="text-[8px] font-semibold opacity-60">Stage 3/4</span>
            </div>
          </div>
          <div className="text-[10px] text-center opacity-60">Compiling bundle chunks...</div>
        </div>
      );

    case 'mono-radar':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold opacity-60">Incident Radar Arc</span>
            <span className="text-xs font-bold flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-white' : 'bg-black'}`} />
              <span>Scanning</span>
            </span>
          </div>
          <div className="relative w-full h-16 flex items-center justify-center my-1">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={isDark ? "#262626" : "#E5E5E5"} strokeWidth="6" strokeLinecap="round" />
              <motion.path
                d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={isDark ? "#FFFFFF" : "#000000"} strokeWidth="6" strokeLinecap="round"
                strokeDasharray="125.6" strokeDashoffset="0"
                initial={{ strokeDashoffset: 125.6 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1 }}
              />
            </svg>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-xs font-black">Zero Criticals</span>
            </div>
          </div>
          <div className="text-[10px] opacity-60 text-center">Monitored 24/7 · 0 Open Alerts</div>
        </div>
      );

    case 'mono-timer-arc':
      return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-between select-none font-sans">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold opacity-60">Focus Arc Gauge</span>
            <span className="text-xs font-mono font-bold">25:00</span>
          </div>
          <div className="relative w-28 h-28 flex items-center justify-center my-1">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="40" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="8" stroke="currentColor" fill="none" />
              <motion.circle
                cx="50" cy="50" r="40" className={isDark ? "text-white" : "text-black"} strokeWidth="8" strokeLinecap="round" stroke="currentColor" fill="none"
                strokeDasharray="251.2" strokeDashoffset="62.8"
                initial={{ strokeDashoffset: 62.8 }} animate={{ strokeDashoffset: 62.8 }} transition={{ duration: 1.2 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>18:42</span>
              <span className="text-[9px] font-semibold opacity-60 uppercase tracking-widest">Remaining</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerHaptic('medium');
              setTimerActive(!timerActive);
            }}
            className={`px-4 py-1 text-xs font-bold rounded-full border-0 cursor-pointer ${
              isDark ? 'bg-white text-black' : 'bg-black text-white'
            }`}
          >
            {timerActive ? 'Pause' : 'Start Focus'}
          </button>
        </div>
      );

    case 'mono-timer-ring':
    default:
      return (
        <div className="w-full h-full p-4 flex flex-col items-center justify-between select-none font-sans">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold opacity-60">Concentric Ring Timer</span>
            <span className="text-xs font-bold">Deep Work</span>
          </div>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="42" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="5" stroke="currentColor" fill="none" />
              <motion.circle
                cx="50" cy="50" r="42" className={isDark ? "text-white" : "text-black"} strokeWidth="5" strokeLinecap="round" stroke="currentColor" fill="none"
                strokeDasharray="263.8" strokeDashoffset="65.9"
                initial={{ strokeDashoffset: 263.8 }} animate={{ strokeDashoffset: 65.9 }} transition={{ duration: 1 }}
              />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="32" className={isDark ? "text-neutral-800" : "text-neutral-200"} strokeWidth="5" stroke="currentColor" fill="none" />
              <motion.circle
                cx="50" cy="50" r="32" className={isDark ? "text-neutral-400" : "text-neutral-600"} strokeWidth="5" strokeLinecap="round" stroke="currentColor" fill="none"
                strokeDasharray="201" strokeDashoffset="40.2"
                initial={{ strokeDashoffset: 201 }} animate={{ strokeDashoffset: 40.2 }} transition={{ duration: 1, delay: 0.2 }}
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-black'}`}>75%</span>
              <span className="text-[9px] font-bold opacity-60">Goal</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold opacity-70">
            <span>Focus 45m</span> · <span>Break 15m</span>
          </div>
        </div>
      );
  }
};
