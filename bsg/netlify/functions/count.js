const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const TOTAL = 50;

exports.handler = async function(event) {
  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
  };

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/bsg_plazas?select=numero_plaza&tipo=in.(pendiente,confirmada)`,
    { headers: { ...headers, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' } }
  );

  const countHeader = res.headers.get('content-range');
  const taken = countHeader ? parseInt(countHeader.split('/')[1], 10) : 0;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify({
      taken,
      available: TOTAL - taken,
      total: TOTAL,
      debug_url: (process.env.SUPABASE_URL || 'NOT_SET').substring(0, 30),
      debug_key: (process.env.SUPABASE_SERVICE_KEY || 'NOT_SET').substring(0, 10)
    })
  };
};
