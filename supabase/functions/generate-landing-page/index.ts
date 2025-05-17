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

        const outlineGenerationPromptFn = (mainTopic: string, targetAudience: string) => `
You are 'KDP AdNinja', an expert SEO content strategist and direct response copywriter specializing in Amazon KDP ad optimization for indie authors.
Your task is to generate a detailed plan for a comprehensive, high-quality blog article in **English** based on the main topic: "${mainTopic}".
The target audience is: ${targetAudience}.

**Output Format Specification (Strict JSON Schema):**
You MUST output a single, valid JSON object. Do NOT include any text outside of this JSON object.
The JSON object MUST conform to the following schema:
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "A compelling, SEO-optimized title for the article (around 60-70 characters), in English. It should be benefit-driven or curiosity-inducing for ${targetAudience}."
    },
    "meta_description": {
      "type": "string",
      "description": "A concise and engaging meta description (around 150-160 characters), summarizing the article's value and including the main topic, in English."
    },
    "introduction_concept": {
      "type": "string",
      "description": "A 1-2 sentence concept for the article's introduction. It should state the primary problem or goal related to '${mainTopic}' for ${targetAudience} and briefly outline what the article will deliver."
    },
    "h2_sections": {
      "type": "array",
      "minItems": 3,
      "maxItems": 4,
      "items": {
        "type": "object",
        "properties": {
          "h2_title": {
            "type": "string",
            "description": "A clear and benefit-oriented H2 heading for a main section of the article."
          },
          "core_sub_points": {
            "type": "array",
            "minItems": 2,
            "maxItems": 3,
            "items": {
              "type": "string",
              "description": "A specific, actionable, and in-depth core thematic sub-point (talking point) to be elaborated within this H2 section. Each point should form the basis of a detailed explanation, example, or step-by-step advice. Focus on unique insights or advanced tips, not just common knowledge."
            }
          },
          "h2_concept": {
             "type": "string",
             "description": "A 1-2 sentence concept for this H2 section, summarizing its purpose and the value it provides to ${targetAudience} related to '${mainTopic}' and its core_sub_points."
          }
        },
        "required": ["h2_title", "core_sub_points", "h2_concept"]
      }
    },
    "conclusion_concept": {
      "type": "string",
      "description": "A 1-2 sentence concept for the article's conclusion. It should summarize the key actionable takeaways and offer an encouraging final thought for ${targetAudience}."
    }
  },
  "required": ["title", "meta_description", "introduction_concept", "h2_sections", "conclusion_concept"]
}

**Instructions for 'h2_sections.core_sub_points':**
For each H2 section, the 'core_sub_points' MUST be distinct and designed to build a comprehensive, in-depth exploration of the H2's topic. These points are CRITICAL as they will guide the detailed content generation later. They should not be generic, but rather specific aspects that allow for deep dives, examples, and actionable advice. Think about what truly advanced or incredibly practical insights an expert would share for each sub-point.
Each generated H2 section (based on these sub-points) will later need to be 250-350 words.

**Overall Goal:**
This plan will be used to generate a full article of 800-1200 words. The quality of this plan, especially the specificity and actionability of the 'core_sub_points', is paramount for creating a high-value final article.
`;

        // Helper function to generate content for a specific section
        async function generateSectionContent(
          openaiClient: OpenAI,
          sectionType: 'introduction' | 'h2' | 'conclusion',
          mainTopic: string,
          targetAudience: string,
          articleTitle: string, // Overall article title
          sectionData: any // Contains section-specific details like concepts, h2_title, core_sub_points
        ): Promise<string> {
          let sectionPrompt = `You are 'KDP AdNinja', an expert SEO content writer and KDP advertising specialist with over 10 years of experience. Your goal is to write a compelling, insightful, and highly actionable piece of content in English.
Focus on providing extreme value to ${targetAudience}.

**Main Topic of the Article:** "${mainTopic}"
**Overall Article Title:** "${articleTitle}"
**Target Audience:** ${targetAudience}

`;

          let wordCountGoal = "";

          if (sectionType === 'introduction') {
            sectionPrompt += `**Task:** Write a compelling introduction for this article.
**Concept to expand upon:** "${sectionData.introduction_concept}"
**Length:** Approximately 100-150 words.

**Instructions:**
*   Hook the reader immediately by addressing a key pain point or aspiration related to "${mainTopic}" for KDP authors.
*   Clearly state what the article will help them achieve.
*   Set an encouraging and expert tone.
`;
            wordCountGoal = "100-150 words";
          } else if (sectionType === 'h2') {
            sectionPrompt += `**Task:** Write a detailed H2 main section for this article.
**H2 Section Title:** "${sectionData.h2_title}"
**Concept for this H2 section:** "${sectionData.h2_concept}"
**Core Sub-Points to Elaborate In-Depth:**
${sectionData.core_sub_points.map((point: string, index: number) => `  ${index + 1}. ${point}`).join('\n')}

**CRITICAL Length & Depth Requirement for THIS H2 SECTION:** This H2 section, on its own, MUST be **approximately 250 to 350 words long.**

**Instructions for this H2 Section:**
*   Start with the H2 heading: "## ${sectionData.h2_title}".
*   For EACH of the 'Core Sub-Points' listed above, provide extensive, in-depth explanation (at least 3-5 detailed sentences per sub-point). This MUST include concrete examples, actionable step-by-step advice, or profound analysis. The goal is to provide advice so practical that the reader can implement it immediately.
*   Focus on 'how-to' and 'why it matters' for ${targetAudience}.
*   Ensure this H2 section flows logically, comprehensively covers its sub-topic with genuine depth, and robustly meets the 250-350 word count. Do not make this section superficial or brief.
*   You can use H3 sub-headings if it helps organize the detailed content within this H2, but ensure the overall H2 section meets its length and depth requirements.
`;
            wordCountGoal = "250-350 words for this H2 section";
          } else if (sectionType === 'conclusion') {
            sectionPrompt += `**Task:** Write a thoughtful conclusion for this article.
**Concept to expand upon:** "${sectionData.conclusion_concept}"
**Length:** Approximately 100-150 words.

**Instructions:**
*   Summarize the 2-3 most important actionable takeaways from the entire article.
*   Reinforce the main benefits or solutions offered.
*   End with an encouraging and empowering message for KDP authors, possibly with a call to action or a reflective question.
`;
            wordCountGoal = "100-150 words";
          }

          sectionPrompt += `
**Shared Content Style & Quality Guidelines for this Section (Adhere Strictly):**
*   **Tone:** Conversational, encouraging, empathetic, and expert. Write as if directly advising a fellow author. Use "you" and "your."
*   **Actionability:** Every piece of advice MUST be highly concrete and directly actionable.
*   **Depth:** Go deep, not broad. Explain the 'why' behind the 'what' and 'how'.
*   **Examples:** Use short, relatable examples relevant to KDP authors if they help clarify points. (e.g., "Think of targeting your ads like finding the perfect fishing spot...").
*   **Value-Driven:** Ensure every paragraph offers clear value.
*   **Language:** Use benefit-driven language, active voice, strong verbs. Avoid jargon or explain it simply.
*   **Engagement:** Use varied sentence structure. Rhetorical questions can be used sparingly.
*   **Keyword Integration:** Naturally incorporate terms related to "${mainTopic}" where organic, but prioritize natural language and value.
*   **Output:** Provide ONLY the Markdown content for this specific section, adhering to the ~${wordCountGoal} length. Do NOT include any other text, titles (unless it's the H2 title itself), or JSON formatting.
`;

          console.log(`Requesting content for section: ${sectionType} - ${sectionData.h2_title || articleTitle} from OpenAI...`);
          const chatCompletion = await openaiClient.chat.completions.create({
            model: 'gpt-4o', 
            messages: [
              {
                role: 'system',
                content: 'You are \'KDP AdNinja\', an expert SEO content writer and KDP advertising specialist. You write in clear, engaging, and actionable English Markdown. You will only output the requested Markdown content for the specific section, without any extra text or formatting.',
              },
              { role: 'user', content: sectionPrompt },
            ],
            temperature: 0.7,
          });

          const sectionMarkdown = chatCompletion.choices[0]?.message?.content;
          if (!sectionMarkdown) {
            console.error(`OpenAI response was empty for section: ${sectionType} - ${sectionData.h2_title || articleTitle}.`);
            throw new Error('Failed to get a valid response from OpenAI for section content.');
          }
          return sectionMarkdown.trim();
        }

        // --- Phase 1: Generate Outline, Title, Meta Description ---
        console.log(`Requesting article outline from OpenAI for keyword: "${keywordText}"...`);
        const currentOutlinePrompt = outlineGenerationPromptFn(mainTopic, targetAudience);
        const outlineCompletion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: "You are 'KDP AdNinja', an expert SEO content strategist. You always respond with valid JSON as per the user's instructions.",
            },
            { role: 'user', content: currentOutlinePrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.6, // Slightly lower temp for structured output
        });

        const outlineResponseJson = outlineCompletion.choices[0]?.message?.content;
        if (!outlineResponseJson) {
          console.error(`OpenAI outline response was empty for keyword ID: ${keywordId}.`);
          throw new Error('Failed to get a valid outline response from OpenAI.');
        }

        let outlineData;
        try {
          outlineData = JSON.parse(outlineResponseJson);
        } catch (e: any) {
          console.error(`Failed to parse OpenAI JSON outline for keyword ID: ${keywordId}:`, e.message);
          console.error('Raw OpenAI outline response:', outlineResponseJson);
          throw new Error('Failed to parse OpenAI JSON outline.');
        }

        const { title, meta_description, introduction_concept, h2_sections, conclusion_concept } = outlineData;

        if (!title || !meta_description || !introduction_concept || !h2_sections || !conclusion_concept) {
          console.error(`OpenAI outline response missing required fields for keyword ID: ${keywordId}. Received:`, outlineData);
          throw new Error('OpenAI outline response missing required fields.');
        }

        // --- Phase 2: Generate Content for Each Section ---
        let fullArticleMarkdown = "";

        // Generate Introduction
        const introMarkdown = await generateSectionContent(openai, 'introduction', mainTopic, targetAudience, title, { introduction_concept });
        fullArticleMarkdown += introMarkdown + "\n\n";

        // Generate H2 Sections
        for (const h2Section of h2_sections) {
          const h2Markdown = await generateSectionContent(openai, 'h2', mainTopic, targetAudience, title, h2Section);
          fullArticleMarkdown += h2Markdown + "\n\n";
        }

        // Generate Conclusion
        const conclusionMarkdown = await generateSectionContent(openai, 'conclusion', mainTopic, targetAudience, title, { conclusion_concept });
        fullArticleMarkdown += conclusionMarkdown;
        
        const article_markdown = fullArticleMarkdown.trim();

        if (article_markdown.length < 500) { // Basic sanity check for total length
            console.warn(`Generated article for keyword ID ${keywordId} is shorter than expected: ${article_markdown.length} characters. Title: ${title}`);
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
