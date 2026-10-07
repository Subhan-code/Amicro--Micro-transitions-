import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSponsorshipByCheckoutId } from '../lib/db';
import { getTierFromPolarProductId } from '../lib/pricing';

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
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  const checkoutId = (req.query.checkout_id as string) || '';
  if (!checkoutId || checkoutId.trim().length === 0) {
    return res.status(400).json({ valid: false, error: 'Missing checkout_id query parameter.' });
  }

  const cleanCheckoutId = checkoutId.trim();

  try {
    // 1. Check if database already has a record for this Polar checkout
    const existingRecord = await getSponsorshipByCheckoutId(cleanCheckoutId);
    if (existingRecord) {
      const isPaid =
        existingRecord.payment_status === 'paid' ||
        existingRecord.payment_status === 'PAID';

      const isAlreadySubmitted =
        existingRecord.status === 'pending_review' ||
        existingRecord.status === 'approved' ||
        existingRecord.ad_status === 'ACTIVE';

      if (isAlreadySubmitted && existingRecord.name && existingRecord.website) {
        return res.status(200).json({
          valid: true,
          alreadySubmitted: true,
          checkoutId: cleanCheckoutId,
          sponsorshipId: existingRecord.id,
          tier: existingRecord.tier,
          status: existingRecord.status || 'pending_review',
          paymentStatus: existingRecord.payment_status,
          name: existingRecord.name,
          company: existingRecord.company || existingRecord.company_name,
          website: existingRecord.website || existingRecord.site_url,
          email: existingRecord.email,
          description: existingRecord.description,
          logoUrl: existingRecord.logo_url,
          twitterUrl: existingRecord.twitter_url,
          githubUrl: existingRecord.github_url,
        });
      }

      if (isPaid) {
        return res.status(200).json({
          valid: true,
          alreadySubmitted: false,
          checkoutId: cleanCheckoutId,
          sponsorshipId: existingRecord.id,
          tier: existingRecord.tier,
          customerEmail: existingRecord.email,
          customerName: existingRecord.name || existingRecord.company || existingRecord.company_name,
          paymentStatus: 'paid',
        });
      } else {
        return res.status(402).json({
          valid: false,
          paymentNotCompleted: true,
          error: 'Your sponsorship payment has not been completed.',
        });
      }
    }

    // 2. Server-side verification with Polar API using private credentials
    const polarToken = process.env.POLAR_ACCESS_TOKEN;
    if (polarToken) {
      let sessionData: any = null;

      // Try custom checkout endpoint first, fallback to standard checkouts endpoint
      const endpoints = [
        `https://api.polar.sh/v1/checkouts/custom/${cleanCheckoutId}`,
        `https://api.polar.sh/v1/checkouts/${cleanCheckoutId}`,
      ];

      for (const endpoint of endpoints) {
        try {
          const polarRes = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${polarToken}`,
              Accept: 'application/json',
            },
          });
          if (polarRes.ok) {
            sessionData = await polarRes.json();
            break;
          }
        } catch (fetchErr) {
          console.warn(`Polar API fetch error at ${endpoint}:`, fetchErr);
        }
      }

      if (sessionData) {
        const checkoutStatus = sessionData.status;

        if (checkoutStatus === 'expired') {
          return res.status(410).json({
            valid: false,
            error: 'This Polar checkout session has expired.',
          });
        }

        if (checkoutStatus === 'failed' || checkoutStatus === 'cancelled') {
          return res.status(400).json({
            valid: false,
            error: 'This Polar checkout payment was cancelled or failed.',
          });
        }

        const isCompleted =
          checkoutStatus === 'succeeded' ||
          checkoutStatus === 'confirmed';

        if (!isCompleted) {
          return res.status(402).json({
            valid: false,
            paymentNotCompleted: true,
            error: 'Your sponsorship payment has not been completed.',
          });
        }

        // Determine tier from Polar product ID
        const productId =
          sessionData.product_id ||
          sessionData.product?.id ||
          (sessionData.items && sessionData.items[0]?.product_id) ||
          '';

        const tierConfig = getTierFromPolarProductId(productId);
        const tier = (sessionData.metadata?.tier || tierConfig?.id || 'silver') as string;

        const customerEmail =
          sessionData.customer_email ||
          sessionData.customer?.email ||
          '';

        const customerName =
          sessionData.customer_name ||
          sessionData.customer?.name ||
          '';

        return res.status(200).json({
          valid: true,
          alreadySubmitted: false,
          checkoutId: cleanCheckoutId,
          polarOrderId: sessionData.order_id || null,
          polarProductId: productId,
          tier,
          customerEmail,
          customerName,
          paymentStatus: 'paid',
        });
      }
    }

    // 3. Fallback for testing in development with simulated or test checkout IDs (strictly disabled in production)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    if (
      !isProduction &&
      (cleanCheckoutId.includes('test') || cleanCheckoutId.includes('simulated'))
    ) {
      return res.status(200).json({
        valid: true,
        alreadySubmitted: false,
        checkoutId: cleanCheckoutId,
        tier: 'silver',
        customerEmail: 'sponsor@example.com',
        customerName: 'Silver Sponsor Partner',
        paymentStatus: 'paid',
        devNotice: 'Simulated development verification (no Polar credentials configured).',
      });
    }

    return res.status(404).json({
      valid: false,
      error: "We couldn't verify your sponsorship payment.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Verify checkout error:', msg);
    return res.status(500).json({
      valid: false,
      error: "We couldn't verify your sponsorship payment.",
    });
  }
}
