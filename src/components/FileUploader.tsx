/**
 * Component for file upload and CSV processing
 */
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { parseAmazonAdsCsv } from '@/lib/utils/csv-parser';
import { AmazonAdData } from '@/types';

interface FileUploaderProps {
  onDataParsed: (data: AmazonAdData[]) => void;
  onError: (error: string) => void;
}

export default function FileUploader({ onDataParsed, onError }: FileUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

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
    <div 
      {...getRootProps()} 
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      
      {isLoading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Processing your CSV file...</p>
        </div>
      ) : (
        <>
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
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
          
          <p className="mt-2 text-sm font-medium text-gray-900">
            {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your Amazon Ads CSV file here'}
          </p>
          
          <p className="mt-1 text-xs text-gray-500">
            Download your Amazon Ads CSV export from 'Sponsored Products – Targeting' and upload it here
          </p>
          
          <button
            type="button"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Select CSV File
          </button>
        </>
      )}
    </div>
  );
}
