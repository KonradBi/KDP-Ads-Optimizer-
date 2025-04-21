export interface AmazonAdData {
  campaignName: string;
  adGroup: string;
  keyword: string;
  matchType: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  orders: number;
  sales: number;
  acos: number;
  
  // Added fields based on Amazon CSV export list
  state?: string; // e.g., enabled, paused, archived
  status?: string; // Similar to state?
  keywordBid?: number | null;
  suggestedBidLow?: number | null;
  suggestedBidMedian?: number | null;
  suggestedBidHigh?: number | null;
  topOfSearchIS?: number | null; // Percentage (e.g., 0.6 for 60%)
  kenpRead?: number | null;
  estimatedKenpRoyalties?: number | null;
}

export interface AnalyzedKeyword extends AmazonAdData {
  recommendation: string;
  newBid?: number;
  profitOptimizedBid?: number | null;
  priorityScore: number;
  color: 'red' | 'green' | 'yellow';
  
  // New fields for enhanced analysis
  relativeAcos?: number | null;      // Backend calculated
  relativeCtr?: number | null;       // Backend calculated
  relativeCvr?: number | null;       // Backend calculated
  dataConfidence?: 'Low' | 'Medium' | 'High' | null; // Backend calculated
  // Potential combined metric (calculated in backend)
  estimatedTotalRoyalty?: number | null; // salesRoyalty + kenpRoyalty
  effectiveAcos?: number | null; // Spend / estimatedTotalRoyalty (ACoTR)
}

export interface MatchTypeRecommendation {
  keyword: string;
  currentMatchType: string;
  recommendedMatchType: string;
  reason: string;
}

export interface BidRecommendation {
  keyword: string;
  matchType: string;
  currentBid: number;
  recommendedBid: number;
  action: 'increase' | 'decrease' | 'maintain';
  potentialImpact: string;
}

export interface BudgetRecommendation {
  campaignName: string;
  currentPerformance: string;
  recommendation: string;
  potentialImpact: string;
}

export interface CampaignStructureRecommendation {
  type: 'new-adgroup' | 'move-keyword' | 'split-campaign';
  description: string;
  keywords: string[];
}

export interface PaymentSession {
  id: string;
  url: string;
}

// Type definitions for the application

// Base Data Types
export interface KeywordData {
  keyword: string;
  matchType: string;
  clicks: number;
  spend: number;
  orders: number;
  acos: number;
  impressions?: number;
  sales?: number;
  keywordBid?: number | null;
  kenpRead?: number | null;
  estimatedKenpRoyalties?: number | null;
}

export interface ProcessedKeyword extends KeywordData {
  recommendation: string;
  newBid?: number;
  priorityScore: number;
  color: 'red' | 'yellow' | 'green';
  profitOptimizedBid?: number | null;
  relativeAcos?: number | null;
  relativeCtr?: number | null;
  relativeCvr?: number | null;
  dataConfidence?: 'Low' | 'Medium' | 'High' | null;
  estimatedTotalRoyalty?: number | null;
  effectiveAcos?: number | null;
}

export interface NegativeKeywordSuggestion {
  keyword: string;
  clicks: number;
  spend: number;
}

export interface MatchTypeRecommendation {
  keyword: string;
  currentMatchType: string;
  recommendedMatchType: string;
  reason: string;
}

export interface BidRecommendation {
  keyword: string;
  matchType: string;
  currentBid: number;
  recommendedBid: number;
  action: 'increase' | 'decrease' | 'maintain';
  potentialImpact: string;
}

export interface BudgetAllocation {
  campaignName: string;
  currentPerformance: string;
  recommendation: string;
  potentialImpact: string;
}

export interface CampaignStructure {
  type: 'new-adgroup' | 'split-campaign' | 'move-keywords';
  description: string;
  keywords: string[];
}

export interface PainPoints {
  keywordsWithNoSales: number;
  wastedSpend: number;
  keywordsWithLowCtr: number;
  highAcosKeywords?: number;
  poorMatchTypes?: number;
  inefficientBids?: number;
}

// Analysis Result from the API
export interface FullAnalysis {
  data: AnalyzedKeyword[];
  totalSpend: number;
  totalSales: number;
  averageAcos: number;
  effectiveRoas?: number;
  potentialSavings: number;
  estimatedGain: number;
  netOptimizationPotential: number;
  negativeKeywordSuggestions: string[];
  matchTypeRecommendations: MatchTypeRecommendation[];
  bidRecommendations: BidRecommendation[];
  budgetAllocation: BudgetRecommendation[];
  campaignStructure: CampaignStructureRecommendation[];
  analyzedKeywordsCount: number;
}

export interface AnalysisResult {
  summary?: string;
  painPoints: PainPoints;
  freeRecommendation?: {
    keyword: string;
    clicks: number;
    orders: number;
    action: string;
  };
  fullAnalysis: FullAnalysis;
}

// Form data types
export interface FormData {
  fileData: string;
  targetAcos: number;
  adBudget: number;
  bookCategory: string;
  bookPrice: number;
  royaltyRate: number;
  salesGoal: string;
}

// Payment types
export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  credits: number;
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: number;
  };
}

// API Response types
export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Analysis requests history
export interface AnalysisHistoryEntry {
  id: string;
  userId: string;
  createdAt: Date;
  targetAcos: number;
  bookCategory: string;
  status: 'completed' | 'processing' | 'failed';
}

// Session state for sharing across components
export interface SessionState {
  formData?: FormData;
  analysisResult?: AnalysisResult;
  loading?: boolean;
  error?: string;
}

// State for the form context
export interface FormContextState {
  state: SessionState;
  updateFormData: (data: Partial<FormData>) => void;
  updateAnalysisResult: (result: AnalysisResult | undefined) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  resetState: () => void;
}
