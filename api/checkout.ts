import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slotId, companyName, description, siteUrl } = req.body;

    if (!slotId || !companyName || !description || !siteUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Determine the base origin URL for callbacks
    const origin = req.headers.origin || 'http://localhost:5173';

    const polarToken = process.env.POLAR_ACCESS_TOKEN;
    const polarPriceId = process.env.POLAR_PRICE_ID;

    if (!polarToken || !polarPriceId) {
      throw new Error('Polar environment variables POLAR_ACCESS_TOKEN or POLAR_PRICE_ID are not configured.');
    }

    // Create Polar Checkout Session
    const response = await fetch('https://api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${polarToken}`,
      },
      body: JSON.stringify({
        product_price_id: polarPriceId,
        success_url: `${origin}/?payment_success=true&slot_id=${slotId}&company_name=${encodeURIComponent(companyName)}&description=${encodeURIComponent(description)}&site_url=${encodeURIComponent(siteUrl)}`,
        metadata: {
          slotId: String(slotId),
          companyName,
          description,
          siteUrl,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Polar API Error: ${errorText}`);
    }

    const session = await response.json();
    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Polar Checkout Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
