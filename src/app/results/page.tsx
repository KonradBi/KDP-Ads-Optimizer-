'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FullResults from '@/components/FullResults';
import { AnalysisResult } from '@/types';
import Link from 'next/link';

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    // If no session ID, try to get analysis from session storage
    if (!sessionId) {
      const storedAnalysis = sessionStorage.getItem('analysisResult');
      if (storedAnalysis) {
        try {
          setAnalysisResult(JSON.parse(storedAnalysis));
          setIsLoading(false);
        } catch (err) {
          setError('Failed to load analysis results.');
          setIsLoading(false);
        }
      } else {
        setError('No analysis results found. Please upload your CSV file first.');
        setIsLoading(false);
      }
      return;
    }
    
    // Verify payment with session ID
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error('Payment verification failed');
        }
        
        const result = await response.json();
        
        if (result.paid) {
          setIsPaid(true);
          
          // Get analysis result from session storage
          const storedAnalysis = sessionStorage.getItem('analysisResult');
          if (storedAnalysis) {
            setAnalysisResult(JSON.parse(storedAnalysis));
          } else {
            setError('Analysis results not found. Please try uploading your CSV again.');
          }
        } else {
          setError('Payment has not been completed. Please complete the payment to view full results.');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError('An error occurred while verifying your payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyPayment();
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {isPaid ? 'Your Complete Analysis Results' : 'Analysis Results'}
          </h1>
          {isPaid && (
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Here's your complete analysis with actionable insights, new bid suggestions, negative keyword and match-type optimization recommendations, all prioritized to help you improve your ad performance.
            </p>
          )}
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back to Upload
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Verifying your payment...</p>
          </div>
        )}
        
        {!isLoading && !error && isPaid && analysisResult && (
          <FullResults analysisResult={analysisResult} />
        )}
        
        {!isLoading && !error && !isPaid && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-yellow-50">
              <h3 className="text-lg font-medium text-yellow-900">Payment Required</h3>
              <p className="mt-1 text-sm text-yellow-600">
                Please complete the payment to view your full analysis results.
              </p>
            </div>
            <div className="px-6 py-5 text-center">
              <p className="text-gray-700 mb-4">
                Your payment has not been completed or verified. Please return to the upload page to try again.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Upload
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
