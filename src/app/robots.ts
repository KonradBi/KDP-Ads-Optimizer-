import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kdpninja.app'; // Fallback, falls Env Var nicht gesetzt

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // disallow: '/private/', // Beispiel, falls es private Bereiche gäbe
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
