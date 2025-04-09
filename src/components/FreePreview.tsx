/**
 * Component for displaying the free preview of analysis results
 */
import React from 'react';
import { AnalysisResult } from '@/types';

interface FreePreviewProps {
  analysisResult: AnalysisResult;
  onUnlock: () => void;
}

export default function FreePreview({ analysisResult, onUnlock }: FreePreviewProps) {
  const { painPoints, freeRecommendation } = analysisResult;
  const price = process.env.NEXT_PUBLIC_PRICE_AMOUNT || '4.99';
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'EUR';
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-blue-50">
        <h3 className="text-lg font-medium text-blue-900">Your Free Analysis Preview</h3>
        <p className="mt-1 text-sm text-blue-600">
          Here's what we found in your Amazon Ads data
        </p>
      </div>
      
      <div className="px-6 py-5">
        <h4 className="text-base font-semibold text-gray-900 mb-4">
          Top 3 Pain Points This Week:
        </h4>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-700">
              <span className="font-medium">{painPoints.keywordsWithNoSales} keywords</span> with high spend but no sales
            </p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-700">
              Estimated wasted spend: <span className="font-medium">{currency} {painPoints.wastedSpend.toFixed(2)}</span> this week
            </p>
          </li>
          
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <p className="ml-2 text-sm text-gray-700">
              <span className="font-medium">{painPoints.keywordsWithLowCtr} keywords</span> with low CTR (&lt;0.2%)
            </p>
          </li>
        </ul>
        
        {freeRecommendation.keyword && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              Free Recommendation:
            </h4>
            <p className="text-sm text-gray-700">
              Keyword "<span className="font-medium">{freeRecommendation.keyword}</span>" – 
              {freeRecommendation.clicks} clicks, {freeRecommendation.orders} sales.
              <br />
              <span className="text-red-600 font-medium">Suggested Action: {freeRecommendation.action}</span>
            </p>
          </div>
        )}
        
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 backdrop-blur-sm rounded-md">
            <div className="text-center p-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Full Analysis Locked</h3>
              <p className="mt-1 text-xs text-gray-500">
                Unlock to see all 25+ detailed recommendations, optimized bids, negative keyword suggestions, and priority scores
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={onUnlock}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Unlock Full CSV for {currency} {price}
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Keyword
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spend
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACOS
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysisResult.fullAnalysis.data.slice(0, 5).map((item, index) => (
                  <tr key={index} className="filter blur-sm">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.keyword}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.matchType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {currency} {item.spend.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.acos * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${item.color === 'red' ? 'bg-red-100 text-red-800' : 
                          item.color === 'green' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {item.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
