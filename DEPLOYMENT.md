# KDP Ads Optimizer Deployment Guide

This document provides instructions for deploying the KDP Ads Optimizer application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account
2. A Supabase account with a project set up
3. A Stripe account with API keys

## Environment Variables

The following environment variables need to be configured in Vercel:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://your-vercel-deployment-url.vercel.app
NEXT_PUBLIC_PRICE_ID=your-stripe-price-id
NEXT_PUBLIC_PRICE_AMOUNT=4.99
NEXT_PUBLIC_CURRENCY=EUR
```

## Deployment Steps

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the application:
   ```
   cd kdp-ads-optimizer
   vercel
   ```

4. Follow the prompts to link to your Vercel project and configure settings.

5. For production deployment:
   ```
   vercel --prod
   ```

## Post-Deployment Configuration

After deployment:

1. Update the `NEXT_PUBLIC_SITE_URL` environment variable with your actual Vercel deployment URL
2. Configure Stripe webhook endpoints to point to your deployed application
3. Test the payment flow in the production environment

## Supabase Setup

Ensure your Supabase database has the following table:

```sql
CREATE TABLE payment_sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  status TEXT
);
```

## Stripe Setup

1. Create a product in Stripe dashboard
2. Create a price for the product (€4.99)
3. Update the `NEXT_PUBLIC_PRICE_ID` environment variable with the price ID
4. Configure webhook endpoints for payment events
