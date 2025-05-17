import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';

// Define the expected shape of our landing page data
interface LandingPage {
  id: string;
  title: string;
  meta_description: string;
  content_markdown: string;
  slug: string;
  published_at: string | null; // Assuming you might have a published_at field
  // Add other fields if necessary, e.g., created_at, updated_at
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
}

// Function to fetch a single landing page by slug
async function getLandingPage(slug: string): Promise<LandingPage | null> {
  // Create a new Supabase client instance for server-side data fetching
  // using public URL and anon key as blog posts are public
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for server-side client (getLandingPage).');
    return null;
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);

  const { data, error } = await supabase
    .from('seo_landing_pages')
    .select('id, title, meta_description, content_markdown, slug, published_at')
    .eq('slug', slug)
    // .not('published_at', 'is', null) // Optional: only fetch if published_at is set
    .single(); // We expect only one page per slug

  if (error) {
    console.error('Error fetching landing page:', error.message);
    return null;
  }
  return data as LandingPage;
}

// Function to fetch related published articles (newest ones, excluding current)
async function getRelatedPublishedArticles(count: number, currentArticleId: string): Promise<RelatedArticle[] | null> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for server-side client (getRelatedPublishedArticles).');
    return null;
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);

  const { data: articles, error } = await supabase
    .from('seo_landing_pages')
    .select('id, title, slug')
    .eq('status', 'published')
    .neq('id', currentArticleId)
    .order('published_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching related articles:', error.message);
    return null;
  }
  return articles as RelatedArticle[];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getLandingPage(params.slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }

  return {
    title: page.title,
    description: page.meta_description,
    alternates: {
      canonical: `/blog/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.meta_description,
      url: `/blog/${page.slug}`,
      type: 'article',
      // publishedTime: page.published_at || undefined, // Optional: if you have published_at
      // authors: ['KDP AdNinja'], // Optional
    },
    // Add other metadata tags as needed
  };
}

// The page component itself
export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const page = await getLandingPage(params.slug);

  if (!page) {
    notFound(); // Triggers Next.js 404 page
  }

  const relatedArticles = await getRelatedPublishedArticles(3, page.id);

  return (
    <article className="prose prose-invert lg:prose-xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">{page.title}</h1>
        {page.published_at && (
          <p className="text-sm text-slate-400">
            Published on: {new Date(page.published_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        )}
        <p className="text-slate-300 mt-2 italic">{page.meta_description}</p>
      </header>
      
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {page.content_markdown}
      </ReactMarkdown>
      
      {/* Related Articles Section */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mt-16 pt-10 border-t border-slate-600/50">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-12 text-center">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedArticles.map((article) => (
              <Link 
                href={`/blog/${article.slug}`} 
                key={article.id} 
                className="group block"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700/30 hover:border-amber-500/30 transition-all duration-300 ease-out transform hover:-translate-y-1 hover:shadow-amber-500/20 min-h-[220px] flex flex-col justify-between">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full -mr-20 -mt-20 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full -ml-16 -mb-16 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
                    <h3 className="text-lg font-bold text-amber-300 group-hover:text-amber-200 transition-colors duration-200">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
