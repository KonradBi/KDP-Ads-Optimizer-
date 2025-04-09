# KDP Ads Optimizer - Code Documentation

This document provides an overview of the codebase structure and functionality for the KDP Ads Optimizer application.

## Project Structure

```
kdp-ads-optimizer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts         # API endpoint for analyzing CSV data
│   │   │   └── payment/
│   │   │       ├── route.ts         # API endpoint for creating payment sessions
│   │   │       └── verify/
│   │   │           └── route.ts     # API endpoint for verifying payments
│   │   ├── upload/
│   │   │   └── page.tsx             # Upload page component
│   │   ├── results/
│   │   │   └── page.tsx             # Results page component
│   │   ├── layout.tsx               # Root layout component
│   │   └── page.tsx                 # Landing page component
│   ├── components/
│   │   ├── FileUploader.tsx         # File upload component
│   │   ├── FreePreview.tsx          # Free preview component
│   │   └── FullResults.tsx          # Full results component
│   ├── lib/
│   │   └── utils/
│   │       ├── analysis.ts          # Data analysis utility functions
│   │       ├── csv-parser.ts        # CSV parsing utility functions
│   │       ├── stripe.ts            # Stripe integration utility functions
│   │       └── supabase.ts          # Supabase integration utility functions
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── public/                          # Static assets
├── .env.local                       # Environment variables (local)
├── package.json                     # Project dependencies
├── vercel.json                      # Vercel deployment configuration
├── DEPLOYMENT.md                    # Deployment guide
└── USER_GUIDE.md                    # User guide
```

## Core Components

### API Endpoints

#### `/api/analyze` (route.ts)

Handles the analysis of Amazon Ads CSV data:
- Receives parsed CSV data as JSON
- Validates the data structure
- Calls the analysis utility functions
- Returns analysis results including pain points, recommendations, and optimizations

#### `/api/payment` (route.ts)

Manages the Stripe payment process:
- Creates a Stripe checkout session
- Stores the session ID in Supabase (optional)
- Returns the session ID and checkout URL

#### `/api/payment/verify` (route.ts)

Verifies payment completion:
- Retrieves the session ID from the URL
- Checks the payment status with Stripe
- Updates the session status in Supabase (optional)
- Returns the payment verification result

### Page Components

#### Landing Page (page.tsx)

The main entry point for the application:
- Displays the value proposition
- Shows features and benefits
- Provides a clear call-to-action

#### Upload Page (upload/page.tsx)

Handles the CSV upload process:
- Integrates the FileUploader component
- Manages the state for CSV data and analysis results
- Displays the FreePreview component after analysis
- Handles the payment flow initiation

#### Results Page (results/page.tsx)

Displays the full analysis results after payment:
- Verifies payment status
- Retrieves analysis results from session storage
- Renders the FullResults component

### UI Components

#### FileUploader.tsx

Handles file upload functionality:
- Uses react-dropzone for drag-and-drop support
- Validates CSV files
- Parses CSV data using the csv-parser utility
- Provides feedback during upload and processing

#### FreePreview.tsx

Displays the free preview of analysis results:
- Shows top 3 pain points
- Displays one free recommendation
- Shows a blurred preview of the full data table
- Provides a call-to-action to unlock the full analysis

#### FullResults.tsx

Displays the complete analysis results:
- Shows the full data table with all recommendations
- Provides color-coded recommendations
- Displays negative keyword suggestions
- Shows match type optimization recommendations
- Includes export functionality for CSV and Excel formats

## Utility Functions

### analysis.ts

Contains the core analysis logic:
- Identifies keywords with no sales
- Calculates wasted spend
- Finds keywords with low CTR
- Generates actionable recommendations
- Calculates new bid suggestions
- Creates priority scores
- Generates negative keyword suggestions
- Provides match type optimization recommendations

### csv-parser.ts

Handles CSV parsing functionality:
- Uses PapaParse library to parse CSV files
- Maps CSV columns to the AmazonAdData interface
- Handles parsing errors

### stripe.ts

Manages Stripe integration:
- Creates a Stripe client instance
- Provides functions for payment processing

### supabase.ts

Manages Supabase integration:
- Creates a Supabase client instance
- Provides functions for database operations

## Type Definitions (types/index.ts)

Defines TypeScript interfaces for:
- AmazonAdData: Structure of the Amazon Ads CSV data
- AnalysisResult: Structure of the analysis results
- AnalyzedKeyword: Extended AmazonAdData with recommendations
- MatchTypeRecommendation: Structure for match type suggestions
- PaymentSession: Structure for Stripe payment sessions

## Environment Variables

The application uses the following environment variables:
- NEXT_PUBLIC_SUPABASE_URL: Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase anonymous key
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Stripe publishable key
- STRIPE_SECRET_KEY: Stripe secret key
- STRIPE_WEBHOOK_SECRET: Stripe webhook secret
- NEXT_PUBLIC_SITE_URL: Application URL
- NEXT_PUBLIC_PRICE_ID: Stripe price ID
- NEXT_PUBLIC_PRICE_AMOUNT: Price amount (4.99)
- NEXT_PUBLIC_CURRENCY: Currency code (EUR)

## Deployment

The application is configured for deployment to Vercel:
- vercel.json contains the deployment configuration
- DEPLOYMENT.md provides detailed deployment instructions
