import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Copy,
  Check,
  Circle,
  Github,
  ExternalLink,
  ArrowLeft,
  ArrowDownAZ,
} from 'lucide-react';

import { MonoActivityHeatmap } from './mono-charts/MonoActivityHeatmap';
import { MonoRoundedLineChart } from './mono-charts/MonoRoundedLineChart';
import { MonoRoundedBarChart } from './mono-charts/MonoRoundedBarChart';
import { MonoRoundedAreaChart } from './mono-charts/MonoRoundedAreaChart';
import { MonoRoundedDonutChart } from './mono-charts/MonoRoundedDonutChart';
import { MonoRoundedComposedChart } from './mono-charts/MonoRoundedComposedChart';
import { MonoRoundedScatterChart } from './mono-charts/MonoRoundedScatterChart';
import { MonoRoundedCandlestickChart } from './mono-charts/MonoRoundedCandlestickChart';
import { MonoRoundedKpiCardChart } from './mono-charts/MonoRoundedKpiCardChart';
import { MonoRoundedPyramidChart } from './mono-charts/MonoRoundedPyramidChart';
import { MonoRoundedRadialBarGroup } from './mono-charts/MonoRoundedRadialBarGroup';
import { MonoRoundedGaugeArc } from './mono-charts/MonoRoundedGaugeArc';
import { MonoRoundedBulletChart } from './mono-charts/MonoRoundedBulletChart';
import { MonoRoundedSankeyChart } from './mono-charts/MonoRoundedSankeyChart';
import { MonoRoundedStepChart } from './mono-charts/MonoRoundedStepChart';
import { MonoRoundedStackedBarChart } from './mono-charts/MonoRoundedStackedBarChart';
import { MonoRoundedRadarChart } from './mono-charts/MonoRoundedRadarChart';
import { MonoRoundedRadialGaugeChart } from './mono-charts/MonoRoundedRadialGaugeChart';
import { MonoRoundedFunnelChart } from './mono-charts/MonoRoundedFunnelChart';
import { MonoRoundedHeatmapChart } from './mono-charts/MonoRoundedHeatmapChart';
import { MonoRoundedSparklineChart } from './mono-charts/MonoRoundedSparklineChart';
import { MonoRoundedBubbleChart } from './mono-charts/MonoRoundedBubbleChart';
import { MonoRoundedTreemapChart } from './mono-charts/MonoRoundedTreemapChart';
import { MonoRoundedStreamChart } from './mono-charts/MonoRoundedStreamChart';
import { MonoRoundedMeterChart } from './mono-charts/MonoRoundedMeterChart';
import { MonoRoundedWaterfallChart } from './mono-charts/MonoRoundedWaterfallChart';
import { MonoRoundedPolarChart } from './mono-charts/MonoRoundedPolarChart';
import { MonoRoundedRangeChart } from './mono-charts/MonoRoundedRangeChart';

import { InViewRender } from './InViewRender';
import { IconSwap, IconSwapItem } from './IconSwap';
import { SponsorSection, SponsorItem } from './SponsorSection';

export interface SponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  siteUrl?: string;
  isAvailable: boolean;
  tier?: 'diamond' | 'gold' | 'silver';
  price?: string;
}

interface MonoChartsPageProps {
  theme: 'dark' | 'light';
  embedded?: boolean;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  onNavigateHome?: () => void;
  onSelectChart?: (id: string) => void;
  sponsors?: SponsorItem[];
  checkoutUrl?: string;
}

interface MonoCardDef {
  id: string;
  title: string;
  description: string;
  cliCommand: string;
  codeSnippet: string;
  component: React.ReactNode;
}

