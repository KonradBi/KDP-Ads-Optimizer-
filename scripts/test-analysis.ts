import { analyzeAdsData } from '../src/lib/utils/analysis';
import { AmazonAdData } from '../src/types';

// --- Test Data ---
// This keyword should trigger a 'Boost' recommendation with 'Medium' confidence
const testDataMediumBoost: AmazonAdData[] = [
  {
    // Data designed for Medium Confidence and Low ACoTR (< 0.7)
    campaignName: "Test Campaign Boost",
    adGroup: "Test Group Boost",
    keyword: "test boost medium confidence",
    matchType: "BROAD",
    impressions: 1000,
    clicks: 50,        // Meets LOW_CONF_CLICKS (20), less than MED_CONF_CLICKS (100)
    spend: 10,
    orders: 2,         // Meets LOW_CONF_ORDERS (1), less than MED_CONF_ORDERS (3) -> Results in Medium Confidence
    sales: 15,         // Total Revenue = 16
    acos: 10 / 15,     // 0.667
    ctr: 50 / 1000,    // 0.05
    keywordBid: 0.50,
    estimatedKenpRoyalties: 1, // Total Revenue = 16. Spend/Revenue = 10/16 = 0.625 (< 0.7)
    kenpRead: 100,
    suggestedBidMedian: 0.60,
    suggestedBidHigh: 0.80,
    suggestedBidLow: 0.40,
  },
  // Baseline keyword to establish group averages
  {
    campaignName: "Test Campaign Boost",
    adGroup: "Test Group Boost",
    keyword: "baseline keyword",
    matchType: "BROAD",
    impressions: 10000,
    clicks: 200,
    spend: 100,
    orders: 5,
    sales: 200, // ACOS = 0.5
    acos: 0.5,
    ctr: 0.02,
    keywordBid: 0.60,
    estimatedKenpRoyalties: 10,
    kenpRead: 1000,
  },
   // Control keyword: High ACOS, Medium Confidence - should NOT boost
  {
    campaignName: "Test Campaign Control",
    adGroup: "Test Group Control",
    keyword: "test no boost high acos",
    matchType: "EXACT",
    impressions: 1000,
    clicks: 60,      // Medium Confidence
    spend: 50,
    orders: 2,       // Medium Confidence
    sales: 30,       // Total Revenue = 35. Spend/Revenue = 50/35 = 1.42 (> 1.0) -> High ACoTR
    acos: 50 / 30,
    ctr: 0.06,
    keywordBid: 0.70,
    estimatedKenpRoyalties: 5,
    kenpRead: 200,
    suggestedBidMedian: 0.65,
    suggestedBidHigh: 0.90,
    suggestedBidLow: 0.50,
  }
];

// --- Run Analysis ---
console.log("Running analysis test script...");
const analysisResult = analyzeAdsData(testDataMediumBoost);

// --- Verify Results ---
const boostKeywordResult = analysisResult.fullAnalysis.data.find(
  item => item.keyword === "test boost medium confidence"
);

const noBoostKeywordResult = analysisResult.fullAnalysis.data.find(
  item => item.keyword === "test no boost high acos"
);

console.log("\n--- Verification ---");

if (boostKeywordResult) {
  console.log(`\nResults for keyword: "${boostKeywordResult.keyword}"`);
  console.log(`  Data Confidence: ${boostKeywordResult.dataConfidence}`);
  console.log(`  Effective ACOS: ${boostKeywordResult.effectiveAcos?.toFixed(3)}`);
  console.log(`  Recommendation: ${boostKeywordResult.recommendation}`);
  console.log(`  Current Bid: ${boostKeywordResult.keywordBid}`);
  console.log(`  New Suggested Bid: ${boostKeywordResult.newBid}`);

  // Basic Checks
  if (boostKeywordResult.dataConfidence === 'Medium' &&
      boostKeywordResult.recommendation?.startsWith('Boost') &&
      typeof boostKeywordResult.newBid === 'number' &&
      boostKeywordResult.newBid > (boostKeywordResult.keywordBid ?? 0)) {
    console.log("  ✅ SUCCESS: Boost recommendation correctly triggered for Medium confidence.");
  } else {
    console.log("  ❌ FAILED: Boost recommendation NOT triggered as expected for Medium confidence.");
    console.log(`            Expected Recommendation to start with 'Boost', got '${boostKeywordResult.recommendation}'`);
    console.log(`            Expected New Bid > Current Bid, got New: ${boostKeywordResult.newBid}, Current: ${boostKeywordResult.keywordBid}`);
  }
} else {
  console.log("❌ FAILED: Could not find the 'test boost medium confidence' keyword in results.");
}

if (noBoostKeywordResult) {
  console.log(`\nResults for keyword: "${noBoostKeywordResult.keyword}"`);
  console.log(`  Data Confidence: ${noBoostKeywordResult.dataConfidence}`);
  console.log(`  Effective ACOS: ${noBoostKeywordResult.effectiveAcos?.toFixed(3)}`);
  console.log(`  Recommendation: ${noBoostKeywordResult.recommendation}`);
  console.log(`  Current Bid: ${noBoostKeywordResult.keywordBid}`);
  console.log(`  New Suggested Bid: ${noBoostKeywordResult.newBid}`);

  if (noBoostKeywordResult.recommendation?.startsWith('Lower Bid')) {
    console.log("  ✅ SUCCESS: High ACOS keyword correctly triggered 'Lower Bid' (not 'Boost').");
  } else {
    console.log("  ❌ FAILED: High ACOS keyword did not trigger 'Lower Bid'.");
    console.log(`             Expected Recommendation to start with 'Lower Bid', got '${noBoostKeywordResult.recommendation}'`);
  }
} else {
  console.log("❌ FAILED: Could not find the 'test no boost high acos' keyword in results.");
}

console.log("\nAnalysis script finished."); 