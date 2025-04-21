/**
 * CSV parsing utility functions
 */
import Papa from 'papaparse';
import { AmazonAdData } from '@/types';

// Helper to safely parse float, removing currency symbols and handling null/empty
const parseFloatSafe = (value: any): number => {
  if (value === null || value === undefined || typeof value !== 'string' && typeof value !== 'number') {
    return 0;
  }
  const cleanedValue = String(value).replace(/[^\d.-]/g, ''); // Remove $, €, etc.
  const parsed = parseFloat(cleanedValue);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper to safely parse int
const parseIntSafe = (value: any): number => {
  if (value === null || value === undefined || typeof value !== 'string' && typeof value !== 'number') {
    return 0;
  }
  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? 0 : parsed;
};

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
          const parsedData: AmazonAdData[] = results.data.map((row: any) => {
            
            // Map CSV headers (handle variations in casing and spacing)
            const getVal = (keys: string[]): any => {
              for (const key of keys) {
                 // Exact match first
                 if (row[key] !== undefined) return row[key];
                 // Case-insensitive match
                 const lowerKey = key.toLowerCase();
                 const foundKey = Object.keys(row).find(k => k.toLowerCase() === lowerKey);
                 if (foundKey) return row[foundKey];
              }
              return undefined; // Return undefined if no key matches
            };

            // Parse base fields safely
            const campaignName = getVal(['Campaign Name', 'campaign name']) || getVal(['Status']) || 'UNKNOWN';
            const adGroup = getVal(['Ad Group', 'ad group']) || getVal(['State']) || '';
            const keyword = getVal(['Keyword', 'keyword']) || '';
            const matchType = getVal(['Match Type', 'Match type', 'match type']) || '';
            const impressions = parseIntSafe(getVal(['Impressions', 'impressions']));
            const clicks = parseIntSafe(getVal(['Clicks', 'clicks']));
            const ctr = parseFloatSafe(getVal(['CTR', 'ctr'])); // CTR is often a direct decimal
            const spend = parseFloatSafe(getVal(['Spend', 'Spend(USD)', 'spend']));
            const orders = parseIntSafe(getVal(['Orders', 'orders']));
            const sales = parseFloatSafe(getVal(['Sales', 'Sales(USD)', 'sales']));
            const acos = parseFloatSafe(getVal(['ACOS', 'acos'])); // ACOS is often a direct decimal
            
            // Parse new fields safely
            const state = getVal(['State', 'state']);
            const status = getVal(['Status', 'status']);
            const keywordBid = parseFloatSafe(getVal(['Keyword bid', 'Keyword bid(USD)', 'keyword bid']));
            const suggestedBidLow = parseFloatSafe(getVal(['Suggested bid (low)', 'Suggested bid (low)(USD)']));
            const suggestedBidMedian = parseFloatSafe(getVal(['Suggested bid (median)', 'Suggested bid (median)(USD)']));
            const suggestedBidHigh = parseFloatSafe(getVal(['Suggested bid (high)', 'Suggested bid (high)(USD)']));
            const topOfSearchISValue = getVal(['Top-of-search IS', 'top-of-search is']);
            const topOfSearchIS = topOfSearchISValue ? parseFloatSafe(topOfSearchISValue.replace('%', '')) / 100 : undefined; // Handle percentage and convert to decimal
            const kenpRead = parseIntSafe(getVal(['KENP read', 'kenp read']));
            const estimatedKenpRoyalties = parseFloatSafe(getVal(['Estimated KENP royalties', 'Estimated KENP royalties(USD)']));

            return {
              campaignName,
              adGroup,
              keyword,
              matchType,
              impressions,
              clicks,
              ctr,
              spend,
              orders,
              sales,
              acos,
              // Add new fields
              state,
              status,
              keywordBid: keywordBid > 0 ? keywordBid : undefined,
              suggestedBidLow: suggestedBidLow > 0 ? suggestedBidLow : undefined,
              suggestedBidMedian: suggestedBidMedian > 0 ? suggestedBidMedian : undefined,
              suggestedBidHigh: suggestedBidHigh > 0 ? suggestedBidHigh : undefined,
              topOfSearchIS,
              kenpRead: !isNaN(parseIntSafe(getVal(['KENP read', 'kenp read']))) ? parseIntSafe(getVal(['KENP read', 'kenp read'])) : undefined,
              estimatedKenpRoyalties: !isNaN(parseFloatSafe(getVal(['Estimated KENP royalties', 'Estimated KENP royalties(USD)']))) ? parseFloatSafe(getVal(['Estimated KENP royalties', 'Estimated KENP royalties(USD)'])) : undefined,
            };
          });
          
          // Filter out rows with empty keywords (likely header/footer/totals)
          const validData = parsedData.filter(item => item.keyword && item.keyword.trim() !== '');
          
          resolve(validData);
        } catch (error: unknown) {
          console.error('Error parsing CSV:', error);
          reject(new Error('Failed to parse CSV file. Please check the format.')); // Provide a user-friendly error
        }
      },
      error: (error: Error) => {
        console.error('PapaParse error:', error);
        reject(new Error('Error reading the CSV file.')); // Provide a user-friendly error
      }
    });
  });
};
