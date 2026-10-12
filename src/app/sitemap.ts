import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

/* /gamdom is a redirect, not a page, so it is not listed. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE.url}/csgobig`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE.url}/bonuses`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
