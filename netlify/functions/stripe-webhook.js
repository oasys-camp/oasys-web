// netlify/functions/stripe-webhook.js
// Webhook handler for Stripe events - BSG Funnel Integration

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // nombre correcto en Netlify
);

// Resend para emails
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(stripeEvent.data.object);
      break;
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(stripeEvent.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(stripeEvent.data.object);
      break;
    case 'invoice.paid':
      await handleInvoicePaid(stripeEvent.data.object);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(stripeEvent.data.object);
      break;
    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};

// Handle successful checkout session
async function handleCheckoutCompleted(session) {
  console.log('Checkout session completed:', session.id);

  const { metadata, customer_email, customer_details } = session;

  // Extract BSG-specific metadata
  const plazaNumber = metadata.plaza_number;
  const nif = metadata.nif;
  const fullName = metadata.nombre;
  const treeType = metadata.especie_arbol;
  const animalType = metadata.especie_raza;
  const petName = metadata.mascota;
  const phone = metadata.telefono;
  const message = metadata.mensaje;

  try {
    // 1. Actualizar plaza en Supabase con columnas reales del schema
    const { data: plaza, error: supabaseError } = await supabase
      .from('bsg_plazas')
      .update({
        tipo: 'confirmada',
        nombre_fundador: fullName,
        nif: nif,
        email: customer_email || customer_details?.email,
        telefono: phone || '',
        nombre_mascota: petName,
        especie_raza: animalType,
        especie_arbol: treeType,
        nota: message || '',
        fecha_reserva: new Date().toISOString(),
        stripe_session_id: session.id
      })
      .eq('numero_plaza', parseInt(plazaNumber))
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw supabaseError;
    }

    console.log('Plaza confirmada en Supabase:', plaza?.numero_plaza);

    // 2. Enviar email de confirmación con Resend
    const numeroPlaza = plaza?.numero_plaza || plazaNumber;
    const expediente = 'BSG-' + String(numeroPlaza).padStart(3, '0');

    await resend.emails.send({
      from: 'El Bosque Sagrado <info@elbosquesagrado.org>',
      to: customer_email || customer_details?.email,
      subject: `${expediente} · Tu plaza en El Bosque Sagrado está confirmada`,
      html: `
        <div style="font-family: 'IBM Plex Mono', monospace; background: #060d08; color: #dce8e2; padding: 48px; max-width: 600px; margin: 0 auto;">
          <p style="font-size: 10px; color: #00D4AA; letter-spacing: 0.25em; text-transform: uppercase; margin-bottom: 32px;">
            EL BOSQUE SAGRADO · OASYS BASECAMP LAT 40°N
          </p>
          <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: white; margin-bottom: 16px;">
            Tu plaza está confirmada.
          </h1>
          <p style="font-size: 14px; color: rgba(220,232,226,0.7); line-height: 1.7; margin-bottom: 32px;">
            Hola ${fullName},<br><br>
            Hemos recibido tu pago de <strong style="color: #C9A84C;">450,00€</strong> correctamente.<br>
            Tu expediente es <strong style="color: #00D4AA;">${expediente}</strong>.
          </p>
          <div style="background: rgba(0,212,170,0.05); border: 1px solid rgba(0,212,170,0.2); padding: 24px; margin-bottom: 32px;">
            <p style="font-size: 9px; color: #00D4AA; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 16px;">DATOS DE TU PLAZA</p>
            <p style="font-size: 13px; color: #dce8e2; margin: 8px 0;">Árbol nominal: <strong>${treeType}</strong></p>
            <p style="font-size: 13px; color: #dce8e2; margin: 8px 0;">Mascota: <strong>${petName}</strong></p>
            <p style="font-size: 13px; color: #dce8e2; margin: 8px 0;">Expediente: <strong style="color: #00D4AA;">${expediente}</strong></p>
          </div>
          <p style="font-size: 12px; color: rgba(220,232,226,0.5); line-height: 1.7;">
            En las próximas 48h recibirás tu certificado digital, la ficha de tu Árbol y el contrato de servicio.<br><br>
            Yunclillos, Toledo · Tierra que da vida.
          </p>
          <p style="font-size: 10px; color: rgba(220,232,226,0.3); margin-top: 32px; letter-spacing: 0.1em;">
            OASYS BASECAMP LAT 40°N · elbosquesagrado.org
          </p>
        </div>
      `
    });

    console.log('Email de confirmación enviado a:', customer_email || customer_details?.email);

    // 3. Track conversion event
    await trackConversionEvent({
      event: 'bsg_purchase_completed',
      plazaNumber: numeroPlaza,
      amount: session.amount_total / 100,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Error handling checkout completed:', error);
    // Implement error handling/notifications
  }
}

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);

  // Update payment status in Supabase
  try {
    const { error } = await supabase
      .from('bsg_plazas')
      .update({
        payment_status: 'paid',
        payment_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating payment status:', error);
    }
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error);
  }
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent) {
  console.log('Payment failed:', paymentIntent.id);

  // Update payment status in Supabase
  try {
    const { error } = await supabase
      .from('bsg_plazas')
      .update({
        payment_status: 'failed',
        payment_error: paymentIntent.last_payment_error?.message,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating failed payment:', error);
    }

    // Send failed payment notification
    await sendFailedPaymentEmail({
      paymentIntentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message
    });

  } catch (error) {
    console.error('Error in handlePaymentFailed:', error);
  }
}

// Handle invoice payment (for subscriptions)
async function handleInvoicePaid(invoice) {
  console.log('Invoice paid:', invoice.id);

  // Handle recurring payments if needed
  // This is for future subscription-based BSG model
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id);

  // Handle subscription-based BSG model
  // This is for future expansion
}

// Helper function para notificación de pago fallido
async function sendFailedPaymentEmail(data) {
  console.log('Pago fallido:', data.paymentIntentId, data.error);
  // Notificación interna — implementar si se necesita
}

// Helper function to track conversion events
async function trackConversionEvent(data) {
  // Implement analytics tracking (Google Analytics 4, etc.)
  console.log('Tracking conversion event:', data);
  // TODO: Integrate with analytics service
}