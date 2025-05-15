# KDP Ads Optimizer - README

## Project Overview

KDP Ads Optimizer is a web-based tool designed for Kindle Direct Publishing (KDP) authors who run Amazon Ads campaigns. This tool analyzes weekly CSV exports from Amazon Ads to deliver expert-level, actionable recommendations to improve ad performance.

## Value Proposition

- **Time and Money Savings**: Quickly identify pain points and inefficiencies in ad spend.
- **Actionable Insights**: Get clear, data-driven recommendations without manual Excel work.
- **User-Friendly Experience**: No account required; simply upload a CSV, view a free preview, and pay a small fee (€4.99) to unlock the full report.

## Features

- CSV upload and parsing of Amazon Ads data
- Free preview with top 3 pain points and one actionable recommendation
- Full analysis with:
  - Color-coded recommendations (red, green, yellow)
  - New bid suggestions based on target ACOS
  - Priority scores for each keyword
  - Negative keyword suggestions
  - Match type optimization recommendations
- Export functionality (CSV and Excel)
- Secure payment processing with Stripe

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes (serverless functions)
- **Database**: Supabase
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## Documentation

- [User Guide](./USER_GUIDE.md): Instructions for using the application
- [Code Documentation](./CODE_DOCUMENTATION.md): Overview of the codebase structure and functionality
- [Deployment Guide](./DEPLOYMENT.md): Instructions for deploying the application

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with the required environment variables (see [Deployment Guide](./DEPLOYMENT.md))
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
kdp-ads-optimizer/
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Utility functions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── ...                       # Configuration files
```

## Deployment

See the [Deployment Guide](./DEPLOYMENT.md) for detailed instructions on deploying the application to Vercel.

## License

This project is proprietary and confidential.

## Contact

For support or inquiries, please contact support@kdpadsoptimizer.com.

<!-- Triggering redeploy for Vercel -->
