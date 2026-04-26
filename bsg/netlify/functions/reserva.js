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

  // INSERT reserva
  const insRes = await fetch(`${SUPABASE_URL}/rest/v1/bsg_plazas`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      numero_plaza,
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

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, numero_plaza })
  };
};
