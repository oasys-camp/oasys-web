// netlify/functions/verify-session.js
// Verify Stripe checkout session and retrieve plaza details

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { session_id } = JSON.parse(event.body);

    if (!session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing session_id' })
      };
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Session not found' })
      };
    }

    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment not completed' })
      };
    }

    // Get plaza details from metadata
    const plazaNumber = session.metadata.plaza_number;
    const nif = session.metadata.nif;
    const fullName = session.metadata.full_name;
    const treeType = session.metadata.tree_type;
    const animalType = session.metadata.animal_type;

    // Get plaza details from Supabase
    const { data: plaza, error: plazaError } = await supabase
      .from('bsg_plazas')
      .select('*')
      .eq('numero_plaza', plazaNumber)
      .single();

    if (plazaError || !plaza) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Plaza not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        plaza_number: plazaNumber,
        nif: nif,
        full_name: fullName,
        tree_type: treeType,
        animal_type: animalType,
        payment_date: plaza.payment_date || session.created,
        amount: session.amount_total / 100,
        currency: session.currency,
        customer_email: session.customer_email || session.customer_details?.email,
        status: plaza.status
      })
    };

  } catch (error) {
    console.error('Error verifying session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify session' })
    };
  }
};