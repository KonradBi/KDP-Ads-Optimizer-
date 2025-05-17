// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log('generate-keywords function booting up');

// CORS Headers - wichtig für lokale Tests, aber auch generell gut
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import OpenAI from 'https://esm.sh/openai@4.29.2';

// Erweiterte Liste verschiedener Hauptthemen für KDP-Autoren
const diverseMainTopics = [
  'Amazon KDP ads strategy for indie authors',
  'Keyword research techniques for KDP book descriptions',
  'Optimizing Amazon KDP ad bids for profitability',
  'Marketing self-published non-fiction books on Amazon',
  'Using social media to boost KDP sales',
  'Understanding and lowering ACoS for KDP ads',
  'KDP pre-order strategies to maximize book launch impact',
  'Targeting niche audiences with Amazon KDP advertising',
  'Advanced KDP reporting and analytics interpretation',
  'Creative ad copy for Amazon KDP campaigns',
  'Scaling successful KDP ad campaigns effectively',
  'Troubleshooting common KDP ad problems',
  'Amazon Ads for authors: A/B testing strategies',
  'How to use negative keywords in KDP ads',
  'Marketing childrens books with Amazon KDP ads',
  'KDP select vs. going wide: ad strategy implications',
  'Seasonal KDP ad campaigns: planning and execution',
  'Leveraging author brand in KDP advertising',
  'International KDP ad campaigns for global reach',
  'Content marketing strategies to support KDP ads',
  'Email list building for authors using KDP ads',
  'Budgeting for KDP ads: a practical guide',
  'Analyzing competitor strategies in KDP advertising',
  'The role of book cover design in KDP ad success',
  'Utilizing Amazon Author Central for better ad performance'
  // Fügen Sie hier gerne viele weitere Themen hinzu!
];

serve(async (req: Request) => {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', // oder SUPABASE_SERVICE_ROLE_KEY für Admin-Rechte
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables');
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    console.log('Requesting new keywords from OpenAI...');

    // Wähle zufällig ein Hauptthema aus der Liste
    const mainTopic = diverseMainTopics[Math.floor(Math.random() * diverseMainTopics.length)];
    console.log(`[generate-keywords] Selected main topic for this run: ${mainTopic}`); 

    const numberOfKeywords = 5;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Oder ein anderes Modell wie 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: `You are an expert SEO keyword generator. Your goal is to generate ${numberOfKeywords} NEW, DIVERSE, and VERY SPECIFIC long-tail keywords in English related to the main topic provided by the user. Each keyword should explore a DISTINCT niche aspect, user problem, or unique angle within that broader topic. Avoid generic phrasings. Prioritize keywords that indicate a clear user intent (e.g., how-to, best-for, compare, alternatives). Return only the keywords, each on a new line, without any numbering, introductory text, or conversational filler.`,
        },
        { role: 'user', content: `Main topic: "${mainTopic}"` },
      ],
      temperature: 0.85, // Temperatur leicht erhöht für mehr Vielfalt
      max_tokens: 150, // Genug für ca. 5-7 Keywords
      n: 1,
    });

    const keywordsText = completion.choices[0].message?.content?.trim();
    if (!keywordsText) {
      throw new Error('OpenAI did not return any keywords.');
    }

    const keywords = keywordsText.split('\n').map((kw: string) => kw.trim()).filter((kw: string) => kw.length > 0);
    console.log('Generated keywords:', keywords);

    if (keywords.length === 0) {
      return new Response(JSON.stringify({ message: 'No keywords generated or failed to parse.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const keywordsToInsert = keywords.map((kw: string) => ({ 
      keyword_text: kw,
      status: 'new' // Standardstatus für neu generierte Keywords
    }));

    console.log('Inserting keywords into Supabase:', keywordsToInsert);

    const { data, error } = await supabaseClient
      .from('generated_keywords')
      .insert(keywordsToInsert)
      .select();

    if (error) {
      // Spezifische Fehlerbehandlung für Unique Constraint Violation (23505)
      if (error.code === '23505') {
        console.warn('Some keywords already existed (unique constraint violation):', error.message);
        // Hier könntest du versuchen, die nicht-duplikativen Keywords einzeln einzufügen
        // oder einfach eine Erfolgsmeldung mit Warnung zurückgeben.
        // Für diesen ersten Wurf geben wir eine generische Fehlermeldung, aber mit Kontext.
        return new Response(JSON.stringify({ 
          message: 'Keywords generated, but some may already exist.', 
          details: error.message,
          inserted: data 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 207, // Multi-Status, da ein Teil erfolgreich sein könnte
        });
      } else {
        console.error('Supabase insert error:', error);
        throw error; // Wirft den Fehler weiter, um unten abgefangen zu werden
      }
    }

    console.log('Successfully inserted keywords:', data);

    return new Response(JSON.stringify({ message: 'Keywords generated and saved successfully!', keywords: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in function:', error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:
  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-keywords' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
