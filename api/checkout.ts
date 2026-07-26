import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

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

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Amicro Sponsor Slot #${slotId}`,
              description: `${companyName} — ${description}`,
            },
            unit_amount: 4900, // $49.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?payment_success=true&slot_id=${slotId}&company_name=${encodeURIComponent(companyName)}&description=${encodeURIComponent(description)}&site_url=${encodeURIComponent(siteUrl)}`,
      cancel_url: `${origin}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
