'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/FileUploader';
import FreePreview from '@/components/FreePreview';
import { AmazonAdData, AnalysisResult } from '@/types';
import { useSupabase } from '@/components/SupabaseProvider';

export default function UploadPage() {
  const router = useRouter();
  const { session, openLogin } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<AmazonAdData[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null);

  // Removed parallax scroll effect as it might interfere with dark theme
  // useEffect(() => { ... scroll effect ... }, []);

  const handleDataParsed = async (data: AmazonAdData[]) => {
    setCsvData(data);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisResultId(null);

    try {
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({ message: 'Failed to analyze data' }));
        throw new Error(errorData.message || 'Failed to analyze data');
      }

      const result: AnalysisResult = await analyzeResponse.json();
      setAnalysisResult(result);

      const saveResponse = await fetch('/api/analysis/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({ message: 'Failed to save analysis result' }));
        console.error('Failed to save analysis result:', errorData.message || 'Unknown error');
        setError('Could not save analysis details, but preview is available.');
      } else {
        const saveData = await saveResponse.json();
        if (saveData.id) {
          setAnalysisResultId(saveData.id);
        } else {
          console.error('Save API did not return an ID.');
          setError('Could not retrieve analysis ID, but preview is available.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing your data. Please try again.');
      console.error('Analysis error:', err);
      setAnalysisResult(null);
      setCsvData(null);
      setAnalysisResultId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setCsvData(null);
    setAnalysisResult(null);
    setAnalysisResultId(null);
  };

  const handleUnlock = async () => {
    if (!session) {
      openLogin();
      return;
    }

    if (!analysisResultId) {
      setError('Analysis Result ID is missing. Cannot proceed to payment. Please try re-analyzing.');
      console.error('Attempted to unlock without analysisResultId');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisResultId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to initiate payment session.' }));
        throw new Error(errorData.error || 'Failed to initiate payment session.');
      }

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('Failed to get payment session URL.');
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'An error occurred while initiating payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 md:px-6">
      <div className="w-full max-w-[95%] mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-fuchsia-200 bg-clip-text text-transparent drop-shadow-lg mb-4">
            Amazon KDP Optimizer <span className="text-3xl md:text-5xl">A.I.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300/80 max-w-2xl mx-auto">
            Upload your "Sponsored Products - Targeting" CSV export to get instant, actionable insights and recommendations.
          </p>
        </div>

        {!analysisResult ? (
          <div className="space-y-8">
            <div className="bg-slate-800/60 shadow-2xl rounded-2xl p-8 md:p-10 flex flex-col items-center border border-slate-700/50">
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
          <div className="mt-8 w-full">
            <FreePreview analysisResult={analysisResult} onUnlock={handleUnlock} />
          </div>
        )}

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
