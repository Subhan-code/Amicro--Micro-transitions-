import { VercelRequest, VercelResponse } from '@vercel/node';
import { getActiveSponsorships, SponsorshipRecord } from './lib/db';

const ALLOWED_ORIGINS = [
  'https://amicro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

export interface FormattedSponsorSlot {
  id: number;
  companyName: string;
  description: string;
  logoType?: string;
  logoUrl?: string;
  siteUrl: string;
  isAvailable: boolean;
  tier: 'diamond' | 'gold' | 'silver';
  price: string;
  placement: string;
  sponsorshipId?: string;
  startsAt?: string | null;
  expiresAt?: string | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const activeRecords = await getActiveSponsorships();

    // Map active records by tier
    const activeDiamond = activeRecords.filter((r) => r.tier === 'diamond');
    const activeGold = activeRecords.filter((r) => r.tier === 'gold');
    const activeSilver = activeRecords.filter((r) => r.tier === 'silver');

    // 1. Diamond Slots:
    const slot1Record = activeDiamond.find(
      (r) => r.placement === 'diamond-1' || r.placement === 'slot-1'
    );
    const diamond1: FormattedSponsorSlot = slot1Record
      ? {
          id: 1,
          companyName: slot1Record.company_name,
          description: slot1Record.description,
          logoUrl: slot1Record.logo_url || undefined,
          siteUrl: slot1Record.site_url,
          isAvailable: false,
          tier: 'diamond',
          price: '$250',
          placement: slot1Record.placement,
          sponsorshipId: slot1Record.id,
          startsAt: slot1Record.starts_at,
          expiresAt: slot1Record.expires_at,
        }
      : {
          id: 1,
          companyName: 'Maple',
          description:
            'Open-source observability built for AI, with fast traces, logs, and metrics powered by OpenTelemetry and ClickHouse.',
          logoType: 'maple',
          siteUrl: 'https://maple.dev/',
          isAvailable: false,
          tier: 'diamond',
          price: '$250',
          placement: 'diamond-1',
        };

    // Slot 2: Active paid Diamond sponsor if exists, otherwise available
    const slot2Record = activeDiamond.find(
      (r) => r.id !== slot1Record?.id && (r.placement === 'diamond-2' || !slot1Record)
    );
    const diamond2: FormattedSponsorSlot = slot2Record
      ? {
          id: 2,
          companyName: slot2Record.company_name,
          description: slot2Record.description,
          logoUrl: slot2Record.logo_url || undefined,
          siteUrl: slot2Record.site_url,
          isAvailable: false,
          tier: 'diamond',
          price: '$250',
          placement: slot2Record.placement || 'diamond-2',
          sponsorshipId: slot2Record.id,
          startsAt: slot2Record.starts_at,
          expiresAt: slot2Record.expires_at,
        }
      : {
          id: 2,
          companyName: 'Available Slot',
          description: 'Advertise your product here.',
          siteUrl: 'https://amicro.dev',
          isAvailable: true,
          tier: 'diamond',
          price: '$250',
          placement: 'diamond-2',
        };

    // 2. Gold Slots (4 slots: 3, 4, 5, 6)
    const goldSlotIds = [3, 4, 5, 6];
    const goldSlots: FormattedSponsorSlot[] = goldSlotIds.map((slotId, index) => {
      const record = activeGold.find((r) => r.placement === `gold-${slotId}`) || activeGold[index];
      if (record) {
        return {
          id: slotId,
          companyName: record.company_name,
          description: record.description,
          logoUrl: record.logo_url || undefined,
          siteUrl: record.site_url,
          isAvailable: false,
          tier: 'gold',
          price: '$150',
          placement: record.placement || `gold-${slotId}`,
          sponsorshipId: record.id,
          startsAt: record.starts_at,
          expiresAt: record.expires_at,
        };
      }
      return {
        id: slotId,
        companyName: 'Available Slot',
        description: 'Advertise your product here.',
        siteUrl: 'https://amicro.dev',
        isAvailable: true,
        tier: 'gold',
        price: '$150',
        placement: `gold-${slotId}`,
      };
    });

    // 3. Silver Slots (4 slots: 7, 8, 9, 10 for 2x2 matrix)
    const silverSlotIds = [7, 8, 9, 10];
    const silverSlots: FormattedSponsorSlot[] = silverSlotIds.map((slotId, index) => {
      const record = activeSilver.find((r) => r.placement === `silver-${slotId}`) || activeSilver[index];
      if (record) {
        return {
          id: slotId,
          companyName: record.company_name,
          description: record.description,
          logoUrl: record.logo_url || undefined,
          siteUrl: record.site_url,
          isAvailable: false,
          tier: 'silver',
          price: '$99',
          placement: record.placement || `silver-${slotId}`,
          sponsorshipId: record.id,
          startsAt: record.starts_at,
          expiresAt: record.expires_at,
        };
      }
      return {
        id: slotId,
        companyName: 'Available Slot',
        description: 'Advertise your product here.',
        siteUrl: 'https://amicro.dev',
        isAvailable: true,
        tier: 'silver',
        price: '$99',
        placement: `silver-${slotId}`,
      };
    });

    const allSlots: FormattedSponsorSlot[] = [
      diamond1,
      diamond2,
      ...goldSlots,
      ...silverSlots,
    ];

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({
      sponsors: allSlots,
      activeCount: activeRecords.length + 1, // +1 for Maple
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching sponsors:', message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
