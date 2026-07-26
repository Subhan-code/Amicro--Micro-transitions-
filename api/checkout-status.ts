import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { checkout_id } = req.query;

  if (!checkout_id || typeof checkout_id !== 'string') {
    return res.status(400).json({ error: 'Missing checkout_id parameter' });
  }

  try {
    const polarToken = process.env.POLAR_ACCESS_TOKEN;

    if (!polarToken) {
      throw new Error('Polar POLAR_ACCESS_TOKEN is not configured.');
    }

    // Call Polar API to retrieve checkout session details
    const response = await fetch(`https://api.polar.sh/v1/checkouts/${checkout_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${polarToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Polar API Error: ${errorText}`);
    }

    const session = await response.json();

    // Extract custom fields values
    const customData = session.custom_field_data || {};
    
    // Fuzzy search for custom field labels/slugs
    const getFuzzyKey = (keywords: string[]) => {
      const keys = Object.keys(customData);
      for (const k of keys) {
        const lowerK = k.toLowerCase();
        if (keywords.some(kw => lowerK.includes(kw))) {
          return customData[k];
        }
      }
      return null;
    };

    const companyName = getFuzzyKey(['company', 'brand', 'name']) || 'New Sponsor';
    const description = getFuzzyKey(['description', 'tagline', 'text']) || 'Advertise your product here.';
    const siteUrl = getFuzzyKey(['url', 'website', 'redirect', 'site']) || 'https://polar.sh';

    const isConfirmed = session.status === 'confirmed' || session.status === 'succeeded';

    return res.status(200).json({
      payment_success: isConfirmed,
      companyName,
      description,
      siteUrl,
    });
  } catch (error: any) {
    console.error('Polar Checkout Status Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
