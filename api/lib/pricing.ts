/**
 * Server-side trusted pricing for Amicro sponsorships using Polar.
 * Pricing tiers: Diamond ($250), Gold ($150), Silver ($99).
 */

export interface TierPricingConfig {
  id: 'diamond' | 'gold' | 'silver';
  name: string;
  price: number; // in USD dollars
  priceCents: number; // in cents
  productId: string;
  period: string;
  durationDays: number;
  defaultSlots: number;
}

const getEnv = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

export const TRUSTED_TIER_PRICING: Record<'diamond' | 'gold' | 'silver', TierPricingConfig> = {
  diamond: {
    id: 'diamond',
    name: 'Diamond',
    price: 250,
    priceCents: 25000,
    productId: getEnv('POLAR_PRODUCT_DIAMOND') || '2fcd67d7-3f48-4d3e-b6e3-10b6cae99a6a',
    period: 'one-time',
    durationDays: Number(getEnv('POLAR_DURATION_DIAMOND_DAYS') || 30),
    defaultSlots: 2,
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    price: 150,
    priceCents: 15000,
    productId: getEnv('POLAR_PRODUCT_GOLD') || 'ff47249c-8f45-4242-bd8d-466c1fbfb609',
    period: 'one-time',
    durationDays: Number(getEnv('POLAR_DURATION_GOLD_DAYS') || 30),
    defaultSlots: 4,
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    price: 99,
    priceCents: 9900,
    productId: getEnv('POLAR_PRODUCT_SILVER') || 'dd643ac1-9559-4430-ad6b-cd8ebef2f5a9',
    period: 'one-time',
    durationDays: Number(getEnv('POLAR_DURATION_SILVER_DAYS') || 30),
    defaultSlots: 3,
  },
};

export function getTrustedPriceForTier(tier: string): TierPricingConfig | null {
  const normalizedTier = tier?.toLowerCase() as 'diamond' | 'gold' | 'silver';
  return TRUSTED_TIER_PRICING[normalizedTier] || null;
}

export function getDurationDaysForTier(tier: string): number {
  const config = getTrustedPriceForTier(tier);
  return config?.durationDays || 30;
}

export function getTierFromPolarProductId(productId: string): TierPricingConfig | null {
  if (!productId) return null;
  const cleanId = productId.trim().toLowerCase();
  for (const config of Object.values(TRUSTED_TIER_PRICING)) {
    if (config.productId.toLowerCase() === cleanId) {
      return config;
    }
  }
  return null;
}
