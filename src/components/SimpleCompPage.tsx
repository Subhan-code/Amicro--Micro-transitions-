import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DitherBook } from './simple-comp/DitherBook';
import { DitherDonutChart } from './simple-comp/DitherDonutChart';
import { DitherGrowthChart } from './simple-comp/DitherGrowthChart';
import { DitherStackedChart } from './simple-comp/DitherStackedChart';
import { DitherFunnelChart } from './simple-comp/DitherFunnelChart';
import { ActivityHeatmap } from './simple-comp/ActivityHeatmap';
import { ServerGauge } from './simple-comp/ServerGauge';
import { TrafficBubble } from './simple-comp/TrafficBubble';
import { DeviceUsageChart } from './simple-comp/DeviceUsageChart';
import { StorageUsageChart } from './simple-comp/StorageUsageChart';
import { RevenueLineChart } from './simple-comp/RevenueLineChart';
import { UptimeChart } from './simple-comp/UptimeChart';
import { IconSwap, IconSwapItem } from './IconSwap';

interface SimpleCompPageProps {
  theme: 'dark' | 'light';
  showToast: (message: string) => void;
  triggerHaptic: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
}

type CompCategory = 'all' | 'book' | 'donut' | 'growth' | 'stacked';

interface CatalogCardItem {
  id: string;
  label: string;
  kebabName: string;
  category: CompCategory;
  description: string;
  component: React.ComponentType<{ theme?: 'dark' | 'light'; compact?: boolean }>;
  codeSnippet: string;
}

const CATALOG_ITEMS: CatalogCardItem[] = [
  {
    id: 'dither-book',
    label: '3D Dither Lab Book',
    kebabName: 'dither-book',
    category: 'book',
    description: '3D page-flipping flipbook with cream paper texture & customizable crease depth.',
    component: DitherBook,
    codeSnippet: `import { DitherBook } from '@/components/ui/dither-book';\n\nexport default function Demo() {\n  return <DitherBook theme="dark" />;\n}`
  },
  {
    id: 'dither-donut',
    label: 'Dither Donut Chart',
    kebabName: 'dither-donut',
    category: 'donut',
    description: 'Canvas dithered donut chart with white highlights & period filters.',
    component: DitherDonutChart,
    codeSnippet: `import { DitherDonutChart } from '@/components/ui/dither-donut';\n\nexport default function Demo() {\n  return <DitherDonutChart theme="dark" />;\n}`
  },
  {
    id: 'dither-growth',
    label: 'Dither Growth Chart',
    kebabName: 'dither-growth',
    category: 'growth',
    description: 'Dithered area chart with continuous white shaders & interactive scrubber tooltip.',
    component: DitherGrowthChart,
    codeSnippet: `import { DitherGrowthChart } from '@/components/ui/dither-growth';\n\nexport default function Demo() {\n  return <DitherGrowthChart theme="dark" />;\n}`
  },
  {
    id: 'dither-stacked',
    label: 'Dither Stacked Chart',
    kebabName: 'dither-stacked',
    category: 'stacked',
    description: 'Dithered stacked bar chart with white bands & branch hovers.',
    component: DitherStackedChart,
    codeSnippet: `import { DitherStackedChart } from '@/components/ui/dither-stacked';\n\nexport default function Demo() {\n  return <DitherStackedChart theme="dark" />;\n}`
  },
  {
    id: 'dither-heatmap',
    label: 'Dither Activity Heatmap',
    kebabName: 'dither-heatmap',
    category: 'growth',
    description: 'Activity heatmap grid with white dither intensity tiles.',
    component: ActivityHeatmap,
    codeSnippet: `import { ActivityHeatmap } from '@/components/ui/dither-heatmap';\n\nexport default function Demo() {\n  return <ActivityHeatmap theme="dark" />;\n}`
  },
  {
    id: 'dither-gauge',
    label: 'Dither Server Gauge',
    kebabName: 'dither-gauge',
    category: 'donut',
    description: 'Server CPU & memory radial gauge dial with white dither dot matrix.',
    component: ServerGauge,
    codeSnippet: `import { ServerGauge } from '@/components/ui/dither-gauge';\n\nexport default function Demo() {\n  return <ServerGauge theme="dark" />;\n}`
  },
  {
    id: 'dither-traffic',
    label: 'Dither Traffic Bubbles',
    kebabName: 'dither-traffic',
    category: 'growth',
    description: 'Traffic source scatter bubble plot with floating white dither nodes.',
    component: TrafficBubble,
    codeSnippet: `import { TrafficBubble } from '@/components/ui/dither-traffic';\n\nexport default function Demo() {\n  return <TrafficBubble theme="dark" />;\n}`
  },
  {
    id: 'dither-funnel',
    label: 'Dither Conversion Funnel',
    kebabName: 'dither-funnel',
    category: 'stacked',
    description: 'Conversion funnel with white dither progress stage bars.',
    component: DitherFunnelChart,
    codeSnippet: `import { DitherFunnelChart } from '@/components/ui/dither-funnel';\n\nexport default function Demo() {\n  return <DitherFunnelChart theme="dark" />;\n}`
  },
  {
    id: 'dither-device',
    label: 'Dither Device Breakdown',
    kebabName: 'dither-device',
    category: 'donut',
    description: 'Device usage donut chart with white dither particle segments.',
    component: DeviceUsageChart,
    codeSnippet: `import { DeviceUsageChart } from '@/components/ui/dither-device';\n\nexport default function Demo() {\n  return <DeviceUsageChart theme="dark" />;\n}`
  },
  {
    id: 'dither-storage',
    label: 'Dither Storage Bar',
    kebabName: 'dither-storage',
    category: 'stacked',
    description: 'Storage capacity bar with animated white dither progress shaders.',
    component: StorageUsageChart,
    codeSnippet: `import { StorageUsageChart } from '@/components/ui/dither-storage';\n\nexport default function Demo() {\n  return <StorageUsageChart theme="dark" />;\n}`
  },
  {
    id: 'dither-revenue',
    label: 'Dither Revenue Line',
    kebabName: 'dither-revenue',
    category: 'growth',
    description: 'Revenue line graph with white dither gradient fill.',
    component: RevenueLineChart,
    codeSnippet: `import { RevenueLineChart } from '@/components/ui/dither-revenue';\n\nexport default function Demo() {\n  return <RevenueLineChart theme="dark" />;\n}`
  },
  {
    id: 'dither-uptime',
    label: 'Dither System Uptime',
    kebabName: 'dither-uptime',
    category: 'stacked',
    description: '90-day system uptime matrix with white dither status tiles.',
    component: UptimeChart,
    codeSnippet: `import { UptimeChart } from '@/components/ui/dither-uptime';\n\nexport default function Demo() {\n  return <UptimeChart theme="dark" />;\n}`
  }
];

