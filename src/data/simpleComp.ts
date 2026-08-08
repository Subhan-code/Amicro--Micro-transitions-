export interface SimpleCompItem {
  id: string;
  label: string;
  kebabName: string;
  category: string;
  description: string;
  cliCommand: string;
  codeSnippet: string;
}

export const simpleCompData: SimpleCompItem[] = [
  {
    id: 'dither-book',
    label: '3D Dither Lab Book',
    kebabName: 'dither-book',
    category: 'book',
    description: '3D page-flipping book with cream texture overlay & crease depth control.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-book',
    codeSnippet: `import { DitherBook } from '@/components/ui/dither-book';\n\nexport default function Demo() {\n  return <DitherBook theme="dark" />;\n}`
  },
  {
    id: 'dither-donut',
    label: 'Dither Donut Chart',
    kebabName: 'dither-donut',
    category: 'donut',
    description: 'Canvas dithered donut graph with white particle highlights & period selectors.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-donut',
    codeSnippet: `import { DitherDonutChart } from '@/components/ui/dither-donut';\n\nexport default function Demo() {\n  return <DitherDonutChart theme="dark" />;\n}`
  },
  {
    id: 'dither-stacked',
    label: 'Dither Stacked Chart',
    kebabName: 'dither-stacked',
    category: 'stacked',
    description: 'Stacked canvas bar graph with regional branch hovers & white dither bands.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-stacked',
    codeSnippet: `import { DitherStackedChart } from '@/components/ui/dither-stacked';\n\nexport default function Demo() {\n  return <DitherStackedChart theme="dark" />;\n}`
  },
  {
    id: 'dither-growth',
    label: 'Dither Growth Chart',
    kebabName: 'dither-growth',
    category: 'growth',
    description: 'Canvas area growth line graph with white dither tiles & date scrubber cursor.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-growth',
    codeSnippet: `import { DitherGrowthChart } from '@/components/ui/dither-growth';\n\nexport default function Demo() {\n  return <DitherGrowthChart theme="dark" />;\n}`
  },
  {
    id: 'dither-heatmap',
    label: 'Dither Activity Heatmap',
    kebabName: 'dither-heatmap',
    category: 'heatmap',
    description: 'Activity heatmap grid with white dither intensity tiles.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-heatmap',
    codeSnippet: `import { ActivityHeatmap } from '@/components/ui/dither-heatmap';\n\nexport default function Demo() {\n  return <ActivityHeatmap theme="dark" />;\n}`
  },
  {
    id: 'dither-gauge',
    label: 'Dither Server Gauge',
    kebabName: 'dither-gauge',
    category: 'gauge',
    description: 'Server CPU & memory radial gauge dial with white dither dot matrix.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-gauge',
    codeSnippet: `import { ServerGauge } from '@/components/ui/dither-gauge';\n\nexport default function Demo() {\n  return <ServerGauge theme="dark" />;\n}`
  },
  {
    id: 'dither-traffic',
    label: 'Dither Traffic Bubbles',
    kebabName: 'dither-traffic',
    category: 'traffic',
    description: 'Traffic source scatter bubble plot with floating white dither nodes.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-traffic',
    codeSnippet: `import { TrafficBubble } from '@/components/ui/dither-traffic';\n\nexport default function Demo() {\n  return <TrafficBubble theme="dark" />;\n}`
  },
  {
    id: 'dither-funnel',
    label: 'Dither Conversion Funnel',
    kebabName: 'dither-funnel',
    category: 'funnel',
    description: 'Conversion funnel with white dither progress stage bars.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-funnel',
    codeSnippet: `import { DitherFunnelChart } from '@/components/ui/dither-funnel';\n\nexport default function Demo() {\n  return <DitherFunnelChart theme="dark" />;\n}`
  },
  {
    id: 'dither-device',
    label: 'Dither Device Breakdown',
    kebabName: 'dither-device',
    category: 'device',
    description: 'Device usage donut chart with white dither particle segments.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-device',
    codeSnippet: `import { DeviceUsageChart } from '@/components/ui/dither-device';\n\nexport default function Demo() {\n  return <DeviceUsageChart theme="dark" />;\n}`
  },
  {
    id: 'dither-storage',
    label: 'Dither Storage Bar',
    kebabName: 'dither-storage',
    category: 'storage',
    description: 'Storage capacity bar with animated white dither progress shaders.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-storage',
    codeSnippet: `import { StorageUsageChart } from '@/components/ui/dither-storage';\n\nexport default function Demo() {\n  return <StorageUsageChart theme="dark" />;\n}`
  },
  {
    id: 'dither-revenue',
    label: 'Dither Revenue Line',
    kebabName: 'dither-revenue',
    category: 'revenue',
    description: 'Revenue line graph with white dither gradient fill.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-revenue',
    codeSnippet: `import { RevenueLineChart } from '@/components/ui/dither-revenue';\n\nexport default function Demo() {\n  return <RevenueLineChart theme="dark" />;\n}`
  },
  {
    id: 'dither-uptime',
    label: 'Dither System Uptime',
    kebabName: 'dither-uptime',
    category: 'uptime',
    description: '90-day system uptime matrix with white dither status tiles.',
    cliCommand: 'npx @subhanhq/amicro@latest add dither-uptime',
    codeSnippet: `import { UptimeChart } from '@/components/ui/dither-uptime';\n\nexport default function Demo() {\n  return <UptimeChart theme="dark" />;\n}`
  }
];
