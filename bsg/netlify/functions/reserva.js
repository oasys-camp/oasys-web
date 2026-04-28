const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'JSON inválido' }) };
  }

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  // GET primera plaza libre
  const rgRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bsg_plazas?select=numero_plaza&tipo=eq.libre&order=numero_plaza.asc&limit=1`,
    { headers }
  );
  const plazas = await rgRes.json();
  if (!plazas || plazas.length === 0) {
    return { statusCode: 200, body: JSON.stringify({ ok: false, error: 'sin_plazas' }) };
  }
  const numero_plaza = plazas[0].numero_plaza;

  // PATCH reserva
  const insRes = await fetch(`${SUPABASE_URL}/rest/v1/bsg_plazas?numero_plaza=eq.${numero_plaza}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      tipo:             'pendiente',
      nombre_fundador:  data.nombre    || '',
      nif:              data.nif       || '',
      domicilio_fiscal: data.domicilio || '',
      email:            data.email     || '',
      telefono:         data.telefono  || '',
      nombre_mascota:   data.mascota   || '',
      especie_raza:     data.especie_mascota || '',
      peso_kg:          data.peso ? parseFloat(data.peso) : null,
      especie_arbol:    data.especie   || '',
      nota:             data.nota      || '',
      fecha_reserva:    new Date().toISOString()
    })
  });

  if (!insRes.ok) {
    const err = await insRes.text();
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err }) };
  }

  const plazaPad = String(numero_plaza).padStart(2, '0');
  const resendHeaders = {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  };

  // Email al fundador
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: resendHeaders,
    body: JSON.stringify({
      from: 'El Bosque Sagrado <info@elbosquesagrado.org>',
      to: [data.email],
      reply_to: 'admin@oasysbasecamp.com',
      subject: `Plaza Nº${plazaPad} reservada · ${data.mascota} ya tiene su árbol`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#060d08;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#060d08;">
  <tr><td align="center" style="padding:48px 20px;">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr><td style="padding-bottom:28px;border-bottom:1px solid rgba(0,212,170,0.2);">
        <span style="font-family:monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#00D4AA;">EL BOSQUE SAGRADO &middot; OASYS BASE CAMP &middot; LAT 40&deg;N</span>
      </td></tr>
      <tr><td style="padding:36px 0 28px;">
        <p style="margin:0 0 10px;font-family:monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#00D4AA;">PLAZA FUNDADORA &middot; RECIBIDA</p>
        <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;line-height:1.2;color:#ffffff;">${data.nombre},<br><em style="font-style:italic;color:rgba(255,255,255,0.6);">bienvenido al bosque.</em></h1>
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(220,232,226,0.6);line-height:1.7;">Hemos recibido tu reserva. En cuanto confirmemos el pago, tu expediente quedar&aacute; activado.</p>
      </td></tr>
      <tr><td style="background:#0a1a12;border:1px solid rgba(0,212,170,0.15);padding:28px 32px;">
        <p style="margin:0 0 20px;font-family:monospace;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,212,170,0.45);">FICHA DE RESERVA</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Fundador</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#ffffff;font-weight:500;">${data.nombre}</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;vertical-align:bottom;">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Plaza</span><br>
              <span style="font-family:monospace;font-size:28px;color:#C9A84C;font-weight:700;line-height:1;">N&ordm;${plazaPad}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Animal</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#ffffff;">${data.mascota}</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;vertical-align:bottom;">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Especie &aacute;rbol</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#ffffff;">${data.especie || 'Sin preferencia'}</span>
            </td>
          </tr>
          <tr><td colspan="2" style="padding:10px 0;">
            <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Estado</span><br>
            <span style="font-family:monospace;font-size:11px;color:#00D4AA;letter-spacing:0.12em;text-transform:uppercase;">&#x23F3; Pendiente confirmaci&oacute;n de pago</span>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 0 0;">
        <p style="margin:0 0 8px;font-family:monospace;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,212,170,0.45);">PR&Oacute;XIMO PASO</p>
        <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(220,232,226,0.75);line-height:1.7;">Realiza la transferencia de <strong style="color:#C9A84C;">450&nbsp;&euro;</strong> con el concepto <strong style="color:#ffffff;">SEMILLA &middot; ${data.mascota}</strong>.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1a12;border:1px solid rgba(255,255,255,0.06);">
          <tr><td style="padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">IBAN</span><br>
            <span style="font-family:monospace;font-size:13px;color:#00D4AA;">ES16 3081 0151 9650 0081 2750</span>
          </td></tr>
          <tr><td style="padding:10px 16px;">
            <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Concepto</span><br>
            <span style="font-family:monospace;font-size:13px;color:#00D4AA;">SEMILLA &middot; ${data.mascota} &middot; 450&euro;</span>
          </td></tr>
        </table>
        <p style="margin:14px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:12px;color:rgba(220,232,226,0.3);line-height:1.7;">Dudas: responde a este email o WhatsApp al +34&nbsp;686&nbsp;411&nbsp;201.</p>
      </td></tr>
      <tr><td style="padding:36px 0 0;">
        <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:28px;"></div>
        <p style="margin:0;font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.18);line-height:2.2;">El Bosque Sagrado &middot; OASYS BASE CAMP &middot; LAT 40&deg;N Yunclillos &middot; Toledo</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
    })
  });

  // Aviso interno a Leonardo
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: resendHeaders,
    body: JSON.stringify({
      from: 'El Bosque Sagrado <info@elbosquesagrado.org>',
      to: ['leonardo@oasysbasecamp.com'],
      reply_to: 'admin@oasysbasecamp.com',
      subject: `[SEMILLA] Reserva Nº${plazaPad} · ${data.nombre} · ${data.mascota}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px;background:#060d08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <p style="margin:0 0 4px;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#00D4AA;">NUEVA RESERVA SEMILLA</p>
  <p style="margin:0 0 24px;font-family:monospace;font-size:28px;color:#C9A84C;font-weight:700;">N&ordm;${plazaPad}</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px;background:#0a1a12;border:1px solid rgba(0,212,170,0.15);">
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Fundador</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${data.nombre}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Email</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;"><a href="mailto:${data.email}" style="color:#00D4AA;">${data.email}</a></td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Tel&eacute;fono</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${data.telefono || '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Animal</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${data.mascota}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Especie mascota</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${data.especie_mascota || '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Peso</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${data.peso ? data.peso + ' kg' : '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Especie &aacute;rbol</td><td style="padding:8px 12px;font-size:14px;color:#fff;">${data.especie || '&mdash;'}</td></tr>
  </table>
</body>
</html>`
    })
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, numero_plaza })
  };
};
