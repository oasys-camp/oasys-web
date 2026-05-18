// netlify/functions/create-checkout.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);

    // Validate required fields (nombres reales del formulario)
    if (!data.nombre || !data.email || !data.mascota || !data.nif) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios: nombre, email, mascota, nif' })
      };
    }

    // Buscar primera plaza libre disponible automaticamente
    const { data: plazas, error: plazaError } = await supabase
      .from('bsg_plazas')
      .select('*')
      .eq('tipo', 'libre')
      .order('numero_plaza', { ascending: true })
      .limit(1);

    if (plazaError || !plazas || plazas.length === 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'No hay plazas disponibles en este momento' })
      };
    }

    const plaza = plazas[0];
    const plazaNumber = plaza.numero_plaza;

    // Crear sesion Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Plaza BSG #${plazaNumber} · El Bosque Sagrado`,
            description: `Plaza fundadora · Mascota: ${data.mascota} · Arbol: ${data.especie_arbol || 'Sin preferencia'}`,
          },
          unit_amount: 45000,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/cancel.html`,
      customer_email: data.email,
      metadata: {
        plaza_number: String(plazaNumber),
        nif: data.nif,
        nombre: data.nombre,
        domicilio: data.domicilio || '',
        telefono: data.telefono || '',
        mascota: data.mascota,
        especie_raza: data.especie_raza || '',
        especie_arbol: data.especie_arbol || '',
        peso: data.peso || '',
        mensaje: data.mensaje || '',
        source: 'elbosquesagrado.org'
      },
      billing_address_collection: 'auto',
      allow_promotion_codes: false,
    });

    // Reservar plaza: libre -> pendiente
    await supabase
      .from('bsg_plazas')
      .update({
        tipo: 'pendiente',
        email: data.email,
        nombre_fundador: data.nombre,
        nombre_mascota: data.mascota,
        especie_raza: data.especie_raza || null,
        especie_arbol: data.especie_arbol || null,
        fecha_reserva: new Date().toISOString(),
        stripe_session_id: session.id
      })
      .eq('numero_plaza', plazaNumber);

    console.log(`Plaza ${plazaNumber} reservada para ${data.email} - session ${session.id}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id, url: session.url, plazaNumber })
    };

  } catch (error) {
    console.error('Error create-checkout:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear la sesion de pago' })
    };
  }
};
