// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4.29.2'

console.log('generate-landing-page function started');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

// Function to generate a slug from a string
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Fetch up to 5 unprocessed keywords
    const MAX_KEYWORDS_TO_PROCESS = 5;
    console.log(`Fetching up to ${MAX_KEYWORDS_TO_PROCESS} unprocessed keywords...`);
    const { data: keywordsData, error: keywordsError } = await supabaseClient
      .from('generated_keywords')
      .select('*')
      .eq('status', 'new')
      .order('created_at', { ascending: true })
      .limit(MAX_KEYWORDS_TO_PROCESS);

    if (keywordsError) {
      console.error('Error fetching keywords:', keywordsError);
      return new Response(JSON.stringify({ error: `Error fetching keywords: ${keywordsError.message}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!keywordsData || keywordsData.length === 0) {
      console.log('No new keywords to process.');
      return new Response(JSON.stringify({ message: 'No new keywords to process.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${keywordsData.length} keywords to process.`);
    const processedItems: any[] = [];
    const failedItems: any[] = [];

    for (const keyword of keywordsData) {
      const { id: keywordId, keyword_text: keywordText } = keyword;
      console.log(`Processing keyword: "${keywordText}" (ID: ${keywordId})`);

      try {
        // 2. Generate landing page content using OpenAI
        console.log(`Requesting landing page content from OpenAI for keyword: "${keywordText}"...`);
        const mainTopic = keywordText;
        const targetAudience = 'Kindle Direct Publishing (KDP) authors and indie writers';

        const completionPrompt = `
You are an expert SEO content generator. Your task is to generate comprehensive, high-quality landing page content in **English** for the keyword: "${mainTopic}".
The target audience is: ${targetAudience}.

**Output Format Specification (Strict JSON Schema):**
You MUST output a single, valid JSON object. Do NOT include any text outside of this JSON object.
The JSON object MUST conform to the following schema:
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "A compelling, SEO-optimized title for the landing page (around 60-70 characters), in English."
    },
    "meta_description": {
      "type": "string",
      "description": "A concise and engaging meta description (around 150-160 characters), summarizing the page content and including the keyword, in English."
    },
    "article_markdown": {
      "type": "string",
      "description": "The main article content in well-structured English Markdown. See detailed requirements below."
    }
  },
  "required": ["title", "meta_description", "article_markdown"]
}

**Detailed Requirements for \"article_markdown\" Property:**
The content MUST be EXTREMELY comprehensive, deeply insightful, and meticulously well-researched, providing substantial value to ${targetAudience}.

**Critical Structural and Length Requirements for \"article_markdown\":**
The article MUST be structured as follows AND adhere to the specified word counts to achieve the total length:
  1.  **Introduction:** A compelling introduction to "${mainTopic}".
  2.  **Main Sections (H2 Headings):** You MUST create **3 to 4 distinct H2 main sections**. Each H2 section MUST explore a significant sub-topic of "${mainTopic}" in great detail and depth.
      *   **Individual H2 Section Elaboration & Length:** THIS IS CRITICAL. Each H2 main section, on its own, MUST be **approximately 250 to 350 words long**. To achieve this depth and length:
          *   Identify **2 to 3 core thematic points** for the sub-topic of that H2 section.
          *   For each core point, provide **extensive, in-depth explanation (at least 3-5 sentences)**. This MUST include **concrete examples, actionable step-by-step advice, or profound analysis**. The goal is to provide advice so practical that the reader can implement it immediately after reading. Avoid high-level or vague suggestions. Focus on 'how-to' and 'why it matters' for ${targetAudience}.
          *   Ensure the H2 section flows logically, comprehensively covers its sub-topic with genuine depth, and meets the 250-350 word count. Do not make these sections superficial or brief.
          *   Use H3 sub-headings within H2 sections if it helps to organize the detailed content further, but ensure the H2 section as a whole meets the length and depth requirements.
  3.  **Conclusion:** A thoughtful conclusion summarizing the key actionable takeaways and encouraging the reader.

**Total Article Length for \"article_markdown\":**
The ENTIRE "article_markdown" (sum of introduction, all H2 sections, and conclusion) MUST meet a **STRICT MINIMUM of 800 words, with an IDEAL TARGET of 1000-1200 words.** This total word count is a NON-NEGOTIABLE, KEY REQUIREMENT. The primary way to achieve this is by ensuring each of the 3-4 H2 sections robustly meets its individual length requirement of 250-350 words through detailed, actionable elaboration.

**Content Style for \"article_markdown\":**
Naturally incorporate the keyword "${mainTopic}" where it feels organic. Avoid generic statements; the goal is in-depth expertise. Do not use H1 in the article_markdown, as the 'title' property will be used for H1.

**Achieving Depth and Actionability:**
*   **Concrete & Actionable:** Every piece of advice or information MUST be highly concrete and directly actionable for ${targetAudience}. Instead of saying "Optimize your ads," explain *how* to optimize them with specific examples or steps.
*   **Go Deep, Not Broad:** For each H2 sub-topic, focus on providing profound insights and comprehensive explanations on a few key aspects rather than superficially touching on many. Explain the 'why' behind the 'what' and 'how'.
*   **Show, Don't Just Tell:** Use relatable examples relevant to KDP authors to illustrate your points. If you mention a strategy, briefly outline how it would play out.
*   **Value-Driven:** Continuously ask: "What is the immediate, practical takeaway for the reader here?" Ensure every paragraph offers clear value.

**Making the Content More Engaging and Less Dry:**
To ensure the article is not just informative but also engaging and resonates with indie KDP authors, please adhere to the following stylistic guidelines:
*   **Conversational & Encouraging Tone:** Write as if you're directly advising a fellow author. Use "you" and "your." Acknowledge their challenges and offer solutions in an encouraging way. (Example: "As an indie author, you know how challenging it can be to stand out. But what if you could...?").
*   **Relatability and Empathy:** Show understanding of the indie author's journey and pain points. Frame advice in a way that feels like it's coming from someone who 'gets it'.
*   **Benefit-Driven Language:** Clearly connect each piece of advice to tangible benefits for the author (e.g., "This simple tweak can significantly boost your visibility and save you hours of guesswork," or "Imagine your book climbing the ranks without breaking the bank...").
*   **Active Voice & Strong Verbs:** Prioritize active voice and use dynamic, impactful verbs to make the text more lively. Avoid overly passive or academic phrasing.
*   **Illustrative Language (Keep it Concise):** Where appropriate, use short, relatable examples or analogies to clarify complex points. For instance, instead of just saying "target your ads," you could say "Think of targeting your ads like finding the perfect fishing spot: you want to cast your line where the fish you're seeking actually swim." Avoid lengthy, fabricated case studies.
*   **Rhetorical Questions:** Occasionally use well-placed rhetorical questions to engage the reader and prompt them to reflect (e.g., "Struggling to make your ad budget stretch? You're not alone. But what if there was a smarter way?").
*   **Positive & Empowering Framing:** Present information in a way that empowers authors and makes them feel capable of implementing the strategies successfully.
*   **Varied Sentence Structure:** Mix short, punchy sentences with longer, more explanatory ones to improve readability and flow.
*   **Avoid Jargon (or Explain It):** If technical terms are necessary, briefly explain them in simple language suitable for a broad author audience.

**Final Check:**
Before outputting the JSON, re-verify that the "article_markdown" content fulfills all structural requirements, all H2 sections are substantially developed (250-350 words each), and that the total word count meets the 800-1200 word target. An article that is too short, or has underdeveloped H2 sections, is not acceptable.
`;

        const chatCompletion = await openai.chat.completions.create({
          model: 'gpt-4o', // Or your preferred model
          messages: [
            {
              role: 'system',
              content: 'You are an expert SEO content writer specializing in creating engaging and informative landing pages for online businesses. You always respond with valid JSON as per the user\'s instructions.',
            },
            { role: 'user', content: completionPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const openAIResponse = chatCompletion.choices[0]?.message?.content;
        if (!openAIResponse) {
          console.error(`OpenAI response was empty for keyword ID: ${keywordId}.`);
          throw new Error('Failed to get a valid response from OpenAI.');
        }

        let parsedContent;
        try {
          parsedContent = JSON.parse(openAIResponse);
        } catch (e: any) {
          console.error(`Failed to parse OpenAI JSON response for keyword ID: ${keywordId}:`, e.message);
          console.error('Raw OpenAI response:', openAIResponse);
          throw new Error('Failed to parse OpenAI JSON response.');
        }

        const { title, meta_description, article_markdown } = parsedContent;

        if (!title || !meta_description || !article_markdown) {
          console.error(`OpenAI response missing required fields for keyword ID: ${keywordId}.`);
          throw new Error('OpenAI response missing required fields.');
        }

        // 3. Generate slug
        const slug = generateSlug(title);
        console.log(`Generated slug: ${slug} for keyword ID: ${keywordId}`);

        // 4. Save content to seo_landing_pages table
        console.log(`Saving content to seo_landing_pages for keyword ID: ${keywordId}...`);
        const { data: newPageData, error: newPageError } = await supabaseClient
          .from('seo_landing_pages')
          .insert({
            keyword_id: keywordId,
            keyword_text: keywordText,
            slug: slug,
            title: title,
            meta_description: meta_description,
            content_markdown: article_markdown,
            status: 'published',
            published_at: new Date().toISOString(),
          })
          .select()
          .single(); 

        if (newPageError) {
          console.error(`Error saving new page for keyword ID: ${keywordId}:`, newPageError);
          throw new Error(`Error saving new page: ${newPageError.message}`);
        }
        console.log(`New page created successfully with ID: ${newPageData.id} for keyword "${keywordText}"`);

        // 5. Update keyword status to 'completed'
        console.log(`Updating keyword status to 'completed' for keyword ID: ${keywordId}...`);
        const { error: updateKeywordError } = await supabaseClient
          .from('generated_keywords')
          .update({ status: 'completed' })
          .eq('id', keywordId);

        if (updateKeywordError) {
          // Log critical error but don't stop processing other keywords
          console.error(`CRITICAL: Error updating keyword status to 'completed' for ID ${keywordId}:`, updateKeywordError);
          // Decide if this keyword should be added to failedItems or if the page creation is still a success
          // For now, we assume page creation was a success if it reached here, but keyword update failed.
        }
        processedItems.push({ keywordId, keywordText, pageId: newPageData.id, title });

      } catch (error: any) {
        console.error(`Failed to process keyword "${keywordText}" (ID: ${keywordId}): ${error.message}`);
        failedItems.push({ keywordId, keywordText, error: error.message });
        // Optionally, update keyword status to 'error' in DB if you want to track processing errors
        // await supabaseClient.from('generated_keywords').update({ status: 'error' }).eq('id', keywordId);
      }
    } // End of for loop

    console.log('Batch processing finished.');
    return new Response(JSON.stringify({
      message: 'Batch landing page generation process completed.',
      processedCount: processedItems.length,
      failedCount: failedItems.length,
      processed: processedItems,
      failed: failedItems,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Unhandled error in function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
