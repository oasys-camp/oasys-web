const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = event.queryStringParameters && event.queryStringParameters.token;
  if (token !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, error: 'Invalid token' }) };
  }

  try {
    const { data, error } = await supabase
      .from('bsg_plazas')
      .select('*')
      .eq('tipo', 'pendiente');
    if (error) {
      return { statusCode: 500, body: JSON.stringify({ ok: false, error: error.message }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, plazas: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Internal server error' }) };
  }
};
