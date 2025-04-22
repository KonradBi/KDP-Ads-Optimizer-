'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import FileUploader from '@/components/FileUploader';
import FreePreview from '@/components/FreePreview';
import LoginModal from '@/components/LoginModal';
import { AmazonAdData, AnalysisResult } from '@/types';

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, openLogin } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<AmazonAdData[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisResultId, setAnalysisResultId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState<string | undefined>(undefined);

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

  const handleUnlock = useCallback(async (idFromUrl?: string | null) => {
    const targetAnalysisId = idFromUrl || analysisResultId;

    if (!session) {
      console.log('handleUnlock called without session, opening login.');
      openLogin(); 
      return;
    }

    if (!targetAnalysisId) {
      setError('Analysis Result ID is missing. Cannot proceed to payment. Please try re-analyzing.');
      console.error('Attempted to unlock without targetAnalysisId (from state or URL).');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Initiating Stripe checkout session creation for analysis:', targetAnalysisId);
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          analysisId: targetAnalysisId, 
        }), 
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || `Failed to create checkout session: ${paymentResponse.status}`);
      }

      const { sessionId, url } = await paymentResponse.json(); // Expecting session URL or ID
      console.log('Stripe Checkout session created:', sessionId);

      // Redirect user to Stripe Checkout
      if (url) {
        window.location.href = url; // Redirect to Stripe's checkout page
      } else {
        throw new Error('Stripe checkout URL or Session ID not received.');
      }
    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message || 'An error occurred while initiating payment. Please try again.');
      setIsLoading(false);
    }
  }, [session, analysisResultId, openLogin]);

  useEffect(() => {
    const action = searchParams.get('action');
    const analysisIdFromUrl = searchParams.get('analysisResultId');
    console.log('Upload page effect check. Action:', action, 'analysisIdFromUrl:', analysisIdFromUrl, 'Session:', !!session);

    if (session && action === 'complete_unlock' && analysisIdFromUrl) {
      console.log('Detected post-login action: complete_unlock with analysisId:', analysisIdFromUrl);
      
      handleUnlock(analysisIdFromUrl);

      const currentPath = window.location.pathname;
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('action');
      newSearchParams.delete('analysisResultId');
      const newUrl = `${currentPath}${newSearchParams.size > 0 ? `?${newSearchParams.toString()}` : ''}`;
      router.replace(newUrl, { scroll: false });
    }

  }, [session, searchParams, router, handleUnlock]);

  const handleUnlockClick = () => {
    console.log('handleUnlockClick triggered.');
    if (!analysisResult) {
      setError('Please upload and analyze a file first.');
      return;
    }
    if (!analysisResultId) { 
      setError('Analysis ID is missing. Cannot proceed. Please re-analyze.');
      console.error('handleUnlockClick: analysisResultId is missing!');
      return;
    }

    if (session) {
      handleUnlock();
    } else {
      const redirectUrl = `${window.location.origin}/upload?action=complete_unlock&analysisResultId=${analysisResultId}`;
      setLoginRedirectUrl(redirectUrl); 
      setIsLoginModalOpen(true);
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
            <FreePreview analysisResult={analysisResult} onUnlock={handleUnlockClick} />
          </div>
        )}

        {isLoading && (
          <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-400 border-t-transparent mb-4"></div>
            <p className="text-xl text-slate-200 font-semibold">Analyzing your data...</p>
          </div>
        )}

        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            redirectTo={loginRedirectUrl}
          />
        )}
      </div>
    </div>
  );
}
