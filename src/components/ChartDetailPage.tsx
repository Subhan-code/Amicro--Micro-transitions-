import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Copy,
  Check,
  Terminal,
  Code2,
  Eye,
  Boxes,
  ExternalLink,
  Plus,
  Share2,
} from 'lucide-react';
import { getComponentEntry, ComponentItem } from '../data/componentEntries';
import { formatCliCommand, getStoredRegistryMode, RegistryMode } from '../utils/registryPreference';
import type { SponsorItem } from './SponsorSection';
import { MapleLogo } from './MapleLogo';
import { CopyButton } from './CopyButton';

// Mono Charts imports
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

// Dither Charts imports
import { DitherDonutChart } from './dither-charts/DitherDonutChart';
import { DitherGrowthChart } from './dither-charts/DitherGrowthChart';
import { DitherStackedChart } from './dither-charts/DitherStackedChart';
import { DitherFunnelChart } from './dither-charts/DitherFunnelChart';
import { ActivityHeatmap } from './dither-charts/ActivityHeatmap';
import { ServerGauge } from './dither-charts/ServerGauge';
import { TrafficBubble } from './dither-charts/TrafficBubble';
import { DeviceUsageChart } from './dither-charts/DeviceUsageChart';
import { StorageUsageChart } from './dither-charts/StorageUsageChart';
import { RevenueLineChart } from './dither-charts/RevenueLineChart';
import { UptimeChart } from './dither-charts/UptimeChart';

// Cards & Carousels imports
import { CardArc5 } from './cards/CardArc5';
import { CardArc7 } from './cards/CardArc7';
import { CardLongArc5 } from './cards/CardLongArc5';
import { CardLinearSpread } from './cards/CardLinearSpread';
import { CardCornerFan } from './cards/CardCornerFan';
import { CardStampArc } from './cards/CardStampArc';
import { CardCascadeStagger } from './cards/CardCascadeStagger';
import { CardScatterSpread } from './cards/CardScatterSpread';
import { CardWheelFan } from './cards/CardWheelFan';
import { CardCarousel } from './cards/CardCarousel';
import { CardCoverFlow } from './cards/CardCoverFlow';
import { CardTimeMachine } from './cards/CardTimeMachine';
import { FocusBlur } from './cards/FocusBlur';

// Buttons imports
import { AnimatedButton } from './AnimatedButton';
import { buttonsData } from '../data/buttons';
import { cardsData } from '../data/cards';
import { getComponentCode, getCardComponentCode } from '../utils/codeGenerator';

// Raw component sources loaded dynamically via Vite
const rawComponents = ((import.meta as unknown as { glob: (patterns: string[], options?: Record<string, unknown>) => Record<string, string> }).glob([
  './cards/*.tsx',
  './mono-charts/*.tsx',
  './dither-charts/*.tsx',
  './ai/*.tsx',
  './morphing/*.tsx',
  './css-animations/*.tsx',
  './*.tsx',
], { query: '?raw', import: 'default', eager: true })) || {};

// Loaders import
import { loaderGroups } from '../data/loaders';

// Keyframe Morphs
import { KEYFRAME_MORPH_ITEMS } from './morphing/keyframeMorphs';

interface ChartDetailPageProps {
  chartId: string;
  theme: 'dark' | 'light';
  onBack: () => void;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy') => void;
  sponsors?: SponsorItem[];
  checkoutUrl?: string;
  onSelectComponent?: (id: string, category?: string) => void;
  onNavigateTab?: (tab: string) => void;
  onToggleTheme?: () => void;
  onOpenSponsorModal?: (ctx: { tier: 'diamond' | 'gold' | 'silver'; placement?: string; slotId?: number }) => void;
}

type TabType = 'preview' | 'code';

