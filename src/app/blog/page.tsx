import { Metadata } from 'next';

export const dynamic = 'force-dynamic'; // Force dynamic rendering, disable caching
import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';
import BlogPostsDisplay from '@/components/BlogPostsDisplay';
// PaginationControls wird jetzt innerhalb von BlogPostsDisplay verwendet
import PaginationControls from '@/components/PaginationControls';

// Define the expected shape of our landing page data for the list
interface LandingPageTeaser {
  id: string;
  title: string;
  meta_description: string;
  slug: string;
  published_at: string | null; // Or created_at if you prefer for ordering
}

// Function to fetch paginated landing pages
async function getAllLandingPages(
  page: number = 1,
  pageSize: number = 10,
  query?: string // Optionaler Suchparameter
): Promise<{ pages: LandingPageTeaser[]; totalCount: number }> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for server-side client (getAllLandingPages).');
    return { pages: [], totalCount: 0 };
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);
  console.log(`[getAllLandingPages] Fetching page: ${page}, pageSize: ${pageSize}, query: ${query}`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Fetch paginated data and total count in parallel
  const [
    { data: pagesData, error: pagesError },
    { count: totalCount, error: countError }
  ] = await Promise.all([
    (() => {
      let pageQuery = supabase
        .from('seo_landing_pages')
        .select('id, title, meta_description, slug, published_at')
        .not('published_at', 'is', null)
        .gte('created_at', new Date(0).toISOString()) // Cache-Busting
        .lte('created_at', new Date(Date.now()).toISOString()); // Cache-Busting

      if (query) {
        // Suche in Titel ODER Meta-Beschreibung. PostgreSQL spezifisch für OR über mehrere ilike.
        // Für eine robustere Suche wäre .textSearch() mit tsvector besser.
        pageQuery = pageQuery.or(`title.ilike.%${query}%,meta_description.ilike.%${query}%`);
      }

      return pageQuery
        .order('published_at', { ascending: false })
        .range(from, to);
    })(),
    (() => {
      let countQuery = supabase
        .from('seo_landing_pages')
        .select('*', { count: 'exact', head: true })
        .not('published_at', 'is', null)
        .gte('created_at', new Date(0).toISOString()) // Cache-Busting
        .lte('created_at', new Date(Date.now()).toISOString()); // Cache-Busting

      if (query) {
        countQuery = countQuery.or(`title.ilike.%${query}%,meta_description.ilike.%${query}%`);
      }
      return countQuery;
    })()
  ]);

  const data = pagesData;
  const error = pagesError || countError;

  console.log('[getAllLandingPages] Raw pagesData:', pagesData);
  console.log('[getAllLandingPages] Raw totalCount:', totalCount);

  if (error) {
    console.error('Error fetching paginated landing pages:', error.message);
    return { pages: [], totalCount: 0 };
  }
  return {
    pages: (data as LandingPageTeaser[]) || [],
    totalCount: totalCount || 0,
  };
}

export const metadata: Metadata = {
  title: 'KDP AdNinja Blog - Tips & Strategies for Amazon KDP Authors',
  description: 'Discover expert advice, tips, and strategies to optimize your Amazon KDP ads, lower ACOS, and boost your book sales on the KDP AdNinja Blog.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'KDP AdNinja Blog - Tips & Strategies for Amazon KDP Authors',
    description: 'Expert advice for KDP authors to optimize ads and boost sales.',
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogIndexPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const initialPage = typeof searchParams?.page === 'string' ? Math.max(1, parseInt(searchParams.page, 10)) : 1;
  const initialSearchQuery = typeof searchParams?.q === 'string' ? searchParams.q : undefined;
  const pageSize = 10; // Standard Artikel pro Seite, kann in BlogPostsDisplay angepasst werden
  
  console.log(`[BlogIndexPage] Initial load - page: ${initialPage}, query: "${initialSearchQuery}", pageSize: ${pageSize}`);

  // Lade initiale Daten basierend auf URL-Parametern (wenn vorhanden)
  const { pages: initialPages, totalCount: initialTotalCount } = await getAllLandingPages(initialPage, pageSize, initialSearchQuery);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-amber-400 mb-4">KDP AdNinja Blog</h1>
        <p className="text-xl text-slate-300">Insights and strategies for Amazon KDP Ads optimization.</p>
      </header>

      <BlogPostsDisplay 
        initialPages={initialPages}
        initialTotalCount={initialTotalCount}
        initialPageSize={pageSize}
      />
    </div>
  );
}
