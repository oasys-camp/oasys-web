const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

exports.handler = async function(event) {
  const token = event.queryStringParameters?.token;

  if (!ADMIN_SECRET || token !== ADMIN_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'unauthorized' }) };
  }

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
  };

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bsg_plazas?tipo=eq.pendiente&select=numero_plaza,nombre_fundador,nif,email,telefono,nombre_mascota,especie_raza,especie_arbol,peso_kg,domicilio_fiscal,fecha_reserva&order=numero_plaza.asc`,
    { headers }
  );

  const plazas = await res.json();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ ok: true, plazas })
  };
};
