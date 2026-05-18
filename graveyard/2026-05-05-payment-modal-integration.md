---
tags: [graveyard, tombstone, claude-code, oasys-web]
project: oasys-web
date: 2026-05-05
duration: medium
type: tombstone
---

# Payment Modal Integration - Stripe Checkout Example

**Status at death**: Payment modal UI complete and functional as demo, awaiting real Stripe integration

## What we did
- Created sophisticated payment modal with three payment methods (card, Apple Pay, Google Pay) alongside traditional bank transfer
- Updated `bsg/index.html` transfer section with two-column layout showing both payment options
- Implemented JavaScript functions for payment method selection, checkout initiation, and Google Analytics tracking
- Added responsive design with mobile-first approach and smooth animations
- Created comprehensive `PAYMENT_MODAL_GUIDE.md` with integration instructions, testing procedures, and production deployment steps
- Integrated modal with existing BSG design language (green gradients, gold accents, IBM Plex Mono typography)
- Added security indicators and SSL encryption messaging for user trust

## Where it went wrong
- No major technical blockers - implementation proceeded smoothly
- Modal currently functions as demo with alert() instead of real Stripe redirect
- Need to configure production Stripe API keys and webhook endpoints

## Unfinished business
- Implement real Stripe checkout session creation in Netlify Functions (update `netlify/functions/create-checkout.js`)
- Configure production Stripe API keys and webhook secrets in Netlify environment variables
- Test complete payment funnel: form submission → Stripe checkout → webhook processing → document generation
- Implement Apple Pay and Google Pay using Payment Request API (currently just UI placeholders)
- Update `netlify/functions/stripe-webhook.js` to handle new payment events from modal
- Add payment method preference tracking in Supabase for analytics
- Implement payment failure handling and retry logic
- Add payment confirmation email with Stripe receipt details

## Key files touched
- `C:\Users\amyus\Documents\oasys-web\bsg\index.html`
- `C:\Users\amyus\Documents\oasys-web\PAYMENT_MODAL_GUIDE.md`
- `C:\Users\amyus\Documents\oasys-web\netlify\functions\create-checkout.js`
- `C:\Users\amyus\Documents\oasys-web\netlify\functions\stripe-webhook.js`