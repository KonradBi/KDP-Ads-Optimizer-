/**
 * Test script for CSV parsing with the new Amazon format
 */
import * as fs from 'fs';
import * as path from 'path';
import { AmazonAdData } from '@/types';
import Papa from 'papaparse';

// Mock implementation of the CSV parser for testing with a file path
// instead of a browser File object
const parseAmazonAdsCsv = (filePath: string): Promise<AmazonAdData[]> => {
  return new Promise((resolve, reject) => {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData: AmazonAdData[] = results.data.map((row: any) => {
            // Extract status to use as campaign name if Campaign Name doesn't exist
            const status = row['Status'] || 'UNKNOWN';
            
            return {
              // Use Status as campaign name if no Campaign Name field exists
              campaignName: row['Campaign Name'] || status,
              // Use State as AdGroup if no Ad Group field exists
              adGroup: row['Ad Group'] || row['State'] || '',
              // Keyword should be present in both formats
              keyword: row['Keyword'] || '',
              // Match type is present in both formats but may have different casing
              matchType: row['Match Type'] || row['Match type'] || '',
              // Parse numeric fields, handling both old and new format names
              impressions: parseInt(row['Impressions'] || '0', 10),
              clicks: parseInt(row['Clicks'] || '0', 10),
              // Parse CTR, handling percentage formatting if necessary
              ctr: parseFloat(row['CTR'] || '0') || 0,
              // Handle spend with USD suffix
              spend: parseFloat((row['Spend'] || row['Spend(USD)'] || '0').toString().replace(/[^\d.-]/g, '')) || 0,
              orders: parseInt(row['Orders'] || '0', 10),
              // Handle sales with USD suffix
              sales: parseFloat((row['Sales'] || row['Sales(USD)'] || '0').toString().replace(/[^\d.-]/g, '')) || 0,
              // Handle ACOS, ensuring it's a number
              acos: parseFloat((row['ACOS'] || '0').toString().replace(/[%]/g, '')) / 100 || 0,
            };
          });
          
          // Filter out rows with empty keywords (likely header or footer rows)
          const validData = parsedData.filter(item => item.keyword.trim() !== '');
          
          resolve(validData);
        } catch (error: unknown) {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};

// The main testing function
const testCsvParser = async () => {
  try {
    // Path to CSV file
    const csvPath = path.resolve(process.cwd(), 'Sponsored_Products_adgroup_targeting_Apr_9_2025.csv');
    
    console.log(`Reading CSV file from: ${csvPath}`);
    
    // Parse the CSV file
    const parsedData = await parseAmazonAdsCsv(csvPath);
    
    // Check if we have any data
    if (parsedData.length === 0) {
      console.error('No data was parsed from the CSV file');
      return;
    }
    
    console.log(`Successfully parsed ${parsedData.length} rows of data`);
    
    // Display a sample of the parsed data
    console.log('\nSample of first 3 parsed rows:');
    console.log(JSON.stringify(parsedData.slice(0, 3), null, 2));
    
    // Check for keywords with no sales
    const keywordsWithNoSales = parsedData.filter(item => item.spend > 0 && item.orders === 0);
    console.log(`\nFound ${keywordsWithNoSales.length} keywords with no sales (potential wasted spend)`);
    
    // Check for keywords with low CTR
    const LOW_CTR_THRESHOLD = 0.002; // 0.2%
    const keywordsWithLowCtr = parsedData.filter(item => item.ctr < LOW_CTR_THRESHOLD && item.impressions > 100);
    console.log(`Found ${keywordsWithLowCtr.length} keywords with low CTR (< 0.2%)`);
    
    // Check for high ACOS
    const TARGET_ACOS = 0.35; // 35%
    const keywordsWithHighAcos = parsedData.filter(item => item.acos > TARGET_ACOS && item.orders > 0);
    console.log(`Found ${keywordsWithHighAcos.length} keywords with high ACOS (> 35%)`);
    
    console.log('\nCSV parsing test completed successfully');
  } catch (error: unknown) {
    console.error('Error testing CSV parser:', error);
  }
};

// Run the test
testCsvParser(); 