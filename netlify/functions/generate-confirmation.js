// netlify/functions/generate-confirmation.js
// Generate confirmation document similar to Lolo's confirmation

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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
    const { plaza_number } = JSON.parse(event.body);

    if (!plaza_number) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing plaza_number' })
      };
    }

    // Get plaza details from Supabase
    const { data: plaza, error: plazaError } = await supabase
      .from('bsg_plazas')
      .select('*')
      .eq('plaza_number', plaza_number)
      .single();

    if (plazaError || !plaza) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Plaza not found' })
      };
    }

    // Generate HTML confirmation document
    const html = generateConfirmationHTML(plaza);

    // Save document to Supabase Storage
    const filename = `confirmacion_plaza${plaza_number}_${plaza.pet_name?.toLowerCase().replace(/\s+/g, '_') || 'mascota'}.html`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bsg-confirmations')
      .upload(filename, html, {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading confirmation:', uploadError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to upload confirmation document' })
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('bsg-confirmations')
      .getPublicUrl(filename);

    // Update plaza record with confirmation URL
    await supabase
      .from('bsg_plazas')
      .update({
        confirmation_url: publicUrlData.publicUrl,
        confirmation_generated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('plaza_number', plaza_number);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        confirmationUrl: publicUrlData.publicUrl,
        filename,
        plaza
      })
    };

  } catch (error) {
    console.error('Error in generate-confirmation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  };
};

function generateConfirmationHTML(plaza) {
  const today = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Plaza Nº ${plaza.plaza_number} · El Bosque Sagrado</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#ffffff; color:#111111; font-family:'Cormorant Garamond',serif; }
  .wrap { max-width:640px; margin:0 auto; background:#ffffff; box-shadow:0 4px 40px rgba(0,0,0,0.08); }
  .header { padding:48px 40px 32px; border-bottom:1px solid rgba(17,17,17,0.08); }
  .id-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
  .id-brand { font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.5); letter-spacing:0.2em; }
  .id-right { font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.5); letter-spacing:0.1em; }
  .greeting { font-size:28px; font-weight:300; line-height:1.3; margin-bottom:16px; }
  .greeting em { font-style:italic; color:#1a472a; }
  .body-p { font-size:16px; color:rgba(17,17,17,0.7); line-height:1.7; margin-bottom:16px; }
  .visa-card { background:#f5f0e8; padding:32px; margin:32px 40px; position:relative; }
  .visa-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; position:relative; z-index:1; }
  .visa-brand-label { font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.45); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:5px; }
  .visa-brand-name { font-size:24px; font-weight:300; font-style:italic; color:#111111; line-height:1; }
  .visa-plaza-label { font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.45); letter-spacing:0.15em; text-transform:uppercase; text-align:right; margin-bottom:4px; }
  .visa-plaza-num { font-family:'IBM Plex Mono',monospace; font-size:52px; color:#111111; line-height:1; font-weight:300; text-align:right; }
  .visa-divider { border:none; border-top:1px solid rgba(17,17,17,0.15); margin-bottom:18px; position:relative; z-index:1; }
  .visa-rows { position:relative; z-index:1; }
  .visa-row { display:flex; justify-content:space-between; align-items:baseline; padding:9px 0; border-bottom:1px solid rgba(17,17,17,0.1); gap:12px; }
  .visa-key { font-family:'IBM Plex Mono',monospace; font-size:11px; color:rgba(17,17,17,0.5); letter-spacing:0.1em; text-transform:uppercase; }
  .visa-val { font-size:15px; color:#111111; font-weight:400; }
  .visa-val em { font-style:italic; color:#1a472a; }
  .visa-val.price { font-family:'IBM Plex Mono',monospace; font-size:18px; font-weight:400; color:#1a472a; }
  .visa-footer { display:flex; justify-content:space-between; margin-top:20px; padding-top:16px; border-top:1px solid rgba(17,17,17,0.1); font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.5); line-height:1.6; }
  .visa-footer-right { text-align:right; }
  .steps-section { padding:32px 40px; }
  .steps-title { font-family:'IBM Plex Mono',monospace; font-size:12px; color:rgba(17,17,17,0.5); letter-spacing:0.2em; text-transform:uppercase; margin-bottom:24px; }
  .step { display:flex; gap:16px; margin-bottom:20px; }
  .step-num { font-family:'IBM Plex Mono',monospace; font-size:14px; color:#1a472a; font-weight:400; min-width:40px; }
  .step p { font-size:15px; color:rgba(17,17,17,0.7); line-height:1.6; }
  .footer { padding:32px 40px; border-top:1px solid rgba(17,17,17,0.08); text-align:center; }
  .footer p { font-family:'IBM Plex Mono',monospace; font-size:10px; color:rgba(17,17,17,0.4); letter-spacing:0.1em; line-height:1.8; }
  .footer a { color:#1a472a; text-decoration:none; }
  @media print { .wrap { box-shadow:none; } }
</style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="id-bar">
        <div class="id-brand">⬡ OASYS BASECAMP LAT 40°N</div>
        <div class="id-right">Proyecto Semilla · Pack Fundador 2026</div>
      </div>

      <div class="body">
        <p class="greeting">${plaza.full_name.split(' ')[0]}, tu plaza está <em>registrada.</em></p>
        <p class="body-p">${plaza.pet_name || 'Tu mascota'} forma ya parte del Bosque Sagrado. Su árbol estará plantado en esta tierra toledana — geoposicionado, con placa física y certificado digital desde el primer día.</p>
        <p class="body-p">En los próximos días recibirás la documentación completa del servicio. Cuando llegue ese momento, nos ponemos en marcha contigo.</p>

        <div class="visa-card">
          <div class="visa-header">
            <div>
              <div class="visa-brand-label">El Bosque Sagrado · OASYS</div>
              <div class="visa-brand-name">Ficha de reserva</div>
            </div>
            <div>
              <div class="visa-plaza-label">Plaza</div>
              <div class="visa-plaza-num">${plaza.plaza_number}</div>
            </div>
          </div>
          <hr class="visa-divider">
          <div class="visa-rows">
            <div class="visa-row">
              <span class="visa-key">Titular</span>
              <span class="visa-val em">${plaza.pet_name || 'Tu mascota'}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Propietario</span>
              <span class="visa-val">${plaza.full_name}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">NIF</span>
              <span class="visa-val">${plaza.nif}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Email</span>
              <span class="visa-val">${plaza.email}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Árbol</span>
              <span class="visa-val">${plaza.tree_type || 'Encina · Olivo · Almendro'}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Animal</span>
              <span class="visa-val">${plaza.animal_type || 'Perro · Gato · Otro'}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Fecha registro</span>
              <span class="visa-val">${today}</span>
            </div>
            <div class="visa-row">
              <span class="visa-key">Precio fundador</span>
              <span class="visa-val price">450 €</span>
            </div>
          </div>
          <div class="visa-footer">
            <div class="visa-footer-left">
              Pack Fundador · 50 plazas<br>
              Inicio actividad · Mayo 2026<br>
              LAT 40°N · Tierra toledana
            </div>
            <div class="visa-footer-right">
              elbosquesagrado.org<br>
              oasysbasecamp.com<br>
              @elbosque_sagrado
            </div>
          </div>
        </div>
      </div>

      <div class="steps-section">
        <div class="steps-title">Qué ocurre ahora</div>
        <div class="step">
          <span class="step-num">01</span>
          <p>Confirmamos la recepción del pago y registramos tu plaza de forma definitiva.</p>
        </div>
        <div class="step">
          <span class="step-num">02</span>
          <p>Recibirás el protocolo completo del servicio y los datos de contacto directo del equipo OASYS.</p>
        </div>
        <div class="step">
          <span class="step-num">03</span>
          <p>Coordinaremos contigo el momento adecuado para la integración de tu mascota en el bosque.</p>
        </div>
        <div class="step">
          <span class="step-num">04</span>
          <p>Recibirás las coordenadas GPS exactas de tu árbol y la documentación blockchain de seguimiento.</p>
        </div>
        <div class="step">
          <span class="step-num">05</span>
          <p>Te incluiremos en el hall of fame de @elbosque_sagrado con la foto que compartiste.</p>
        </div>
      </div>

      <div class="footer">
        <p>Este documento es la confirmación oficial de tu plaza en El Bosque Sagrado.</p>
        <p>Para cualquier consulta: <a href="mailto:info@elbosquesagrado.org">info@elbosquesagrado.org</a></p>
        <p>Generado automáticamente el ${today} · ID: ${plaza.stripe_session_id || 'N/A'}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}