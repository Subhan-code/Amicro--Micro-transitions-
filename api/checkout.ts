import { VercelRequest, VercelResponse } from '@vercel/node';
import { createSponsorshipRecord, isPlacementOccupied, updateSponsorshipRecord, SponsorshipTier } from './lib/db';
import { getTrustedPriceForTier } from './lib/pricing';

const ALLOWED_ORIGINS = [
  'https://amicro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON payload' });
      }
    }

    const {
      tier,
      placement = 'diamond',
      companyName = '',
      description = '',
      siteUrl = '',
      logoUrl = '',
      email = '',
    } = body || {};

    // 1. Validate Tier & Lookup Trusted Price Server-Side
    if (!tier || typeof tier !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid sponsorship tier' });
    }

    const tierPricing = getTrustedPriceForTier(tier);
    if (!tierPricing) {
      return res.status(400).json({
        error: `Invalid tier '${tier}'. Valid tiers are 'diamond' ($250), 'gold' ($150), 'silver' ($99).`,
      });
    }

    const sanitizedPlacement = String(placement || tierPricing.id).trim().slice(0, 50);

    // 2. Prevent duplicate booking on occupied active placement slot
    const isOccupied = await isPlacementOccupied(sanitizedPlacement);
    if (isOccupied) {
      return res.status(409).json({
        error: `Placement slot '${sanitizedPlacement}' is currently occupied by an active sponsor. Please select an available slot.`,
      });
    }

    // 3. Create Pending Sponsorship Record
    const sponsorshipId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const nowIso = new Date().toISOString();

    const requestHost = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    const requestProto = (req.headers['x-forwarded-proto'] as string) || (requestHost.includes('localhost') ? 'http' : 'https');
    const siteBase = `${requestProto}://${requestHost}`;

    // Success URL where Polar will redirect with checkout_id parameter
    const successUrl = `${siteBase}/sponsor/success?checkout_id={CHECKOUT_ID}`;

    // 4. Create Polar Checkout Session
    const polarAccessToken = process.env.POLAR_ACCESS_TOKEN;

    if (polarAccessToken) {
      try {
        const polarResponse = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${polarAccessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            products: [tierPricing.productId],
            success_url: successUrl,
            customer_email: email ? email.trim().toLowerCase() : undefined,
            metadata: {
              sponsorship_id: sponsorshipId,
              tier: tierPricing.id,
              placement: sanitizedPlacement,
            },
          }),
        });

        if (!polarResponse.ok) {
          const errorBody = await polarResponse.text();
          console.error(`Polar API Checkout Error (${polarResponse.status}):`, errorBody);
          return res.status(502).json({
            error: 'Failed to initiate checkout session with Polar.',
            details: errorBody,
          });
        }

        const session = await polarResponse.json();
        const checkoutUrl = session.url;
        const sessionId = session.id;

        await createSponsorshipRecord({
          id: sponsorshipId,
          placement: sanitizedPlacement,
          tier: tierPricing.id as SponsorshipTier,
          company: companyName ? companyName.trim() : 'Pending Sponsor',
          company_name: companyName ? companyName.trim() : 'Pending Sponsor',
          description: description ? description.trim() : 'Sponsorship on Amicro',
          website: siteUrl ? siteUrl.trim() : 'https://polar.sh',
          site_url: siteUrl ? siteUrl.trim() : 'https://polar.sh',
          logo_url: logoUrl || null,
          email: email ? email.trim().toLowerCase() : 'pending@polar.sh',
          price: tierPricing.price,
          currency: 'USD',
          payment_status: 'pending',
          status: 'pending_review',
          ad_status: 'PENDING',
          checkout_id: sessionId,
          polar_checkout_id: sessionId,
          created_at: nowIso,
          updated_at: nowIso,
        });

        return res.status(200).json({
          checkoutUrl,
          sponsorshipId,
          tier: tierPricing.id,
          price: tierPricing.price,
        });
      } catch (polarError: unknown) {
        console.error('Error connecting to Polar Payments API:', polarError);
        return res.status(502).json({
          error: 'Could not connect to Polar payment gateway.',
        });
      }
    } else {
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
      if (isProduction) {
        console.error('POLAR_ACCESS_TOKEN is not configured in production.');
        return res.status(500).json({
          error: 'Payment system misconfiguration: POLAR_ACCESS_TOKEN is required in production.',
        });
      }

      // In local dev without POLAR_ACCESS_TOKEN, return direct Polar buy link or simulated flow
      console.warn('POLAR_ACCESS_TOKEN not configured. Returning simulated checkout for dev.');
      const directPolarUrl = `https://buy.polar.sh/checkout?product=${tierPricing.productId}`;
      const simulatedUrl = `${siteBase}/sponsor/success?checkout_id=simulated_${sponsorshipId}`;

      return res.status(200).json({
        checkoutUrl: simulatedUrl,
        directPolarUrl,
        sponsorshipId,
        tier: tierPricing.id,
        price: tierPricing.price,
        note: 'POLAR_ACCESS_TOKEN not set in dev. Using simulated redirect to /sponsor/success.',
      });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Checkout creation error:', message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
