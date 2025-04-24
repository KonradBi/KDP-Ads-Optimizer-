"use client";
import { Check } from "lucide-react";

export default function AdBudgetGuardianSummary() {
  return (
    <div className="space-y-8">
      {/* Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Negative Keywords */}
        <div className="bg-red-700/80 p-6 rounded-xl border border-red-500/50 shadow-lg text-white">
          <p className="text-sm font-bold mb-1">Negative Keywords</p>
          <p className="text-2xl font-bold mb-1">18</p>
          <p className="text-xs text-red-100">wasteful keywords found</p>
          <p className="text-xs text-red-100/80 italic mb-2">$237.50 spent with no conversions</p>
          <p className="text-xs font-medium bg-red-900/60 p-1 rounded border border-red-400/30">✓ Action: Add as negative keywords</p>
        </div>
        {/* Bid Optimization */}
        <div className="bg-orange-600/80 p-6 rounded-xl border border-orange-500/50 shadow-lg text-white">
          <p className="text-sm font-bold mb-1">Bid Optimization</p>
          <p className="text-2xl font-bold mb-1">26</p>
          <p className="text-xs text-orange-100">bid adjustments recommended</p>
          <p className="text-xs text-orange-100/80 italic mb-2">14 decreases & 12 increases</p>
          <p className="text-xs font-medium bg-orange-800/60 p-1 rounded border border-orange-400/30">✓ Action: Adjust bids manually in KDP</p>
        </div>
        {/* Match Types */}
        <div className="bg-yellow-600/70 p-6 rounded-xl border border-yellow-500/50 shadow-lg text-white">
          <p className="text-sm font-bold mb-1">Match Types</p>
          <p className="text-2xl font-bold mb-1">8</p>
          <p className="text-xs text-yellow-100">match type improvements</p>
          <p className="text-xs text-yellow-100/80 italic mb-2">Mostly broad to phrase/exact changes</p>
          <p className="text-xs font-medium bg-yellow-800/60 p-1 rounded border border-yellow-400/30">✓ Action: Update match types in KDP</p>
        </div>
        {/* ACOS Improvement */}
        <div className="bg-green-600/80 p-6 rounded-xl border border-green-500/50 shadow-lg text-white">
          <p className="text-sm font-bold mb-1">ACOS Improvement</p>
          <p className="text-2xl font-bold mb-1">-9.8%</p>
          <p className="text-xs text-green-100">potential ACOS reduction</p>
          <p className="text-xs text-green-100/80 italic mb-2">From 42.3% down to 32.5%</p>
          <p className="text-xs font-medium bg-green-800/60 p-1 rounded border border-green-400/30">✓ Action: Follow optimization plan</p>
        </div>
      </div>
      {/* ACOS Improvement Panel */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-700/80 shadow-xl shadow-indigo-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/80 bg-gradient-to-r from-slate-800 to-slate-900/80">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="bg-indigo-600/20 p-1.5 rounded-lg mr-2">
              {/* Icon could go here */}
              <span className="text-indigo-400">LL</span>
            </span>
            ACOS Improvement
          </h3>
          <p className="mt-1 text-sm text-slate-300/80">See the difference optimization makes</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-slate-300 text-sm">Before Optimization</span>
              <span className="ml-auto font-semibold text-white">42.3%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-slate-300 text-sm">After Optimization</span>
              <span className="ml-auto font-semibold text-white">32.5%</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-indigo-300 font-bold">↳ ACOS Reduction:</span>
              <span className="ml-auto text-indigo-100 font-bold text-lg">-23.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
