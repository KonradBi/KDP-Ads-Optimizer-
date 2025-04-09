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
}

export interface AnalysisResult {
  painPoints: {
    keywordsWithNoSales: number;
    wastedSpend: number;
    keywordsWithLowCtr: number;
  };
  freeRecommendation: {
    keyword: string;
    clicks: number;
    orders: number;
    action: string;
  };
  fullAnalysis: {
    data: AnalyzedKeyword[];
    negativeKeywordSuggestions: string[];
    matchTypeRecommendations: MatchTypeRecommendation[];
  };
}

export interface AnalyzedKeyword extends AmazonAdData {
  recommendation: string;
  newBid?: number;
  priorityScore: number;
  color: 'red' | 'green' | 'yellow';
}

export interface MatchTypeRecommendation {
  keyword: string;
  currentMatchType: string;
  recommendedMatchType: string;
  reason: string;
}

export interface PaymentSession {
  id: string;
  url: string;
}
