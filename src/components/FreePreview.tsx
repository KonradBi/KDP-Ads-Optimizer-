/**
 * Component for displaying the free preview of analysis results
 */
import React from 'react';
import { AnalysisResult, AnalyzedKeyword } from '@/types';
import Tooltip from '@/components/Tooltip'; // Corrected import path assuming @ maps to src

interface FreePreviewProps {
  analysisResult: AnalysisResult;
  onUnlock: () => void;
}

export default function FreePreview({ analysisResult, onUnlock }: FreePreviewProps) {
  const { painPoints, fullAnalysis } = analysisResult;
  const price = process.env.NEXT_PUBLIC_PRICE_AMOUNT || '4.99';
  const currency = 'USD';
  const HIGH_ACOS_THRESHOLD = 0.5; // Consistent threshold
  
  // Calculate counts needed for other Pain Points cards
  const inefficientKeywordsCount = fullAnalysis.data.filter(
    kw => kw.relativeAcos !== null && kw.relativeAcos !== undefined && kw.relativeAcos > HIGH_ACOS_THRESHOLD
  ).length;
  const lowCtrKeywordsCount = painPoints.keywordsWithLowCtr || 0;
  
  // Get Potential Savings from analysis (used for the card and the unlock text)
  const potentialSavings = analysisResult.fullAnalysis.potentialSavings || 0; 
  
  return (
    // Use a single dark container for the entire component
    <div className="bg-slate-900 shadow-lg rounded-lg overflow-hidden w-full mx-auto">
      {/* Top Section (Header + Pain Points) */}
      <div> 
        {/* Dark Header */}
        <div className="px-6 md:px-10 lg:px-20 py-8 md:py-12 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-xl font-medium text-slate-100">Your Free Analysis Preview</h3>
          <p className="mt-2 text-base text-slate-300">
            Here's what we found in your Amazon Ads data
          </p>
        </div>
        
        {/* Dark Pain Points Section */}
        <div className="px-6 md:px-10 lg:px-20 py-10 md:py-14">
          <h4 className="text-xl md:text-2xl font-bold text-slate-100 mb-6 md:mb-8">
            Top Pain Points This Week:
          </h4>
          
          {/* Pain Point Cards - Adjusted to Landing Page Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Potential Savings Card - UPDATED LOGIC & TEXTS */}
            <div className="bg-red-700/80 p-6 rounded-xl border border-red-500/50 shadow-lg text-white flex flex-col">
                {/* Icon without background */}
                <div className="flex items-center justify-between mb-4">
                    {/* Updated Title */}
                    <p className="text-lg font-bold text-white">Potential Savings</p>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                {/* Use potentialSavings value */}
                <p className="text-6xl font-bold mb-3">${potentialSavings.toFixed(2)}</p>
                
                {/* Updated Description Text */}
                <div className="space-y-2 mb-3">
                    <p className="text-xl font-semibold text-white">Estimated savings potential</p>
                    <p className="text-base italic text-red-100/80">From pausing draining keywords & optimizing bids.</p>
                </div>
                
                {/* Updated Action Text */}
                <div className="mt-2">
                    <p className="text-base font-medium bg-red-900/60 p-2 rounded border border-red-400/30">
                        <span className="font-bold">✓ Action:</span> Optimize keywords & bids.
                    </p>
                </div>
                
                {/* Unlock text remains relevant */}
                <div className="mt-4 pt-3 border-t border-red-400/30 flex items-center">
                    <svg className="w-5 h-5 text-red-200 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-sm text-red-100">Unlock to see the detailed savings breakdown</p> {/* Slightly adapted unlock text */}
                </div>
            </div>
            
            {/* Inefficient Keywords Card */}
            <div className="bg-orange-600/80 p-6 rounded-xl border border-orange-500/50 shadow-lg text-white flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-white">Inefficient Keywords</p>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <p className="text-6xl font-bold mb-3">{inefficientKeywordsCount}</p>
                
                <div className="space-y-2 mb-3">
                    <p className="text-base text-orange-100 font-semibold">Keywords draining profit (ACOS {'>'} {HIGH_ACOS_THRESHOLD * 100}% above Avg.)</p>
                    <p className="text-base text-orange-100">Estimated optimization potential: <span className="text-xl font-bold">$$$</span></p>
                </div>
                
                <div className="mt-2">
                    <p className="text-base font-medium bg-orange-800/60 p-2 rounded border border-orange-400/30">
                        <span className="font-bold">✓ Action:</span> Lower bids or check search terms.
                    </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-orange-400/30 flex items-center">
                    <svg className="w-5 h-5 text-orange-200 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm text-orange-100">Unlock for calculated bid recommendations and profit optimization</p>
                </div>
            </div>
            
            {/* Keywords with Low CTR Card */}
            <div className="bg-amber-600/80 p-6 rounded-xl border border-amber-500/50 shadow-lg text-white flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-white">Keywords with Low CTR</p>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.293-1.293a3 3 0 114.242-4.242l1.293 1.293" />
                    </svg>
                </div>
                
                <p className="text-6xl font-bold mb-3">{lowCtrKeywordsCount}</p>
                
                <div className="space-y-2 mb-3">
                    <p className="text-base text-amber-100 font-semibold">CTR significantly lower than category average</p>
                    <p className="text-base text-amber-100">Impact on your spend: <span className="text-xl font-bold">High</span></p>
                </div>
                
                <div className="mt-2">
                    <p className="text-base font-medium bg-amber-800/60 p-2 rounded border border-amber-400/30">
                        <span className="font-bold">✓ Action:</span> Check search terms, improve ad copy, or lower bids.
                    </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-amber-400/30 flex items-center">
                    <svg className="w-5 h-5 text-amber-200 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <p className="text-sm text-amber-100">Unlock for keyword-by-keyword ad copy suggestions</p>
                </div>
            </div>

            {/* Revenue Boost Potential Card */}
            <div className="bg-green-600/80 p-6 rounded-xl border border-green-500/50 shadow-lg text-white flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-lg font-bold text-white">Revenue Boost Potential</p>
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                
                {/* Value with Tooltip */}
                <Tooltip text="Estimated potential revenue increase from boosting profitable keywords. Calculated based on current performance and profitability headroom.">
                    <p className="text-6xl font-bold mb-3 cursor-help underline decoration-dashed decoration-green-300/50 underline-offset-4">~${analysisResult.fullAnalysis.estimatedGain.toFixed(2)}</p>
                </Tooltip>
                
                <div className="space-y-2 mb-3">
                    <p className="text-base text-green-100 font-semibold">Estimated gain from boosting top keywords</p>
                </div>
                
                <div className="mt-2">
                    <p className="text-base font-medium bg-green-800/60 p-2 rounded border border-green-400/30">
                        <span className="font-bold">✓ Action:</span> Increase bids on profitable keywords.
                    </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-green-400/30 flex items-center">
                    <svg className="w-5 h-5 text-green-200 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-green-100">Unlock specific 'Boost' recommendations & bid levels</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Table + Unlock) */}
      <div className="p-6 md:p-8 lg:p-10 relative"> 
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl md:text-2xl font-bold text-slate-100">
              Detailed Analysis Preview <span className="opacity-75">(Top 5 Rows)</span>:
            </h4>
            
            {/* Visual direction hint to unlock */}
            <div className="hidden md:flex items-center text-indigo-400 text-sm font-medium animate-pulse">
              <p>Unlock full analysis</p>
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          
          {/* Table container with dark border/shadow - Restore bottom margin */} 
          <div className="w-full overflow-x-auto rounded-lg border border-slate-700 shadow-md mb-10"> 
            <table className="min-w-full divide-y divide-slate-700 table-fixed">
              {/* Dark theme header/body - UPDATED COLUMNS */}
              <thead className="bg-slate-700/60"> 
                 <tr>
                  {/* Columns based on FullResults.tsx */}
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-64">Keyword</th> {/* Added fixed width */}
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Match Type</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Impressions</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Clicks</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Spend</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Sales</th> {/* Added Sales */}
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Orders</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">ACOS</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Eff. ACOS</th>
                  <th scope="col" className="px-5 py-3.5 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Data Conf.</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Rel. ACOS</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Rel. CTR</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Rel. CVR</th>
                  <th scope="col" className="px-5 py-3.5 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommendation</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Suggested Bid</th>
                  {/* Removed Profit Opt. Bid */}
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Your Bid</th>
                  {/* Removed Sug. Bid (Med) */}
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">KENP Read</th>
                  <th scope="col" className="px-5 py-3.5 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Est. KENP Royalty</th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                {/* Visible rows (first 5) - UPDATED CELLS */}
                {analysisResult.fullAnalysis.data.slice(0, 5).map((item, index) => (
                  <tr key={`visible-${index}`} className="hover:bg-slate-700/40 transition-colors duration-150">
                    {/* Priority */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                       {item.priorityScore ? (
                           <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-bold shadow">
                             {item.priorityScore}
                           </span>
                       ) : <span className="text-slate-500">-</span>}
                    </td>
                    {/* Keyword */}
                    <td className="px-5 py-4 text-sm text-slate-200 w-64 truncate" title={item.keyword}>{item.keyword}</td>
                    {/* Match Type */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400">{item.matchType}</td>
                    {/* Impressions */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.impressions.toLocaleString()}</td>
                    {/* Clicks */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.clicks}</td>
                    {/* Spend */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">${item.spend.toFixed(2)}</td>
                    {/* Sales */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">${item.sales.toFixed(2)}</td>
                    {/* Orders */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.orders}</td>
                    {/* ACOS */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{(item.acos * 100).toFixed(1)}%</td>
                    {/* Eff. ACOS */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                       {item.effectiveAcos !== null && item.effectiveAcos !== undefined ? `${(item.effectiveAcos * 100).toFixed(1)}%` : <span className="text-slate-500">-</span>}
                    </td>
                    {/* Data Confidence */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                       {/* Use DataConfidenceDisplay component if available and imported, otherwise inline style */}
                       {item.dataConfidence ? (<span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ item.dataConfidence === 'Low' ? 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30' : item.dataConfidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30' : 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' }`}>{item.dataConfidence}</span>) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* Rel. ACOS */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                       {(item.relativeAcos !== null && item.relativeAcos !== undefined) ? (
                           <span className={item.relativeAcos > 0 ? 'text-red-400' : 'text-green-400'}>
                              {`${item.relativeAcos >= 0 ? '+' : ''}${(item.relativeAcos * 100).toFixed(0)}%`}
                           </span>
                       ) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* Rel. CTR */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                       {(item.relativeCtr !== null && item.relativeCtr !== undefined) ? (
                           <span className={item.relativeCtr < 1 ? 'text-red-400' : 'text-green-400'}>
                              {`${item.relativeCtr.toFixed(1)}x`}
                           </span>
                       ) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* Rel. CVR */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                       {(item.relativeCvr !== null && item.relativeCvr !== undefined) ? (
                           <span className={item.relativeCvr < 1 ? 'text-red-400' : 'text-green-400'}>
                              {`${item.relativeCvr.toFixed(1)}x`}
                            </span>
                         ) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* Recommendation */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                       <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold truncate ${ item.color === 'red' ? 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30' : item.color === 'green' ? 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' : 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30' }`}>
                         {item.recommendation || 'N/A'}
                       </span>
                    </td>
                    {/* Suggested Bid (Handles profitOptBid or newBid) */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                      {/* Simplified logic for preview: show newBid if available, otherwise '-' */}
                      {item.newBid !== undefined && item.newBid !== null ? (
                         <span className="inline-flex items-center space-x-1">
                           {item.keywordBid && item.newBid > item.keywordBid ? (
                             <><span className="text-green-400 font-semibold text-xs">↑</span><span className="text-green-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span></>
                           ) : item.keywordBid && item.newBid < item.keywordBid ? (
                             <><span className="text-red-400 font-semibold text-xs">↓</span><span className="text-red-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span></>
                           ) : (
                             <span className="text-slate-300 font-medium">{`$${item.newBid.toFixed(2)}`}</span> 
                           )}
                         </span>
                       ) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* Your Bid */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 text-right">
                       {item.keywordBid ? (<span>${item.keywordBid.toFixed(2)}</span>) : (<span className="text-slate-500">-</span>)}
                    </td>
                    {/* KENP Read */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                       {item.kenpRead ?? <span className="text-slate-500">-</span>}
                    </td>
                    {/* Est. KENP Royalty */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                       {(item.estimatedKenpRoyalties !== null && item.estimatedKenpRoyalties !== undefined) ? (<span>${item.estimatedKenpRoyalties.toFixed(2)}</span>) : (<span className="text-slate-500">-</span>)}
                    </td>
                  </tr>
                ))}

                {/* Blurred rows (next 3) - UPDATED CELLS */}
                {analysisResult.fullAnalysis.data.slice(5, 8).map((item, index) => (
                   <tr key={`blurred-${index}`} className="filter blur-sm pointer-events-none"> {/* Apply blur */}
                       {/* Repeat all TD elements for blurred rows - UPDATED */}
                       {/* Priority */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                          {item.priorityScore ? (
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-bold shadow">
                                {item.priorityScore}
                              </span>
                          ) : <span className="text-slate-500">-</span>}
                       </td>
                       {/* Keyword */}
                       <td className="px-5 py-4 text-sm text-slate-200 w-64 truncate" title={item.keyword}>{item.keyword}</td>
                       {/* Match Type */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400">{item.matchType}</td>
                       {/* Impressions */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.impressions.toLocaleString()}</td>
                       {/* Clicks */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.clicks}</td>
                       {/* Spend */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">${item.spend.toFixed(2)}</td>
                       {/* Sales */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">${item.sales.toFixed(2)}</td>
                       {/* Orders */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{item.orders}</td>
                       {/* ACOS */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">{(item.acos * 100).toFixed(1)}%</td>
                       {/* Eff. ACOS */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                          {item.effectiveAcos !== null && item.effectiveAcos !== undefined ? `${(item.effectiveAcos * 100).toFixed(1)}%` : <span className="text-slate-500">-</span>}
                       </td>
                       {/* Data Confidence */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-center">
                         {item.dataConfidence ? (<span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${ item.dataConfidence === 'Low' ? 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30' : item.dataConfidence === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30' : 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' }`}>{item.dataConfidence}</span>) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* Rel. ACOS */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                          {(item.relativeAcos !== null && item.relativeAcos !== undefined) ? (
                              <span className={item.relativeAcos > 0 ? 'text-red-400' : 'text-green-400'}>
                                 {`${item.relativeAcos >= 0 ? '+' : ''}${(item.relativeAcos * 100).toFixed(0)}%`}
                              </span>
                          ) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* Rel. CTR */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                          {(item.relativeCtr !== null && item.relativeCtr !== undefined) ? (
                              <span className={item.relativeCtr < 1 ? 'text-red-400' : 'text-green-400'}>
                                 {`${item.relativeCtr.toFixed(1)}x`}
                              </span>
                          ) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* Rel. CVR */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-right">
                          {(item.relativeCvr !== null && item.relativeCvr !== undefined) ? (
                              <span className={item.relativeCvr < 1 ? 'text-red-400' : 'text-green-400'}>
                                 {`${item.relativeCvr.toFixed(1)}x`}
                               </span>
                             ) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* Recommendation */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold truncate ${ item.color === 'red' ? 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30' : item.color === 'green' ? 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' : 'bg-yellow-500/20 text-yellow-300 ring-1 ring-inset ring-yellow-500/30' }`}>
                            {item.recommendation || 'N/A'}
                          </span>
                       </td>
                       {/* Suggested Bid */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                         {item.newBid !== undefined && item.newBid !== null ? (
                            <span className="inline-flex items-center space-x-1">
                              {item.keywordBid && item.newBid > item.keywordBid ? (
                                <><span className="text-green-400 font-semibold text-xs">↑</span><span className="text-green-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span></>
                              ) : item.keywordBid && item.newBid < item.keywordBid ? (
                                <><span className="text-red-400 font-semibold text-xs">↓</span><span className="text-red-400 font-medium">{`$${item.newBid.toFixed(2)}`}</span></>
                              ) : (
                                <span className="text-slate-300 font-medium">{`$${item.newBid.toFixed(2)}`}</span> 
                              )}
                            </span>
                          ) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* Your Bid */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 text-right">
                          {item.keywordBid ? (<span>${item.keywordBid.toFixed(2)}</span>) : (<span className="text-slate-500">-</span>)}
                       </td>
                       {/* KENP Read */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                          {item.kenpRead ?? <span className="text-slate-500">-</span>}
                       </td>
                       {/* Est. KENP Royalty */}
                       <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-300 text-right">
                          {(item.estimatedKenpRoyalties !== null && item.estimatedKenpRoyalties !== undefined) ? (<span>${item.estimatedKenpRoyalties.toFixed(2)}</span>) : (<span className="text-slate-500">-</span>)}
                       </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>

          {/* Unlock Section - Now consistent with the card */} 
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
            <div className="bg-slate-800/90 backdrop-blur p-6 rounded-2xl shadow-xl border border-slate-700 text-center">
              <svg className="mx-auto h-10 w-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h3 className="mt-3 text-lg font-bold text-slate-100">Unlock Your Full Profit Potential!</h3> 
              <ul className="mt-4 space-y-2 text-sm text-slate-300 text-left px-4">
                  <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">✅</span>
                      {/* Uses the same potentialSavings value */}
                      <span>Stop an estimated <span className="font-medium text-red-400">${potentialSavings.toFixed(2)}</span> in wasted spend & inefficiency.</span> {/* Slightly adapted text */}
                  </li>
                  <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">✅</span>
                      <span>Unlock potential gains of <span className="font-medium text-green-400">~${analysisResult.fullAnalysis.estimatedGain.toFixed(2)}</span> by optimizing bids.</span>
                  </li>
                  <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">✅</span>
                      <span>Discover hidden money-draining keywords.</span>
                  </li>
                   <li className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 text-green-500 mr-2">✅</span>
                      <span>Get detailed recommendations for all <span className="font-medium text-amber-400">{analysisResult.fullAnalysis.analyzedKeywordsCount}</span> analyzed keywords.</span>
                  </li>
              </ul>
              <div className="mt-6">
                {/* Changed button style to match landing page */}
                <button
                  type="button"
                  onClick={onUnlock}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-[#232F3E] bg-[#FF9900] hover:bg-[#E68A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:scale-105"
                >
                  Unlock Full Analysis for ${price}
                </button>
              </div>
            </div>
          </div>
      </div>
    </div> // End of single dark container
  );
}
