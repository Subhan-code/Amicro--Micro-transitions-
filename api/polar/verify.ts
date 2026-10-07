import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSponsorshipByPolarCheckout, isPlacementOccupied } from '../lib/db';
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const checkoutId = (req.query.checkout_id as string) || '';
  if (!checkoutId || checkoutId.trim().length === 0) {
    return res.status(400).json({ valid: false, error: 'Missing checkout_id parameter.' });
  }

  const cleanCheckoutId = checkoutId.trim();

  try {
    // 1. Check if database already has a verified record for this Polar checkout
    const existingRecord = await getSponsorshipByPolarCheckout(cleanCheckoutId);
    if (existingRecord) {
      const isPaid = existingRecord.payment_status === 'PAID';
      const isAlreadyClaimed = existingRecord.ad_status === 'ACTIVE';

      if (isAlreadyClaimed) {
        return res.status(409).json({
          valid: false,
          alreadyClaimed: true,
          error: 'This sponsorship checkout has already been claimed and activated.',
        });
      }

      if (isPaid) {
        return res.status(200).json({
          valid: true,
          sponsorshipId: existingRecord.id,
          checkoutId: cleanCheckoutId,
          tier: existingRecord.tier,
          price: existingRecord.price,
          customerEmail: existingRecord.email,
          customerName: existingRecord.company_name,
          alreadyClaimed: false,
          placement: existingRecord.placement,
        });
      } else {
        return res.status(402).json({
          valid: false,
          alreadyClaimed: false,
          error: 'Payment has not been completed for this checkout session.',
        });
      }
    }

    // 2. Query Polar API directly with POLAR_ACCESS_TOKEN
    const polarToken = process.env.POLAR_ACCESS_TOKEN;
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
          const status = session.status;

          if (status === 'expired') {
            return res.status(410).json({
              valid: false,
              status,
              error: 'This Polar checkout session has expired.',
            });
          }

          if (status === 'failed') {
            return res.status(400).json({
              valid: false,
              status,
              error: 'This Polar checkout payment failed.',
            });
          }

          const isSucceeded = status === 'succeeded' || status === 'confirmed';
          if (!isSucceeded) {
            return res.status(402).json({
              valid: false,
              status,
              error: 'This Polar checkout session has not been completed or paid yet.',
            });
          }

          // Check if session.id already claimed in database
          if (session.id && session.id !== cleanCheckoutId) {
            const dbCheck = await getSponsorshipByPolarCheckout(session.id);
            if (dbCheck && dbCheck.ad_status === 'ACTIVE') {
              return res.status(409).json({
                valid: false,
                alreadyClaimed: true,
                error: 'This sponsorship checkout has already been claimed and activated.',
              });
            }
          }

          const productId =
            session.product_id ||
            session.product?.id ||
            (session.items && session.items[0]?.product_id) ||
            '';

          const tierConfig = getTierFromPolarProductId(productId);
          const tier = (session.metadata?.tier || tierConfig?.id || 'diamond') as string;
          const price = tierConfig ? tierConfig.price : 250;

          return res.status(200).json({
            valid: true,
            checkoutId: cleanCheckoutId,
            tier,
            price,
            customerEmail: session.customer_email || session.customer?.email || '',
            customerName: session.customer?.name || '',
            alreadyClaimed: false,
          });
        } else if (polarRes.status === 404) {
          return res.status(404).json({
            valid: false,
            error: 'Checkout session not found on Polar.',
          });
        }
      } catch (polarErr) {
        console.warn('Polar API check error:', polarErr);
      }
    }

    // 3. Fallback for local development or testing with simulated checkout ID
    if (cleanCheckoutId.includes('test') || cleanCheckoutId.includes('simulated')) {
      return res.status(200).json({
        valid: true,
        checkoutId: cleanCheckoutId,
        tier: 'diamond',
        price: 250,
        customerEmail: 'sponsor@example.com',
        customerName: 'Test Sponsor',
        alreadyClaimed: false,
        note: 'Simulated verification for development.',
      });
    }

    return res.status(404).json({
      valid: false,
      error: 'Unverified checkout session. Please ensure your Polar checkout payment completed.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Verify checkout error:', msg);
    return res.status(500).json({ valid: false, error: 'Internal server error verifying checkout' });
  }
}
