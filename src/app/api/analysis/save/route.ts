import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/utils/supabase';
import type { AnalysisResult } from '@/types';

export async function POST(request: Request) {
  try {
    const { userId, analysisResult }: { userId: string; analysisResult: AnalysisResult } = await request.json();

    await supabaseAdmin
      .from('analysis_results')
      .insert({
        user_id: userId,
        pain_points: analysisResult.painPoints,
        free_recommendation: analysisResult.freeRecommendation,
        full_analysis: analysisResult.fullAnalysis,
      });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Error saving analysis result:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
