/**
 * Landing page for KDP Ads Optimizer
 */
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-3/5">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Optimize Your Amazon Ads in Minutes!
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl">
              Upload your weekly CSV export and receive expert insights to boost your KDP campaign performance.
            </p>
            <div className="mt-10">
              <Link 
                href="/upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-indigo-700"
              >
                Get Started – It's Free to Try!
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              KDP Ads Optimizer
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Why Use Our Tool?
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Designed specifically for KDP authors who want to optimize their Amazon Ads without becoming ads experts.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Time and Money Savings</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Quickly identify pain points and inefficiencies in your ad spend without hours of manual analysis.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">Actionable Insights</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get clear, data-driven recommendations and optimizations without manual Excel work.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-medium text-gray-900">User-Friendly Experience</h3>
                  <p className="mt-2 text-base text-gray-500">
                    No account required; simply upload a CSV, view a free teaser preview, and pay a small fee to unlock the full report.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Simple Process
            </h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              How It Works
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
                  1
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Upload Your CSV</h3>
                <p className="mt-2 text-base text-gray-500">
                  Download your Amazon Ads CSV export from 'Sponsored Products – Targeting' and upload it here.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
                  2
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">View Free Preview</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get a free preview of your top pain points and one actionable recommendation.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold">
                  3
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Unlock Full Analysis</h3>
                <p className="mt-2 text-base text-gray-500">
                  Pay a small fee (€4.99) to unlock the complete analysis with detailed recommendations.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try It Now
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} KDP Ads Optimizer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
