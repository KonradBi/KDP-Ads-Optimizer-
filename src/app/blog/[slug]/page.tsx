import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';
import SidebarSearchField from '@/components/SidebarSearchField';

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
    .not('id', 'eq', currentArticleId)
    .order('title', { ascending: true })
    .limit(count);

  if (error) {
    console.error('Error fetching related articles:', error.message);
    return null;
  }
  return articles as RelatedArticle[];
}

// Function to fetch latest published articles
async function getLatestPublishedArticles(count: number): Promise<RelatedArticle[] | null> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for server-side client (getLatestPublishedArticles).');
    return null;
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);

  const { data: articles, error } = await supabase
    .from('seo_landing_pages')
    .select('id, title, slug')
    .eq('status', 'published') // Ensure we only get published articles
    // .not('published_at', 'is', null) // Alternative if you prefer checking published_at directly
    .order('published_at', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching latest articles:', error.message);
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
  const latestPosts = await getLatestPublishedArticles(3); // Fetch 3 latest posts

  return (
    <div className="container mx-auto p-4 md:p-8 lg:max-w-screen-xl flex flex-col lg:flex-row gap-8 lg:gap-12">
      
      {/* Main Content Spalte */}
      <main className="lg:w-2/3 w-full">
        <article className="prose prose-invert lg:prose-xl max-w-none">
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
        </article>
      </main>

      {/* Sidebar Spalte */}
      <aside className="lg:w-1/3 w-full lg:mt-0 mt-12">
        <div className="sticky top-24 space-y-8">
          
          {/* Suchfeld */}
          <section>
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Search Articles</h2>
            <SidebarSearchField />
          </section>

          {/* Verwandte Artikel */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-amber-400 mb-4">
                You Might Also Like
              </h2>
              <div className="space-y-4">
                {relatedArticles.map((article) => (
                  <Link 
                    href={`/blog/${article.slug}`} 
                    key={article.id} 
                    className="block p-4 bg-slate-800/70 rounded-lg hover:bg-slate-700/70 transition-colors duration-200 border border-slate-700/50 hover:border-amber-500/30"
                  >
                    <h3 className="font-medium text-amber-300 group-hover:text-amber-200 transition-colors duration-200 text-sm">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Neueste Artikel */}
          {latestPosts && latestPosts.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-amber-400 mb-4">Latest Posts</h2>
              <div className="space-y-4">
                {latestPosts.map((article) => (
                  <Link 
                    href={`/blog/${article.slug}`} 
                    key={article.id} 
                    className="block p-4 bg-slate-800/70 rounded-lg hover:bg-slate-700/70 transition-colors duration-200 border border-slate-700/50 hover:border-amber-500/30"
                  >
                    <h3 className="font-medium text-amber-300 group-hover:text-amber-200 transition-colors duration-200 text-sm">
                      {article.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action (Placeholder) */}
          <section>
            <div className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg text-center shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Boost Your KDP Ads!</h3>
              <p className="text-sm text-slate-800 mb-4">
                Let KDP AdNinja A.I. optimize your campaigns and save you time.
              </p>
              <Link 
                href="/" 
                className="inline-block bg-slate-900 text-white font-semibold py-2 px-5 rounded-md hover:bg-slate-800 transition-colors duration-200"
              >
                Try KDP AdNinja A.I.
              </Link>
            </div>
          </section>

        </div>
      </aside>
    </div>
  );
}
