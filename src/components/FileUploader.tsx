/**
 * Component for file upload and CSV processing
 */
import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseAmazonAdsCsv } from '@/lib/utils/csv-parser';
import { AmazonAdData } from '@/types';
import { ArrowRight, HelpCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FileUploaderProps {
  onDataParsed: (data: AmazonAdData[]) => void;
  onError: (error: string) => void;
}

export default function FileUploader({ onDataParsed, onError }: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      onError('Please upload a CSV file.');
      return;
    }

    const file = acceptedFiles[0];
    
    // Check if file is CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a valid CSV file.');
      return;
    }

    setIsLoading(true);
    
    try {
      const parsedData = await parseAmazonAdsCsv(file);
      
      if (parsedData.length === 0) {
        onError('The CSV file appears to be empty or in an incorrect format.');
        setIsLoading(false);
        return;
      }
      
      onDataParsed(parsedData);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      onError('Failed to parse the CSV file. Please ensure it is a valid Amazon Ads export.');
    } finally {
      setIsLoading(false);
    }
  }, [onDataParsed, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Export Guide Toggle */}
      <div className="mb-6 w-full">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowGuide(!showGuide);
          }} 
          className="flex items-center justify-between w-full p-4 bg-indigo-900/40 hover:bg-indigo-900/60 rounded-lg text-white text-left transition-colors border border-indigo-700/50"
        >
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-indigo-400" />
            <span className="font-medium">How to export your KDP Advertising CSV file</span>
          </div>
          {showGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {/* Export Guide Content */}
        {showGuide && (
          <div className="mt-2 p-6 bg-slate-800/70 border border-slate-700/50 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Step-by-Step CSV Export Guide</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center text-white font-bold border border-indigo-500">1</div>
                </div>
                <div className="md:col-span-7">
                  <h4 className="text-lg font-semibold text-white">Access Campaign Manager</h4>
                  <p className="text-slate-300">Log in to your Amazon KDP account and navigate to <span className="text-amber-400 font-semibold">Sponsored Ads</span> → <span className="text-amber-400 font-semibold">Campaign Manager</span></p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center text-white font-bold border border-indigo-500">2</div>
                </div>
                <div className="md:col-span-7">
                  <h4 className="text-lg font-semibold text-white">Select Your Campaign</h4>
                  <p className="text-slate-300">Navigate to <span className="text-amber-400 font-semibold">Budgets</span> and select the campaign you want to analyze</p>
                  <p className="text-slate-400 text-sm">Note: A new tab will open with your campaign details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center text-white font-bold border border-indigo-500">3</div>
                </div>
                <div className="md:col-span-7">
                  <h4 className="text-lg font-semibold text-white">Choose Ad Group</h4>
                  <p className="text-slate-300">Select the specific ad group you want to analyze data from</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center text-white font-bold border border-indigo-500">4</div>
                </div>
                <div className="md:col-span-7">
                  <h4 className="text-lg font-semibold text-white">Go to Targeting</h4>
                  <p className="text-slate-300">In the side navigation bar, click on <span className="text-amber-400 font-semibold">Targeting</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-start">
                <div className="md:col-span-1 flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center text-white font-bold border border-indigo-500">5</div>
                </div>
                <div className="md:col-span-7">
                  <h4 className="text-lg font-semibold text-white">Export the CSV</h4>
                  <p className="text-slate-300">Look for the <span className="text-amber-400 font-semibold">Export</span> button located at the bottom right above the keyword table</p>
                  <p className="text-slate-400 text-sm mt-1">This will download a CSV file that you can upload here</p>
                  <p className="text-slate-200 text-xs mt-2"><strong>Tip:</strong> For reliable analysis, select <span className="font-semibold text-white">"Last 30 days"</span> or <span className="font-semibold text-white">"Last 60 days"</span> as the reporting period when exporting your data.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <p className="text-slate-300">Make sure you're exporting from <span className="font-semibold text-white">"Sponsored Products – Targeting"</span></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Uploader */}
      <div 
        {...getRootProps()} 
        className={`p-8 sm:p-12 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-950/30' : 'border-slate-700 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-300 text-xl">Processing your CSV file...</p>
          </div>
        ) : (
          <>
            <div className="mx-auto h-24 w-24 text-slate-400 border-2 border-slate-700/50 rounded-full flex items-center justify-center bg-slate-800/50">
              <svg 
                className="h-12 w-12" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            <p className="mt-5 text-xl font-medium text-white">
              {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your Amazon Ads CSV file here'}
            </p>
            
            <p className="mt-3 text-base text-slate-400">
              Once uploaded, we'll analyze your data and provide optimization recommendations
            </p>
            
            <button
              type="button"
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-slate-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
            >
              Select CSV File
            </button>
          </>
        )}
      </div>
    </div>
  );
}
