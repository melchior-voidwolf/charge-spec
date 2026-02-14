import { MetadataRoute } from 'next'
import { allChargers } from '@charge-spec/shared'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chargespec.com'

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
  ]

  // Charger detail pages
  const chargerPages = allChargers.map((charger) => ({
    url: `${baseUrl}/chargers/${charger.id}`,
    lastModified: new Date(),
  }))

  // Brand pages
  const uniqueBrands = Array.from(new Set(allChargers.map((c) => c.brand)))
  const brandPages = uniqueBrands.map((brand) => ({
    url: `${baseUrl}/brand/${encodeURIComponent(brand)}`,
    lastModified: new Date(),
  }))

  return [...staticPages, ...chargerPages, ...brandPages]
}
