/**
 * Analysis utility functions for Amazon Ads data
 * 2025‑04‑18 – Bayesian "no‑sales"‑Erkennung v2
 */
import {
  AmazonAdData,
  AnalysisResult,
  AnalyzedKeyword,
  MatchTypeRecommendation,
  BidRecommendation,
  BudgetRecommendation,
  CampaignStructureRecommendation,
  FullAnalysis
} from '@/types';
// @ts-ignore: Missing type declarations for 'jstat'
import { jStat } from 'jstat';           // <─ NEU

/* ─────────────── Constants & Thresholds ─────────────── */
const MIN_BID = 0.05;

const LOW_CTR_THRESHOLD       = 0.002;   // 0.2 %
const HIGH_ACOS_FACTOR        = 1.5;
const LOW_ACOS_FACTOR         = 0.7;
const MIN_IMPRESSIONS_FOR_CTR_REC = 100;

/* Gain Calculation Parameters */
const TARGET_ACOS_FOR_BOOST = 0.7; // Target ACOS for Boost calculation
const BASE_GAIN_PERCENTAGE  = 0.08; // Base gain percentage
const SENSITIVITY_FACTOR    = 0.15; // How much headroom affects gain

/* Bayes‑Parameter */
const MIN_CR_THRESHOLD = 0.005;          // 0.5 % akzeptable Mindestrate
const MAX_BAD_PROB     = 0.05;           // <5 % Chance, dass CR ≥ 0.5 %
const JEFFREYS_ALPHA   = 0.5;
const JEFFREYS_BETA    = 0.5;

/* Confidence‑Limits */
const LOW_CONF_CLICKS  = 20;
const LOW_CONF_ORDERS  = 2;
const MED_CONF_CLICKS  = 100;
const MED_CONF_ORDERS  = 3;
const HIGH_CONF_CLICKS_NO_ORDERS = 50;

/* ─────────────── Helper Functions ─────────────── */
interface GroupAverages {
  avgCtr: number;
  avgCvr: number;
  avgAcos: number;
  avgKenpRate: number;
}

/** Wahrscheinlich­keit, dass wahre CR ≥ «rate» */
const probConvRateAbove = (
  clicks: number,
  orders: number,
  rate: number
) =>
  1 -
  jStat.beta.cdf(
    rate,
    orders + JEFFREYS_ALPHA,
    clicks - orders + JEFFREYS_BETA
  );

const calculateGroupAverages = (groupData: AmazonAdData[]): GroupAverages => {
  const totalImpressions = groupData.reduce(
    (sum, i) => sum + (i.impressions || 0),
    0
  );
  const totalClicks = groupData.reduce((sum, i) => sum + (i.clicks || 0), 0);
  const totalOrders = groupData.reduce((sum, i) => sum + (i.orders || 0), 0);
  const totalSpend = groupData.reduce((sum, i) => sum + (i.spend || 0), 0);
  const totalSales = groupData.reduce((sum, i) => sum + (i.sales || 0), 0);
  const totalKenp = groupData.reduce(
    (sum, i) => sum + (i.estimatedKenpRoyalties || 0),
    0
  );

  return {
    avgCtr: totalImpressions ? totalClicks / totalImpressions : 0,
    avgCvr: totalClicks ? totalOrders / totalClicks : 0,
    avgAcos: totalSales ? totalSpend / totalSales : 0,
    avgKenpRate: totalClicks ? totalKenp / totalClicks : 0
  };
};

