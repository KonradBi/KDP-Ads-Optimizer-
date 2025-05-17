'use server';

import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';

// LandingPageTeaser Definition (könnte in eine gemeinsame types.ts Datei ausgelagert werden)
interface LandingPageTeaser {
  id: string;
  title: string;
  meta_description: string;
  slug: string;
  published_at: string | null;
}

// Die Logik von getAllLandingPages wird hierher kopiert und angepasst,
// um direkt von einer Server Action genutzt zu werden.
async function fetchLandingPagesForAction(
  page: number = 1,
  pageSize: number = 10,
  query?: string
): Promise<{ pages: LandingPageTeaser[]; totalCount: number }> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for server-side client (fetchLandingPagesForAction).');
    // Im Fehlerfall leere Ergebnisse oder spezifischen Fehler werfen, den der Client behandeln kann
    return { pages: [], totalCount: 0 };
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);
  console.log(`[Server Action - fetchLandingPagesForAction] Fetching page: ${page}, pageSize: ${pageSize}, query: "${query}"`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Parallele Abfragen für Daten und Gesamtanzahl
  const dataQueryBuilder = () => {
    let sbQuery = supabase
      .from('seo_landing_pages')
      .select('id, title, meta_description, slug, published_at')
      .not('published_at', 'is', null)
      .gte('created_at', new Date(0).toISOString())      // Cache-Busting
      .lte('created_at', new Date(Date.now()).toISOString()); // Cache-Busting

    if (query) {
      sbQuery = sbQuery.or(`title.ilike.%${query}%,meta_description.ilike.%${query}%`);
    }
    return sbQuery.order('published_at', { ascending: false }).range(from, to);
  };

  const countQueryBuilder = () => {
    let sbQuery = supabase
      .from('seo_landing_pages')
      .select('*', { count: 'exact', head: true })
      .not('published_at', 'is', null)
      .gte('created_at', new Date(0).toISOString())      // Cache-Busting
      .lte('created_at', new Date(Date.now()).toISOString()); // Cache-Busting

    if (query) {
      sbQuery = sbQuery.or(`title.ilike.%${query}%,meta_description.ilike.%${query}%`);
    }
    return sbQuery;
  };

  const [
    { data: pagesData, error: pagesError },
    { count: totalCountData, error: countError }
  ] = await Promise.all([
    dataQueryBuilder(),
    countQueryBuilder()
  ]);

  if (pagesError) {
    console.error('Error fetching pages in Server Action:', pagesError.message);
    // Hier könnte man einen spezifischeren Fehler werfen oder behandeln
  }
  if (countError) {
    console.error('Error fetching total count in Server Action:', countError.message);
  }

  return {
    pages: (pagesData as LandingPageTeaser[] || []),
    totalCount: totalCountData || 0,
  };
}

// Die eigentliche Server Action
export async function searchBlogArticlesAction(
  page: number,
  pageSize: number,
  query?: string
): Promise<{ pages: LandingPageTeaser[]; totalCount: number }> {
  // Hier könnten zusätzliche Berechtigungsprüfungen oder Logging stattfinden
  return fetchLandingPagesForAction(page, pageSize, query);
}
