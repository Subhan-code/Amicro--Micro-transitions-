import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { DitherBook } from './DitherBook';
import { DitherDonutChart } from './DitherDonutChart';
import { DitherGrowthChart } from './DitherGrowthChart';
import { DitherStackedChart } from './DitherStackedChart';
import { DitherFunnelChart } from './DitherFunnelChart';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ServerGauge } from './ServerGauge';
import { TrafficBubble } from './TrafficBubble';
import { DeviceUsageChart } from './DeviceUsageChart';
import { StorageUsageChart } from './StorageUsageChart';
import { RevenueLineChart } from './RevenueLineChart';
import { UptimeChart } from './UptimeChart';
import { simpleCompData, SimpleCompItem } from '../../data/simpleComp';
import { IconSwap, IconSwapItem } from '../IconSwap';

interface SimpleCompGridProps {
  theme: 'dark' | 'light';
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
}

export function SimpleCompGrid({ theme, showToast, triggerHaptic }: SimpleCompGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (item: SimpleCompItem) => {
    navigator.clipboard.writeText(item.codeSnippet)
      .then(() => {
        if (triggerHaptic) triggerHaptic('success');
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
        if (showToast) showToast(`Copied ${item.label} code!`);
      })
      .catch(() => {
        if (triggerHaptic) triggerHaptic('error');
        if (showToast) showToast('Failed to copy code.');
      });
  };

  const bookItem = simpleCompData.find(i => i.id === 'dither-book') || simpleCompData[0];
  const chartItems = simpleCompData.filter(i => i.id !== 'dither-book');

  return (
    <div className="w-full flex flex-col gap-8 max-w-[1060px] mx-auto text-left font-sans">
      
      {/* Hero Book Component Card */}
      <div className="w-full">
        <div className={`relative group rounded-[24px] flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-300 border w-full overflow-hidden ${
          theme === 'dark' 
            ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
            : 'bg-white border-neutral-100 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }`}>
          {/* Inner Stage Area */}
          <div className="flex-1 flex items-center justify-center w-full min-h-[260px] md:min-h-[300px]">
            <DitherBook theme={theme} />
          </div>

          {/* Details Row */}
          <div className="w-full flex items-center justify-between mt-3 px-2">
            <span className={`text-[13px] font-semibold transition-colors ${
              theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              {bookItem.label}
            </span>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleCopyCode(bookItem)}
              className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
                copiedId === bookItem.id
                  ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-300')
                  : (theme === 'dark' ? 'bg-white/[0.08] border-transparent hover:bg-white/[0.14] text-neutral-300 hover:text-white' : 'bg-neutral-100 border-transparent hover:bg-neutral-200 text-neutral-650 hover:text-black')
              }`}
              title="Copy component code"
            >
              <IconSwap>
                <IconSwapItem key={copiedId === bookItem.id ? "check" : "copy"}>
                  {copiedId === bookItem.id ? (
                    <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </IconSwapItem>
              </IconSwap>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Grid of Compact Dither Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {chartItems.map((item) => {
          const isCopied = copiedId === item.id;

          return (
            <div 
              key={item.id} 
              className={`relative group rounded-2xl flex flex-col items-center justify-between p-3.5 transition-all duration-300 border ${
                theme === 'dark' 
                  ? 'bg-[#181818] border-white/5 hover:bg-[#1f1f1f] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]' 
                  : 'bg-white border-neutral-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-neutral-200/50'
              }`}
            >
              {/* Compact Component Preview Stage */}
              <div className="flex-1 flex items-center justify-center w-full h-[180px] overflow-hidden rounded-xl">
                {item.id === 'dither-donut' && <DitherDonutChart theme={theme} compact={true} />}
                {item.id === 'dither-stacked' && <DitherStackedChart theme={theme} compact={true} />}
                {item.id === 'dither-growth' && <DitherGrowthChart theme={theme} compact={true} />}
                {item.id === 'dither-heatmap' && <ActivityHeatmap theme={theme} compact={true} />}
                {item.id === 'dither-gauge' && <ServerGauge theme={theme} compact={true} />}
                {item.id === 'dither-traffic' && <TrafficBubble theme={theme} compact={true} />}
                {item.id === 'dither-funnel' && <DitherFunnelChart theme={theme} compact={true} />}
                {item.id === 'dither-device' && <DeviceUsageChart theme={theme} compact={true} />}
                {item.id === 'dither-storage' && <StorageUsageChart theme={theme} compact={true} />}
                {item.id === 'dither-revenue' && <RevenueLineChart theme={theme} compact={true} />}
                {item.id === 'dither-uptime' && <UptimeChart theme={theme} compact={true} />}
              </div>

              {/* Card Footer Row */}
              <div className="w-full flex items-center justify-between mt-2.5 px-1 gap-1">
                <span className={`text-[12px] font-medium truncate transition-colors ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`} title={item.label}>
                  {item.label}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopyCode(item)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer border flex items-center justify-center ${
                    isCopied
                      ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-600 border-emerald-300')
                      : (theme === 'dark' ? 'bg-white/[0.08] border-transparent text-neutral-300 hover:text-white hover:bg-white/[0.14]' : 'bg-neutral-100/90 border-transparent text-neutral-600 hover:text-black hover:bg-neutral-200')
                  }`}
                  title="Copy component code"
                >
                  <IconSwap>
                    <IconSwapItem key={isCopied ? "check" : "copy"}>
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </IconSwapItem>
                  </IconSwap>
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
