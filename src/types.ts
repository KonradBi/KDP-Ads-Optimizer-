/**
 * Type definitions for the KDP Ads Optimizer
 */

// Input Data Structure (from Amazon CSV)
export interface AmazonAdData {
  campaignName: string;
  adGroup: string;
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  spend: number;
  orders: number;
  sales: number;
  acos: number;
  ctr: number;
  cvr?: number; // Optional CVR if pre-calculated
  keywordBid?: number; // Current bid, if available
  suggestedBidMedian?: number; // Amazon's median suggested bid
  suggestedBidLow?: number; // Amazon's low suggested bid
  suggestedBidHigh?: number; // Amazon's high suggested bid
  kenpRead?: number; // KENP pages read
  estimatedKenpRoyalties?: number; // Estimated KENP royalties
  targeting?: string; // Targeting type
}

// --- Analysis Result Structures ---

// Pain points identified
export interface PainPoints {
  keywordsWithNoSales: number; // Count of keywords with spend but no sales/significant KENP
  wastedSpend: number; // Total spend on keywords with no sales/significant KENP
  keywordsWithLowCtr: number; // Count of keywords with significantly low CTR
}

// Structure for a single analyzed keyword row
export interface AnalyzedKeyword extends AmazonAdData {
  recommendation?: string; // e.g., 'Lower Bid', 'Pause', 'Maintain', 'Boost'
  newBid?: number; // The suggested new bid
  profitOptimizedBid?: number | null; // Calculated profit-optimized bid based on user royalty
  priorityScore?: number; // Score indicating urgency/impact (e.g., 1-10)
  color?: 'red' | 'green' | 'yellow'; // Color hint for recommendation
  relativeAcos?: number | null; // ACOS relative to ad group average (e.g., 0.2 means 20% higher)
  relativeCtr?: number | null; // CTR relative to ad group average (e.g., 1.5 means 50% higher)
  relativeCvr?: number | null; // CVR relative to ad group average
  dataConfidence?: 'Low' | 'Medium' | 'High'; // Confidence level based on data volume
  estimatedTotalRoyalty?: number; // Calculated: Sales + Estimated KENP Royalties
  effectiveAcos?: number | null; // Calculated: Spend / Estimated Total Royalty (ACoTR)
}

// Recommendation for changing match type
export interface MatchTypeRecommendation {
  keyword: string;
  currentMatchType: string;
  recommendedMatchType: string; // Allow dynamic match-type recommendations
  reason: string;
}

// Recommendation for changing bid
export interface BidRecommendation {
  keyword: string;
  matchType: string;
  campaignName: string;
  adGroupName: string;
  currentBid: number;
  recommendedBid: number;
  action: 'increase' | 'decrease' | 'maintain';
  potentialImpact: string;
}

// Recommendation for adjusting budget
export interface BudgetRecommendation {
  campaignName: string;
  currentPerformance: string;
  recommendation: string;
  potentialImpact: string;
}

// Recommendation for campaign structure changes
export interface CampaignStructureRecommendation {
  type: 'new-adgroup' | 'split-campaign';
  description: string;
  keywords: string[];
}

// Contains the detailed analysis results
export interface FullAnalysis {
  data: AnalyzedKeyword[];
  negativeKeywordSuggestions: string[];
  matchTypeRecommendations: MatchTypeRecommendation[];
  bidRecommendations: BidRecommendation[];
  budgetAllocation: BudgetRecommendation[];
  campaignStructure: CampaignStructureRecommendation[];
  totalSpend: number;
  totalSales: number;
  averageAcos: number; // This now represents overallEffectiveAcos (ACoTR)
  effectiveRoas?: number; // ENSURING THIS IS ADDED
  potentialSavings: number;
  estimatedGain: number; // NEW: Estimated potential gain from boosting profitable keywords
  analyzedKeywordsCount: number; // NEW: Total count of keywords analyzed
}

// Structure for the free preview recommendation
export interface FreeRecommendation {
  keyword: string;
  clicks: number;
  orders: number;
  action: 'PAUSE' | 'OPTIMIZE'; // Simple action for free preview
}

// Top-level structure for the entire analysis result
export interface AnalysisResult {
  painPoints: PainPoints;
  freeRecommendation?: FreeRecommendation; // Optional free recommendation
  fullAnalysis: FullAnalysis;
}