export function ChartDetailPage({
  chartId,
  theme: appTheme,
  onBack,
  showToast,
  triggerHaptic,
  sponsors,
  checkoutUrl,
  onOpenSponsorModal,
}: ChartDetailPageProps) {
  const isAppDark = appTheme === 'dark';
  const entry: ComponentItem = getComponentEntry(chartId);

  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedUsage, setCopiedUsage] = useState(false);
  const [isComponentClicked, setIsComponentClicked] = useState<boolean | null>(null);

  const cliRegistry = getStoredRegistryMode();
  const cliCommand = formatCliCommand(entry.registry, cliRegistry);

  const handleCopyCli = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    triggerHaptic?.('success');
    showToast?.(`Copied ${cliCommand}`);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyUsage = () => {
    navigator.clipboard.writeText(entry.usage);
    setCopiedUsage(true);
    triggerHaptic?.('success');
    showToast?.('Copied TSX component code!');
    setTimeout(() => setCopiedUsage(false), 2000);
  };

  const [installMode, setInstallMode] = useState<'command' | 'manual'>('command');
  const [packageManager, setPackageManager] = useState<'pnpm' | 'yarn' | 'npm' | 'bun'>('pnpm');
  const [copiedInstallCmd, setCopiedInstallCmd] = useState(false);
  const [copiedDeps, setCopiedDeps] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isShareOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isShareOpen]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${entry.name} — Amicro`;

  const handleCopyLink = async () => {
    setIsShareOpen(false);
    triggerHaptic?.('success');
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }
    showToast?.('Link copied to clipboard!');
  };

  const handleOtherApp = async () => {
    setIsShareOpen(false);
    triggerHaptic?.('light');
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: entry.description,
          url: shareUrl,
        });
        return;
      } catch { }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
    }
    showToast?.('Link copied to clipboard!');
  };

  const isSmallComponent = useMemo(() => {
    const id = chartId.toLowerCase();
    const cat = (entry.categoryLabel || '').toLowerCase();
    if (id.startsWith('btn-') || cat.includes('button')) return true;
    if (id.startsWith('toggle-') || cat.includes('toggle')) return true;
    if (id.startsWith('txt-') || cat.includes('text')) return true;
    if (cat.includes('badge') || cat.includes('input') || cat.includes('micro-interaction')) {
      if (!id.startsWith('card-') && !id.startsWith('mono-') && !id.startsWith('dither-') && !id.startsWith('c')) {
        return true;
      }
    }
    return false;
  }, [chartId, entry.categoryLabel]);

  const installCommand = useMemo(() => {
    const cleanName = entry.registry.replace(/^@subhanhq\/amicro\//, '').replace(/^@amicro\//, '');
    switch (packageManager) {
      case 'pnpm':
        return `pnpm dlx shadcn@latest add @amicro/${cleanName}`;
      case 'yarn':
        return `yarn dlx shadcn@latest add @amicro/${cleanName}`;
      case 'bun':
        return `bunx --bun shadcn@latest add @amicro/${cleanName}`;
      case 'npm':
      default:
        return `npx shadcn@latest add @amicro/${cleanName}`;
    }
  }, [packageManager, entry.registry]);

  const componentFilePath = useMemo(() => {
    const cleanName = entry.registry.replace(/^@subhanhq\/amicro\//, '').replace(/^@amicro\//, '');
    return `src/components/ui/${cleanName}.tsx`;
  }, [entry.registry]);

  const realComponentCode = useMemo(() => {
    // 1. Buttons: use codeGenerator
    const cleanButtonId = chartId.replace(/^btn-/, '');
    const foundButton = buttonsData.find(
      (b) => b.id === chartId || b.id === cleanButtonId || b.interactionType === chartId || b.interactionType === cleanButtonId
    );
    if (foundButton) {
      return getComponentCode(foundButton);
    }

    // 2. Direct raw component file match
    const cleanId = chartId.replace(/[-_]/g, '').toLowerCase();
    for (const [key, code] of Object.entries(rawComponents)) {
      const base = key.split('/').pop()?.replace(/\.tsx?$/, '').toLowerCase();
      if (base === cleanId || base === `card${cleanId}`) {
        return code;
      }
    }

    // 3. Match from registry name in raw components
    const cleanReg = entry.registry.replace(/^@subhanhq\/amicro\//, '').replace(/^@amicro\//, '').replace(/[-_]/g, '').toLowerCase();
    for (const [key, code] of Object.entries(rawComponents)) {
      const base = key.split('/').pop()?.replace(/\.tsx?$/, '').toLowerCase();
      if (base === cleanReg || base === `card${cleanReg}`) {
        return code;
      }
    }

    // 4. Cards from cardsData generator
    const foundCard = cardsData.find((c) => c.id === chartId || c.interactionType === chartId);
    if (foundCard) {
      const generated = getCardComponentCode(foundCard);
      if (generated && generated !== '// No card interaction defined.') {
        return generated;
      }
    }

    // 5. From entry.source
    if (entry.source) {
      const match = entry.source.match(/src\/components\/(.+)$/);
      if (match && match[1]) {
        const directKey = `./${match[1]}`;
        if (rawComponents[directKey]) {
          return rawComponents[directKey];
        }
      }
    }

    // 6. Fallback
    return entry.usage;
  }, [chartId, entry]);

  const handleCopyInstallCmd = () => {
    navigator.clipboard.writeText(installCommand);
    setCopiedInstallCmd(true);
    triggerHaptic?.('success');
    showToast?.(`Copied ${installCommand}`);
    setTimeout(() => setCopiedInstallCmd(false), 2000);
  };

  const renderPackageManagerLogo = (pm: 'pnpm' | 'yarn' | 'npm' | 'bun') => {
    switch (pm) {
      case 'pnpm':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
            <path d="M0 0h7.5v7.5H0zm8.25 0h7.5v7.5h-7.5zm8.25 0H24v7.5h-7.5zM8.25 8.25h7.5v7.5h-7.5zm8.25 0H24v7.5h-7.5zM0 16.5h7.5V24H0zm8.25 0h7.5V24h-7.5zm8.25 0H24V24h-7.5z" />
          </svg>
        );
      case 'yarn':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c1.782 0 3.444.475 4.88 1.303l-10.7 10.7a9.782 9.782 0 0 1-1.362-4.821c0-3.957 2.37-7.362 5.76-8.868.461-.205.945-.314 1.422-.314zm6.425 2.658a9.773 9.773 0 0 1 2.211 4.793l-12.87 12.87c-1.808-.66-3.385-1.789-4.57-3.234zm3.393 7.16a9.775 9.775 0 0 1-1.362 4.821l-10.7-10.7a9.78 9.78 0 0 1 4.88-1.303c.477 0 .961.109 1.422.314 3.39 1.506 5.76 4.911 5.76 8.868z" />
          </svg>
        );
      case 'npm':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464V8.774l-3.454.01v10.374H5.13z" />
          </svg>
        );
      case 'bun':
        return (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
            <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z" />
          </svg>
        );
    }
  };


  // Active Sponsors (Maple as default active sponsor, plus any active sponsors from props)
  const activeSponsors: SponsorItem[] = useMemo(() => {
    const list = (sponsors || []).filter((s) => !s.isAvailable);
    if (list.length > 0) return list;
    return [
      {
        id: 1,
        companyName: 'Maple',
        description: 'Open-source observability for AI',
        siteUrl: 'https://maple.dev/',
        isAvailable: false,
        tier: 'diamond',
        price: '$250/mo',
      },
    ];
  }, [sponsors]);


  // Live Component Renderer: activates on hover or tap toggle
  const renderLiveComponent = () => {
    const cardActive = isComponentClicked !== null ? isComponentClicked : undefined;

    // 0. Keyframe Morphing Items
    const foundMorph = KEYFRAME_MORPH_ITEMS.find((m) => m.id === chartId || m.registry === chartId);
    if (foundMorph) {
      const MorphComp = foundMorph.component;
      return (
        <div className="flex items-center justify-center p-8 cursor-pointer">
          <MorphComp
            size={80}
            color={appTheme === 'dark' ? '#ffffff' : '#000000'}
          />
        </div>
      );
    }

    // 1. Mono Charts
    switch (chartId) {
      case 'mono-rounded-line':
        return <MonoRoundedLineChart theme={appTheme} compact={false} />;
      case 'mono-rounded-bar':
        return <MonoRoundedBarChart theme={appTheme} compact={false} />;
      case 'mono-rounded-area':
        return <MonoRoundedAreaChart theme={appTheme} compact={false} />;
      case 'mono-rounded-donut':
        return <MonoRoundedDonutChart theme={appTheme} compact={false} />;
      case 'mono-rounded-composed':
        return <MonoRoundedComposedChart theme={appTheme} compact={false} />;
      case 'mono-rounded-scatter':
        return <MonoRoundedScatterChart theme={appTheme} compact={false} />;
      case 'mono-rounded-candlestick':
        return <MonoRoundedCandlestickChart theme={appTheme} compact={false} />;
      case 'mono-rounded-kpi-card':
        return <MonoRoundedKpiCardChart theme={appTheme} compact={false} />;
      case 'mono-rounded-pyramid':
        return <MonoRoundedPyramidChart theme={appTheme} compact={false} />;
      case 'mono-rounded-radial-bar-group':
        return <MonoRoundedRadialBarGroup theme={appTheme} compact={false} />;
      case 'mono-rounded-gauge-arc':
        return <MonoRoundedGaugeArc theme={appTheme} compact={false} />;
      case 'mono-rounded-bullet':
        return <MonoRoundedBulletChart theme={appTheme} compact={false} />;
      case 'mono-rounded-sankey':
        return <MonoRoundedSankeyChart theme={appTheme} compact={false} />;
      case 'mono-rounded-step':
        return <MonoRoundedStepChart theme={appTheme} compact={false} />;
      case 'mono-rounded-stacked-bar':
        return <MonoRoundedStackedBarChart theme={appTheme} compact={false} />;
      case 'mono-rounded-radar':
        return <MonoRoundedRadarChart theme={appTheme} compact={false} />;
      case 'mono-rounded-radial-gauge':
        return <MonoRoundedRadialGaugeChart theme={appTheme} compact={false} />;
      case 'mono-rounded-funnel':
        return <MonoRoundedFunnelChart theme={appTheme} compact={false} />;
      case 'mono-rounded-heatmap':
        return <MonoRoundedHeatmapChart theme={appTheme} compact={false} />;
      case 'mono-rounded-sparkline':
        return <MonoRoundedSparklineChart theme={appTheme} compact={false} />;
      case 'mono-rounded-bubble':
        return <MonoRoundedBubbleChart theme={appTheme} compact={false} />;
      case 'mono-rounded-treemap':
        return <MonoRoundedTreemapChart theme={appTheme} compact={false} />;
      case 'mono-rounded-stream':
        return <MonoRoundedStreamChart theme={appTheme} compact={false} />;
      case 'mono-rounded-meter':
        return <MonoRoundedMeterChart theme={appTheme} compact={false} />;
      case 'mono-rounded-waterfall':
        return <MonoRoundedWaterfallChart theme={appTheme} compact={false} />;
      case 'mono-rounded-polar':
        return <MonoRoundedPolarChart theme={appTheme} compact={false} />;
      case 'mono-rounded-range':
        return <MonoRoundedRangeChart theme={appTheme} compact={false} />;
      case 'mono-activity-green':
        return <MonoActivityHeatmap theme={appTheme} accentColor="green" />;
      case 'mono-activity-blue':
        return <MonoActivityHeatmap theme={appTheme} accentColor="blue" />;
      case 'mono-activity-purple':
        return <MonoActivityHeatmap theme={appTheme} accentColor="purple" />;

      // 2. Dither Visualizers
      case 'dither-donut':
        return <DitherDonutChart theme={appTheme} compact={false} />;
      case 'dither-growth':
        return <DitherGrowthChart theme={appTheme} compact={false} />;
      case 'dither-stacked':
        return <DitherStackedChart theme={appTheme} compact={false} />;
      case 'dither-funnel':
        return <DitherFunnelChart theme={appTheme} compact={false} />;
      case 'activity-heatmap':
        return <ActivityHeatmap theme={appTheme} />;
      case 'server-gauge':
        return <ServerGauge theme={appTheme} />;
      case 'traffic-bubble':
        return <TrafficBubble theme={appTheme} />;
      case 'device-usage':
        return <DeviceUsageChart theme={appTheme} />;
      case 'storage-usage':
        return <StorageUsageChart theme={appTheme} />;
      case 'revenue-line':
        return <RevenueLineChart theme={appTheme} />;
      case 'uptime-chart':
        return <UptimeChart theme={appTheme} />;

      // 3. Cards & Card Spreads
      case 'card-arc-5':
      case 'c1':
        return <CardArc5 hovered={cardActive} className="scale-100 sm:scale-115 origin-center transition-transform" />;
      case 'card-arc-7':
      case 'c2':
        return <CardArc7 hovered={cardActive} className="scale-95 sm:scale-110 origin-center transition-transform" />;
      case 'card-long-arc-5':
      case 'c3':
        return <CardLongArc5 hovered={cardActive} className="scale-95 sm:scale-110 origin-center transition-transform" />;
      case 'card-linear-spread':
      case 'c4':
        return <CardLinearSpread hovered={cardActive} className="scale-100 sm:scale-115 origin-center transition-transform" />;
      case 'card-corner-fan':
      case 'c5':
        return <CardCornerFan hovered={cardActive} className="scale-100 sm:scale-115 origin-center transition-transform" />;
      case 'card-stamp-arc':
      case 'c6':
        return <CardStampArc hovered={cardActive} className="scale-100 sm:scale-115 origin-center transition-transform" />;
      case 'card-cascade-stagger':
      case 'c8':
        return <CardCascadeStagger hovered={cardActive} className="scale-110 sm:scale-125 origin-center transition-transform" />;
      case 'card-scatter-spread':
      case 'c9':
        return <CardScatterSpread hovered={cardActive} className="scale-110 sm:scale-125 origin-center transition-transform" />;
      case 'card-wheel-fan':
      case 'c10':
        return <CardWheelFan hovered={cardActive} className="scale-110 sm:scale-125 origin-center transition-transform" />;
      case 'card-carousel':
      case 'c11':
        return <CardCarousel hovered={cardActive} className="scale-90 sm:scale-100 origin-center transition-transform" />;
      case 'card-cover-flow':
      case 'c12':
        return <CardCoverFlow hovered={cardActive} className="scale-90 sm:scale-100 origin-center transition-transform" />;
      case 'card-time-machine':
      case 'c13':
        return <CardTimeMachine hovered={cardActive} className="scale-95 sm:scale-100 origin-center transition-transform" />;
      case 'card-carousel-mono':
        return <CardCarousel hovered={cardActive} isMonochrome={true} className="scale-90 sm:scale-100 origin-center transition-transform" />;
      case 'card-cover-flow-mono':
        return <CardCoverFlow hovered={cardActive} isMonochrome={true} className="scale-90 sm:scale-100 origin-center transition-transform" />;
      case 'card-time-machine-mono':
        return <CardTimeMachine hovered={cardActive} isMonochrome={true} className="scale-95 sm:scale-100 origin-center transition-transform" />;
      case 'focus-blur':
      case 'btn-35':
        return (
          <FocusBlur
            items={[
              { label: '@Twitter', href: '#' },
              { label: '@Threads', href: '#' },
              { label: '@Instagram', href: '#' },
              { label: '@GitHub', href: '#' }
            ]}
            showBrackets={true}
            className="text-xl sm:text-2xl gap-6 sm:gap-8"
          />
        );
    }

    // 4. Buttons
    const foundBtn = buttonsData.find((b) => b.id === chartId || `btn-${b.id}` === chartId);
    if (foundBtn) {
      return <AnimatedButton config={foundBtn} layoutMode="grid" theme={appTheme} />;
    }

    // 5. Loaders
    for (const group of loaderGroups) {
      const foundLoader = group.loaders.find((l) => l.kebabName === chartId || l.name.toLowerCase().replace(/\s+/g, '-') === chartId);
      if (foundLoader) {
        const LoaderComponent = foundLoader.component;
        return <LoaderComponent theme={appTheme} />;
      }
    }

    return <MonoRoundedLineChart theme={appTheme} compact={false} />;
  };

  // Reusable Sidebar Cards (Dependencies, Details, Tags)
  const renderSidebarCards = () => (
    <>
      {/* Dependencies Section Card */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3" aria-label="Dependencies">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Dependencies
        </h2>
        <div className="flex flex-wrap gap-2">
          {(entry.dependencies && entry.dependencies.length > 0 ? entry.dependencies : ['motion']).map((dep) => (
            <span
              key={dep}
              className="inline-flex items-center gap-2 rounded-xl bg-muted/60 border border-border/40 px-3 py-1.5 text-xs font-medium text-foreground/90"
            >
              <span className="flex h-4 w-4 items-center justify-center shrink-0">
                {dep === 'motion' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" className="h-3.5 w-3.5">
                    <path
                      fill="currentColor"
                      d="M37.796 31.248 18.018 68.753H0l15.445-29.284c2.394-4.542 8.366-8.221 13.343-8.221zm44.186 9.377c0-5.18 4.033-9.376 9.009-9.376 4.975 0 9.009 4.195 9.009 9.376S95.967 50 90.99 50c-4.975 0-9.008-4.194-9.008-9.375m-40.808-9.377h18.018L39.414 68.753H21.396zm21.28 0h18.018l-15.44 29.284c-2.394 4.542-8.371 8.22-13.347 8.22h-9.01z"
                    />
                  </svg>
                ) : (
                  <Boxes className="h-3.5 w-3.5 text-foreground/70" />
                )}
              </span>
              {dep}
            </span>
          ))}
        </div>
      </section>

      {/* Details Info Card */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-3" aria-label="Details">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Details
        </h2>
        <dl className="space-y-3 text-xs pt-1">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Published</dt>
            <dd className="font-medium text-foreground">Oct 2024</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Updated</dt>
            <dd className="font-medium text-foreground">Latest</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">License</dt>
            <dd className="font-medium text-foreground">
              <a
                href="https://github.com/Subhan-code/Amicro--Micro-transitions-/blob/main/LICENSE"
                className="hover:underline text-foreground"
                rel="noreferrer noopener"
                target="_blank"
              >
                MIT (Free)
              </a>
            </dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Framework</dt>
            <dd className="font-medium text-foreground">React + Framer Motion</dd>
          </div>
        </dl>
      </section>
    </>
  );

  return (
    <div className={`w-full min-h-screen flex flex-col font-sans transition-colors duration-200 ${isAppDark ? 'dark bg-[#08080a] text-[#ededed]' : 'bg-[#f8f9fa] text-[#0a0a0c]'}`}>

      <main className="flex-1 w-full max-w-[1480px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 py-4 sm:py-6 2xl:py-8">

        <div className="w-full space-y-6">

          {/* HERO BAR: Title and Simplified Action Buttons (Stays on same row as long as there is space) */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pb-1">

            {/* Identity: Component Title */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-[34px] 2xl:text-[38px] font-semibold tracking-[-0.025em] text-foreground truncate">
                {entry.name}
              </h1>
            </div>

            {/* Clean Action Buttons: Preview / Code tabs, Share button, Copy CLI */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Preview & Code Segmented Switcher */}
              <div className="inline-flex items-center rounded-xl border border-border/50 bg-muted/40 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic?.('light');
                    setActiveTab('preview');
                  }}
                  className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${activeTab === 'preview'
                      ? 'bg-[#262626] text-white shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic?.('light');
                    setActiveTab('code');
                  }}
                  className={`rounded-lg px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${activeTab === 'code'
                      ? 'bg-[#262626] text-white shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <span>Code</span>
                </button>
              </div>

              {/* Share button with Dropdown Menu */}
              <div className="relative" ref={shareMenuRef}>
                <button
                  type="button"
                  tabIndex={0}
                  data-slot="dropdown-menu-trigger"
                  aria-haspopup="menu"
                  aria-expanded={isShareOpen}
                  id="base-ui-_r_c9_"
                  onClick={() => {
                    triggerHaptic?.('light');
                    setIsShareOpen((prev) => !prev);
                  }}
                  aria-label="Share component"
                  className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground rounded-[min(var(--radius-lg),10px)] in-data-[slot=button-group]:rounded-lg size-7 border-none active:scale-none cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-share size-4"
                    aria-hidden="true"
                  >
                    <path d="M12 2v13" />
                    <path d="m16 6-4-4-4 4" />
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  </svg>
                </button>

                {/* Dropdown Menu when clicked on share */}
                {isShareOpen && (
                  <div
                    data-side="bottom"
                    data-align="end"
                    data-open=""
                    tabIndex={-1}
                    data-base-ui-focusable=""
                    id="_r_12_"
                    role="menu"
                    aria-labelledby="base-ui-_r_14_"
                    data-slot="dropdown-menu-content"
                    data-rootownerid="_r_11_"
                    className="absolute right-0 top-full mt-2 z-50 max-h-(--available-height) min-w-36 origin-top-right overflow-x-hidden overflow-y-auto rounded-xl bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 dark:ring-foreground/20 animate-in fade-in-0 zoom-in-95 w-fit"
                  >
                    <div
                      role="menuitem"
                      id="base-ui-_r_4m_"
                      tabIndex={-1}
                      data-slot="dropdown-menu-item"
                      data-variant="default"
                      onClick={handleCopyLink}
                      className="group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                      </svg>
                      Copy link
                    </div>
                    <a
                      href={`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      id="base-ui-_r_4n_"
                      tabIndex={-1}
                      data-slot="dropdown-menu-item"
                      data-variant="default"
                      onClick={() => setIsShareOpen(false)}
                      className="group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
                        <path d="m22.991 23-8.533-12.612L22.42 1h-2.77l-6.422 7.575L8.105 1H1.123l8.225 12.158L1 23h2.77l6.81-8.03L16.015 23H23zM7.193 2.769l12.49 18.462h-2.76L4.43 2.769z" fill="currentColor"></path>
                      </svg>
                      Share on X
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                      id="base-ui-_r_4o_"
                      tabIndex={-1}
                      data-slot="dropdown-menu-item"
                      data-variant="default"
                      onClick={() => setIsShareOpen(false)}
                      className="group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
                        <path d="M22.274 0H1.728C.692 0 0 .685 0 1.715v20.569C0 23.316.864 24 1.727 24h20.546C23.31 24 24 23.315 24 22.285V1.716C24.001.684 23.31 0 22.274 0M7.08 20.4H3.454V8.915h3.625zM5.352 7.371c-1.209 0-2.07-.856-2.07-2.056s.863-2.059 2.07-2.059c1.21 0 2.073.859 2.073 2.059S6.388 7.37 5.352 7.37M20.548 20.4h-3.626v-5.485c0-1.371 0-3.087-1.9-3.087-1.898 0-2.073 1.372-2.073 2.916V20.4H9.325V8.915h3.454v1.541c.69-1.2 2.073-1.885 3.453-1.885 3.627 0 4.316 2.4 4.316 5.485z" fill="currentColor"></path>
                      </svg>
                      Share on LinkedIn
                    </a>
                    <div
                      role="menuitem"
                      id="base-ui-_r_4p_"
                      tabIndex={-1}
                      data-slot="dropdown-menu-item"
                      data-variant="default"
                      onClick={handleOtherApp}
                      className="group/dropdown-menu-item relative flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis" aria-hidden="true">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                      Other app
                    </div>
                  </div>
                )}
              </div>

              {/* Copy CLI */}
              <CopyButton
                text={cliCommand}
                label="Copy CLI"
                copiedLabel="Copied"
                className="h-7 px-2.5 rounded-[min(var(--radius-lg),10px)] text-xs font-medium border border-border/40 bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs"
                iconClassName="size-3.5"
                onCopySuccess={() => showToast?.(`Copied ${cliCommand}`)}
              />
            </div>

          </div>

          {/* HERO EMBED PREVIEW PLAYGROUND: Height dynamically based on component size */}
          <div className="w-full">
            <div
              className={`w-full rounded-3xl sm:rounded-[36px] border-2 border-[#242427] flex items-center justify-center relative overflow-hidden transition-all duration-200 select-none ${isSmallComponent
                  ? 'min-h-[200px] sm:min-h-[260px] 2xl:min-h-[300px] p-6 sm:p-10'
                  : 'min-h-[380px] sm:min-h-[500px] 2xl:min-h-[560px] p-6 sm:p-12 2xl:p-16'
                } ${isAppDark ? 'bg-black' : 'bg-[#f5f6f8]'}`}
            >
              {activeTab === 'preview' ? (
                <div
                  onClick={() => {
                    triggerHaptic?.('light');
                    setIsComponentClicked((prev) => (prev === true ? false : true));
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    triggerHaptic?.('light');
                    setIsComponentClicked((prev) => (prev === true ? false : true));
                  }}
                  className={`w-full h-full flex items-center justify-center cursor-pointer select-none ${isSmallComponent
                      ? 'min-h-[160px] sm:min-h-[200px]'
                      : 'min-h-[320px] sm:min-h-[440px]'
                    }`}
                >
                  {renderLiveComponent()}
                </div>
              ) : (
                <div className="w-full h-full max-h-[460px] overflow-hidden rounded-2xl border border-[#1A1A1C] bg-[#0c0c0e] p-2 text-neutral-300 font-mono text-xs flex flex-col">
                  <div className="rounded-xl border border-[#1A1A1C] bg-[#141416]/90 overflow-hidden flex flex-col h-full">
                    <div className="flex justify-between items-center px-4 py-2.5 border-b border-[#1A1A1C] bg-[#18181b]/80 shrink-0">
                      <span className="text-[11px] text-neutral-400 font-mono">src/components/{entry.registry}.tsx</span>
                      <CopyButton
                        text={realComponentCode}
                        label="Copy TSX"
                        copiedLabel="Copied"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        iconClassName="size-3.5"
                        onCopySuccess={() => showToast?.('Copied TSX component code!')}
                      />
                    </div>
                    <pre className="flex-1 overflow-auto leading-relaxed m-0 p-4 rounded-b-xl text-neutral-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                      {realComponentCode}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BODY: Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-12 pt-6 items-start">

            {/* LEFT COLUMN */}
            <div className="space-y-10">

              {/* COMPONENT SPECIFICATION & DOCUMENTATION */}
              <div className="space-y-10 bg-transparent text-left">

                {/* PRIORITY 1: Installation (Command vs Manual) */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                      Installation
                    </h2>
                    {/* Mode Switcher: Command vs Manual */}
                    <div className="inline-flex items-center rounded-lg border border-border/50 bg-muted/40 p-0.5 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setInstallMode('command');
                          triggerHaptic?.('light');
                        }}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${installMode === 'command'
                            ? 'bg-[#262626] text-white shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Command
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInstallMode('manual');
                          triggerHaptic?.('light');
                        }}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${installMode === 'manual'
                            ? 'bg-[#262626] text-white shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                          }`}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  {installMode === 'command' ? (
                    <figure className="not-prose m-0" data-rehype-pretty-code-figure="">
                      <div data-slot="code-block-command" className="rounded-2xl border border-[#1A1A1C] bg-[#0c0c0e] p-2">
                        <div data-orientation="horizontal" data-activation-direction="left" data-slot="tabs" className="flex flex-col gap-0">
                          <div className="flex items-center justify-between px-2 pb-2">
                            <div
                              data-orientation="horizontal"
                              data-activation-direction="left"
                              role="tablist"
                              data-slot="tabs-list"
                              className="relative z-0 flex w-fit items-center justify-center text-muted-foreground inset-ring-border/64 h-9 rounded-none bg-transparent p-0 inset-ring-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:text-muted-foreground"
                            >
                              <div className="mr-2 text-muted-foreground transition-opacity" style={{ opacity: 1, filter: 'blur(0px)', transform: 'none' }}>
                                {renderPackageManagerLogo(packageManager)}
                              </div>
                              {(['pnpm', 'yarn', 'npm', 'bun'] as const).map((pm) => (
                                <button
                                  key={pm}
                                  type="button"
                                  data-orientation="horizontal"
                                  role="tab"
                                  aria-selected={packageManager === pm}
                                  data-slot="tabs-trigger"
                                  data-active={packageManager === pm ? '' : undefined}
                                  onClick={() => {
                                    setPackageManager(pm);
                                    triggerHaptic?.('light');
                                  }}
                                  className={`flex shrink-0 items-center justify-center gap-2 text-xs font-medium whitespace-nowrap transition-[color,background-color] outline-none h-7 rounded-lg p-0 px-2.5 font-mono cursor-pointer ${packageManager === pm
                                      ? 'text-white font-semibold bg-[#262626]'
                                      : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                  {pm}
                                </button>
                              ))}
                            </div>

                            <CopyButton
                              text={installCommand}
                              className="size-7 rounded-[min(var(--radius-lg),8px)] bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 shadow-xs cursor-pointer"
                              iconClassName="size-4"
                              onCopySuccess={() => showToast?.(`Copied ${installCommand}`)}
                            />
                          </div>

                          <div data-orientation="horizontal" data-slot="tabs-content" className="flex-1 outline-none">
                            <div className="rounded-xl border border-[#1A1A1C] bg-[#141416]/90">
                              <pre className="overflow-x-auto overscroll-x-contain leading-5 p-3.5 m-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <code data-slot="code-block" data-language="bash" className="font-mono text-sm/none text-foreground/90">
                                  {installCommand}
                                </code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </figure>
                  ) : (
                    <div className="rounded-2xl border border-[#1A1A1C] bg-transparent p-4 sm:p-5 space-y-5 text-xs">
                      {/* 1. Install dependencies */}
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm font-medium text-foreground">
                          1. Install dependencies
                        </div>
                        <div className="relative flex items-center justify-between rounded-xl border border-[#1A1A1C] bg-[#141416]/90 px-3.5 py-2.5 font-mono text-xs text-foreground/90">
                          <span className="truncate select-all font-mono">npm i motion clsx tailwind-merge</span>
                          <CopyButton
                            text="npm i motion clsx tailwind-merge"
                            className="inline-flex size-6 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 shadow-xs cursor-pointer shrink-0 ml-2"
                            iconClassName="size-3.5"
                            onCopySuccess={() => showToast?.('Copied dependencies command')}
                          />
                        </div>
                      </div>

                      {/* 2. Add component file & show the real code */}
                      <div className="space-y-2.5">
                        <div className="text-xs sm:text-sm font-medium text-foreground">
                          2. Add component file
                        </div>
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Copy component source into{' '}
                          <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[11px] text-foreground border border-border/40">
                            {componentFilePath}
                          </code>
                        </p>

                        {/* Show the real component code */}
                        <div className="relative rounded-xl border border-[#1A1A1C] bg-[#141416]/90 overflow-hidden mt-2">
                          <div className="flex items-center justify-between border-b border-[#1A1A1C] bg-[#18181b] px-3.5 py-2 text-xs">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {componentFilePath}
                            </span>
                            <CopyButton
                              text={realComponentCode}
                              className="inline-flex size-6 items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 shadow-xs cursor-pointer"
                              iconClassName="size-3"
                              onCopySuccess={() => showToast?.('Copied component source code!')}
                            />
                          </div>
                          <pre className="max-h-[300px] overflow-auto p-3.5 font-mono text-xs leading-5 text-neutral-200 m-0 rounded-b-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <code>{realComponentCode}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* MOBILE ONLY: Right Part (Dependencies, Details, Tags) comes right after Installation */}
                <div className="block lg:hidden space-y-4 pt-1">
                  {renderSidebarCards()}
                </div>

                {/* PRIORITY 2: How to use */}
                <div className="flex flex-col gap-3">
                  <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                    How to use
                  </h2>
                  <figure data-rehype-pretty-code-figure="" className="m-0 rounded-2xl border border-[#1A1A1C] bg-[#0c0c0e] p-2 text-[#ededed]">
                    <div className="rounded-xl border border-[#1A1A1C] bg-[#141416]/90 overflow-hidden">
                      <div className="flex items-center justify-between border-b border-[#1A1A1C] bg-[#18181b]/80 px-4 py-2 text-xs">
                        <span className="font-mono text-[11px] text-muted-foreground">Demo.tsx</span>
                        <CopyButton
                          text={entry.usage}
                          className="size-7 rounded-[min(var(--radius-lg),8px)] bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/40 shadow-xs cursor-pointer"
                          iconClassName="size-4"
                          onCopySuccess={() => showToast?.('Copied TSX component code!')}
                        />
                      </div>
                      <pre
                        data-not-typeset="true"
                        className="no-scrollbar min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain overscroll-y-auto p-4 sm:p-5 outline-none m-0 rounded-b-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        tabIndex={0}
                        data-language="tsx"
                      >
                        <code
                          data-language="tsx"
                          className="font-mono text-xs sm:text-[13px] leading-6 text-neutral-200 block"
                          style={{ display: 'grid' }}
                        >
                          {entry.usage}
                        </code>
                      </pre>
                    </div>
                  </figure>
                </div>

                {/* PRIORITY 3: Props */}
                <div className="flex flex-col gap-3">
                  <div>
                    <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                      Props
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                      Options you can pass to customize this component.
                    </p>
                  </div>

                  <div className="typeset-scroll scroll-fade-x scrollbar-none relative w-full overflow-hidden rounded-xl border border-border/50 bg-card [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <table className="w-full table-fixed caption-bottom text-sm border-collapse">
                      <thead className="[&_tr]:border-b border-border/50 bg-muted/20">
                        <tr className="border-b border-border/50">
                          <th className="h-10 px-3 text-left align-middle font-medium text-foreground text-xs uppercase tracking-wider w-[28%] sm:w-[24%]">
                            Prop
                          </th>
                          <th className="h-10 px-3 text-center align-middle font-medium text-foreground text-xs uppercase tracking-wider w-[32%] sm:w-[28%]">
                            Type
                          </th>
                          <th className="h-10 px-3 text-left align-middle font-medium text-foreground text-xs uppercase tracking-wider w-[40%] sm:w-[48%]">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="[&_tr:last-child]:border-0 divide-y divide-border/40">
                        {((entry.props && entry.props.length > 0) ? entry.props : [
                          { name: 'theme', type: "'dark' | 'light'", default: "'dark'", description: 'Color palette theme mode for visual contrast.' },
                          { name: 'className', type: 'string', default: '""', description: 'Additional custom Tailwind CSS utility classes.' },
                        ]).map((p) => (
                          <tr key={p.name} className="border-b border-border/40 transition-colors hover:bg-muted/40">
                            <td className="p-3 text-left align-middle font-medium">
                              <code className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] sm:text-xs font-medium text-foreground inline-block max-w-full truncate">
                                {p.name}
                              </code>
                            </td>
                            <td className="p-3 text-center align-middle font-mono text-[11px] sm:text-xs text-foreground font-medium break-all">
                              {p.type}
                            </td>
                            <td className="p-3 text-left align-middle text-xs sm:text-sm text-foreground leading-normal">
                              {p.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PRIORITY 4: Interaction Type */}
                <div className="flex flex-col gap-2.5 pt-1">
                  <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                    Interaction Type
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {entry.interaction}
                  </p>
                </div>

                {/* Keep in mind */}
                <div className="flex flex-col gap-2 pt-2">
                  <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                    Keep in mind
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    Components in Amicro are lightweight, mathematical spring recreations of fine interactions. Zero vendor lock-in; you own the code once copied into your codebase. Adapt or tweak freely.
                  </p>
                </div>

                {/* License & Usage (Points List) */}
                <div className="flex flex-col gap-2.5">
                  <h2 className="text-xs font-medium uppercase tracking-normal text-foreground/40">
                    License &amp; Usage
                  </h2>
                  <ul className="space-y-2 text-sm leading-relaxed text-foreground/70 list-disc list-inside">
                    <li>
                      MIT License with attribution. Free to use, modify and ship in personal and commercial projects, closed source included.
                    </li>
                    <li>
                      Credit appreciated: Link back to Amicro in your footer, credits screen, or README.
                    </li>
                    <li>
                      You own the code once copied into your codebase. Zero recurring fees.
                    </li>
                  </ul>
                </div>

              </div>

              {/* SPONSORS SECTION */}
              <section className="space-y-4 border-t border-border/50 pt-6" aria-label="Sponsors">

                {/* Header: Title + Simple Become a Sponsor Button */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Sponsors
                  </h2>

                  {onOpenSponsorModal ? (
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic?.('light');
                        onOpenSponsorModal({ tier: 'diamond', placement: 'diamond-2', slotId: 2 });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer bg-transparent border-0 p-0"
                    >
                      Become a sponsor
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  ) : (
                    <a
                      href={checkoutUrl || "https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => triggerHaptic?.('light')}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Become a sponsor
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* High-Impact Sponsor Cards Row */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Diamond: Maple */}
                  <a
                    href="https://maple.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => triggerHaptic?.('light')}
                    className="group flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center gap-3.5">
                        <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-[#E86F00] transition-transform duration-200 group-hover:scale-105">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 739 739" className="size-6 sm:size-7" aria-hidden="true">
                            <path d="M369.38 0C480.324 2.908e-08 572.686 76.542 592.669 177.775C681.438 222.749 738.763 293.878 738.765 373.942C738.763 482.538 633.316 574.71 486.96 607.449C499.978 645.591 508.455 690.397 510.789 738.765L227.967 738.764C229.399 709.074 233.146 680.725 238.834 654.436C269.538 661.732 306.949 666.785 347.396 664.859L345.194 618.741C208.102 625.268 0.005 528.243 0 373.948C2.099e-08 293.883 57.322 222.751 146.093 177.775C166.076 76.543 258.436 0.001 369.38 0ZM202.322 258.434C174.48 255.016 149.271 273.738 146.015 300.254L133.046 405.874C129.791 432.389 149.721 456.662 177.563 460.08C205.404 463.499 230.614 444.769 233.87 418.254L246.839 312.633C250.095 286.118 230.163 261.853 202.322 258.434ZM367.3 278.691C339.459 275.273 314.117 295.071 310.699 322.913L298.319 423.736C294.902 451.576 314.7 476.918 342.541 480.337C370.382 483.755 395.724 463.955 399.143 436.115L411.523 335.292C414.941 307.451 395.142 282.109 367.3 278.691Z" fill="currentColor" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            Maple
                          </div>
                          <div className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                            maple.dev
                          </div>
                        </div>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        Open-source observability for AI. Traces, logs, and metrics via OpenTelemetry and ClickHouse.
                      </p>
                    </div>
                  </a>

                  {/* Diamond Slot 2: Active or Open */}
                  {(() => {
                    const slot2 = sponsors?.find((s) => s.id === 2);
                    if (slot2 && !slot2.isAvailable) {
                      return (
                        <a
                          key={slot2.id}
                          href={slot2.siteUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => triggerHaptic?.('light')}
                          className="group flex flex-col rounded-2xl border border-border bg-card p-4 sm:p-5 no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99]"
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-3.5">
                              <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 overflow-hidden transition-transform duration-200 group-hover:scale-105">
                                {slot2.logoUrl ? (
                                  <img src={slot2.logoUrl} alt={slot2.companyName} className="size-full object-contain p-2" />
                                ) : (
                                  <span className="text-sm font-bold">{slot2.companyName.slice(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div>
                                <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                  {slot2.companyName}
                                </div>
                                <div className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                  {slot2.siteUrl ? slot2.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'sponsor'}
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                              {slot2.description}
                            </p>
                          </div>
                        </a>
                      );
                    }

                    return onOpenSponsorModal ? (
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic?.('medium');
                          onOpenSponsorModal({ tier: 'diamond', placement: 'diamond-2', slotId: 2 });
                        }}
                        className="group flex flex-col rounded-2xl border-2 border-dashed border-border hover:border-foreground/30 bg-card p-4 sm:p-5 text-left no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-3.5">
                            <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border group-hover:border-foreground/40 text-muted-foreground group-hover:text-foreground transition-all">
                              <Plus className="size-5 sm:size-6" />
                            </div>
                            <div>
                              <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                Your logo here
                              </div>
                              <div className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                sponsor slot
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                            Reach engineers building modern interfaces.
                          </p>
                        </div>
                      </button>
                    ) : (
                      <a
                        href={checkoutUrl || "https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => triggerHaptic?.('medium')}
                        className="group flex flex-col rounded-2xl border-2 border-dashed border-border hover:border-foreground/30 bg-card p-4 sm:p-5 text-left no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-3.5">
                            <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border group-hover:border-foreground/40 text-muted-foreground group-hover:text-foreground transition-all">
                              <Plus className="size-5 sm:size-6" />
                            </div>
                            <div>
                              <div className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                                Your logo here
                              </div>
                              <div className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                sponsor slot
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                            Reach engineers building modern interfaces.
                          </p>
                        </div>
                      </a>
                    );
                  })()}
                </div>

                {/* THREE METRIC CARDS BELOW THE SPONSOR ROW (SAME ROW ON MOBILE & DESKTOP) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
                  {/* Card 1: 50k+ developers / month */}
                  <div className="rounded-xl border border-border/50 bg-card p-2 sm:p-4 md:p-5 flex flex-col justify-center text-center sm:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em] font-sans text-foreground">
                      50k+
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
                      developers / month
                    </div>
                  </div>

                  {/* Card 2: 5M+ impressions */}
                  <div className="rounded-xl border border-border/50 bg-card p-2 sm:p-4 md:p-5 flex flex-col justify-center text-center sm:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em] font-sans text-foreground">
                      5M+
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
                      impressions
                    </div>
                  </div>

                  {/* Card 3: 160+ components */}
                  <div className="rounded-xl border border-border/50 bg-card p-2 sm:p-4 md:p-5 flex flex-col justify-center text-center sm:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.03em] font-sans text-foreground">
                      160+
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mt-0.5 sm:mt-1 leading-tight">
                      components
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN: DESKTOP STICKY SIDEBAR (WITH DEPENDENCIES) */}
            <div className="hidden lg:block space-y-4 sticky top-24">
              {renderSidebarCards()}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
