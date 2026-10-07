import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import {
  createSponsorshipRecord,
  updateSponsorshipRecord,
  getSponsorshipByPolarCheckout,
  SponsorshipTier,
} from '../lib/db';
import { getTierFromPolarProductId, getDurationDaysForTier } from '../lib/pricing';

/**
 * Verifies the Polar webhook HMAC signature (Standard Webhooks specification).
 */
function verifyPolarWebhook(
  rawBody: string,
  headers: Record<string, string | string[] | undefined>,
  secret: string
): boolean {
  try {
    const webhookId = (headers['webhook-id'] || headers['Webhook-Id']) as string;
    const webhookTimestamp = (headers['webhook-timestamp'] || headers['Webhook-Timestamp']) as string;
    const webhookSignature = (headers['webhook-signature'] || headers['Webhook-Signature']) as string;

    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      return false;
    }

    // Protect against replay attacks (5 minute threshold)
    const timestampSec = parseInt(webhookTimestamp, 10);
    const nowSec = Math.floor(Date.now() / 1000);
    if (isNaN(timestampSec) || Math.abs(nowSec - timestampSec) > 300) {
      console.warn('Polar webhook timestamp out of tolerance window');
      return false;
    }

    // Decode secret key (Standard Webhooks whsec_ base64 prefix)
    const secretKey = secret.startsWith('whsec_')
      ? Buffer.from(secret.slice(6), 'base64')
      : Buffer.from(secret, 'utf-8');

    const signedPayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
    const expectedHash = crypto
      .createHmac('sha256', secretKey)
      .update(signedPayload)
      .digest('base64');

    // Signatures may be multiple space-separated: "v1,abc... v1,def..."
    const passedSignatures = webhookSignature.split(' ');
    for (const item of passedSignatures) {
      const parts = item.split(',');
      if (parts.length === 2 && parts[0] === 'v1') {
        const passedHash = parts[1];
        try {
          if (
            crypto.timingSafeEqual(
              Buffer.from(expectedHash, 'base64'),
              Buffer.from(passedHash, 'base64')
            )
          ) {
            return true;
          }
        } catch {
          // If buffer lengths differ, timingSafeEqual throws
        }
      }
    }

    return false;
  } catch (err) {
    console.error('Webhook verification error:', err);
    return false;
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to buffer request body for exact cryptographic validation
async function getRawBody(req: VercelRequest): Promise<string> {
  if ((req as any).rawBody && typeof (req as any).rawBody === 'string') return (req as any).rawBody;
  if (typeof req.body === 'string') return req.body;
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body);

  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'));
    });
    req.on('error', reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  let rawBody = '';

  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    return res.status(400).json({ error: 'Failed to read request body' });
  }

  // Cryptographic Signature Validation
  if (webhookSecret) {
    const isValid = verifyPolarWebhook(rawBody, req.headers, webhookSecret);
    if (!isValid) {
      console.warn('Polar webhook signature verification failed.');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  } else {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    if (isProduction) {
      console.error('POLAR_WEBHOOK_SECRET is not configured in production.');
      return res.status(500).json({ error: 'Server misconfiguration: POLAR_WEBHOOK_SECRET is required.' });
    }
    
    // In dev, if signature header is provided, strictly verify it using dev test secret
    const passedSig = (req.headers['webhook-signature'] || req.headers['Webhook-Signature']) as string;
    if (passedSig) {
      const devSecret = 'whsec_test_secret_for_polar_webhooks';
      const isValid = verifyPolarWebhook(rawBody, req.headers, devSecret);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    } else {
      console.warn('POLAR_WEBHOOK_SECRET is not set and no signature header sent. Allowing in dev.');
    }
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  const eventType = event.type || event.event;
  console.log(`Processing Polar webhook event: ${eventType}`);

  try {
    const data = event.data || {};
    
    // Extract checkout or order details
    const checkoutId = data.checkout_id || data.id;
    const orderId = data.order_id || (eventType.startsWith('order.') ? data.id : null);
    const productId = data.product_id || data.product?.id || (data.items && data.items[0]?.product_id);
    const customerEmail = data.customer?.email || data.customer_email || data.user?.email || '';
    const customerName = data.customer?.name || data.customer_name || '';
    const metadata = data.metadata || data.custom_field_data || {};

    const tierConfig = getTierFromPolarProductId(productId);
    const tier = (metadata.tier || tierConfig?.id || 'diamond') as SponsorshipTier;

    // Handle payment completion
    const isPaid =
      eventType === 'order.created' ||
      eventType === 'order.paid' ||
      (eventType === 'checkout.updated' && (data.status === 'succeeded' || data.status === 'confirmed'));

    if (isPaid && checkoutId) {
      const existing = await getSponsorshipByPolarCheckout(checkoutId);
      const nowIso = new Date().toISOString();
      const durationDays = getDurationDaysForTier(tier);
      const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

      if (existing) {
        await updateSponsorshipRecord(existing.id, {
          payment_status: 'paid',
          checkout_id: checkoutId,
          polar_checkout_id: checkoutId,
          polar_order_id: orderId || existing.polar_order_id,
          updated_at: nowIso,
        });
      } else {
        // Create initial verified record ready for onboarding claim
        const sponsorshipId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        await createSponsorshipRecord({
          id: sponsorshipId,
          placement: metadata.placement || tier,
          tier,
          name: customerName || 'Sponsor',
          company: customerName || 'Sponsor',
          company_name: customerName || 'Sponsor',
          description: 'Sponsorship via Polar',
          website: 'https://polar.sh',
          site_url: 'https://polar.sh',
          email: customerEmail,
          price: tierConfig ? tierConfig.price : 99,
          currency: 'USD',
          payment_status: 'paid',
          status: 'pending_review',
          ad_status: 'PENDING', // Awaiting details from intake onboarding page
          checkout_id: checkoutId,
          polar_checkout_id: checkoutId,
          polar_order_id: orderId,
          polar_product_id: productId,
          created_at: nowIso,
          updated_at: nowIso,
          starts_at: nowIso,
          expires_at: expiresAt,
        });
      }
    } else if (
      (eventType === 'order.refunded' ||
        eventType === 'refund.created' ||
        eventType === 'checkout.canceled' ||
        eventType === 'subscription.canceled') &&
      checkoutId
    ) {
      const existing = await getSponsorshipByPolarCheckout(checkoutId);
      if (existing) {
        const nowIso = new Date().toISOString();
        await updateSponsorshipRecord(existing.id, {
          payment_status: 'refunded',
          status: 'cancelled',
          ad_status: 'CANCELLED',
          updated_at: nowIso,
        });
      }
    }

    return res.status(200).json({ received: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown webhook error';
    console.error('Polar webhook processing error:', msg);
    return res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}
