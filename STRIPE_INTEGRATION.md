# Stripe Integration for BSG Funnel

Complete Stripe integration for the OASYS Bosque Sagrado (BSG) payment funnel with Instagram Hall of Fame feature.

## 🚀 Features

- **Stripe Checkout Integration**: Seamless payment flow for BSG plaza reservations
- **Webhook Handling**: Real-time event processing for payments
- **Supabase Integration**: Automatic plaza status updates
- **Document Generation**: Automatic BSG document generation after successful payment
- **Email Notifications**: Confirmation emails and payment status updates
- **Analytics Tracking**: Google Analytics 4 integration for conversion tracking
- **Instagram Hall of Fame**: Photo upload system for social media integration
- **Enhanced User Experience**: Beautiful, responsive design with animations

## 📋 Prerequisites

- Node.js and npm installed
- Stripe account (test mode for development)
- Supabase project configured
- Netlify account for deployment

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install stripe @supabase/supabase-js
```

### 2. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# Site Configuration
SITE_URL=https://oasys.earth
```

### 3. Run Setup Script (Optional)

For automated setup, run:

```powershell
.\setup-stripe.ps1
```

This will:
- Check Stripe CLI installation
- Configure environment variables
- Install dependencies
- Guide you through webhook setup

## 🎯 How It Works

### Payment Flow

1. **User initiates checkout** → `POST /api/create-checkout`
2. **Stripe Checkout Session** → User completes payment
3. **Webhook triggered** → `POST /.netlify/functions/stripe-webhook`
4. **Plaza updated** → Supabase status changed to 'paid'
5. **Document generated** → BSG document created
6. **Email sent** → Confirmation with document link
7. **Instagram ready** → Photo upload option for Hall of Fame

### Instagram Hall of Fame Flow

1. **User uploads photo** → During checkout or after payment
2. **Photo validation** → Type and size checks (max 5MB)
3. **Storage upload** → Supabase Storage (bsg-photos bucket)
4. **Plaza update** → Photo URL saved to plaza record
5. **Instagram notification** → Ready for manual posting or API integration
6. **Community feature** → Pet appears in @elbosque_sagrado feed

### API Endpoints

#### Create Checkout Session

```bash
POST /api/create-checkout
Content-Type: application/json

{
  "plazaNumber": 13,
  "nif": "03833458W",
  "fullName": "Francisco García Yuste",
  "email": "francisco@example.com",
  "treeType": "Encina",
  "animalType": "Cabra"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### Verify Session

```bash
POST /api/verify-session
Content-Type: application/json

{
  "session_id": "cs_test_..."
}
```

#### Release Plaza

```bash
POST /api/release-plaza
Content-Type: application/json

{
  "plaza_number": 13
}
```

### Webhook Events

The webhook handler processes these Stripe events:

- `checkout.session.completed` - Successful checkout
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `invoice.paid` - Invoice paid (subscriptions)
- `customer.subscription.created` - Subscription created

## 🧪 Testing

### Local Development

1. **Start local server**:
```bash
npm run dev
```

2. **Start Stripe webhook listener**:
```bash
stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook
```

3. **Test checkout flow**:
   - Navigate to your local site
   - Initiate a checkout session
   - Complete test payment using Stripe test cards

### Test Cards

Use these Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Failure**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0025 0000 3155`
- **Expired card**: `4000 0000 0000 0069`

### Webhook Testing

Trigger specific webhook events:

```bash
# Trigger checkout.session.completed
stripe trigger checkout.session.completed

# Trigger payment_intent.succeeded
stripe trigger payment_intent.succeeded

# Trigger payment_intent.payment_failed
stripe trigger payment_intent.payment_failed
```

## 🚢 Deployment

### Netlify Deployment

1. **Set environment variables in Netlify**:
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env`

2. **Deploy**:
```bash
netlify deploy --prod
```

3. **Setup production webhook**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://oasys.earth/.netlify/functions/stripe-webhook`
   - Select events to listen for
   - Copy webhook secret and add to Netlify environment variables

## 📊 Analytics & Tracking

### Google Analytics 4 Events

The integration tracks these events:

- `begin_checkout` - Checkout initiated
- `purchase` - Payment completed
- `checkout_abandoned` - Payment cancelled

### Funnel Metrics

Track conversion rates:
- Checkout initiation → Payment completion
- Payment success → Document generation
- Document generation → Email delivery

## 🔐 Security

- **Webhook signature verification** - All webhooks are verified
- **Environment variables** - Sensitive data stored in environment
- **Service role keys** - Used only server-side
- **HTTPS only** - All endpoints require HTTPS in production

## 🐛 Troubleshooting

### Webhook not triggering

1. Check Stripe CLI is running: `stripe listen`
2. Verify webhook secret in `.env`
3. Check Stripe Dashboard webhook logs

### Payment not updating Supabase

1. Verify Supabase credentials
2. Check Supabase RLS policies
3. Review webhook handler logs

### Document generation failing

1. Check BSG document engine is configured
2. Verify document template exists
3. Review error logs in Netlify functions

## 📝 Configuration Files

- `netlify/functions/stripe-webhook.js` - Webhook handler
- `netlify/functions/create-checkout.js` - Checkout session creator
- `netlify/functions/verify-session.js` - Session verifier
- `netlify/functions/release-plaza.js` - Plaza releaser
- `bsg/success.html` - Success page
- `bsg/cancel.html` - Cancel page
- `.env.example` - Environment variables template
- `setup-stripe.ps1` - Setup script

## 🔄 Future Enhancements

- [ ] Email service integration (SendGrid/Mailgun)
- [ ] Subscription-based BSG model
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] A/B testing for checkout flow
- [ ] SMS notifications
- [ ] Payment method icons
- [ ] Discount code support

## 📞 Support

For issues or questions:
- Stripe Docs: https://stripe.com/docs
- Supabase Docs: https://supabase.com/docs
- Netlify Docs: https://docs.netlify.com

---

**OASYS BASE CAMP** · Sistema Operativo de la Tierra · Yunclillos, Toledo