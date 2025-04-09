/**
 * Analysis utility functions for Amazon Ads data
 */
import { AmazonAdData, AnalysisResult, AnalyzedKeyword, MatchTypeRecommendation } from '@/types';

const TARGET_ACOS = 0.35; // 35%
const MIN_BID = 0.20; // €0.20
const LOW_CTR_THRESHOLD = 0.002; // 0.2%

/**
 * Analyze Amazon Ads data to generate recommendations
 * @param data - Array of Amazon Ad data entries
 * @returns Analysis result with pain points, recommendations, and optimizations
 */
export const analyzeAdsData = (data: AmazonAdData[]): AnalysisResult => {
  // Filter out entries with no keyword (could be product targeting)
  const keywordData = data.filter(item => item.keyword.trim() !== '');
  
  // Calculate pain points
  const keywordsWithNoSales = keywordData.filter(item => item.spend > 0 && item.orders === 0);
  const keywordsWithLowCtr = keywordData.filter(item => item.ctr < LOW_CTR_THRESHOLD && item.impressions > 100);
  const wastedSpend = keywordsWithNoSales.reduce((total, item) => total + item.spend, 0);
  
  // Generate one free recommendation
  const freeRecommendationData = keywordsWithNoSales.length > 0 
    ? keywordsWithNoSales.sort((a, b) => b.spend - a.spend)[0] 
    : null;
  
  // Analyze all keywords
  const analyzedKeywords: AnalyzedKeyword[] = keywordData.map(item => {
    let recommendation = '';
    let color: 'red' | 'green' | 'yellow' = 'yellow';
    let priorityScore = 0;
    let newBid;
    
    // Calculate priority score (0-10)
    if (item.spend > 0) {
      priorityScore = Math.min(10, Math.round((item.spend / 5) * 10));
    }
    
    // Generate recommendations
    if (item.clicks > 5 && item.orders === 0) {
      recommendation = 'Pause - Too many clicks with no sales';
      color = 'red';
      priorityScore = Math.min(10, priorityScore + 3);
    } else if (item.ctr < LOW_CTR_THRESHOLD && item.impressions > 100) {
      recommendation = 'Low CTR - may be irrelevant';
      color = 'red';
      priorityScore = Math.min(10, priorityScore + 2);
    } else if (item.acos > TARGET_ACOS && item.orders > 0) {
      recommendation = 'Lower bid - ACOS too high';
      color = 'yellow';
      // Calculate new bid based on target ACOS
      const currentBid = item.spend / item.clicks;
      newBid = Math.max(MIN_BID, currentBid * (TARGET_ACOS / item.acos));
      priorityScore = Math.min(10, priorityScore + 1);
    } else if (item.acos < TARGET_ACOS * 0.7 && item.orders > 0) {
      recommendation = 'Boost - Profitable keyword, consider increasing bid';
      color = 'green';
      // Calculate new bid with a modest increase
      const currentBid = item.spend / item.clicks;
      newBid = currentBid * 1.2; // 20% increase
    }
    
    return {
      ...item,
      recommendation,
      newBid,
      priorityScore,
      color
    };
  });
  
  // Generate negative keyword suggestions
  const negativeKeywordSuggestions = keywordsWithNoSales
    .filter(item => item.clicks > 5)
    .map(item => item.keyword);
  
  // Generate match type recommendations
  const matchTypeRecommendations: MatchTypeRecommendation[] = [];
  
  // Group keywords by their base keyword (ignoring match type)
  const keywordGroups = keywordData.reduce((groups, item) => {
    if (!groups[item.keyword]) {
      groups[item.keyword] = [];
    }
    groups[item.keyword].push(item);
    return groups;
  }, {} as Record<string, AmazonAdData[]>);
  
  // Find keywords that exist in multiple match types and compare performance
  Object.entries(keywordGroups).forEach(([keyword, items]) => {
    if (items.length > 1) {
      // Compare performance across match types
      const exactMatch = items.find(item => item.matchType.toLowerCase() === 'exact');
      const phraseMatch = items.find(item => item.matchType.toLowerCase() === 'phrase');
      const broadMatch = items.find(item => item.matchType.toLowerCase() === 'broad');
      
      if (exactMatch && broadMatch && exactMatch.acos < broadMatch.acos && exactMatch.orders > 0) {
        matchTypeRecommendations.push({
          keyword,
          currentMatchType: 'broad',
          recommendedMatchType: 'exact',
          reason: 'Better ACOS in exact match'
        });
      } else if (phraseMatch && broadMatch && phraseMatch.acos < broadMatch.acos && phraseMatch.orders > 0) {
        matchTypeRecommendations.push({
          keyword,
          currentMatchType: 'broad',
          recommendedMatchType: 'phrase',
          reason: 'Better ACOS in phrase match'
        });
      }
    }
  });
  
  // Sort analyzed keywords by priority score (descending)
  const sortedAnalyzedKeywords = analyzedKeywords.sort((a, b) => b.priorityScore - a.priorityScore);
  
  return {
    painPoints: {
      keywordsWithNoSales: keywordsWithNoSales.length,
      wastedSpend,
      keywordsWithLowCtr: keywordsWithLowCtr.length
    },
    freeRecommendation: freeRecommendationData ? {
      keyword: freeRecommendationData.keyword,
      clicks: freeRecommendationData.clicks,
      orders: freeRecommendationData.orders,
      action: 'PAUSE'
    } : {
      keyword: '',
      clicks: 0,
      orders: 0,
      action: ''
    },
    fullAnalysis: {
      data: sortedAnalyzedKeywords,
      negativeKeywordSuggestions,
      matchTypeRecommendations
    }
  };
};
