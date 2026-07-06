import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe ONLY if the API key is present.
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
// @ts-ignore
const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: '2024-04-10' }) : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, date, location, guests, message, tier, tierPrice, tierName } = body;

    // Simulate Stripe checkout flow if API keys are not configured yet
    if (!stripe) {
      console.log('Stripe API Key missing. Simulating checkout for:', tierName, tierPrice);
      // We simulate a small delay to mimic network request
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({
        url: '/?success=mock_stripe', // Redirect back to homepage with a mock success param
        message: 'Mock Stripe URL generated'
      });
    }

    // Actual Stripe Logic
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: tierName,
              description: `Consulenza Privata per ${name} - Data: ${date} - Location: ${location}`,
            },
            unit_amount: tierPrice * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/?success=true`,
      cancel_url: `${req.headers.get('origin')}/#contact`,
      customer_email: email,
      metadata: {
        name, phone, date, location, guests, message, tier
      }
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('Stripe error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
