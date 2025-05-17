'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import PaginationControls from '@/components/PaginationControls';
import { searchBlogArticlesAction } from '@/app/blog/actions'; // Importiere die Server Action

// Define the expected shape of our landing page data
interface LandingPageTeaser {
  id: string;
  title: string;
  meta_description: string;
  slug: string;
  published_at: string | null;
}

// Hilfsfunktion für Debounce
const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};


export default function BlogPostsDisplay({
  initialPages,
  initialTotalCount,
  initialPageSize
}: {
  initialPages: LandingPageTeaser[];
  initialTotalCount: number;
  initialPageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearchQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [pages, setPages] = useState<LandingPageTeaser[]>(initialPages);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = initialPageSize;

  const fetchBlogPosts = useCallback(async (query: string, page: number) => {
    console.log(`[BlogPostsDisplay] Calling Server Action for query: "${query}", page: ${page}`);
    setIsLoading(true);
    try {
      // Rufe die Server Action auf
      const { pages: newPages, totalCount: newTotalCount } = await searchBlogArticlesAction(page, pageSize, query);
      setPages(newPages);
      setTotalCount(newTotalCount);
    } catch (error) {
      console.error("Error fetching blog posts via Server Action:", error);
      setPages(initialPages); // Fallback zu initialen Daten oder leeren Array bei Fehler
      setTotalCount(initialTotalCount);
    }
    setIsLoading(false);

    // URL aktualisieren
    const currentUrlParams = new URLSearchParams(Array.from(searchParams.entries()));
    if (!query) {
      currentUrlParams.delete('q');
    } else {
      currentUrlParams.set('q', query);
    }
    if (page === 1) {
      currentUrlParams.delete('page');
    } else {
      currentUrlParams.set('page', String(page));
    }
    const newSearchString = currentUrlParams.toString();
    const newUrl = `${pathname}${newSearchString ? `?${newSearchString}` : ''}`;
    router.push(newUrl, { scroll: false });

  }, [router, pathname, searchParams, pageSize, initialPages, initialTotalCount]);

  const debouncedFetchBlogPosts = useCallback(debounce(fetchBlogPosts, 400), [fetchBlogPosts]);

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    const pageFromUrl = Number(searchParams.get('page')) || 1;

    // Synchronisiere State mit URL, wenn sie sich extern ändert oder beim ersten Laden
    if (queryFromUrl !== searchTerm || pageFromUrl !== currentPage) {
      setSearchTerm(queryFromUrl);
      setCurrentPage(pageFromUrl);
      // Daten direkt laden, ohne Debounce, wenn URL sich ändert
      fetchBlogPosts(queryFromUrl, pageFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searchParams]); // Nur auf searchParams hören, um externe Änderungen zu erkennen

  useEffect(() => {
    // Nur ausführen, wenn searchTerm sich tatsächlich durch User-Input geändert hat
    // und nicht durch die Synchronisation mit der URL im obigen useEffect.
    // Dies wird getriggert, wenn der User tippt.
    if (searchTerm !== (searchParams.get('q') || '')) {
      setCurrentPage(1); // Bei neuer Suche immer auf Seite 1
      debouncedFetchBlogPosts(searchTerm, 1);
    }
  }, [searchTerm, debouncedFetchBlogPosts, searchParams]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search articles by title or description..."
          className="w-full p-3 text-lg bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none placeholder-slate-400 text-white"
        />
      </div>

      {isLoading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : pages && pages.length === 0 && searchTerm ? (
        <p className="text-center text-slate-400">No articles found for "{searchTerm}".</p>
      ) : pages && pages.length === 0 ? (
         <p className="text-center text-slate-400">No blog posts published yet. Check back soon!</p>
      ) : (
        <div className="space-y-8">
          {pages && pages.map((page) => (
            <article key={page.id} className="p-6 bg-slate-800/70 rounded-xl shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300 border border-slate-700/50">
              <h2 className="text-2xl font-semibold text-amber-300 mb-2">
                <Link href={`/blog/${page.slug}`} className="hover:text-amber-200 transition-colors">
                  {page.title}
                </Link>
              </h2>
              {page.published_at && (
                <p className="text-xs text-slate-400 mb-3">
                  Published: {new Date(page.published_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              )}
              <p className="text-slate-300 mb-4 line-clamp-3">
                {page.meta_description}
              </p>
              <Link href={`/blog/${page.slug}`} className="inline-flex items-center text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Read more &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && !isLoading && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/blog" // basePath muss query-Parameter für die Suche beibehalten
          currentSearchQuery={searchTerm}
        />
      )}
    </div>
  );
}
