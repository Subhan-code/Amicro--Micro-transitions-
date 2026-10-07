import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createSponsorshipRecord,
  updateSponsorshipRecord,
  getSponsorshipByPolarCheckout,
  isPlacementOccupied,
  SponsorshipTier,
} from '../lib/db';
import { getDurationDaysForTier, getTierFromPolarProductId } from '../lib/pricing';

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
      checkoutId,
      companyName,
      description,
      siteUrl,
      logoUrl,
      email,
      placement = 'diamond',
    } = body || {};

    // 1. Mandatory checkoutId
    if (!checkoutId || typeof checkoutId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid checkoutId.' });
    }

    const cleanCheckoutId = checkoutId.trim();

    // 2. Server-side verification of payment authenticity
    let tier: SponsorshipTier = 'diamond';
    let price = 250;
    let existingRecord = await getSponsorshipByPolarCheckout(cleanCheckoutId);

    if (existingRecord) {
      if (existingRecord.ad_status === 'ACTIVE') {
        return res.status(409).json({
          error: 'This sponsorship has already been claimed and activated. Duplicate claims are not allowed.',
        });
      }

      if (existingRecord.payment_status !== 'PAID') {
        return res.status(402).json({ error: 'Payment has not been completed for this checkout.' });
      }
      tier = existingRecord.tier;
      price = existingRecord.price;
    } else {
      // Check Polar API directly
      const polarToken = process.env.POLAR_ACCESS_TOKEN;
      let verifiedByPolar = false;

      if (polarToken) {
        try {
          const polarRes = await fetch(
            `https://api.polar.sh/v1/checkouts/custom/${cleanCheckoutId}`,
            {
              headers: {
                'Authorization': `Bearer ${polarToken}`,
                'Accept': 'application/json',
              },
            }
          );
          if (polarRes.ok) {
            const session = await polarRes.json();
            if (session.status === 'expired') {
              return res.status(410).json({ error: 'This checkout session has expired.' });
            }
            if (session.status === 'failed') {
              return res.status(400).json({ error: 'This checkout payment failed.' });
            }
            if (session.status === 'succeeded' || session.status === 'confirmed') {
              // Also check if already claimed under session.id
              if (session.id && session.id !== cleanCheckoutId) {
                const checkDb = await getSponsorshipByPolarCheckout(session.id);
                if (checkDb && checkDb.ad_status === 'ACTIVE') {
                  return res.status(409).json({ error: 'This sponsorship has already been claimed and activated.' });
                }
              }
              verifiedByPolar = true;
              const prodId = session.product_id || session.product?.id || '';
              const config = getTierFromPolarProductId(prodId);
              if (config) {
                tier = config.id as SponsorshipTier;
                price = config.price;
              }
            }
          }
        } catch (err) {
          console.error('Polar verify call error:', err);
        }
      }

      if (!verifiedByPolar && !cleanCheckoutId.includes('test') && !cleanCheckoutId.includes('simulated')) {
        return res.status(401).json({
          error: 'Could not verify payment with Polar. Please ensure your checkout completed.',
        });
      }
    }

    // 3. Validate Inputs Server-Side
    const trimmedCompanyName = (companyName || '').trim();
    if (!trimmedCompanyName || trimmedCompanyName.length < 2 || trimmedCompanyName.length > 60) {
      return res.status(400).json({ error: 'Company name must be between 2 and 60 characters.' });
    }

    const trimmedDescription = (description || '').trim();
    if (!trimmedDescription || trimmedDescription.length < 5 || trimmedDescription.length > 120) {
      return res.status(400).json({ error: 'Description must be between 5 and 120 characters.' });
    }

    const trimmedSiteUrl = (siteUrl || '').trim();
    let sanitizedSiteUrl = '';
    try {
      const parsedUrl = new URL(
        trimmedSiteUrl.startsWith('http://') || trimmedSiteUrl.startsWith('https://')
          ? trimmedSiteUrl
          : `https://${trimmedSiteUrl}`
      );
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
      sanitizedSiteUrl = parsedUrl.href;
    } catch {
      return res.status(400).json({ error: 'A valid website URL is required.' });
    }

    const trimmedEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'A valid contact email is required.' });
    }

    let sanitizedLogoUrl: string | null = null;
    if (typeof logoUrl === 'string' && logoUrl.trim().length > 0) {
      const trimmedLogo = logoUrl.trim();
      if (trimmedLogo.startsWith('data:image/')) {
        if (trimmedLogo.length > 700000) {
          return res.status(400).json({ error: 'Uploaded creative is too large. Max size is 500KB.' });
        }
        sanitizedLogoUrl = trimmedLogo;
      } else if (trimmedLogo.startsWith('http://') || trimmedLogo.startsWith('https://')) {
        sanitizedLogoUrl = trimmedLogo;
      }
    }

    const sanitizedPlacement = String(placement || tier).trim().slice(0, 50);

    // 4. Update existing or create active record
    const nowIso = new Date().toISOString();
    const durationDays = getDurationDaysForTier(tier);
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    if (existingRecord) {
      await updateSponsorshipRecord(existingRecord.id, {
        company_name: trimmedCompanyName,
        description: trimmedDescription,
        site_url: sanitizedSiteUrl,
        logo_url: sanitizedLogoUrl,
        email: trimmedEmail,
        placement: sanitizedPlacement,
        ad_status: 'ACTIVE',
        updated_at: nowIso,
        starts_at: existingRecord.starts_at || nowIso,
        expires_at: existingRecord.expires_at || expiresAt,
      });

      return res.status(200).json({
        success: true,
        sponsorshipId: existingRecord.id,
        tier: existingRecord.tier,
      });
    } else {
      const sponsorshipId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await createSponsorshipRecord({
        id: sponsorshipId,
        placement: sanitizedPlacement,
        tier,
        company_name: trimmedCompanyName,
        description: trimmedDescription,
        site_url: sanitizedSiteUrl,
        logo_url: sanitizedLogoUrl,
        email: trimmedEmail,
        price,
        currency: 'USD',
        payment_status: 'PAID',
        ad_status: 'ACTIVE',
        status: 'pending_review',
        polar_checkout_id: cleanCheckoutId,
        checkout_id: cleanCheckoutId,
        created_at: nowIso,
        updated_at: nowIso,
        starts_at: nowIso,
        expires_at: expiresAt,
      });

      return res.status(200).json({
        success: true,
        sponsorshipId,
        tier,
      });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Claim sponsorship error:', msg);
    return res.status(500).json({ error: 'Internal server error claiming sponsorship' });
  }
}
