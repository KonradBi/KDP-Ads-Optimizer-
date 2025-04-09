'use client';

import React, { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import FreePreview from '@/components/FreePreview';
import { AmazonAdData, AnalysisResult } from '@/types';

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<AmazonAdData[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const handleDataParsed = async (data: AmazonAdData[]) => {
    setCsvData(data);
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the analyze API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze data');
      }
      
      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError('An error occurred while analyzing your data. Please try again.');
      console.error('Analysis error:', err);
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
    
    try {
      // Call the payment API endpoint
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }
      
      const { url } = await response.json();
      
      // Store the analysis data in session storage for retrieval after payment
      if (analysisResult) {
        sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      }
      
      // Redirect to Stripe checkout
      window.location.href = url;
    } catch (err) {
      setError('An error occurred while processing your payment. Please try again.');
      console.error('Payment error:', err);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Upload Your Amazon Ads CSV
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Get expert insights to optimize your KDP campaign performance
          </p>
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
              </div>
            </div>
          </div>
        )}
        
        {!csvData && !analysisResult && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upload Your CSV File</h3>
              <p className="mt-1 text-sm text-gray-500">
                Download your Amazon Ads CSV export from 'Sponsored Products – Targeting' and upload it here.
              </p>
            </div>
            <div className="px-6 py-5">
              <FileUploader onDataParsed={handleDataParsed} onError={handleError} />
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Analyzing your data...</p>
          </div>
        )}
        
        {!isLoading && analysisResult && (
          <FreePreview analysisResult={analysisResult} onUnlock={handleUnlock} />
        )}
      </div>
    </div>
  );
}