/* ─────────────── Main Analyse‑Function ─────────────── */
export const analyzeAdsData = (data: AmazonAdData[]): AnalysisResult => {
  const keywordData = data.filter(
    (i) => i.keyword?.trim() && i.adGroup?.trim()
  );

  /* ---------- Pain‑Points mit Bayes ---------- */
  const keywordsWithNoRevenue = keywordData.filter((item) => {
    if (item.spend <= 0) return false;

    const clicks = item.clicks || 0;
    const orders = item.orders || 0;

    /* KENP liefert <10 % der Kosten ⇒ zählt nicht als Umsatz */
    const kenpInsignificant =
      (item.estimatedKenpRoyalties || 0) < item.spend * 0.1;

    /* Statistische Bewertung */
    const hopelessBayes =
      clicks > 0 &&
      probConvRateAbove(clicks, orders, MIN_CR_THRESHOLD) < MAX_BAD_PROB;

    /* Einfache Regel: 0 Orders, >20 Klicks */
    const hopelessSimple = orders === 0 && clicks > 20; // NEUE REGEL

    // Keyword ist "No Revenue" wenn eine der beiden Bedingungen zutrifft
    return (kenpInsignificant && hopelessBayes) || hopelessSimple; // Logik angepasst
  });

  const wastedSpend = keywordsWithNoRevenue.reduce(
    (t, i) => t + i.spend,
    0
  );
  const keywordsWithLowCtr = keywordData.filter(
    (i) =>
      (i.ctr ?? 0) < LOW_CTR_THRESHOLD &&
      (i.impressions ?? 0) > MIN_IMPRESSIONS_FOR_CTR_REC
  );

  /* Free Top‑Waste‑KW */
  const freeRecommendationData =
    keywordsWithNoRevenue.length > 0
      ? [...keywordsWithNoRevenue].sort((a, b) => b.spend - a.spend)[0]
      : null;

  /* Totals */
  const totalSpend = keywordData.reduce((t, i) => t + (i.spend || 0), 0);
  const totalSales = keywordData.reduce((t, i) => t + (i.sales || 0), 0);
  const totalKenp = keywordData.reduce(
    (t, i) => t + (i.estimatedKenpRoyalties || 0),
    0
  );
  const totalRevenue = totalSales + totalKenp;
  let totalImpressions = keywordData.reduce((t, i) => t + (i.impressions || 0), 0);
  let totalClicks = keywordData.reduce((t, i) => t + (i.clicks || 0), 0);
  const overallEffectiveAcos = totalRevenue ? totalSpend / totalRevenue : 0;
  const effectiveRoas = totalSpend ? totalRevenue / totalSpend : 0;

  /* Prepare maps & sets */
  const bidRecommendations: BidRecommendation[] = [];
  let potentialSavings = wastedSpend;

  const noRevenueKeySet = new Set(
    keywordsWithNoRevenue.map((i) => `${i.keyword}|${i.matchType}`)
  );

  /* Group Averages pro AdGroup */
  const adGroupDataMap: Record<string, AmazonAdData[]> = {};
  keywordData.forEach((i) => {
    if (!adGroupDataMap[i.adGroup]) adGroupDataMap[i.adGroup] = [];
    adGroupDataMap[i.adGroup].push(i);
  });

  const adGroupAverages: Record<string, GroupAverages> = {};
  for (const ag in adGroupDataMap) {
    adGroupAverages[ag] = calculateGroupAverages(adGroupDataMap[ag]);
  }

  /* ---------- Analyse jede Keyword‑Zeile ---------- */
  const analyzedKeywords: AnalyzedKeyword[] = keywordData.map((item) => {
    let recommendation = '';
    let color: 'red' | 'green' | 'yellow' = 'yellow';
    let priorityScore = 0;
    let newBid: number | undefined;
    let potentialImpact = '';

    const group = adGroupAverages[item.adGroup];

    const clicks = item.clicks || 0;
    const orders = item.orders || 0;
    const spend = item.spend || 0;
    const impressions = item.impressions || 0;

    const sales = item.sales || 0;
    const kenp = item.estimatedKenpRoyalties || 0;
    const revenue = sales + kenp;

    const effAcos = revenue ? spend / revenue : null;
    const ctr = impressions ? clicks / impressions : 0;
    const cvr = clicks ? orders / clicks : 0;
    const bid = item.keywordBid;

    const relAcos =
      group.avgAcos > 0 && item.acos > 0 ? item.acos / group.avgAcos - 1 : null;
    const relCtr = group.avgCtr > 0 ? ctr / group.avgCtr : null;
    const relCvr = group.avgCvr > 0 ? cvr / group.avgCvr : null;

    /* Data‑Confidence */
    let dataConf: AnalyzedKeyword['dataConfidence'] = 'Low';
    if (clicks >= MED_CONF_CLICKS && orders >= MED_CONF_ORDERS) dataConf = 'High';
    else if (orders >= LOW_CONF_ORDERS || clicks >= HIGH_CONF_CLICKS_NO_ORDERS)
      dataConf = 'Medium';

    // Override: If confidence is Low but there are orders, set to Medium
    if (dataConf === 'Low' && orders > 0) {
      dataConf = 'Medium';
    }

    /* ---------- Recommendation‑Tree ---------- */

    /* A) Hopeless (Bayes) */
    const bayesHopeless =
      clicks > 0 &&
      probConvRateAbove(clicks, orders, MIN_CR_THRESHOLD) < MAX_BAD_PROB &&
      kenp < spend * 0.1;

    if (bayesHopeless) {
      recommendation = "Pause – 95 % confidence this keyword won't convert (Sales + KENP)";
      color = 'red';
      priorityScore = Math.min(10, Math.round(spend * 2));
      newBid = MIN_BID;
    }

    /* B) Low CTR  */
    else if (ctr < LOW_CTR_THRESHOLD && impressions > MIN_IMPRESSIONS_FOR_CTR_REC) {
      recommendation = 'Low CTR – Check relevance/creative';
      color = 'yellow';
      priorityScore = Math.min(10, Math.round(impressions / 1_000));
      if (bid && spend > 0) {
        newBid = Math.max(MIN_BID, bid * 0.8);
        const saving = spend - spend * (newBid / bid);
        if (saving > 0 && !noRevenueKeySet.has(`${item.keyword}|${item.matchType}`)) {
            potentialSavings += saving;
        }
        potentialImpact = `Lower bid to $${newBid.toFixed(
          2
        )} while optimising ad copy. (Est. save: $${saving > 0 ? saving.toFixed(2) : '0.00'})`;
        bidRecommendations.push({
          keyword: item.keyword,
          matchType: item.matchType,
          campaignName: item.campaignName,
          adGroupName: item.adGroup,
          currentBid: bid,
          recommendedBid: newBid,
          action: 'decrease',
          potentialImpact
        });
      } else if (bid) {
          newBid = Math.max(MIN_BID, bid * 0.8);
          potentialImpact = `Lower bid to $${newBid.toFixed(2)} while optimising ad copy.`;
          bidRecommendations.push({
            keyword: item.keyword,
            matchType: item.matchType,
            campaignName: item.campaignName,
            adGroupName: item.adGroup,
            currentBid: bid,
            recommendedBid: newBid,
            action: 'decrease',
            potentialImpact
          });
      }
    }

    /* C) Unprofitable ACoTR > 100 % */
    else if (effAcos !== null && effAcos > 1 && dataConf !== 'Low') {
      recommendation = 'Lower Bid – Unprofitable (ACoTR > 100 %)';
      color = 'red';
      priorityScore = Math.min(10, Math.round(spend * 1.5));
      if (bid) {
        const targetBid = Math.max(MIN_BID, bid * (1 / effAcos) * 0.9);
        newBid = targetBid;
        const saving = spend - spend * (newBid / bid);
        if (!noRevenueKeySet.has(`${item.keyword}|${item.matchType}`))
          potentialSavings += saving;
        potentialImpact = `Lower to $${newBid.toFixed(
          2
        )} (est. save $${saving.toFixed(2)}).`;
        bidRecommendations.push({
          keyword: item.keyword,
          matchType: item.matchType,
          campaignName: item.campaignName,
          adGroupName: item.adGroup,
          currentBid: bid,
          recommendedBid: newBid,
          action: 'decrease',
          potentialImpact
        });
      }
    }

    /* D) Group‑relative High ACOS */
    else if (
      relAcos !== null &&
      relAcos > HIGH_ACOS_FACTOR - 1 &&
      orders > 0 &&
      dataConf !== 'Low'
    ) {
      recommendation = `Lower Bid – High ACOS (${(relAcos * 100).toFixed(0)} % vs group)`;
      color = 'yellow';
      priorityScore = Math.min(10, Math.round(spend));
      if (bid) {
        const targetFactor = 1 / (1 + relAcos);
        const targetBid = Math.max(MIN_BID, bid * targetFactor);
        newBid = targetBid;
        const saving = spend - spend * (newBid / bid);
        if (saving > 0 && !noRevenueKeySet.has(`${item.keyword}|${item.matchType}`))
          potentialSavings += saving;
        potentialImpact = `Towards $${newBid.toFixed(2)} (group avg).`;
        bidRecommendations.push({
          keyword: item.keyword,
          matchType: item.matchType,
          campaignName: item.campaignName,
          adGroupName: item.adGroup,
          currentBid: bid,
          recommendedBid: newBid,
          action: 'decrease',
          potentialImpact
        });
      }
    }

    /* E) Profitable */
    else if (
      effAcos !== null &&
      effAcos < LOW_ACOS_FACTOR &&
      (dataConf === 'High' || dataConf === 'Medium')
    ) {
      recommendation = 'Boost – Profitable (low ACoTR)';
      color = 'green';
      priorityScore = Math.min(10, Math.round(revenue * 0.5));
      if (bid) {
        const targetBid = Math.max(MIN_BID, bid * 1.2);
        newBid = targetBid;
        potentialImpact = `Raise to $${newBid.toFixed(2)} for more volume.`;
        bidRecommendations.push({
          keyword: item.keyword,
          matchType: item.matchType,
          campaignName: item.campaignName,
          adGroupName: item.adGroup,
          currentBid: bid,
          recommendedBid: newBid,
          action: 'increase',
          potentialImpact
        });
      }
    }

    /* F) Maintain / default */
    else {
      recommendation = orders ? 'Maintain / Monitor' : 'Monitor – Low data';
      color = orders ? 'green' : 'yellow';
      priorityScore = Math.round(spend * 0.5);
      newBid = bid;
    }

    /* Suggested‑Bid Warnungen */
    if (newBid && item.suggestedBidHigh && newBid > item.suggestedBidHigh * 1.1)
      potentialImpact += ' (above suggested high)';
    if (newBid && item.suggestedBidLow && newBid < item.suggestedBidLow)
      potentialImpact += ' (below suggested low)';

    return {
      ...item,
      recommendation,
      color,
      priorityScore,
      newBid: newBid ? +newBid.toFixed(2) : undefined,
      relativeAcos: relAcos,
      relativeCtr: relCtr,
      relativeCvr: relCvr,
      dataConfidence: dataConf,
      estimatedTotalRoyalty: revenue,
      effectiveAcos: effAcos
    };
  });

  /* ---------- Result‑Collections ---------- */

  const negativeKeywordSuggestions = keywordsWithNoRevenue.map((k) => k.keyword);

  /* Estimated Boost‑Gain - Dynamic Calculation */
  const boostCandidates = analyzedKeywords.filter(
      (k): k is AnalyzedKeyword & { effectiveAcos: number } =>
          k.recommendation!.startsWith('Boost') && 
          typeof k.effectiveAcos === 'number' && 
          k.effectiveAcos < TARGET_ACOS_FOR_BOOST
  );
  
  const estimatedGain = boostCandidates.reduce((totalGain, k) => {
        const revenue = k.estimatedTotalRoyalty || 0;
        const effAcos = k.effectiveAcos; // Already confirmed as number by filter
        
        // Calculate headroom (ensure it's not negative)
        const headroom = Math.max(0, TARGET_ACOS_FOR_BOOST - effAcos);
        
        // Calculate dynamic gain percentage
        const gainPercentage = BASE_GAIN_PERCENTAGE + headroom * SENSITIVITY_FACTOR;
        
        // Add this keyword's potential gain to the total
        return totalGain + revenue * gainPercentage;
    }, 0);

  /* Calculate Net Optimization Potential */
  const netOptimizationPotential = estimatedGain + potentialSavings;

  /* Z‑Score based Match‑Type Recommendations */
  const matchTypeRecommendations: MatchTypeRecommendation[] = [];
  // For each Ad Group, compute mean and stdDev of ACOS and recommend match-type changes based on Z-score
  for (const ag in adGroupDataMap) {
    const groupData = adGroupDataMap[ag];
    const acosVals = groupData.map(i => i.acos || 0);
    const meanAcos = jStat.mean(acosVals);
    const stdDevAcos = jStat.stdev(acosVals, true);
    if (stdDevAcos > 0) {
      for (const item of groupData) {
        const z = (item.acos - meanAcos) / stdDevAcos;
        let recommendedMatchType: string | null = null;
        let reason = '';
        if (z > 1) {
          // Significantly higher ACOS: suggest narrower match type
          if (item.matchType === 'broad') recommendedMatchType = 'phrase';
          else if (item.matchType === 'phrase') recommendedMatchType = 'exact';
          reason = 'Z‑Score > +1: ACOS significantly above ad group average';
        } else if (z < -1) {
          // Significantly lower ACOS: suggest broader match type
          if (item.matchType === 'exact') recommendedMatchType = 'phrase';
          else if (item.matchType === 'phrase') recommendedMatchType = 'broad';
          reason = 'Z‑Score < -1: ACOS significantly below ad group average';
        }
        if (recommendedMatchType) {
          matchTypeRecommendations.push({
            keyword: item.keyword,
            currentMatchType: item.matchType,
            recommendedMatchType,
            reason
          });
        }
      }
    }
  }

  /* Budget‑Recs & Structure‑Recs – unverändert */
  const budgetRecommendations: BudgetRecommendation[] = [];
  
  /* Campaign Structure Recommendations - Basic Heuristic */
  const campaignStructureRecommendations: CampaignStructureRecommendation[] = [];
  const keywordsToPauseSet = new Set(keywordsWithNoRevenue.map(k => `${k.campaignName}|${k.adGroup}|${k.keyword}|${k.matchType}`));

  for (const ag in adGroupDataMap) {
      const groupData = adGroupDataMap[ag];
      const analyzedGroupKeywords = analyzedKeywords.filter(ak => ak.adGroup === ag);

      const hasPausedOrWasted = analyzedGroupKeywords.some(k => 
          k.recommendation?.startsWith('Pause') || keywordsToPauseSet.has(`${k.campaignName}|${k.adGroup}|${k.keyword}|${k.matchType}`)
      );

      const hasBoosted = analyzedGroupKeywords.some(k => k.recommendation?.startsWith('Boost'));

      if (hasPausedOrWasted && hasBoosted) {
          campaignStructureRecommendations.push({
              type: 'split-campaign', // Semantically, split ad group
              description: `Split Ad Group "${ag}": Contains both high performers (Boost candidates) and very low performers (Pause candidates). Consider separating them for better control.`,
              keywords: [] // Keep simple for now
          });
      }
      // Add other heuristics here if needed (e.g., high-performing Exact in Broad/Phrase group)
  }

  /* ---------- Return ---------- */
  const baseFullAnalysis = {
      data: [...analyzedKeywords].sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0)),
      negativeKeywordSuggestions,
      matchTypeRecommendations,
      bidRecommendations,
      budgetAllocation: budgetRecommendations,
      campaignStructure: campaignStructureRecommendations,
      totalSpend,
      totalSales,
      totalImpressions,
      totalClicks,
      averageAcos: overallEffectiveAcos,
      effectiveRoas,
      potentialSavings,
      estimatedGain,
      analyzedKeywordsCount: analyzedKeywords.length
  };
  
  // Add the net potential field using type assertion
  (baseFullAnalysis as any).netOptimizationPotential = netOptimizationPotential;

  return {
    painPoints: {
      keywordsWithNoSales: keywordsWithNoRevenue.length,
      wastedSpend,
      keywordsWithLowCtr: keywordsWithLowCtr.length
    },
    freeRecommendation: freeRecommendationData
      ? {
          keyword: freeRecommendationData.keyword,
          clicks: freeRecommendationData.clicks || 0,
          orders: freeRecommendationData.orders || 0,
          action: 'PAUSE'
        }
      : undefined,
    fullAnalysis: baseFullAnalysis as FullAnalysis // Cast back to FullAnalysis for return
  };
};

/* ───────────── Helper (relative metric) ───────────── */
const formatRelativeMetric = (
  v: number | null | undefined,
  unit: '%' | 'x' = '%'
) => {
  if (v === null || v === undefined || isNaN(v)) return '-';
  return unit === '%'
    ? `${v * 100 >= 0 ? '+' : ''}${(v * 100).toFixed(0)}%`
    : `${v.toFixed(1)}x`;
};
export { formatRelativeMetric };