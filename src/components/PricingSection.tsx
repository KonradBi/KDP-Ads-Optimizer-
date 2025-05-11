'use client';

import React from 'react';
import Link from 'next/link';

const PricingSection = () => {
  // Calculate days until offer expires
  const today = new Date();
  const expiryDate = new Date('June 21, 2025');
  const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section id="pricing" className="w-full px-4 py-16 md:py-24 bg-slate-900 text-slate-300">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl max-w-3xl mx-auto text-slate-400">
          Optimize your Amazon KDP ads and maximize your return on investment with our powerful analytics tools
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-amber-500/30">
          {/* Early Bird Banner */}
          <div className="absolute top-6 -right-12 transform rotate-45 bg-red-500 text-white py-1 w-48 text-center font-semibold text-sm shadow-md">
            Early Bird
          </div>
          
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - features */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-slate-800/80 to-slate-900/80 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-6">Everything You Need</h3>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">AI-powered keyword optimization suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">Bid adjustment recommendations for maximum ROI</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">Stop Money Drains</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">Fine-tune Your Bids</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">Increase Keyword Precision</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">Optimise Ad Group Structure</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-amber-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-300">CSV export of optimized keywords</span>
                </li>
              </ul>
              
              <div className="mt-auto pt-6">
                <p className="text-slate-400 text-sm">
                  Questions? Need help? Contact me at{' '}
                  <a href="mailto:kdpninja@proton.me" className="text-amber-400 hover:underline">
                    kdpninja@proton.me
                  </a>
                </p>
              </div>
            </div>

            {/* Right side - pricing */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-slate-800 to-slate-900 border-t md:border-t-0 md:border-l border-slate-700/30 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <span className="text-slate-300 text-lg font-medium line-through mr-2">$9.99</span>
                  <span className="bg-amber-500/20 text-amber-300 text-xs py-1 px-2 rounded">50% OFF</span>
                </div>
                <div className="flex items-end mb-1">
                  <span className="text-4xl md:text-5xl font-bold text-white">$4.99</span>
                  <span className="text-slate-400 ml-2 pb-1">USD</span>
                </div>
                <p className="text-slate-400">$4.99 per analysis</p>
              </div>

              <div className="mb-8 py-4 px-5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-amber-300 font-medium">
                  Early bird offer ends in {daysRemaining} days (June 21, 2025)
                </p>
              </div>

              <Link
                href="/upload"
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-medium text-center transition-all transform hover:scale-105 duration-300 shadow-lg shadow-amber-500/20"
              >
                Get Started Now
              </Link>
              
              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-slate-400">No subscription required.</p>
                <div className="bg-amber-500/20 inline-block text-amber-300 py-1 px-3 rounded-lg text-sm font-medium">
                  Free Preview Available
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-700/30">
                <div className="flex items-center justify-center mb-4">
                  <svg className="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-slate-300 text-sm">Secure payment via Stripe</span>
                </div>
                <p className="text-xs text-center text-slate-500">
                  14-day money-back guarantee if you're not satisfied
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Removed FAQ Section */}
      </div>
    </section>
  );
};

export default PricingSection;
