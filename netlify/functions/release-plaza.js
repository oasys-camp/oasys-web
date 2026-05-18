// netlify/functions/release-plaza.js
// Release plaza reservation when payment is cancelled

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
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

    // Release plaza reservation
    const { data: plaza, error } = await supabase
      .from('bsg_plazas')
      .update({
        status: 'available',
        reserved_by: null,
        reserved_at: null,
        stripe_session_id: null,
        updated_at: new Date().toISOString()
      })
      .eq('plaza_number', plaza_number)
      .select()
      .single();

    if (error) {
      console.error('Error releasing plaza:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to release plaza' })
      };
    }

    // Track cancellation event
    await trackCancellationEvent({
      plaza_number,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        plaza_number,
        status: 'available'
      })
    };

  } catch (error) {
    console.error('Error in release-plaza:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to release plaza' })
    };
  }
};

// Track cancellation events
async function trackCancellationEvent(data) {
  console.log('Tracking cancellation event:', data);
  // TODO: Integrate with analytics service
  // TODO: Track in Supabase analytics table
}