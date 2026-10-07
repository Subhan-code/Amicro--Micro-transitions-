import { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createSponsorshipRecord,
  updateSponsorshipRecord,
  getSponsorshipByCheckoutId,
  SponsorshipTier,
} from '../lib/db';
import { getTierFromPolarProductId, getDurationDaysForTier } from '../lib/pricing';
import { notifyOwnerOfNewSponsor } from '../lib/notify';

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

    const checkoutId = body?.checkoutId || body?.checkout_id;
    const name = body?.name;
    const company = body?.company || body?.company_name;
    const website = body?.website || body?.site_url;
    const email = body?.email;
    const logoUrl = body?.logoUrl || body?.logo_url;
    const description = body?.description;
    const twitterUrl = body?.twitterUrl || body?.twitter_url;
    const githubUrl = body?.githubUrl || body?.github_url;
    const placement = body?.placement || 'silver';

    // 1. Mandatory checkoutId
    if (!checkoutId || typeof checkoutId !== 'string') {
      return res.status(400).json({ error: 'Missing checkout_id parameter.' });
    }

    const cleanCheckoutId = checkoutId.trim();

    // 2. Server-side verification of payment authenticity
    let tier: SponsorshipTier = 'silver';
    let price = 99;
    let polarOrderId: string | null = null;
    let polarProductId: string | null = null;

    const existingRecord = await getSponsorshipByCheckoutId(cleanCheckoutId);

    if (existingRecord) {
      tier = existingRecord.tier || 'silver';
      price = existingRecord.price || 99;
      polarOrderId = existingRecord.polar_order_id || null;
      polarProductId = existingRecord.polar_product_id || null;
    } else {
      // Verify with Polar API directly
      const polarToken = process.env.POLAR_ACCESS_TOKEN;
      let verifiedByPolar = false;

      if (polarToken) {
        const endpoints = [
          `https://api.polar.sh/v1/checkouts/custom/${cleanCheckoutId}`,
          `https://api.polar.sh/v1/checkouts/${cleanCheckoutId}`,
        ];

        for (const ep of endpoints) {
          try {
            const polarRes = await fetch(ep, {
              headers: {
                Authorization: `Bearer ${polarToken}`,
                Accept: 'application/json',
              },
            });
            if (polarRes.ok) {
              const session = await polarRes.json();
              const status = session.status;
              if (status === 'succeeded' || status === 'confirmed') {
                verifiedByPolar = true;
                polarOrderId = session.order_id || null;
                polarProductId = session.product_id || session.product?.id || null;
                const config = getTierFromPolarProductId(polarProductId || '');
                if (config) {
                  tier = config.id as SponsorshipTier;
                  price = config.price;
                }
                break;
              }
            }
          } catch (err) {
            console.warn('Polar verification call error:', err);
          }
        }
      }

      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
      if (!verifiedByPolar && (isProduction || (!cleanCheckoutId.includes('test') && !cleanCheckoutId.includes('simulated')))) {
        return res.status(402).json({
          error: "We couldn't verify an authorized paid checkout session for this sponsorship.",
        });
      }
    }

    // 3. Form Data Validations

    // Full Name (Required)
    const trimmedName = (name || '').trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({ error: 'Full Name is required (2–100 characters).' });
    }

    // Company / Project Name (Required)
    const trimmedCompany = (company || '').trim();
    if (!trimmedCompany || trimmedCompany.length < 2 || trimmedCompany.length > 100) {
      return res.status(400).json({ error: 'Company or Project Name is required (2–100 characters).' });
    }

    // Website URL (Required, normalized)
    const trimmedWebsite = (website || '').trim();
    let sanitizedWebsite = '';
    try {
      const parsedUrl = new URL(
        trimmedWebsite.startsWith('http://') || trimmedWebsite.startsWith('https://')
          ? trimmedWebsite
          : `https://${trimmedWebsite}`
      );
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
      sanitizedWebsite = parsedUrl.href;
    } catch {
      return res.status(400).json({ error: 'A valid Website URL is required (e.g. https://example.com).' });
    }

    // Email (Required, format check)
    const trimmedEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }

    // Logo (Required, validated format & size & SVG security sanitization)
    const trimmedLogo = (logoUrl || '').trim();
    if (!trimmedLogo) {
      return res.status(400).json({ error: 'A logo image is required for your sponsorship placement.' });
    }

    let sanitizedLogoUrl = trimmedLogo;
    if (trimmedLogo.startsWith('data:image/')) {
      // Validate data URI size (< 2MB)
      if (trimmedLogo.length > 2.5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Uploaded logo is too large. Maximum file size is 2MB.' });
      }

      // Security check for SVG: strip potential XSS / script tags
      if (trimmedLogo.startsWith('data:image/svg+xml')) {
        try {
          const rawBase64 = trimmedLogo.replace(/^data:image\/svg\+xml;base64,/, '');
          const decodedSvg = Buffer.from(rawBase64, 'base64').toString('utf-8');
          if (
            /<script/i.test(decodedSvg) ||
            /javascript:/i.test(decodedSvg) ||
            /<foreignObject/i.test(decodedSvg) ||
            /on\w+\s*=/i.test(decodedSvg)
          ) {
            return res.status(400).json({
              error: 'Invalid SVG logo: Executable scripts and handlers are not allowed.',
            });
          }
        } catch {
          // If decoding fails, continue safely
        }
      }
    } else {
      try {
        const parsedLogoUrl = new URL(trimmedLogo);
        if (parsedLogoUrl.protocol !== 'http:' && parsedLogoUrl.protocol !== 'https:') {
          throw new Error('Invalid logo URL protocol');
        }
      } catch {
        return res.status(400).json({ error: 'Invalid logo format or URL.' });
      }
    }

    // Short Description (Optional, max 250 characters)
    const trimmedDesc = (description || '').trim();
    if (trimmedDesc.length > 250) {
      return res.status(400).json({ error: 'Description must be under 250 characters.' });
    }

    // X / Twitter URL (Optional)
    let sanitizedTwitterUrl: string | null = null;
    const trimmedTwitter = (twitterUrl || '').trim();
    if (trimmedTwitter) {
      try {
        const handle = trimmedTwitter.replace(/^@/, '');
        const twitterFormatted =
          trimmedTwitter.startsWith('http://') || trimmedTwitter.startsWith('https://')
            ? trimmedTwitter
            : `https://x.com/${handle}`;
        const parsedX = new URL(twitterFormatted);
        sanitizedTwitterUrl = parsedX.href;
      } catch {
        return res.status(400).json({ error: 'Invalid X / Twitter profile URL.' });
      }
    }

    // GitHub URL (Optional)
    let sanitizedGithubUrl: string | null = null;
    const trimmedGithub = (githubUrl || '').trim();
    if (trimmedGithub) {
      try {
        const handle = trimmedGithub.replace(/^@/, '');
        const ghFormatted =
          trimmedGithub.startsWith('http://') || trimmedGithub.startsWith('https://')
            ? trimmedGithub
            : `https://github.com/${handle}`;
        const parsedGh = new URL(ghFormatted);
        sanitizedGithubUrl = parsedGh.href;
      } catch {
        return res.status(400).json({ error: 'Invalid GitHub profile URL.' });
      }
    }

    // 4. Save to Database: status = 'pending_review', payment_status = 'paid'
    const nowIso = new Date().toISOString();
    const durationDays = getDurationDaysForTier(tier);
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();
    const sanitizedPlacement = String(placement || tier).trim().slice(0, 50);

    let savedRecord;

    if (existingRecord) {
      savedRecord = await updateSponsorshipRecord(existingRecord.id, {
        name: trimmedName,
        company: trimmedCompany,
        company_name: trimmedCompany,
        website: sanitizedWebsite,
        site_url: sanitizedWebsite,
        email: trimmedEmail,
        logo_url: sanitizedLogoUrl,
        description: trimmedDesc || 'Amicro OSS Sponsor',
        twitter_url: sanitizedTwitterUrl,
        github_url: sanitizedGithubUrl,
        placement: sanitizedPlacement,
        checkout_id: cleanCheckoutId,
        polar_checkout_id: cleanCheckoutId,
        polar_order_id: polarOrderId || existingRecord.polar_order_id,
        polar_product_id: polarProductId || existingRecord.polar_product_id,
        payment_status: 'paid',
        status: 'pending_review',
        ad_status: 'PENDING',
        updated_at: nowIso,
      });
    } else {
      const newId = `spn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      savedRecord = await createSponsorshipRecord({
        id: newId,
        checkout_id: cleanCheckoutId,
        polar_checkout_id: cleanCheckoutId,
        polar_order_id: polarOrderId,
        polar_product_id: polarProductId,
        tier,
        placement: sanitizedPlacement,
        name: trimmedName,
        company: trimmedCompany,
        company_name: trimmedCompany,
        website: sanitizedWebsite,
        site_url: sanitizedWebsite,
        email: trimmedEmail,
        logo_url: sanitizedLogoUrl,
        description: trimmedDesc || 'Amicro OSS Sponsor',
        twitter_url: sanitizedTwitterUrl,
        github_url: sanitizedGithubUrl,
        price,
        currency: 'USD',
        payment_status: 'paid',
        status: 'pending_review',
        ad_status: 'PENDING',
        created_at: nowIso,
        updated_at: nowIso,
        starts_at: nowIso,
        expires_at: expiresAt,
      });
    }

    // 5. Notify Amicro Owner
    const requestHost = req.headers['x-forwarded-host'] || req.headers.host || 'amicro.dev';
    const requestProto = (req.headers['x-forwarded-proto'] as string) || (requestHost.includes('localhost') ? 'http' : 'https');
    const adminUrl = `${requestProto}://${requestHost}/admin/sponsors`;

    if (savedRecord) {
      notifyOwnerOfNewSponsor(savedRecord, adminUrl).catch((err) =>
        console.warn('Async notification dispatch error:', err)
      );
    }

    return res.status(200).json({
      success: true,
      status: 'pending_review',
      sponsorshipId: savedRecord ? savedRecord.id : existingRecord?.id,
      tier,
      message: 'Sponsorship submitted successfully. Awaiting review.',
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown server error';
    console.error('Submit sponsorship error:', msg);
    return res.status(500).json({ error: 'Internal server error submitting sponsorship' });
  }
}
