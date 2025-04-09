/**
 * Component for displaying the full analysis results after payment
 */
import React from 'react';
import { AnalysisResult } from '@/types';
import * as XLSX from 'xlsx';

interface FullResultsProps {
  analysisResult: AnalysisResult;
}

export default function FullResults({ analysisResult }: FullResultsProps) {
  const { fullAnalysis } = analysisResult;
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'EUR';
  
  // Function to export data as CSV
  const exportAsCSV = () => {
    // Convert data to CSV format
    const csvContent = 
      'Campaign Name,Ad Group,Keyword,Match Type,Impressions,Clicks,CTR,Spend,Orders,Sales,ACOS,Recommendation,New Bid,Priority Score\n' +
      fullAnalysis.data.map(item => 
        `"${item.campaignName}","${item.adGroup}","${item.keyword}","${item.matchType}",${item.impressions},${item.clicks},${item.ctr},${item.spend},${item.orders},${item.sales},${item.acos},"${item.recommendation}",${item.newBid || ''},${item.priorityScore}`
      ).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'kdp_ads_analysis.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to export data as Excel
  const exportAsExcel = () => {
    // Prepare data for Excel
    const excelData = fullAnalysis.data.map(item => ({
      'Campaign Name': item.campaignName,
      'Ad Group': item.adGroup,
      'Keyword': item.keyword,
      'Match Type': item.matchType,
      'Impressions': item.impressions,
      'Clicks': item.clicks,
      'CTR': item.ctr,
      'Spend': item.spend,
      'Orders': item.orders,
      'Sales': item.sales,
      'ACOS': item.acos,
      'Recommendation': item.recommendation,
      'New Bid': item.newBid || '',
      'Priority Score': item.priorityScore
    }));
    
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Analysis');
    
    // Create a second sheet for negative keywords
    const negativeKeywordsSheet = XLSX.utils.aoa_to_sheet([
      ['Negative Keyword Suggestions'],
      ...fullAnalysis.negativeKeywordSuggestions.map(keyword => [keyword])
    ]);
    XLSX.utils.book_append_sheet(workbook, negativeKeywordsSheet, 'Negative Keywords');
    
    // Create a third sheet for match type recommendations
    const matchTypeSheet = XLSX.utils.aoa_to_sheet([
      ['Keyword', 'Current Match Type', 'Recommended Match Type', 'Reason'],
      ...fullAnalysis.matchTypeRecommendations.map(rec => [
        rec.keyword, rec.currentMatchType, rec.recommendedMatchType, rec.reason
      ])
    ]);
    XLSX.utils.book_append_sheet(workbook, matchTypeSheet, 'Match Type Recommendations');
    
    // Export the workbook
    XLSX.writeFile(workbook, 'kdp_ads_analysis.xlsx');
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-green-50">
        <h3 className="text-lg font-medium text-green-900">Your Complete Analysis</h3>
        <p className="mt-1 text-sm text-green-600">
          Here's your complete analysis with actionable insights, new bid suggestions, negative keyword and match-type optimization recommendations, all prioritized to help you improve your ad performance.
        </p>
      </div>
      
      <div className="px-6 py-5">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-base font-semibold text-gray-900">
            Complete Analysis Results
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={exportAsCSV}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export as CSV
            </button>
            <button
              onClick={exportAsExcel}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export as Excel
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
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
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACOS
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recommendation
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  New Bid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fullAnalysis.data.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-gray-800 font-medium">
                      {item.priorityScore}
                    </span>
                  </td>
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
                    {item.orders}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.newBid ? `${currency} ${item.newBid.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {fullAnalysis.negativeKeywordSuggestions.length > 0 && (
          <div className="mt-8">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Negative Keyword Suggestions
            </h4>
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-sm text-gray-700 mb-2">
                Consider adding these keywords as negative keywords to prevent wasted spend:
              </p>
              <div className="flex flex-wrap gap-2">
                {fullAnalysis.negativeKeywordSuggestions.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {fullAnalysis.matchTypeRecommendations.length > 0 && (
          <div className="mt-8">
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              Match Type Optimization Recommendations
            </h4>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-gray-700 mb-2">
                Consider these match type changes to improve targeting efficiency:
              </p>
              <ul className="space-y-2">
                {fullAnalysis.matchTypeRecommendations.map((rec, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{rec.keyword}</span>: 
                    Change from <span className="text-gray-600">{rec.currentMatchType}</span> to 
                    <span className="text-blue-600 font-medium"> {rec.recommendedMatchType}</span> 
                    <span className="text-gray-500"> ({rec.reason})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
