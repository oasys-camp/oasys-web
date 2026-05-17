// netlify/functions/create-checkout.js
// Create Stripe checkout session for BSG plaza purchase

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // nombre correcto en Netlify
);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['plazaNumber', 'nif', 'fullName', 'email', 'treeType', 'animalType', 'petName'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing required field: ${field}` })
        };
      }
    }

    // Validate NIF format
    if (!isValidNIF(data.nif)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid NIF format' })
      };
    }

    // Check if plaza is available
    const { data: plaza, error: plazaError } = await supabase
      .from('bsg_plazas')
      .select('*')
      .eq('numero_plaza', data.plazaNumber)  // columna real en schema
      .single();

    if (plazaError || !plaza) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Plaza not found' })
      };
    }

    if (plaza.tipo !== 'libre') {  // valor real en schema: libre/pendiente/confirmada
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Plaza is not available' })
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Plaza BSG #${data.plazaNumber} - ${data.treeType} + ${data.animalType}`,
              description: `Plaza fundadora del Bosque Sagrado - Árbol: ${data.treeType}, Animal: ${data.animalType}, Mascota: ${data.petName}`,
              images: ['https://oasys.earth/images/bsg-plaza.jpg'],
              metadata: {
                plaza_number: data.plazaNumber,
                tree_type: data.treeType,
                animal_type: data.animalType,
                pet_name: data.petName
              }
            },
            unit_amount: 45000, // 450€ in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/bsg/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/bsg/cancel?plaza=${data.plazaNumber}`,
      customer_email: data.email,
      metadata: {
        plaza_number: data.plazaNumber,
        nif: data.nif,
        full_name: data.fullName,
        tree_type: data.treeType,
        animal_type: data.animalType,
        pet_name: data.petName,
        phone: data.phone || '',
        message: data.message || '',
        source: 'oasys-web'
      },
      billing_address_collection: 'required',
      customer_creation: 'always',
      phone_number_collection: {
        enabled: true
      },
      allow_promotion_codes: false,
      payment_intent_data: {
        metadata: {
          plaza_number: data.plazaNumber,
          nif: data.nif,
          full_name: data.fullName
        }
      }
    });

    // Marcar plaza como pendiente (transición: libre → pendiente)
    await supabase
      .from('bsg_plazas')
      .update({
        tipo: 'pendiente',           // valor real en schema
        email: data.email,
        fecha_reserva: new Date().toISOString(),
        stripe_session_id: session.id
      })
      .eq('numero_plaza', data.plazaNumber);  // columna real en schema

    // Track funnel event
    await trackFunnelEvent({
      event: 'checkout_initiated',
      plazaNumber: data.plazaNumber,
      sessionId: session.id,
      email: data.email
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    };
  }
};

// NIF validation function
function isValidNIF(nif) {
  // Remove any spaces or hyphens
  const cleanNIF = nif.replace(/[\s-]/g, '').toUpperCase();

  // Check if it's 8 or 9 characters
  if (cleanNIF.length < 8 || cleanNIF.length > 9) {
    return false;
  }

  // Check if it matches the pattern: 8 digits + 1 letter
  const nifRegex = /^[0-9]{8}[A-Z]$/;
  return nifRegex.test(cleanNIF);
}

// Track funnel events
async function trackFunnelEvent(data) {
  console.log('Tracking funnel event:', data);
  // TODO: Integrate with Google Analytics 4
  // TODO: Track in Supabase analytics table
}