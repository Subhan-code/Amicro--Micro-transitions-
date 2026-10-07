export interface SponsorTier {
  id: 'diamond' | 'gold' | 'silver';
  name: string;
  price: number;
  period: string;
  shortPrice: string;
  badge: string;
  tagline: string;
  description: string;
  popular?: boolean;
  features: string[];
  slotsTotal: number;
  checkoutUrl: string;
  productId: string;
}

export const POLAR_PRODUCT_IDS = {
  diamond: '2fcd67d7-3f48-4d3e-b6e3-10b6cae99a6a',
  gold: 'ff47249c-8f45-4242-bd8d-466c1fbfb609',
  silver: 'dd643ac1-9559-4430-ad6b-cd8ebef2f5a9',
};

export const POLAR_DEFAULT_URL = 'https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS';

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: 'diamond',
    name: 'Diamond',
    price: 250,
    period: '/month',
    shortPrice: '$250',
    badge: 'Premier',
    tagline: 'Maximum visibility & high-intent dev reach',
    description: 'Premier spot across the entire Amicro ecosystem with persistent sticky presence and top showcase.',
    popular: true,
    slotsTotal: 1,
    productId: POLAR_PRODUCT_IDS.diamond,
    checkoutUrl: 'https://polar.sh/checkout/polar_c_aJ9w76csnccSI8uNxJ6rIopDFzVFJkzobaGNC17YNtS',
    features: [
      'Sticky bottom ad banner placement across all pages',
      'Top-level prominent logo on Homepage and Catalog',
      'Featured backlink with high-intent dev traffic',
      'Large logo in GitHub repository README',
      'Priority direct line for component requests',
      'Social announcement on X (@SubhanHQ)',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 150,
    period: '/month',
    shortPrice: '$150',
    badge: 'Featured',
    tagline: 'High-visibility placement for growing dev tools',
    description: 'Prominent showcase across Amicro component pages, CLI documentation, and charts.',
    slotsTotal: 3,
    productId: POLAR_PRODUCT_IDS.gold,
    checkoutUrl: 'https://polar.sh/checkout/polar_c_e8o6kfWMdh8Yan4qBRNOs9GkeXQ3Xt3oUXCZp3uBDgE',
    features: [
      'Featured brand logo in Amicro sponsor grid',
      'Placement across subpages (CLI, Skills, Mono Charts)',
      'Brand logo & link in GitHub repository README',
      'High-authority backlink with developer traffic',
      'Early preview access to new components & updates',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 99,
    period: '/month',
    shortPrice: '$99',
    badge: 'Standard',
    tagline: 'Clean presence & open-source support',
    description: 'Ideal for dev tools, libraries, and founders supporting open source UI transitions.',
    slotsTotal: 4,
    productId: POLAR_PRODUCT_IDS.silver,
    checkoutUrl: 'https://buy.polar.sh/polar_cl_c86eOLH4ntmP6PZOHPfoBHpSJdKas9myjONPE40ngXD',
    features: [
      'Logo & description in Amicro Sponsors grid',
      'Listing on Amicro Sponsors page directory',
      'Name & website link in GitHub repository README',
      'Official Amicro OSS Supporter badge',
    ],
  },
];
