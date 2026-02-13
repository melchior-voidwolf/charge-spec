import { MetadataRoute } from 'next';
import { sampleChargers } from '@charge-spec/shared';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chargespec.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/chargers`,
      lastModified: new Date(),
    },
  ];

  // Charger detail pages
  const chargerPages = sampleChargers.map((charger) => ({
    url: `${baseUrl}/chargers/${charger.id}`,
    lastModified: new Date(),
  }));

  // Brand pages
  const uniqueBrands = Array.from(new Set(sampleChargers.map((c) => c.brand)));
  const brandPages = uniqueBrands.map((brand) => ({
    url: `${baseUrl}/brand/${encodeURIComponent(brand)}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...chargerPages, ...brandPages];
}
