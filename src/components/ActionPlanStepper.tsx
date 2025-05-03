/**
 * ActionPlanStepper – Guided "to-do" wizard
 * ------------------------------------------------
 * • Baut dynamisch Schritte aus fullAnalysis / painPoints
 * • Zeigt Sidebar-Navigation + Fortschritts-Balken
 * • Jede Karte erklärt **warum** und bietet einen Action-Button
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FullAnalysis,
  PainPoints,
  BidRecommendation,
  // BudgetRecommendation, // Budget steps not used in this version
  MatchTypeRecommendation,
  CampaignStructureRecommendation,
  AnalyzedKeyword,
} from '@/types';

import {
  Ban,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ListChecks,
  RefreshCw,
  // DollarSign, // Budget icon not used
  Layers, // Icon for structure
  SlidersHorizontal, // Icon for match type
  Zap,
} from 'lucide-react';

interface ActionPlanStepperProps {
  fullAnalysis: FullAnalysis;
  painPoints: PainPoints;
  onCopyNegatives: () => void;
  copiedNegatives: boolean;
}

const ActionPlanStepper: React.FC<ActionPlanStepperProps> = ({
  fullAnalysis,
  painPoints,
  onCopyNegatives,
  copiedNegatives,
}) => {
  /* ───────────────────── Build FIXED 4 steps ───────────────────── */
  const buildSteps = useCallback(() => {
    /* Extract recommendations */
    const originalNegKeywords = fullAnalysis.negativeKeywordSuggestions || [];
    const actionableBids: BidRecommendation[] =
      fullAnalysis.bidRecommendations?.filter((r) => r.action !== 'maintain') ||
      [];
    const matchChanges: MatchTypeRecommendation[] =
      fullAnalysis.matchTypeRecommendations || [];
    // Filter structure changes to only include adgroup splits/moves for simplicity
    const structureChanges: CampaignStructureRecommendation[] = (
      fullAnalysis.campaignStructure || []
    ).filter((c) => c.type.includes('adgroup') || c.type.includes('keyword')); // Simple filter

    // Create a map for quick lookup of keyword data
    const keywordDataMap = new Map<string, AnalyzedKeyword>();
    (fullAnalysis.data || []).forEach(kwData => {
        keywordDataMap.set(kwData.keyword, kwData);
    });

    // --- Refined Negative Keyword Logic ---
    const filteredNegKeywords = originalNegKeywords.filter(negKw => {
        const kwData = keywordDataMap.get(negKw);
        // Keep if no data found OR if KENP is explicitly 0, null, or undefined
        return !kwData || kwData.estimatedKenpRoyalties === null || kwData.estimatedKenpRoyalties === undefined || kwData.estimatedKenpRoyalties === 0;
    });

    const filteredWastedSpend = filteredNegKeywords.reduce((sum, negKw) => {
        const kwData = keywordDataMap.get(negKw);
        return sum + (kwData?.spend || 0); // Add spend if data exists, otherwise 0
    }, 0);
    // --- End Refined Logic ---

    /* Blueprint array - ALWAYS 4 STEPS */
    const steps: {
      id: string;
      title: string;
      description: string;
      content?: React.ReactNode;
      actionButton?: React.ReactNode;
      icon: React.ReactNode;
      autoComplete: boolean; // Completed if no action needed
    }[] = [];

    /* STEP 1 – Negative keywords - USE FILTERED DATA */
    const hasWastedSpendAction = filteredNegKeywords.length > 0 && filteredWastedSpend > 0;
    steps.push({
      id: 'negatives',
      title: 'Stop Money Drains',
      description: hasWastedSpendAction
        ? `Found ${filteredNegKeywords.length} keywords burning through $${filteredWastedSpend.toFixed(2)} without sales or significant KENP royalties.`
        : 'No keywords found that are clearly wasting money (considering sales & KENP).' , // Updated description
      content: hasWastedSpendAction ? (
        <>
          <div className="flex flex-wrap gap-2 mt-4">
            {/* Show filtered keywords */} 
            {filteredNegKeywords.slice(0, 25).map((kw) => (
              <span
                key={kw}
                className="bg-amber-700/50 text-amber-200 text-xs px-2 py-0.5 rounded-full"
              >
                {kw}
              </span>
            ))}
            {filteredNegKeywords.length > 25 && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                and {filteredNegKeywords.length - 25} more
              </span>
            )}
          </div>
          <div className="mt-3 space-y-2 bg-slate-700/30 p-3 rounded-md">
            <p className="text-xs text-slate-300 font-medium">Your task:</p>
            <p className="text-xs text-slate-400">Pause these keywords or add them as "Negative Exact" in Amazon Ads.</p>
             {/* Optional: Add expert tip here later if desired */}
             {/* <p className="text-xs text-sky-300/70 flex items-center gap-1"> ... Expert Tip ... </p> */}
            <p className="text-xs text-indigo-300 flex items-center gap-1 border-t border-slate-600/40 pt-1 mt-2">
              <Zap className="w-3 h-3" /> Why: Save budget instantly without losing valuable reach.
            </p>
            <p className="text-xs text-amber-300/70 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Note: Manual upload needed in Amazon Ads dashboard
            </p>
          </div>
        </>
      ) : (
        <p className="text-xs text-slate-400 mt-2">Great job! No keywords are currently burning money without converting (sales or KENP).</p> // Updated no-action text
      ),
      actionButton: hasWastedSpendAction ? (
        <button
          // IMPORTANT: This button still triggers onCopyNegatives, which copies the ORIGINAL list.
          // This should be addressed later if possible by passing the filtered list or modifying onCopyNegatives.
          onClick={onCopyNegatives} 
          className={`mt-4 inline-flex items-center px-4 py-2.5 text-sm rounded-md shadow-lg transition ${
            copiedNegatives
              ? 'bg-green-600 text-white'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {copiedNegatives ? (
            <><Check className="w-4 h-4 mr-2" /> Copied!</>
          ) : (
            <><Copy className="w-4 h-4 mr-2" /> Copy Negative List</>
          )}
        </button>
      ) : undefined,
      icon: <Ban className="w-5 h-5 text-red-400" />,
      autoComplete: !hasWastedSpendAction,
    });

    /* STEP 2 – Bid tuning */
    const hasBidAction = actionableBids.length > 0;
    const decreaseCount = actionableBids.filter((b) => b.action === 'decrease').length;
    const increaseCount = actionableBids.filter((b) => b.action === 'increase').length;
    // Get Top 5 bids for display
    const top5Bids = actionableBids.slice(0, 5); // Already filtered non-maintain actions

    steps.push({
      id: 'bids',
      title: 'Fine-tune Your Bids',
      description: hasBidAction
        ? `Optimize ${actionableBids.length} bids: ${decreaseCount > 0 ? `reduce ${decreaseCount}` : ''} ${decreaseCount > 0 && increaseCount > 0 ? ' & ' : ''} ${increaseCount > 0 ? `boost ${increaseCount}` : ''} for better ROI.`
        : 'Your bids are well-balanced for now.',
      content: hasBidAction ? (
        <>
          {/* NEW: Display Top 5 Bid Adjustments */} 
          {top5Bids.length > 0 && (
             <div className="mt-4 mb-5 border border-slate-700/50 rounded-lg overflow-hidden bg-slate-800/30">
              <h5 className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-700/40">
                 Top 5 Recommendations:
               </h5>
               <ul className="divide-y divide-slate-700/50 text-xs">
                 {top5Bids.map((bid, index) => (
                   <li key={index} className="px-3 py-2 flex items-center justify-between gap-2 hover:bg-slate-700/20">
                     <div className="flex-1 truncate">
                       <span className="text-slate-200 font-medium">{bid.keyword}</span>
                       <span className="text-slate-400 ml-1.5 text-[10px]">({bid.matchType})</span>
                     </div>
                     <div className="flex items-center gap-1.5 flex-shrink-0">
                       <span className="text-slate-400">${bid.currentBid.toFixed(2)}</span>
                       <span className="text-slate-300 font-bold">→</span>
                       <span className={`${bid.action === 'increase' ? 'text-green-400' : 'text-red-400'} font-medium`}>
                         ${bid.recommendedBid.toFixed(2)}
                       </span>
                        <span className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold
                          ${bid.action === 'increase' ? 'bg-green-500/20 text-green-300 ring-1 ring-inset ring-green-500/30' : 'bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30'}
                        `}>
                          {bid.action === 'increase' ? 'Raise' : 'Lower'}
                       </span>
                     </div>
                   </li>
                 ))}
               </ul>
               {actionableBids.length > 5 && (
                 <div className="px-3 py-1.5 text-center text-[11px] text-slate-500 bg-slate-700/20">
                   ...and {actionableBids.length - 5} more (see table below or export)
                 </div>
               )}
             </div>
           )}
          {/* End NEW section */} 
          
          {/* Existing "Your task" section */} 
          <div className="mt-3 space-y-2 bg-slate-700/30 p-3 rounded-md">
            <p className="text-xs text-slate-300 font-medium">Your task:</p>
            <p className="text-xs text-slate-400">Apply these bid changes manually in your KDP Ads dashboard.</p>
            <p className="text-xs text-indigo-300 flex items-center gap-1 border-t border-slate-600/40 pt-1 mt-2">
              <Zap className="w-3 h-3" /> Why: Lower costs = better margins. Higher bids where profitable = more sales.
            </p>
            <p className="text-xs text-amber-300/70 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Tip: Refer to the detailed table below or use the 'Export Enhanced Data' button for a reference spreadsheet.
            </p>
          </div>
        </>
      ) : (
         <p className="text-xs text-slate-400 mt-2">Based on current data, your bids are effectively capturing traffic without over or under-spending.</p>
      ),
      icon: <ListChecks className="w-5 h-5 text-blue-400" />,
      autoComplete: !hasBidAction,
    });

    /* STEP 3 – Match type optimisation */
    const hasMatchAction = matchChanges.length > 0;
    steps.push({
      id: 'matchtype',
      title: 'Increase Keyword Precision',
      description: hasMatchAction
        ? `${matchChanges.length} keywords need match type adjustments for better targeting.`
        : 'Your match type usage looks efficient.',
      content: hasMatchAction ? (
        <>
          <ul className="mt-4 space-y-2 text-xs text-slate-400 list-disc ml-5">
            {matchChanges.slice(0, 4).map((m) => (
              <li key={`${m.keyword}-${m.recommendedMatchType}`}>
                <span className="text-slate-300">"{m.keyword}"</span> ({m.currentMatchType} → {m.recommendedMatchType}): {m.reason}
              </li>
            ))}
            {matchChanges.length > 4 && <li>... and {matchChanges.length - 4} more</li>}
          </ul>
          <div className="mt-3 space-y-2 bg-slate-700/30 p-3 rounded-md">
            <p className="text-xs text-slate-300 font-medium">Your task:</p>
            <p className="text-xs text-slate-400">Implement these match type changes manually in Amazon Ads.</p>
            <p className="text-xs text-indigo-300 flex items-center gap-1 border-t border-slate-600/40 pt-1 mt-2">
              <Zap className="w-3 h-3" /> Why: Better relevance = better performance. Less wasted impressions.
            </p>
            <p className="text-xs text-blue-300/70 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Pro tip: Keep broad match + add exact version for better control.
            </p>
          </div>
        </>
      ) : (
         <p className="text-xs text-slate-400 mt-2">No clear opportunities found to improve performance by switching match types right now.</p>
      ),
      actionButton: hasMatchAction ? (
        <button
          disabled // Placeholder - No action implemented yet
          className="mt-4 inline-flex items-center px-4 py-2.5 text-sm rounded-md bg-cyan-700/50 text-cyan-300 shadow-lg cursor-not-allowed opacity-60"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Apply Match Type Changes (Manual Step)
        </button>
      ) : undefined,
      icon: <SlidersHorizontal className="w-5 h-5 text-cyan-400" />,
      autoComplete: !hasMatchAction,
    });

    /* STEP 4 – Campaign structure (Adgroup splitting) */
    const hasStructureAction = structureChanges.length > 0;
    steps.push({
      id: 'structure',
      title: 'Optimize Ad Group Structure',
      description: hasStructureAction
        ? `Restructure ${structureChanges.length} ad groups for better performance and control.`
        : 'Ad group structure appears well-organized.',
      content: hasStructureAction ? (
        <>
          <ul className="mt-4 space-y-2 text-xs text-slate-400 list-disc ml-5">
            {structureChanges.slice(0, 4).map((c, i) => (
              <li key={i}>{c.description} (Keywords: {c.keywords.slice(0, 3).join(', ')}{c.keywords.length > 3 ? '...' : ''})</li>
            ))}
            {structureChanges.length > 4 && <li>... and {structureChanges.length - 4} more</li>}
          </ul>
          <div className="mt-3 space-y-2 bg-slate-700/30 p-3 rounded-md">
            <p className="text-xs text-slate-300 font-medium">Your task:</p>
            <p className="text-xs text-slate-400">Create new ad groups in Amazon Ads for better organization.</p>
            <p className="text-xs text-indigo-300 flex items-center gap-1 border-t border-slate-600/40 pt-1 mt-2">
              <Zap className="w-3 h-3" /> Why: High-performance keywords get dedicated focus and budget.
            </p>
            <p className="text-xs text-purple-300/70 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Note: No file needed - implement directly in Amazon Ads.
            </p>
          </div>
        </>
      ) : (
        <p className="text-xs text-slate-400 mt-2">Your campaigns seem well-structured with relevant keywords grouped together.</p>
      ),
      actionButton: hasStructureAction ? (
         <button
          disabled // Placeholder - No action implemented yet
          className="mt-4 inline-flex items-center px-4 py-2.5 text-sm rounded-md bg-purple-700/50 text-purple-300 shadow-lg cursor-not-allowed opacity-60"
        >
          <Layers className="w-4 h-4 mr-2" />
          Implement Structure Changes (Manual Step)
        </button>
      ) : undefined,
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      autoComplete: !hasStructureAction,
    });

    return steps; // Return in fixed order, no sorting needed
  }, [fullAnalysis, onCopyNegatives, copiedNegatives]);

  /* ───────────── Memoised steps with running numbers ───────────── */
  const steps = useMemo(
    () =>
      buildSteps().map((s, i) => ({
        ...s,
        number: i + 1,
      })),
    [buildSteps]
  );

  /* ──────────────── Active/visited/completed state ─────────────── */
  // Initialize completed state based on autoComplete flag
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [completed, setCompleted] = useState<number[]>(
    steps
      .map((s, i) => (s.autoComplete ? i : -1))
      .filter((i) => i !== -1)
  );

  useEffect(() => {
    // Reset state when steps data changes (e.g., new analysis)
    const initialCompleted = steps
      .map((s, i) => (s.autoComplete ? i : -1))
      .filter((i) => i !== -1);
    setActive(0);
    setVisited([0]);
    setCompleted(initialCompleted);
    // Check if the user manually completed the negatives step previously
    if (copiedNegatives && steps[0] && steps[0].id === 'negatives' && !initialCompleted.includes(0)) {
       setCompleted(prev => [...prev, 0].sort((a,b) => a-b));
    }
     // Add dependency on copiedNegatives to re-evaluate step 1 completion
  }, [steps, copiedNegatives]);


  /* Handlers */
  const goTo = (idx: number) => {
    if (idx < 0 || idx >= steps.length) return;
    setActive(idx);
    if (!visited.includes(idx)) setVisited([...visited, idx].sort((a, b) => a - b));
  };

  const markComplete = (idx: number) => {
    if (!completed.includes(idx)) {
      setCompleted(prev => [...prev, idx].sort((a, b) => a - b));
      // Special handling if step 1 (Negatives) is marked complete manually
      if (idx === 0 && steps[0]?.id === 'negatives' && !copiedNegatives) {
          onCopyNegatives(); // Trigger the copy action if marking step 1 manually
      }
    }
  };


  /* Progress % - based on completed steps */
  const pct = steps.length > 0 ? Math.round((completed.length / steps.length) * 100) : 0;

  /* ────────────────────────── UI ────────────────────────── */
  const step = steps[active];

  // Early exit if steps array is somehow empty (shouldn't happen with fixed steps)
  if (!step) {
     return <div className="p-4 text-center text-slate-400">Loading action plan...</div>;
  }

  // Calculate Profit Boost dynamically
  const netOpt: number = (fullAnalysis as any).netOptimizationPotential || 0;
  const totalRevenue = fullAnalysis.totalSales + (fullAnalysis.data?.reduce((sum, kw) => sum + (kw.estimatedKenpRoyalties || 0), 0) || 0); 
  const currentProfitFromAds = totalRevenue - fullAnalysis.totalSpend;
  let profitBoostText = "";

  if (currentProfitFromAds > 0 && netOpt > 0) {
    const percentageImprovement = (netOpt / currentProfitFromAds) * 100;
    profitBoostText = `Boost Profit by +${percentageImprovement.toFixed(1)}%`;
  } else if (netOpt > 0) {
    profitBoostText = `Improve Profitability`;
  } else {
    profitBoostText = "Profit Optimization"; // Default if no potential
  }

  return (
    <div className="relative bg-slate-800/80 border border-indigo-700/40 rounded-xl shadow-lg mb-10 overflow-hidden">
      {/* animated progress bar */}
      <div
        className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 transition-all duration-500 z-10"
        style={{ width: `${pct}%` }}
      />
      {/* decorative grid */}
      <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent 0%,white 40%,white 60%,transparent 100%)] pointer-events-none" />
      
      {/* NEW CALL TO ACTION BANNER */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-4 border-b border-indigo-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/10 rounded-full p-2 mr-3 shadow-lg shadow-indigo-900/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{profitBoostText}</h3>
              <p className="text-indigo-200 text-sm">With just one file upload + a few clicks</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="bg-white/10 px-3 py-1.5 rounded-full text-indigo-100 text-sm font-medium shadow-inner shadow-indigo-900/30 border border-white/5">
              Download, upload, profit!
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center text-xl font-semibold text-white">
            <div className="bg-indigo-500/20 p-2 rounded-lg mr-3 shadow-inner shadow-indigo-900/20">
              <Zap className="w-5 h-5 text-indigo-300" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-bold">
              Profit Acceleration Plan
            </span>
          </h3>
          <span className="text-sm font-medium bg-indigo-900/30 px-3 py-1 rounded-lg text-indigo-300 border border-indigo-700/30">
            {completed.length}/{steps.length} complete
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* sidebar */}
          <nav className="flex sm:flex-col gap-3 w-full sm:w-60 overflow-x-auto sm:overflow-visible flex-shrink-0 pb-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 w-full text-left border ${
                  i === active
                    ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-900/30 border-indigo-500 scale-105 transform-gpu -translate-x-1'
                    : completed.includes(i)
                    ? 'bg-gradient-to-br from-green-700/30 to-green-900/30 text-green-200 border-green-700/30 hover:scale-102 hover:-translate-x-0.5 transform-gpu'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/60 border-slate-700/50 hover:scale-102 hover:-translate-x-0.5 transform-gpu'
                }`}
              >
                <span className={`w-7 h-7 mr-3 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md ${
                  completed.includes(i) 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                  : i === active
                  ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'
                  : 'bg-slate-700 text-slate-200'
                }`}>
                  {completed.includes(i) ? <Check className="w-3.5 h-3.5" /> : s.number}
                </span>
                <span className="truncate font-medium">
                    {s.title}
                </span>
              </button>
            ))}
          </nav>

          {/* main panel */}
          <section className="flex-1 sm:pl-6 border-l border-slate-700/40 min-w-0">
            <div className="flex items-center mb-3 text-indigo-100">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 mr-3 flex-shrink-0 shadow-lg shadow-indigo-900/30">
                {step.icon}
              </div>
              <h4 className="text-lg font-bold truncate bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                Step {step.number}: {step.title}
              </h4>
               {completed.includes(active) && (
                <span className="ml-3 text-xs bg-green-600/20 text-green-300 px-2.5 py-1 rounded-full flex-shrink-0 border border-green-500/30 shadow-inner shadow-green-900/20">
                  Completed
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-4 ml-13">{step.description}</p>

            <div className="ml-13">
                {step.content}
                {step.actionButton && <div className="mt-4">{step.actionButton}</div>}
            </div>

            {/* footer nav */}
            <div className="flex justify-between mt-8 pt-4 border-t border-slate-700/40">
              <button
                disabled={active === 0}
                onClick={() => goTo(active - 1)}
                className="px-4 py-2 text-sm rounded-lg flex items-center disabled:opacity-40 hover:bg-slate-700/40 text-slate-300 border border-slate-700/40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </button>

              <div className="flex gap-2">
                {!step.autoComplete && (
                  <button
                    onClick={() => markComplete(active)}
                    className={`px-4 py-2 text-sm rounded-lg flex items-center transition-all ${
                      completed.includes(active)
                        ? 'bg-green-700/30 text-green-200 cursor-default border border-green-700/30'
                        : 'bg-green-700/20 text-green-300 hover:bg-green-700/30 border border-green-700/20 hover:border-green-700/40'
                    }`}
                    disabled={completed.includes(active)}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    {completed.includes(active) ? 'Completed' : 'Mark complete'}
                  </button>
                )}
                <button
                  disabled={active === steps.length - 1}
                  onClick={() => goTo(active + 1)}
                  className="px-4 py-2 text-sm rounded-lg flex items-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 shadow-md shadow-indigo-900/30 border border-indigo-500 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

             {/* Final Message */}
             {active === steps.length - 1 && completed.length === steps.length && (
               <div className="mt-6 p-5 bg-gradient-to-br from-green-800/30 to-emerald-800/30 rounded-xl text-center border border-green-700/50 shadow-lg">
                 <p className="text-sm text-green-200 flex items-center justify-center">
                   <Check className="w-5 h-5 text-green-400 mr-2" /> All optimizations complete! Apply changes in Amazon Ads to start profiting.
                 </p>
               </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ActionPlanStepper;