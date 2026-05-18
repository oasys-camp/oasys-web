// test-checkout.js
// Test script for Stripe checkout flow

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testCheckout() {
  console.log('=== Testing Stripe Checkout Flow ===\n');

  // Test data
  const testData = {
    plazaNumber: 13,
    nif: '03833458W',
    fullName: 'Francisco García Yuste',
    email: 'francisco@example.com',
    treeType: 'Encina',
    animalType: 'Cabra'
  };

  console.log('Creating checkout session with test data:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n');

  try {
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Plaza BSG #${testData.plazaNumber} - ${testData.treeType} + ${testData.animalType}`,
              description: `Plaza fundadora del Bosque Sagrado - Árbol: ${testData.treeType}, Animal: ${testData.animalType}`,
              metadata: {
                plaza_number: testData.plazaNumber,
                tree_type: testData.treeType,
                animal_type: testData.animalType
              }
            },
            unit_amount: 45000, // 450€ in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.SITE_URL}/bsg/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/bsg/cancel?plaza=${testData.plazaNumber}`,
      customer_email: testData.email,
      metadata: {
        plaza_number: testData.plazaNumber,
        nif: testData.nif,
        full_name: testData.fullName,
        tree_type: testData.treeType,
        animal_type: testData.animalType,
        source: 'test-script'
      },
      billing_address_collection: 'required',
      customer_creation: 'always',
      phone_number_collection: {
        enabled: true
      },
      allow_promotion_codes: false,
      payment_intent_data: {
        metadata: {
          plaza_number: testData.plazaNumber,
          nif: testData.nif,
          full_name: testData.fullName
        }
      }
    });

    console.log('✓ Checkout session created successfully!\n');
    console.log('Session Details:');
    console.log(`  ID: ${session.id}`);
    console.log(`  URL: ${session.url}`);
    console.log(`  Amount: €${session.amount_total / 100}`);
    console.log(`  Currency: ${session.currency.toUpperCase()}`);
    console.log(`  Status: ${session.payment_status}`);
    console.log('\n');

    console.log('🔗 Checkout URL:');
    console.log(session.url);
    console.log('\n');

    console.log('📝 Next steps:');
    console.log('1. Click the URL above to open the checkout page');
    console.log('2. Use test card: 4242 4242 4242 4242');
    console.log('3. Complete the payment');
    console.log('4. Monitor webhooks with: stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook');
    console.log('\n');

    console.log('🧪 To test webhook events manually:');
    console.log('  Success: stripe trigger checkout.session.completed');
    console.log('  Failure: stripe trigger payment_intent.payment_failed');

  } catch (error) {
    console.error('✗ Error creating checkout session:');
    console.error(error.message);
    process.exit(1);
  }
}

// Check if environment variables are set
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('✗ STRIPE_SECRET_KEY not found in environment variables');
  console.error('Please create a .env file with your Stripe credentials');
  console.error('You can copy .env.example to .env and fill in the values');
  process.exit(1);
}

if (!process.env.SITE_URL) {
  console.error('✗ SITE_URL not found in environment variables');
  console.error('Please add SITE_URL to your .env file');
  process.exit(1);
}

// Run the test
testCheckout();