export function SimpleCompPage({ theme, showToast, triggerHaptic }: SimpleCompPageProps) {
  const [activeCategory, setActiveCategory] = useState<CompCategory>('all');
  const [activeStageComp, setActiveStageComp] = useState<CompCategory>('book');

  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10 font-sans">
      
      {/* Page Hero Header */}
      <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Simple Comp
        </h1>
        <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          A curated collection of canvas dither shaders, real-time data visualizers, and 3D interactive flipbook motion.
        </p>
      </div>

      {/* Hero Book & Live Stage Component */}
      <div className={`w-full rounded-[24px] p-6 border flex flex-col gap-6 shadow-xl ${
        theme === 'dark' ? 'bg-[#181818] border-white/10' : 'bg-white border-neutral-200'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStageComp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeStageComp === 'all' && (
              <div className="flex flex-col gap-8 w-full">
                {/* Row 1: Book occupying the full first row */}
                <div className="w-full">
                  <DitherBook theme={theme} />
                </div>
                {/* Row 2: 11 dither visualization components beneath it in 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                  <DitherDonutChart theme={theme} />
                  <DitherStackedChart theme={theme} />
                  <DitherGrowthChart theme={theme} />
                  <ActivityHeatmap theme={theme} />
                  <ServerGauge theme={theme} />
                  <TrafficBubble theme={theme} />
                  <DitherFunnelChart theme={theme} />
                  <DeviceUsageChart theme={theme} />
                  <StorageUsageChart theme={theme} />
                  <RevenueLineChart theme={theme} />
                  <UptimeChart theme={theme} />
                </div>
              </div>
            )}
            {activeStageComp === 'book' && <DitherBook theme={theme} />}
            {activeStageComp === 'donut' && <DitherDonutChart theme={theme} />}
            {activeStageComp === 'growth' && <DitherGrowthChart theme={theme} />}
            {activeStageComp === 'stacked' && <DitherStackedChart theme={theme} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
