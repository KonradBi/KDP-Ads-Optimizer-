'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import FreePreview from '@/components/FreePreview';
import { AmazonAdData, AnalysisResult } from '@/types';

export default function UploadPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<AmazonAdData[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Removed parallax scroll effect as it might interfere with dark theme
  // useEffect(() => { ... scroll effect ... }, []);

  const handleDataParsed = async (data: AmazonAdData[]) => {
    setCsvData(data);
    setIsLoading(true);
    setError(null);

    try {
      // Removed royalty value check and inclusion in requestBody
      // const requestBody = {
      //     adData: data,
      // };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(requestBody), // Old way
        body: JSON.stringify(data), // Send the array directly
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({ message: 'Failed to analyze data' }));
        throw new Error(errorData.message || 'Failed to analyze data');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err: any) { // Catch specific error type
      setError(err.message || 'An error occurred while analyzing your data. Please try again.');
      console.error('Analysis error:', err);
      setAnalysisResult(null); // Clear results on error
      setCsvData(null); // Clear CSV data on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCsvData(null);
    setAnalysisResult(null);
  };

  const handleUnlock = async () => {
    setIsLoading(true);
    setError(null);
    if (analysisResult) {
      try {
        // Store analysis result in sessionStorage
        sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
        
        // Use router.push instead of window.location for better Next.js integration
        router.push('/results');
      } catch (error) {
        console.error('Error during navigation:', error);
        setError('Failed to navigate to results page. Please try again.');
        setIsLoading(false);
      }
    } else {
      setError('Analysis results are missing. Please try uploading again.');
      setIsLoading(false);
    }
  };

  return (
    // Removed specific background, relying on global layout background
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-6">
      <div className="w-full max-w-[95%] mx-auto">
        {/* Styled Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-lg mb-4">
            Amazon KDP Optimizer <span className="text-3xl md:text-5xl">A.I.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto">
            Upload your "Sponsored Products - Targeting" CSV export to get instant, actionable insights and recommendations.
          </p>
        </div>

        {/* Show Uploader OR Free Preview */}
        {!analysisResult ? (
          <div className="space-y-8">
             {/* File Uploader Section */}
             <div className="bg-slate-800/60 shadow-2xl rounded-2xl p-8 md:p-10 flex flex-col items-center border border-slate-700/50">
               {/* Conditionally render error message */}
               {error && (
                   <div className="mb-6 w-full p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg text-center">
                       <p className="font-medium">Error:</p>
                       <p>{error}</p>
                   </div>
               )}
               <FileUploader
                 onDataParsed={handleDataParsed}
                 onError={handleError}
               />
             </div>
          </div>
        ) : (
          // Free Preview Section - Remove max-width to allow full width
          <div className="mt-8 w-full">
            <FreePreview analysisResult={analysisResult} onUnlock={handleUnlock} />
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
           <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
             <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-transparent mb-4"></div>
             <p className="text-xl text-slate-200 font-semibold">Analyzing your data...</p>
           </div>
        )}
      </div>
    </div>
  );
}
