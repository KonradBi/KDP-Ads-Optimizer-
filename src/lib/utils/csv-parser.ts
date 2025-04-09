/**
 * CSV parsing utility functions
 */
import Papa from 'papaparse';
import { AmazonAdData } from '@/types';

/**
 * Parse Amazon Ads CSV data
 * @param file - CSV file to parse
 * @returns Promise resolving to parsed AmazonAdData array
 */
export const parseAmazonAdsCsv = (file: File): Promise<AmazonAdData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData: AmazonAdData[] = results.data.map((row: any) => ({
            campaignName: row['Campaign Name'] || '',
            adGroup: row['Ad Group'] || '',
            keyword: row['Keyword'] || '',
            matchType: row['Match Type'] || '',
            impressions: parseInt(row['Impressions'] || '0', 10),
            clicks: parseInt(row['Clicks'] || '0', 10),
            ctr: parseFloat(row['CTR'] || '0') || 0,
            spend: parseFloat(row['Spend'] || '0') || 0,
            orders: parseInt(row['Orders'] || '0', 10),
            sales: parseFloat(row['Sales'] || '0') || 0,
            acos: parseFloat(row['ACOS'] || '0') || 0,
          }));
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
