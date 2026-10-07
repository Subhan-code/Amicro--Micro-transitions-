import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSponsorshipById,
  getSponsorshipByPaymentId,
  updateSponsorshipRecord,
} from './lib/db';
import { getDurationDaysForTier } from './lib/pricing';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.query || {};
  const sponsorshipId = (query.sponsorship_id || query.sponsorshipId) as string | undefined;
  const paymentId = (query.payment_id || query.checkout_id || query.id) as string | undefined;

  const idToLookup = sponsorshipId || paymentId;

  if (!idToLookup || typeof idToLookup !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing payment/sponsorship ID parameter' });
  }

  try {
    // 1. Check local / Supabase DB first
    let record = sponsorshipId ? await getSponsorshipById(sponsorshipId) : null;
    if (!record && paymentId) {
      record = await getSponsorshipByPaymentId(paymentId);
    }
    if (!record && !sponsorshipId && paymentId) {
      // In case paymentId is actually the sponsorshipId
      record = await getSponsorshipById(paymentId);
    }

    // 2. If record is already ACTIVE/PAID, return immediately (Webhook confirmed it)
    if (record && record.ad_status === 'ACTIVE' && record.payment_status === 'PAID') {
      return res.status(200).json({
        payment_success: true,
        status: 'ACTIVE',
        sponsorshipId: record.id,
        placement: record.placement,
        tier: record.tier,
        companyName: record.company_name,
        description: record.description,
        siteUrl: record.site_url,
        logoUrl: record.logo_url,
      });
    }

    // 3. If Dodo API key is configured, verify with Dodo Payments server-side
    const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY;
    const baseUrl =
      process.env.DODO_PAYMENTS_ENVIRONMENT === 'test'
        ? 'https://test.dodopayments.com'
        : 'https://live.dodopayments.com';

    const checkId = paymentId || record?.dodo_checkout_id || record?.dodo_payment_id;

    if (dodoApiKey && checkId) {
      // Check Dodo Payments API
      let response = await fetch(`${baseUrl}/payments/${checkId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${dodoApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        response = await fetch(`${baseUrl}/checkouts/${checkId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${dodoApiKey}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const session = await response.json();
        const status = String(session.status || session.payment_status || '').toLowerCase();
        const isConfirmed =
          status === 'succeeded' || status === 'successful' || status === 'completed';

        if (isConfirmed) {
          // Activate in database
          const targetTier = record?.tier || (session.metadata?.tier as string) || 'diamond';
          const durationDays = getDurationDaysForTier(targetTier);
          const now = new Date();
          const startsAt = now.toISOString();
          const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

          const targetId = record?.id || (session.metadata?.sponsorship_id as string);
          if (targetId) {
            record = await updateSponsorshipRecord(targetId, {
              payment_status: 'PAID',
              ad_status: 'ACTIVE',
              dodo_payment_id: session.payment_id || checkId,
              starts_at: startsAt,
              expires_at: expiresAt,
            });
          }

          return res.status(200).json({
            payment_success: true,
            status: 'ACTIVE',
            sponsorshipId: record?.id || targetId,
            placement: record?.placement || session.metadata?.placement,
            tier: record?.tier || session.metadata?.tier,
            companyName: record?.company_name || session.customer?.name || 'New Sponsor',
            description: record?.description || 'Supporting open-source UI transitions on Amicro.',
            siteUrl: record?.site_url || 'https://amicro.dev',
            logoUrl: record?.logo_url,
          });
        }
      }
    }

    // 4. Handle simulated test flow ONLY in non-production local development when keys are not configured
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const isSimulated = query.simulated === 'true';
    if (!isProduction && !dodoApiKey && isSimulated && record) {
      const durationDays = getDurationDaysForTier(record.tier);
      const now = new Date();
      record = await updateSponsorshipRecord(record.id, {
        payment_status: 'PAID',
        ad_status: 'ACTIVE',
        starts_at: now.toISOString(),
        expires_at: new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString(),
      });

      return res.status(200).json({
        payment_success: true,
        status: 'ACTIVE',
        sponsorshipId: record?.id,
        placement: record?.placement,
        tier: record?.tier,
        companyName: record?.company_name,
        description: record?.description,
        siteUrl: record?.site_url,
        logoUrl: record?.logo_url,
        simulated: true,
      });
    }

    // Still pending
    return res.status(200).json({
      payment_success: false,
      status: record?.payment_status || 'PENDING_PAYMENT',
      sponsorshipId: record?.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Checkout status handler error:', message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
