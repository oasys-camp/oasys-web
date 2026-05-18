// netlify/functions/next-plaza.js
// Get the next available plaza number

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the next available plaza number
    const { data: plazas, error } = await supabase
      .from('bsg_plazas')
      .select('plaza_number')
      .eq('status', 'available')
      .order('plaza_number', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching next plaza:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch next plaza' })
      };
    }

    if (plazas && plazas.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          plazaNumber: plazas[0].plaza_number,
          available: true
        })
      };
    } else {
      // No available plazas
      return {
        statusCode: 200,
        body: JSON.stringify({
          plazaNumber: null,
          available: false,
          message: 'No plazas available'
        })
      };
    }

  } catch (error) {
    console.error('Error in next-plaza:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};