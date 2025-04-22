import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/utils/supabase';
import type { AnalysisResult } from '@/types';

export async function POST(request: Request) {
  try {
    // Read analysisResult directly from request body (no auth required for free preview)
    const analysisResult: AnalysisResult = await request.json();

    // Basic validation of payload (freeRecommendation is optional)
    if (!analysisResult || !analysisResult.painPoints || !analysisResult.fullAnalysis) {
      console.error('Save analysis error: Invalid analysisResult data received.');
      return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400 });
    }

    // Insert using admin client (bypass RLS) and return the new record ID
    const { data, error: dbError } = await supabaseAdmin
      .from('analysis_results')
      .insert({
        pain_points: analysisResult.painPoints,
        free_recommendation: analysisResult.freeRecommendation,
        full_analysis: analysisResult.fullAnalysis,
      })
      .select('id')
      .single();

    if (dbError) {
      console.error('Supabase DB error saving analysis result:', dbError);
      return NextResponse.json({ error: dbError.message || 'DB insert failed' }, { status: 500 });
    }

    if (!data || !data.id) {
      console.error('No ID returned after analysis_results insert');
      return NextResponse.json({ error: 'No ID returned' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err: any) {
    console.error('Error saving analysis result:', err);
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}
