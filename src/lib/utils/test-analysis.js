/**
 * Test script for CSV parsing and data analysis
 */
const { sampleAdsData } = require('./sample-data');
const { analyzeAdsData } = require('./analysis');

// Test the analysis function with sample data
const analysisResult = analyzeAdsData(sampleAdsData);

// Log the results
console.log('=== Analysis Results ===');
console.log('Pain Points:');
console.log(`- Keywords with no sales: ${analysisResult.painPoints.keywordsWithNoSales}`);
console.log(`- Wasted spend: ${analysisResult.painPoints.wastedSpend.toFixed(2)}`);
console.log(`- Keywords with low CTR: ${analysisResult.painPoints.keywordsWithLowCtr}`);

console.log('\nFree Recommendation:');
console.log(`- Keyword: ${analysisResult.freeRecommendation.keyword}`);
console.log(`- Clicks: ${analysisResult.freeRecommendation.clicks}`);
console.log(`- Orders: ${analysisResult.freeRecommendation.orders}`);
console.log(`- Action: ${analysisResult.freeRecommendation.action}`);

console.log('\nFull Analysis:');
console.log(`- Total keywords analyzed: ${analysisResult.fullAnalysis.data.length}`);
console.log(`- Negative keyword suggestions: ${analysisResult.fullAnalysis.negativeKeywordSuggestions.length}`);
console.log(`- Match type recommendations: ${analysisResult.fullAnalysis.matchTypeRecommendations.length}`);

// Export the analysis result for further testing
module.exports = { analysisResult };
