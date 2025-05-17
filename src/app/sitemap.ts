import { MetadataRoute } from 'next';
import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';

interface BlogPostSitemapEntry {
  slug: string;
  updated_at: string | null;
}

async function getPublishedBlogPosts(): Promise<BlogPostSitemapEntry[]> {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined for sitemap generation.');
    return [];
  }
  const supabase = createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kdpninja.app';

  const staticRoutes = [
    { url: siteUrl, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/blog`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/impressum`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/privacy`, lastModified: new Date().toISOString() },
    { url: `${siteUrl}/terms`, lastModified: new Date().toISOString() },
  ];

  const blogPosts = await getPublishedBlogPosts();
  const blogPostRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at).toISOString() : new Date().toISOString(),
  }));

  return [...staticRoutes, ...blogPostRoutes];
}
