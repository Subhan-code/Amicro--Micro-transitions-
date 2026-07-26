import { VercelRequest, VercelResponse } from '@vercel/node';

// Allow-list of domains that may call this API
const ALLOWED_ORIGINS = [
  'https://amicro.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';

  // Strict CORS — only allow the production URL and local dev
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { checkout_id } = req.query;

  // Validate + sanitize: Polar checkout IDs are alphanumeric with hyphens/underscores only
  if (
    !checkout_id ||
    typeof checkout_id !== 'string' ||
    !/^[a-zA-Z0-9_-]{10,128}$/.test(checkout_id)
  ) {
    return res.status(400).json({ error: 'Invalid or missing checkout_id parameter' });
  }

  const polarToken = process.env.POLAR_ACCESS_TOKEN;

  if (!polarToken) {
    console.error('POLAR_ACCESS_TOKEN is not set in environment variables.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Safely call Polar API — checkout_id is validated above
    const response = await fetch(`https://api.polar.sh/v1/checkouts/${checkout_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${polarToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Polar API Error (${response.status}): ${errorText}`);
      // Return a generic error — don't leak Polar API details to clients
      return res.status(response.status === 404 ? 404 : 502).json({
        error: response.status === 404 ? 'Checkout session not found' : 'Payment provider error',
      });
    }

    const session = await response.json();

    // Only confirm if Polar reports payment as confirmed
    const isConfirmed = session.status === 'confirmed' || session.status === 'succeeded';

    if (!isConfirmed) {
      return res.status(200).json({ payment_success: false });
    }

    // Extract custom fields values (fuzzy key matching for flexibility)
    const customData: Record<string, string> = session.custom_field_data || {};

    const getFuzzyKey = (keywords: string[]): string | null => {
      for (const k of Object.keys(customData)) {
        const lowerK = k.toLowerCase();
        if (keywords.some(kw => lowerK.includes(kw))) {
          return String(customData[k]);
        }
      }
      return null;
    };

    // Safely extract, sanitize, and cap field lengths
    const companyName = (getFuzzyKey(['company', 'brand', 'name']) || 'New Sponsor').slice(0, 60);
    const description = (getFuzzyKey(['description', 'tagline', 'text']) || 'Advertise your product here.').slice(0, 100);
    const rawSiteUrl = getFuzzyKey(['url', 'website', 'redirect', 'site']) || 'https://polar.sh';

    // Validate the URL — only allow http/https
    let siteUrl = 'https://polar.sh';
    try {
      const parsed = new URL(rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        siteUrl = parsed.href;
      }
    } catch {
      // Keep fallback
    }

    return res.status(200).json({
      payment_success: true,
      companyName,
      description,
      siteUrl,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Checkout status handler error:', message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
