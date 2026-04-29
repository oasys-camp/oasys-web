const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

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

  if (!ADMIN_SECRET || data.token !== ADMIN_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'unauthorized' }) };
  }

  const numero_plaza = parseInt(data.numero_plaza, 10);
  if (!numero_plaza || isNaN(numero_plaza)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'numero_plaza requerido' }) };
  }

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json'
  };

  // Verificar que la plaza existe y está pendiente
  const getRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bsg_plazas?numero_plaza=eq.${numero_plaza}&select=*`,
    { headers }
  );
  const plazas = await getRes.json();

  if (!plazas || plazas.length === 0) {
    return { statusCode: 404, body: JSON.stringify({ ok: false, error: 'plaza_no_encontrada' }) };
  }

  const plaza = plazas[0];

  if (plaza.tipo !== 'pendiente') {
    return { statusCode: 409, body: JSON.stringify({ ok: false, error: `plaza_en_estado_${plaza.tipo}` }) };
  }

  // PATCH pendiente → confirmada
  const patchRes = await fetch(
    `${SUPABASE_URL}/rest/v1/bsg_plazas?numero_plaza=eq.${numero_plaza}`,
    {
      method: 'PATCH',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ tipo: 'confirmada' })
    }
  );

  if (!patchRes.ok) {
    const err = await patchRes.text();
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err }) };
  }

  const plazaPad = String(numero_plaza).padStart(2, '0');
  const resendHeaders = {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json'
  };

  // Email de confirmación al fundador
  if (plaza.email) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: 'El Bosque Sagrado <info@elbosquesagrado.org>',
        to: [plaza.email],
        reply_to: 'admin@oasysbasecamp.com',
        subject: `Plaza Nº${plazaPad} activada · ${plaza.nombre_mascota} ya tiene su árbol`,
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
        <p style="margin:0 0 10px;font-family:monospace;font-size:9px;letter-spacing:0.3em;text-transform:uppercase;color:#00D4AA;">PLAZA FUNDADORA &middot; ACTIVADA</p>
        <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:300;line-height:1.2;color:#ffffff;">${plaza.nombre_fundador},<br><em style="font-style:italic;color:rgba(255,255,255,0.6);">el bosque ya te espera.</em></h1>
        <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(220,232,226,0.6);line-height:1.7;">Hemos confirmado tu pago. Tu expediente est&aacute; activado y el &aacute;rbol de ${plaza.nombre_mascota} tiene ya su plaza permanente en el Bosque Sagrado.</p>
      </td></tr>
      <tr><td style="background:#0a1a12;border:1px solid rgba(0,212,170,0.15);padding:28px 32px;">
        <p style="margin:0 0 20px;font-family:monospace;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,212,170,0.45);">EXPEDIENTE CONFIRMADO</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Fundador</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#ffffff;font-weight:500;">${plaza.nombre_fundador}</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;vertical-align:bottom;">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Plaza</span><br>
              <span style="font-family:monospace;font-size:28px;color:#C9A84C;font-weight:700;line-height:1;">N&ordm;${plazaPad}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Animal</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:#ffffff;">${plaza.nombre_mascota}</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;vertical-align:bottom;">
              <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Especie &aacute;rbol</span><br>
              <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:14px;color:#ffffff;">${plaza.especie_arbol || 'Sin preferencia'}</span>
            </td>
          </tr>
          <tr><td colspan="2" style="padding:10px 0;">
            <span style="font-family:monospace;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(220,232,226,0.35);">Estado</span><br>
            <span style="font-family:monospace;font-size:11px;color:#00D4AA;letter-spacing:0.12em;text-transform:uppercase;">&#x2713; Confirmada &middot; Expediente activo</span>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:28px 0 0;">
        <p style="margin:0 0 8px;font-family:monospace;font-size:8px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(0,212,170,0.45);">PR&Oacute;XIMOS PASOS</p>
        <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;color:rgba(220,232,226,0.75);line-height:1.7;">En los pr&oacute;ximos d&iacute;as recibir&aacute;s tu contrato de servicio y la ficha oficial del &aacute;rbol de ${plaza.nombre_mascota}. Si tienes alguna duda, responde a este email o ll&aacute;manos al +34&nbsp;686&nbsp;411&nbsp;201.</p>
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
  }

  // Aviso interno a Leonardo
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: resendHeaders,
    body: JSON.stringify({
      from: 'El Bosque Sagrado <info@elbosquesagrado.org>',
      to: ['leonardo@oasysbasecamp.com'],
      reply_to: 'admin@oasysbasecamp.com',
      subject: `[CONFIRMADA] Plaza Nº${plazaPad} · ${plaza.nombre_fundador} · ${plaza.nombre_mascota}`,
      html: `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px;background:#060d08;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <p style="margin:0 0 4px;font-family:monospace;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#00D4AA;">PLAZA CONFIRMADA · PAGO VERIFICADO</p>
  <p style="margin:0 0 24px;font-family:monospace;font-size:28px;color:#C9A84C;font-weight:700;">N&ordm;${plazaPad}</p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:520px;background:#0a1a12;border:1px solid rgba(0,212,170,0.15);">
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Fundador</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.nombre_fundador}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">NIF</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.nif || '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Email</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;"><a href="mailto:${plaza.email}" style="color:#00D4AA;">${plaza.email}</a></td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Tel&eacute;fono</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.telefono || '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Animal</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.nombre_mascota}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Especie mascota</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.especie_raza || '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Peso</td><td style="padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;color:#fff;">${plaza.peso_kg ? plaza.peso_kg + ' kg' : '&mdash;'}</td></tr>
    <tr><td style="padding:8px 12px;font-family:monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(0,212,170,0.5);">Especie &aacute;rbol</td><td style="padding:8px 12px;font-size:14px;color:#fff;">${plaza.especie_arbol || '&mdash;'}</td></tr>
  </table>
  <p style="margin:24px 0 0;font-family:monospace;font-size:10px;color:rgba(220,232,226,0.3);">Pendiente: emitir Factura BSG/2026-${plazaPad} y enviar contrato de servicio.</p>
</body>
</html>`
    })
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, numero_plaza, nombre_fundador: plaza.nombre_fundador, email: plaza.email })
  };
};
