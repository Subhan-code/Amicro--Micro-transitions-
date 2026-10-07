import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import {
  getSponsorshipById,
  getSponsorshipByPaymentId,
  updateSponsorshipRecord,
} from '../lib/db';
import { getDurationDaysForTier } from '../lib/pricing';

/**
 * Verify Dodo Payments webhook signature following Standard Webhooks spec:
 * https://standardwebhooks.com/
 */
function verifyWebhookSignature(
  rawBody: string,
  headers: {
    id?: string;
    timestamp?: string;
    signature?: string;
  },
  secretKey: string
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature || !secretKey) {
    return false;
  }

  // Prevent replay attacks: timestamp must be within 5 minutes (300 seconds)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const eventTimestamp = parseInt(timestamp, 10);
  if (isNaN(eventTimestamp) || Math.abs(currentTimestamp - eventTimestamp) > 300) {
    console.warn(`Webhook timestamp out of tolerance window: ${timestamp}`);
    return false;
  }

  // Normalize secret (strip whsec_ prefix if present)
  const normalizedKey = secretKey.startsWith('whsec_') ? secretKey.slice(6) : secretKey;

  const keyBuffer = Buffer.from(normalizedKey, 'base64');
  const signedPayload = `${id}.${timestamp}.${rawBody}`;

  const computedHmac = crypto
    .createHmac('sha256', keyBuffer)
    .update(signedPayload, 'utf8')
    .digest('base64');

  const expectedSignature = `v1,${computedHmac}`;

  // Signature header may contain multiple space-separated signatures (e.g. during secret rotation)
  const passedSignatures = signature.split(' ');
  for (const passedSig of passedSignatures) {
    try {
      const sigBuf = Buffer.from(passedSig);
      const expectedBuf = Buffer.from(expectedSignature);
      if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return true;
      }
    } catch {
      // Continue checking next signature
    }
  }

  return false;
}

export const config = {
  api: {
    bodyParser: false, // Access raw body for HMAC signature verification
  },
};

// Helper to buffer stream into string
async function getRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookId = (req.headers['webhook-id'] || req.headers['Webhook-Id']) as string | undefined;
  const webhookTimestamp = (req.headers['webhook-timestamp'] ||
    req.headers['Webhook-Timestamp']) as string | undefined;
  const webhookSignature = (req.headers['webhook-signature'] ||
    req.headers['Webhook-Signature']) as string | undefined;

  let rawBody: string;
  try {
    if (typeof req.body === 'string') {
      rawBody = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf8');
    } else if (req.body && typeof req.body === 'object') {
      rawBody = JSON.stringify(req.body);
    } else {
      rawBody = await getRawBody(req);
    }
  } catch (err) {
    console.error('Failed to read request body:', err);
    return res.status(400).json({ error: 'Cannot read body' });
  }

  const secretKey =
    process.env.DODO_PAYMENTS_WEBHOOK_KEY || process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

  if (secretKey) {
    const isValid = verifyWebhookSignature(
      rawBody,
      {
        id: webhookId,
        timestamp: webhookTimestamp,
        signature: webhookSignature,
      },
      secretKey
    );

    if (!isValid) {
      console.warn('Dodo Payments webhook signature verification failed.');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  } else {
    console.warn(
      'DODO_PAYMENTS_WEBHOOK_KEY is not configured. Skipping signature verification in dev/test mode.'
    );
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventType = payload.type || payload.event || payload.data?.event_type;
    const data = payload.data || payload;

    console.log(`[Dodo Webhook] Received verified event: ${eventType} (ID: ${webhookId})`);

    const payment = data;
    const metadata = payment.metadata || {};
    const paymentId = payment.payment_id || payment.id || data.payment_id || data.id;
    const internalSponsorshipId = (metadata.sponsorship_id || data.sponsorship_id) as
      | string
      | undefined;

    // Find the internal sponsorship record
    let record = internalSponsorshipId
      ? await getSponsorshipById(internalSponsorshipId)
      : null;

    if (!record && paymentId) {
      record = await getSponsorshipByPaymentId(paymentId);
    }

    switch (eventType) {
      case 'payment.succeeded': {
        if (!record) {
          console.warn(
            `[Dodo Webhook] Payment succeeded but no matching sponsorship found (paymentId: ${paymentId})`
          );
          // Return 200 acknowledged so Dodo does not continuously retry an unresolvable event
          return res.status(200).json({
            received: true,
            warning: 'No matching sponsorship found',
          });
        }

        // Idempotency check: If already paid or active, do not re-activate
        if (record.payment_status === 'PAID' && record.ad_status === 'ACTIVE') {
          console.log(
            `[Dodo Webhook] Sponsorship ${record.id} already active. Idempotent return.`
          );
          return res.status(200).json({
            received: true,
            already_processed: true,
            sponsorshipId: record.id,
          });
        }

        // Activate ad and record payment using the configured package duration
        const durationDays = getDurationDaysForTier(record.tier);
        const now = new Date();
        const startsAt = now.toISOString();
        const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

        const updated = await updateSponsorshipRecord(record.id, {
          payment_status: 'PAID',
          ad_status: 'ACTIVE',
          dodo_payment_id: paymentId,
          starts_at: startsAt,
          expires_at: expiresAt,
        });

        console.log(
          `[Dodo Webhook] Successfully activated sponsorship ${record.id} for ${record.company_name} on slot ${record.placement}`
        );

        return res.status(200).json({
          received: true,
          activated: true,
          sponsorshipId: record.id,
          placement: updated?.placement || record.placement,
        });
      }

      case 'payment.failed': {
        if (record) {
          await updateSponsorshipRecord(record.id, {
            payment_status: 'FAILED',
            dodo_payment_id: paymentId,
          });
          console.log(`[Dodo Webhook] Marked sponsorship ${record.id} as payment failed.`);
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        if (record) {
          await updateSponsorshipRecord(record.id, {
            ad_status: 'EXPIRED',
          });
          console.log(`[Dodo Webhook] Marked sponsorship ${record.id} as expired.`);
        }
        break;
      }

      default:
        console.log(`[Dodo Webhook] Handled event ${eventType}`);
        break;
    }

    return res.status(200).json({ received: true, id: webhookId });
  } catch (parseError) {
    console.error('Error parsing webhook payload:', parseError);
    return res.status(400).json({ error: 'Malformed JSON payload' });
  }
}
