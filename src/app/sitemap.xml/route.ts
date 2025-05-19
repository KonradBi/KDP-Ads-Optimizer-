import { createClient } from '@supabase/supabase-js';

// Diese sollten idealerweise aus Umgebungsvariablen gelesen werden
const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface BlogPostSitemapEntry {
  slug: string;
  updated_at: string | null;
}

async function getPublishedBlogPosts(): Promise<BlogPostSitemapEntry[]> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for sitemap generation.');
    return [];
  }
  // Erstellen Sie den Supabase-Client direkt hier oder importieren Sie eine Hilfsfunktion
  const supabase = createClient(publicSupabaseUrl, publicSupabaseAnonKey);

  const { data, error } = await supabase
    .from('seo_landing_pages')
    .select('slug, updated_at')
    .not('published_at', 'is', null); // Nur veröffentlichte Artikel

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
  return data || [];
}

function generateSiteMapXml(siteUrl: string, staticRoutes: any[], blogPosts: BlogPostSitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  staticRoutes.forEach(route => {
    xml += '<url>';
    xml += `<loc>${route.url}</loc>`;
    xml += `<lastmod>${route.lastModified}</lastmod>`;
    xml += '<changefreq>daily</changefreq>'; // Oder eine andere passende Frequenz
    xml += '<priority>0.7</priority>'; // Oder eine andere passende Priorität
    xml += '</url>';
  });

  blogPosts.forEach(post => {
    xml += '<url>';
    xml += `<loc>${siteUrl}/blog/${post.slug}</loc>`;
    xml += `<lastmod>${post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString()}</lastmod>`;
    xml += '<changefreq>daily</changefreq>';
    xml += '<priority>0.5</priority>';
    xml += '</url>';
  });

  xml += '</urlset>';
  return xml;
}

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kdpninja.app';

  const staticRoutes = [
    { url: siteUrl, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/impressum`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/terms`, lastModified: new Date().toISOString() },
  ];

  try {
    const blogPosts = await getPublishedBlogPosts();
    const sitemapXml = generateSiteMapXml(siteUrl, staticRoutes, blogPosts);

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
        // Cache für 1 Stunde (3600 Sekunden)
        // Suchmaschinen crawlen Sitemaps nicht ständig, daher ist ein Cache sinnvoll
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}
