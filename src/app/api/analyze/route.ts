import { NextRequest, NextResponse } from 'next/server';
import { analyzeAdsData } from '@/lib/utils/analysis';
import { AmazonAdData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid data format. Expected an array of Amazon Ads data.' },
        { status: 400 }
      );
    }
    
    // Validate the data structure
    const isValidData = data.every((item: any) => 
      typeof item.campaignName === 'string' &&
      typeof item.keyword === 'string' &&
      typeof item.matchType === 'string' &&
      !isNaN(item.impressions) &&
      !isNaN(item.clicks) &&
      !isNaN(item.spend) &&
      !isNaN(item.orders) &&
      !isNaN(item.sales)
    );
    
    if (!isValidData) {
      return NextResponse.json(
        { error: 'Invalid data structure. Missing required fields.' },
        { status: 400 }
      );
    }
    
    // Analyze the data
    const analysisResult = analyzeAdsData(data as AmazonAdData[]);
    
    // Return the analysis result
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing data:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the data.' },
      { status: 500 }
    );
  }
}
