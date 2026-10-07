import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://amicro.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapRoute {
  url: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const routes: SitemapRoute[] = [
  // Primary Landing & Feature Hubs
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/buttons', priority: '0.9', changefreq: 'daily' },
  { url: '/cards', priority: '0.9', changefreq: 'daily' },
  { url: '/carousels', priority: '0.9', changefreq: 'daily' },
  { url: '/loaders', priority: '0.9', changefreq: 'daily' },
  { url: '/animations', priority: '0.9', changefreq: 'weekly' },
  { url: '/morphing', priority: '0.9', changefreq: 'daily' },
  { url: '/blogs', priority: '0.9', changefreq: 'daily' },
  { url: '/blogs/physics-of-micro-transitions', priority: '0.8', changefreq: 'monthly' },
  { url: '/blogs/shadcn-registry-two', priority: '0.8', changefreq: 'monthly' },
  { url: '/blogs/next-gen-ai-inputs', priority: '0.8', changefreq: 'monthly' },
  { url: '/blogs/react-19-motion-without-layout-shifts', priority: '0.8', changefreq: 'monthly' },
  { url: '/text-animations', priority: '0.9', changefreq: 'weekly' },
  { url: '/dither-charts', priority: '0.9', changefreq: 'weekly' },
  { url: '/mono-charts', priority: '0.9', changefreq: 'weekly' },
  { url: '/3d', priority: '0.9', changefreq: 'weekly' },
  { url: '/cli', priority: '0.8', changefreq: 'weekly' },
  { url: '/skills', priority: '0.8', changefreq: 'weekly' },
  { url: '/sponsors', priority: '0.7', changefreq: 'weekly' },

  // Button components
  ...Array.from({ length: 35 }, (_, i) => ({
    url: `/buttons/btn-${i + 1}`,
    priority: '0.8',
    changefreq: 'weekly' as const,
  })),

  // Card Spreads & Carousels
  { url: '/cards/card-arc-5', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-arc-7', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-long-arc-5', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-linear-spread', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-corner-fan', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-stamp-arc', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-cascade-stagger', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-scatter-spread', priority: '0.8', changefreq: 'weekly' },
  { url: '/cards/card-wheel-fan', priority: '0.8', changefreq: 'weekly' },
  { url: '/carousels/card-carousel', priority: '0.8', changefreq: 'weekly' },
  { url: '/carousels/card-cover-flow', priority: '0.8', changefreq: 'weekly' },
  { url: '/carousels/card-time-machine', priority: '0.8', changefreq: 'weekly' },

  // Mono Charts
  { url: '/mono-charts/mono-rounded-line', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-segmented-timeline', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-donut-breakdown', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-progress-bars', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-activity-rings', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-scatter-matrix', priority: '0.8', changefreq: 'weekly' },
  { url: '/mono-charts/mono-stepped-trend', priority: '0.8', changefreq: 'weekly' },

  // Dither Charts
  { url: '/dither-charts/dither-donut', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-growth', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-uptime', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-heatmap', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-gauge', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-traffic', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-device', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-storage', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-revenue', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-funnel', priority: '0.8', changefreq: 'weekly' },
  { url: '/dither-charts/dither-stacked', priority: '0.8', changefreq: 'weekly' },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml, 'utf-8');
console.log(`Generated canonical sitemap with ${routes.length} URLs at ${outputPath}`);
