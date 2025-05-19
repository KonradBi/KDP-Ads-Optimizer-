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
      <div className="mb-12 relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search articles by title or description..."
            className="w-full p-4 pl-12 text-lg bg-slate-800/80 border border-slate-700 rounded-xl shadow-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none placeholder-slate-400 text-white transition-all duration-300 hover:bg-slate-700/80"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-slate-400 italic">Showing results for "{searchTerm}"</p>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-slate-400">Loading...</p>
      ) : pages && pages.length === 0 && searchTerm ? (
        <p className="text-center text-slate-400">No articles found for "{searchTerm}".</p>
      ) : pages && pages.length === 0 ? (
         <p className="text-center text-slate-400">No blog posts published yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pages && pages.map((page) => (
            <article key={page.id} className="flex flex-col p-0 bg-slate-800/80 rounded-xl shadow-lg hover:shadow-xl hover:shadow-teal-500/20 hover:scale-[1.02] transform transition-all duration-300 border border-slate-700/50 overflow-hidden group">
              {/* Farbiger oberer Rand - Blau-Türkis Verlauf */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-teal-400"></div>
              
              <div className="p-6 flex flex-col h-full">
                <h2 className="text-2xl font-bold text-amber-300 mb-3 group-hover:text-amber-200 transition-colors line-clamp-2">
                  <Link href={`/blog/${page.slug}`} className="hover:text-amber-200 transition-colors">
                    {page.title}
                  </Link>
                </h2>
                
                {page.published_at && (
                  <p className="text-xs text-slate-400 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(page.published_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                )}
                
                <p className="text-slate-300 mb-5 line-clamp-3 flex-grow">
                  {page.meta_description}
                </p>
                
                <Link 
                  href={`/blog/${page.slug}`} 
                  className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-teal-500/20 rounded-lg text-teal-400 hover:text-blue-300 font-medium transition-all duration-300 mt-auto group-hover:bg-slate-700/80 text-sm"
                >
                  Read article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
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
