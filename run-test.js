/**
 * Test script for the KDP Ads Optimizer analysis functionality
 */
const { sampleAdsData } = require('./test-sample-data');
const { analyzeAdsData } = require('./test-analysis-utils');

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

// Print detailed recommendations for the top 3 keywords
console.log('\nTop 3 Recommendations:');
analysisResult.fullAnalysis.data.slice(0, 3).forEach((item, index) => {
  console.log(`${index + 1}. Keyword: "${item.keyword}" (${item.matchType})`);
  console.log(`   Recommendation: ${item.recommendation}`);
  console.log(`   Priority Score: ${item.priorityScore}`);
  if (item.newBid) {
    console.log(`   New Bid: €${item.newBid.toFixed(2)}`);
  }
  console.log('');
});

// Print match type recommendations
if (analysisResult.fullAnalysis.matchTypeRecommendations.length > 0) {
  console.log('Match Type Recommendations:');
  analysisResult.fullAnalysis.matchTypeRecommendations.forEach((rec, index) => {
    console.log(`${index + 1}. Keyword: "${rec.keyword}"`);
    console.log(`   Change from ${rec.currentMatchType} to ${rec.recommendedMatchType}`);
    console.log(`   Reason: ${rec.reason}`);
    console.log('');
  });
}

// Print negative keyword suggestions
if (analysisResult.fullAnalysis.negativeKeywordSuggestions.length > 0) {
  console.log('Negative Keyword Suggestions:');
  analysisResult.fullAnalysis.negativeKeywordSuggestions.forEach((keyword, index) => {
    console.log(`${index + 1}. "${keyword}"`);
  });
}

// Test validation
console.log('\n=== Validation Tests ===');
console.log('1. Pain points calculation:', 
  analysisResult.painPoints.keywordsWithNoSales === 4 ? 'PASS' : 'FAIL');
console.log('2. Wasted spend calculation:', 
  Math.abs(analysisResult.painPoints.wastedSpend - 8.00) < 0.01 ? 'PASS' : 'FAIL');
console.log('3. Priority scoring:', 
  analysisResult.fullAnalysis.data[0].priorityScore > 0 ? 'PASS' : 'FAIL');
console.log('4. Match type recommendations:', 
  analysisResult.fullAnalysis.matchTypeRecommendations.length > 0 ? 'PASS' : 'FAIL');