export function MonoChartsPage({ 
  theme, 
  embedded = false,
  showToast, 
  triggerHaptic, 
  onNavigateHome,
  onSelectChart,
  sponsors,
  checkoutUrl 
}: MonoChartsPageProps) {
  const isDark = theme === 'dark';
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const defaultSponsorsList: SponsorSlot[] = useMemo(() => [
    {
      id: 1,
      companyName: 'Maple',
      description: 'Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.',
      logoType: 'maple',
      siteUrl: 'https://maple.dev/',
      isAvailable: false,
    },
    { id: 2, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
    { id: 3, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
    { id: 4, companyName: 'Available Slot', description: 'Advertise your product here.', isAvailable: true },
  ], []);

  const activeSponsors = sponsors && sponsors.length > 0 ? sponsors : defaultSponsorsList;

  const handleCopy = (id: string, command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    if (triggerHaptic) triggerHaptic('success');
    if (showToast) showToast(`Copied command to clipboard!`);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const CARD_ITEMS: MonoCardDef[] = useMemo(() => [
    {
      id: 'mono-activity-green',
      title: 'Emerald Activity Heatmap',
      description: 'Ultra-clean emerald green contribution heatmap grid with 20-week activity telemetry.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-activity-green',
      codeSnippet: `import { MonoActivityHeatmap } from '@/components/ui/mono-activity-heatmap';\n\nexport default function Demo() {\n  return <MonoActivityHeatmap accentColor="green" theme="${theme}" />;\n}`,
      component: <MonoActivityHeatmap theme={theme} accentColor="green" compact={true} />,
    },
    {
      id: 'mono-activity-blue',
      title: 'Sky Blue Activity Heatmap',
      description: 'Vibrant sky blue contribution activity matrix with cell tooltips and minimalist month headers.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-activity-blue',
      codeSnippet: `import { MonoActivityHeatmap } from '@/components/ui/mono-activity-heatmap';\n\nexport default function Demo() {\n  return <MonoActivityHeatmap accentColor="blue" theme="${theme}" />;\n}`,
      component: <MonoActivityHeatmap theme={theme} accentColor="blue" compact={true} />,
    },
    {
      id: 'mono-activity-purple',
      title: 'Violet Activity Heatmap',
      description: 'Deep violet pulse contribution activity grid with rounded node cells and telemetry.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-activity-purple',
      codeSnippet: `import { MonoActivityHeatmap } from '@/components/ui/mono-activity-heatmap';\n\nexport default function Demo() {\n  return <MonoActivityHeatmap accentColor="purple" theme="${theme}" />;\n}`,
      component: <MonoActivityHeatmap theme={theme} accentColor="purple" compact={true} />,
    },
    {
      id: 'mono-rounded-line',
      title: 'Mono Rounded Spline Line',
      description: 'Minimalist monochromatic line chart with smooth rounded spline curves and rounded stroke caps.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-line',
      codeSnippet: `import { MonoRoundedLineChart } from '@/components/ui/mono-rounded-line';\n\nexport default function Demo() {\n  return <MonoRoundedLineChart theme="${theme}" />;\n}`,
      component: <MonoRoundedLineChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-bar',
      title: 'Mono Rounded Pill Pillars',
      description: 'Minimalist monochromatic bar chart with full corner radii pill columns and vertical/horizontal layout switches.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-bar',
      codeSnippet: `import { MonoRoundedBarChart } from '@/components/ui/mono-rounded-bar';\n\nexport default function Demo() {\n  return <MonoRoundedBarChart theme="${theme}" />;\n}`,
      component: <MonoRoundedBarChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-area',
      title: 'Mono Curved Wave Area',
      description: 'Smooth monochromatic curved area wave visualizer with rounded stroke joins and soft opacity gradient shading.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-area',
      codeSnippet: `import { MonoRoundedAreaChart } from '@/components/ui/mono-rounded-area';\n\nexport default function Demo() {\n  return <MonoRoundedAreaChart theme="${theme}" />;\n}`,
      component: <MonoRoundedAreaChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-donut',
      title: 'Mono Rounded Donut Ring',
      description: 'Minimalist monochromatic donut chart with rounded segment endcaps, generous spacing, and center metric numbers.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-donut',
      codeSnippet: `import { MonoRoundedDonutChart } from '@/components/ui/mono-rounded-donut';\n\nexport default function Demo() {\n  return <MonoRoundedDonutChart theme="${theme}" />;\n}`,
      component: <MonoRoundedDonutChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-composed',
      title: 'Mono Hybrid Spline + Bar',
      description: 'Minimalist hybrid visualizer pairing rounded pill columns with a smooth curved spline line overlay.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-composed',
      codeSnippet: `import { MonoRoundedComposedChart } from '@/components/ui/mono-rounded-composed';\n\nexport default function Demo() {\n  return <MonoRoundedComposedChart theme="${theme}" />;\n}`,
      component: <MonoRoundedComposedChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-scatter',
      title: 'Mono Scatter Matrix',
      description: 'Minimalist monochromatic scatter node matrix with rounded circle nodes and hover trace callouts.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-scatter',
      codeSnippet: `import { MonoRoundedScatterChart } from '@/components/ui/mono-rounded-scatter';\n\nexport default function Demo() {\n  return <MonoRoundedScatterChart theme="${theme}" />;\n}`,
      component: <MonoRoundedScatterChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-candlestick',
      title: 'Mono Financial Candlesticks',
      description: 'Monochromatic candlestick financial price bars with rounded wick caps and solid/hollow candles.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-candlestick',
      codeSnippet: `import { MonoRoundedCandlestickChart } from '@/components/ui/mono-rounded-candlestick';\n\nexport default function Demo() {\n  return <MonoRoundedCandlestickChart theme="${theme}" />;\n}`,
      component: <MonoRoundedCandlestickChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-kpi',
      title: 'Mono Stat KPI Card',
      description: 'Minimalist KPI stat metric card featuring an embedded rounded spline sparkline indicator.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-kpi',
      codeSnippet: `import { MonoRoundedKpiCardChart } from '@/components/ui/mono-rounded-kpi';\n\nexport default function Demo() {\n  return <MonoRoundedKpiCardChart theme="${theme}" />;\n}`,
      component: <MonoRoundedKpiCardChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-pyramid',
      title: 'Mono Tier Pyramid Stack',
      description: 'Monochromatic pyramid level bar chart featuring rounded corner tier geometry.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-pyramid',
      codeSnippet: `import { MonoRoundedPyramidChart } from '@/components/ui/mono-rounded-pyramid';\n\nexport default function Demo() {\n  return <MonoRoundedPyramidChart theme="${theme}" />;\n}`,
      component: <MonoRoundedPyramidChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-radial-group',
      title: 'Mono Radial Bar Group',
      description: 'Multi-ring radial progress bar group with rounded arc endcaps and layered utilization metrics.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-radial-group',
      codeSnippet: `import { MonoRoundedRadialBarGroup } from '@/components/ui/mono-rounded-radial-group';\n\nexport default function Demo() {\n  return <MonoRoundedRadialBarGroup theme="${theme}" />;\n}`,
      component: <MonoRoundedRadialBarGroup theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-gauge-arc',
      title: 'Mono Speedometer Gauge Arc',
      description: 'Semi-circle arc speedometer gauge dial with rounded stroke endcaps and center score callout.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-gauge-arc',
      codeSnippet: `import { MonoRoundedGaugeArc } from '@/components/ui/mono-rounded-gauge-arc';\n\nexport default function Demo() {\n  return <MonoRoundedGaugeArc theme="${theme}" />;\n}`,
      component: <MonoRoundedGaugeArc theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-bullet',
      title: 'Mono Performance Bullet Target',
      description: 'Monochromatic performance bullet bar chart featuring target benchmark markers.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-bullet',
      codeSnippet: `import { MonoRoundedBulletChart } from '@/components/ui/mono-rounded-bullet';\n\nexport default function Demo() {\n  return <MonoRoundedBulletChart theme="${theme}" />;\n}`,
      component: <MonoRoundedBulletChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-sankey',
      title: 'Mono Flow Sankey Channels',
      description: 'Flow transfer channel visualizer featuring smooth curved SVG routing bands with rounded endcaps.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-sankey',
      codeSnippet: `import { MonoRoundedSankeyChart } from '@/components/ui/mono-rounded-sankey';\n\nexport default function Demo() {\n  return <MonoRoundedSankeyChart theme="${theme}" />;\n}`,
      component: <MonoRoundedSankeyChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-step',
      title: 'Mono Step Progression',
      description: 'Monochromatic discrete staircase step chart with rounded stroke joins and level callouts.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-step',
      codeSnippet: `import { MonoRoundedStepChart } from '@/components/ui/mono-rounded-step';\n\nexport default function Demo() {\n  return <MonoRoundedStepChart theme="${theme}" />;\n}`,
      component: <MonoRoundedStepChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-stacked-bar',
      title: 'Mono Stacked Tones Bar',
      description: 'Monochromatic stacked bar visualizer with rounded end pill geometry and layered opacity tones.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-stacked-bar',
      codeSnippet: `import { MonoRoundedStackedBarChart } from '@/components/ui/mono-rounded-stacked-bar';\n\nexport default function Demo() {\n  return <MonoRoundedStackedBarChart theme="${theme}" />;\n}`,
      component: <MonoRoundedStackedBarChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-radar',
      title: 'Mono Polygon Web Radar',
      description: 'Minimalist monochromatic multi-axis polygon radar web with smooth rounded stroke join geometry.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-radar',
      codeSnippet: `import { MonoRoundedRadarChart } from '@/components/ui/mono-rounded-radar';\n\nexport default function Demo() {\n  return <MonoRoundedRadarChart theme="${theme}" />;\n}`,
      component: <MonoRoundedRadarChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-radial-gauge',
      title: 'Mono Concentric Radial Rings',
      description: 'Monochromatic concentric progress rings with rounded arc caps and layered utilization metrics.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-radial-gauge',
      codeSnippet: `import { MonoRoundedRadialGaugeChart } from '@/components/ui/mono-rounded-radial-gauge';\n\nexport default function Demo() {\n  return <MonoRoundedRadialGaugeChart theme="${theme}" />;\n}`,
      component: <MonoRoundedRadialGaugeChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-funnel',
      title: 'Mono Stage Funnel',
      description: 'Horizontal funnel stage visualizer using monochromatic pill bars with rounded endcaps.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-funnel',
      codeSnippet: `import { MonoRoundedFunnelChart } from '@/components/ui/mono-rounded-funnel';\n\nexport default function Demo() {\n  return <MonoRoundedFunnelChart theme="${theme}" />;\n}`,
      component: <MonoRoundedFunnelChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-heatmap',
      title: 'Mono Dot Matrix Heatmap',
      description: 'Monochromatic activity matrix with rounded corner cells and density opacity shading.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-heatmap',
      codeSnippet: `import { MonoRoundedHeatmapChart } from '@/components/ui/mono-rounded-heatmap';\n\nexport default function Demo() {\n  return <MonoRoundedHeatmapChart theme="${theme}" />;\n}`,
      component: <MonoRoundedHeatmapChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-sparkline',
      title: 'Mono Sparkline Telemetry',
      description: 'Compact telemetry row suite featuring rounded micro splines and live metric readouts.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-sparkline',
      codeSnippet: `import { MonoRoundedSparklineChart } from '@/components/ui/mono-rounded-sparkline';\n\nexport default function Demo() {\n  return <MonoRoundedSparklineChart theme="${theme}" />;\n}`,
      component: <MonoRoundedSparklineChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-bubble',
      title: 'Mono Bubble Clusters',
      description: 'Scaled circle bubble distribution with rounded stroke outlines and monochromatic opacity fills.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-bubble',
      codeSnippet: `import { MonoRoundedBubbleChart } from '@/components/ui/mono-rounded-bubble';\n\nexport default function Demo() {\n  return <MonoRoundedBubbleChart theme="${theme}" />;\n}`,
      component: <MonoRoundedBubbleChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-treemap',
      title: 'Mono Tile Treemap',
      description: 'Partition allocation treemap featuring rounded corner tiles and monochrome contrast shading.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-treemap',
      codeSnippet: `import { MonoRoundedTreemapChart } from '@/components/ui/mono-rounded-treemap';\n\nexport default function Demo() {\n  return <MonoRoundedTreemapChart theme="${theme}" />;\n}`,
      component: <MonoRoundedTreemapChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-stream',
      title: 'Mono Fluid Stream Wave',
      description: 'Multi-layer fluid stream wave area visualizer with rounded stroke joins and soft monochrome gradients.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-stream',
      codeSnippet: `import { MonoRoundedStreamChart } from '@/components/ui/mono-rounded-stream';\n\nexport default function Demo() {\n  return <MonoRoundedStreamChart theme="${theme}" />;\n}`,
      component: <MonoRoundedStreamChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-meter',
      title: 'Mono Arc Meter Gauge',
      description: 'Monochromatic semi-circle arc meter gauge with rounded stroke endcaps and center indicator.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-meter',
      codeSnippet: `import { MonoRoundedMeterChart } from '@/components/ui/mono-rounded-meter';\n\nexport default function Demo() {\n  return <MonoRoundedMeterChart theme="${theme}" />;\n}`,
      component: <MonoRoundedMeterChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-waterfall',
      title: 'Mono Waterfall Steps',
      description: 'Sequential delta step bar chart featuring floating pillars with rounded corner geometry.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-waterfall',
      codeSnippet: `import { MonoRoundedWaterfallChart } from '@/components/ui/mono-rounded-waterfall';\n\nexport default function Demo() {\n  return <MonoRoundedWaterfallChart theme="${theme}" />;\n}`,
      component: <MonoRoundedWaterfallChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-polar',
      title: 'Mono Polar Radial Pillars',
      description: 'Polar angle radial bar chart with 360-degree rounded arc pillars.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-polar',
      codeSnippet: `import { MonoRoundedPolarChart } from '@/components/ui/mono-rounded-polar';\n\nexport default function Demo() {\n  return <MonoRoundedPolarChart theme="${theme}" />;\n}`,
      component: <MonoRoundedPolarChart theme={theme} compact={true} />,
    },
    {
      id: 'mono-rounded-range',
      title: 'Mono Range Band Area',
      description: 'Min-Max floating variance area band with smooth rounded spline boundary strokes.',
      cliCommand: 'npx @subhanhq/amicro@latest add mono-rounded-range',
      codeSnippet: `import { MonoRoundedRangeChart } from '@/components/ui/mono-rounded-range';\n\nexport default function Demo() {\n  return <MonoRoundedRangeChart theme="${theme}" />;\n}`,
      component: <MonoRoundedRangeChart theme={theme} compact={true} />,
    },
  ], [theme]);

  return (
    <div className={`w-full max-w-[1240px] mx-auto ${embedded ? 'px-0 pt-0 pb-2' : 'px-4 sm:px-6 pt-0 pb-12'} flex flex-col items-center font-sans relative`}>
      
      {!embedded && (
        <>
          {/* Top Header Row with Back Button on Left */}
          {onNavigateHome && (
            <div className="w-full flex items-center justify-start pt-1 mb-0.5">
              <button
                onClick={() => {
                  if (triggerHaptic) triggerHaptic('light');
                  onNavigateHome();
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white' 
                    : 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>
          )}

          {/* Hero Header matching main page simplicity with decreased top margin */}
          <div className="mt-1 sm:mt-2 mb-7 sm:mb-9 text-center w-full max-w-[1240px] mx-auto px-4 flex flex-col items-center">
            {/* Hero Heading */}
            <h1 className={`text-[34px] sm:text-[52px] lg:text-[58px] font-bold tracking-[-0.03em] leading-[1.1] mb-3 sm:mb-4 font-sans max-w-4xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              Mono Charts.
            </h1>

            {/* Hero Subtitle */}
            <p className={`text-[15px] sm:text-[18px] leading-[24px] sm:leading-[28px] max-w-[620px] mx-auto font-normal tracking-[-0.012em] transition-colors duration-300 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              A unified collection of 30 single-ink chart visualizers built with rounded geometry and minimalist typography.
            </p>

            {/* Hero CTAs matching main page buttons and spring physics */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-7 sm:mt-8">
              <motion.a 
                href="https://github.com/Subhan-code/Amicro--Micro-transitions-" 
                target="_blank" 
                rel="noopener noreferrer" 
                whileHover="hover"
                initial="initial"
                animate="initial"
                whileTap={{ scale: 0.98 }}
                variants={{
                  initial: { 
                    scale: 1,
                    boxShadow: '0 0 0 0 rgba(0,0,0,0)'
                  },
                  hover: { 
                    scale: 1.04,
                    boxShadow: isDark ? '0 10px 25px -5px rgba(255,255,255,0.1)' : '0 10px 25px -5px rgba(0,0,0,0.15)'
                  }
                }}
                className={`inline-flex items-center justify-center gap-1.5 h-[36px] px-[16px] rounded-full text-[13px] font-medium no-underline transition-colors cursor-pointer border-0 ${
                  isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-neutral-950 text-white hover:bg-neutral-800'
                }`}
              >
                <motion.div 
                  variants={{
                    initial: { rotate: 0, scale: 1 },
                    hover: { rotate: -12, scale: 1.15 }
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex items-center shrink-0"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 block">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </motion.div>
                <span>GitHub Repo</span>
              </motion.a>

              <motion.button 
                onClick={() => {
                  const element = document.getElementById('mono-charts-grid');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                whileHover="hover"
                initial="initial"
                animate="initial"
                whileTap={{ scale: 0.98 }}
                variants={{
                  initial: { 
                    scale: 1,
                    boxShadow: '0 0 0 0 rgba(0,0,0,0)'
                  },
                  hover: { 
                    scale: 1.04,
                    boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.3)' : '0 10px 25px -5px rgba(0,0,0,0.05)'
                  }
                }}
                className={`inline-flex items-center justify-center h-[36px] px-[16px] rounded-full text-[13px] font-medium border cursor-pointer transition-colors ${
                  isDark 
                    ? 'bg-[#181818] border-neutral-800 text-white hover:bg-neutral-800' 
                    : 'bg-white border-neutral-200 text-black hover:bg-neutral-50 shadow-sm'
                }`}
              >
                <motion.div
                  variants={{
                    initial: { rotate: 0, scale: 1 },
                    hover: { rotate: 8, scale: 1.12 }
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex items-center shrink-0 mr-1.5"
                >
                  <svg viewBox="0 0 24 24" className="w-[15px] h-[15px] block shrink-0" fill="currentColor" aria-hidden="true">
                    <mask id="browse-mono-charts-mask">
                      <rect width="24" height="24" rx="6.5" fill="white" />
                      <rect x="5.5" y="6" width="7" height="2.5" rx="1.25" fill="black" />
                      <rect x="5.5" y="10.75" width="13" height="2.5" rx="1.25" fill="black" />
                      <rect x="5.5" y="15.5" width="7" height="2.5" rx="1.25" fill="black" />
                    </mask>
                    <rect width="24" height="24" rx="6.5" fill="currentColor" mask="url(#browse-mono-charts-mask)" />
                  </svg>
                </motion.div>
                <span>Browse Charts</span>
              </motion.button>
            </div>
          </div>
        </>
      )}

      {/* Main Charts Showcase Grid */}
      <div id="mono-charts-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full max-w-[1240px] mx-auto">
        <AnimatePresence mode="popLayout">
          {CARD_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-full flex justify-center"
            >
              {/* Standard Amicro Card Architecture */}
              <article className="group/card relative w-full">
                <div
                  onClick={() => {
                    if (onSelectChart) {
                      triggerHaptic?.('light');
                      onSelectChart(item.id);
                    }
                  }}
                  className="block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-3xl cursor-pointer text-inherit no-underline"
                >
                  {/* Live Interactive Chart Stage - Fits the whole card seamlessly */}
                  <div className="w-full rounded-3xl overflow-hidden transition-all duration-300">
                    <InViewRender>
                      <div className="w-full">
                        {item.component}
                      </div>
                    </InViewRender>
                  </div>

                  {/* Minimal Card Footer: Only Title & Description, Hover Copy Button */}
                  <div className="flex items-center justify-between gap-3 pt-3 px-1">
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-base sm:text-[17px] font-semibold tracking-[-0.015em] truncate transition-colors ${
                        isDark ? 'text-white group-hover/card:text-neutral-200' : 'text-neutral-900 group-hover/card:text-black'
                      }`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs sm:text-[13px] font-medium truncate mt-0.5 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-500'
                      }`}>
                        {item.description}
                      </p>
                    </div>

                    {/* Action Copy Button - Fades in on card hover */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.id, item.cliCommand);
                      }}
                      type="button"
                      className={`size-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer border shrink-0 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 ${
                        copiedId === item.id
                          ? 'opacity-100 bg-white/10 border-white/30 text-white'
                          : isDark
                          ? 'border-white/10 bg-[#181818] hover:bg-neutral-800 text-neutral-400 hover:text-white'
                          : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-600 hover:text-black'
                      }`}
                      aria-label="Copy CLI install command"
                      title="Copy CLI install command"
                    >
                      <IconSwap>
                        <IconSwapItem key={copiedId === item.id ? 'check' : 'copy'}>
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </IconSwapItem>
                      </IconSwap>
                    </motion.button>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sponsors Section - Last Section as the rest of the website */}
      {!embedded && (
        <div className="mt-16 sm:mt-24 w-full">
          <SponsorSection
            theme={theme}
            sponsors={activeSponsors}
            checkoutUrl={checkoutUrl || 'https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS'}
            onNavigateSponsors={() => {
              if (triggerHaptic) triggerHaptic('light');
              window.location.href = '/sponsors';
            }}
            triggerHaptic={triggerHaptic}
          />
        </div>
      )}
    </div>
  );
}
