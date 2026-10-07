import { VercelRequest, VercelResponse } from '@vercel/node';
import { getAllSponsorships, updateSponsorshipRecord, getSponsorshipById } from '../lib/db';

const ALLOWED_ORIGINS = [
  'https://amicro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

function isAuthorized(req: VercelRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'amicro-admin-secret';
  const authHeader = (req.headers['x-admin-key'] as string) || '';
  const queryKey = (req.query.admin_key as string) || '';
  const authBearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  return (
    authHeader === adminSecret ||
    queryKey === adminSecret ||
    authBearer === adminSecret ||
    (process.env.NODE_ENV !== 'production' && !process.env.ADMIN_SECRET_KEY)
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, x-admin-key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify Admin authorization
  if (!isAuthorized(req)) {
    return res.status(401).json({
      error: 'Unauthorized. Valid admin credentials required to access sponsor review.',
    });
  }

  // GET: Fetch all sponsorships
  if (req.method === 'GET') {
    try {
      const sponsors = await getAllSponsorships();
      return res.status(200).json({ sponsors });
    } catch (err: unknown) {
      console.error('Admin get sponsors error:', err);
      return res.status(500).json({ error: 'Failed to fetch sponsorships' });
    }
  }

  // POST: Review action (Approve or Reject)
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ error: 'Invalid JSON payload' });
        }
      }

      const { sponsorshipId, action } = body || {};

      if (!sponsorshipId || !action) {
        return res.status(400).json({ error: 'sponsorshipId and action are required.' });
      }

      if (action !== 'approve' && action !== 'reject') {
        return res.status(400).json({ error: "Action must be 'approve' or 'reject'." });
      }

      const existing = await getSponsorshipById(sponsorshipId);
      if (!existing) {
        return res.status(404).json({ error: 'Sponsorship record not found.' });
      }

      const nowIso = new Date().toISOString();

      if (action === 'approve') {
        const updated = await updateSponsorshipRecord(sponsorshipId, {
          status: 'approved',
          ad_status: 'ACTIVE',
          approved_at: nowIso,
          starts_at: existing.starts_at || nowIso,
        });

        return res.status(200).json({
          success: true,
          action: 'approved',
          sponsorship: updated,
          message: 'Sponsorship approved! It will now appear on public sponsor placements.',
        });
      } else {
        const updated = await updateSponsorshipRecord(sponsorshipId, {
          status: 'rejected',
          ad_status: 'CANCELLED',
        });

        return res.status(200).json({
          success: true,
          action: 'rejected',
          sponsorship: updated,
          message: 'Sponsorship rejected.',
        });
      }
    } catch (err: unknown) {
      console.error('Admin sponsor action error:', err);
      return res.status(500).json({ error: 'Failed to update sponsorship status' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
