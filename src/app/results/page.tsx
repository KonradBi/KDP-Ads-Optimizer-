import React, { Suspense } from 'react';
import ResultsClientContent from './ResultsClientContent';

// This remains a Server Component
export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-transparent mb-4"></div>
        <p className="text-xl text-slate-200 font-semibold">Loading analysis results...</p>
      </div>
    }>
      <ResultsClientContent />
    </Suspense>
  );
}
