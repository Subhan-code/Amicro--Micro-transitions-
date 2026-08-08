import React from 'react';

export type MetricInteractionType = 
  | 'cacheable-bandwidth-cost'
  | 'sales-analytics-dual-bars'
  | 'sales-target-segmented-arc'
  | 'sales-overview-radial-dashboard'
  | 'users-growth-pill-progress'
  | 'overview-bar-scrubber-card'
  | 'network-telemetry-matrix'
  | 'progress-indicator-piano'
  | 'server-performance-step-bars'
  | 'credit-score-barcode-meter'
  | 'views-hourly-wave-chart'
  | 'timer-preparation-segmented'
  | 'noise-decibel-level'
  | 'mono-stock'
  | 'mono-revenue'
  | 'mono-credit'
  | 'mono-wallet'
  | 'mono-savings'
  | 'mono-heatmap'
  | 'mono-activity-ring'
  | 'mono-users'
  | 'mono-kfactor'
  | 'mono-latency'
  | 'mono-bandwidth'
  | 'mono-server'
  | 'mono-progress'
  | 'mono-radar'
  | 'mono-timer-arc'
  | 'mono-timer-ring';

export interface MetricConfig {
  id: string;
  label: string;
  interactionType: MetricInteractionType;
  description: string;
  cliCommand: string;
  category: string;
}

export const metricsData: MetricConfig[] = [
  // --- INFRASTRUCTURE ---
  {
    id: 'm-cache-bandwidth',
    label: 'Cacheable Bandwidth Usage & Cost Card',
    interactionType: 'cacheable-bandwidth-cost',
    description: 'CDN cacheable bandwidth breakdown card with cached vs non-cacheable segments and monthly cost.',
    cliCommand: 'npx @subhanhq/amicro@latest add cacheable-bandwidth-cost',
    category: 'Infrastructure',
  },
  {
    id: 'm-net-matrix',
    label: 'Network Telemetry Matrix Dashboard',
    interactionType: 'network-telemetry-matrix',
    description: 'Matrix telemetry dashboard with finality times, intents count, and testnet pixel activity grid.',
    cliCommand: 'npx @subhanhq/amicro@latest add network-telemetry-matrix',
    category: 'Infrastructure',
  },
  {
    id: 'm-progress-piano',
    label: 'Progress Indicator Piano Bar Card',
    interactionType: 'progress-indicator-piano',
    description: 'Piano key progress bar widget with percentage goal readout and completion prediction.',
    cliCommand: 'npx @subhanhq/amicro@latest add progress-indicator-piano',
    category: 'Infrastructure',
  },
  {
    id: 'm-server-step',
    label: 'Server Performance Metrics Step Bar',
    interactionType: 'server-performance-step-bars',
    description: 'Staircase step bar chart with top cap highlights and growth readout.',
    cliCommand: 'npx @subhanhq/amicro@latest add server-performance-step-bars',
    category: 'Infrastructure',
  },

  // --- MARKET & FINANCE ---
  {
    id: 'm-overview-scrubber',
    label: 'Overview Bar Scrubber Tooltip Card',
    interactionType: 'overview-bar-scrubber-card',
    description: 'Monthly diagonal-stripe bar chart card with active scrubber highlight and interactive tooltip bubble.',
    cliCommand: 'npx @subhanhq/amicro@latest add overview-bar-scrubber-card',
    category: 'Market & Finance',
  },
  {
    id: 'm-sales-dual',
    label: 'Sales Analytics Dual Bar Card',
    interactionType: 'sales-analytics-dual-bars',
    description: 'Dual bar chart card with units sold readout, sales vs earnings legend pills, and monthly active bars.',
    cliCommand: 'npx @subhanhq/amicro@latest add sales-analytics-dual-bars',
    category: 'Market & Finance',
  },
  {
    id: 'm-sales-arc',
    label: 'Sales Target Arc Segment Gauge',
    interactionType: 'sales-target-segmented-arc',
    description: 'Semi-circle segmented radial arc gauge with dual property status blocks and percentage target achieved.',
    cliCommand: 'npx @subhanhq/amicro@latest add sales-target-segmented-arc',
    category: 'Market & Finance',
  },
  {
    id: 'm-sales-radial-dash',
    label: 'Sales Overview Arc & Cards Dashboard',
    interactionType: 'sales-overview-radial-dashboard',
    description: 'Sales overview radial arc gauge dashboard with performer rank banner and dual metric stat cards.',
    cliCommand: 'npx @subhanhq/amicro@latest add sales-overview-radial-dashboard',
    category: 'Market & Finance',
  },
  {
    id: 'm-credit-barcode',
    label: 'Credit Score Vertical Barcode Meter',
    interactionType: 'credit-score-barcode-meter',
    description: 'Credit score meter widget with vertical stroke lines progress bar and timeframe dropdown.',
    cliCommand: 'npx @subhanhq/amicro@latest add credit-score-barcode-meter',
    category: 'Market & Finance',
  },
  {
    id: 'm-mono-stock',
    label: 'Monochrome Stock Ticker',
    interactionType: 'mono-stock',
    description: 'Minimalist black & white stock ticker curve with time filters (1D, 1W, 1M, 1Y).',
    cliCommand: 'npx @subhanhq/amicro@latest add mono-stock',
    category: 'Market & Finance',
  },

  // --- AUDIENCE & GROWTH ---
  {
    id: 'm-users-pill',
    label: 'Users Growth Pill Progress Widget',
    interactionType: 'users-growth-pill-progress',
    description: 'Dark user acquisition growth widget with star badge, avatar profile, and stacked pill progress bars.',
    cliCommand: 'npx @subhanhq/amicro@latest add users-growth-pill-progress',
    category: 'Audience & Growth',
  },
  {
    id: 'm-views-wave',
    label: 'Views Hourly Wave Chart',
    interactionType: 'views-hourly-wave-chart',
    description: 'Smooth hourly wave curve chart with period filter pills and average reference line.',
    cliCommand: 'npx @subhanhq/amicro@latest add views-hourly-wave-chart',
    category: 'Audience & Growth',
  },
  {
    id: 'm-mono-heatmap',
    label: 'Monochrome Activity Heatmap',
    interactionType: 'mono-heatmap',
    description: '28-day activity matrix calendar with grayscale commit intensity.',
    cliCommand: 'npx @subhanhq/amicro@latest add mono-heatmap',
    category: 'Audience & Growth',
  },

  // --- PERSONAL & HEALTH ---
  {
    id: 'm-timer-prep',
    label: 'Preparation Segmented Timer Widget',
    interactionType: 'timer-preparation-segmented',
    description: 'iOS-style preparation timer widget with segmented progress bar and step tooltip.',
    cliCommand: 'npx @subhanhq/amicro@latest add timer-preparation-segmented',
    category: 'Personal & Health',
  },
  {
    id: 'm-noise-level',
    label: 'Noise Decibel Level Meter Widget',
    interactionType: 'noise-decibel-level',
    description: 'Ambient decibel meter widget with signal bars and dual-pill range slider.',
    cliCommand: 'npx @subhanhq/amicro@latest add noise-decibel-level',
    category: 'Personal & Health',
  },
];
