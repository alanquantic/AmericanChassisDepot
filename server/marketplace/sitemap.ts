import { Router, Request, Response } from 'express';
import { getMarketplaceDb, isMarketplaceAvailable } from './db.js';
import { marketplaceListings, marketplaceChassisTypes, marketplaceConditions } from '../../shared/marketplace-schema.js';
import { eq, desc } from 'drizzle-orm';

const router = Router();

const BASE_URL = 'https://www.americanchassisdepot.com';

// Generate XML sitemap for marketplace listings
router.get('/sitemap-marketplace.xml', async (req: Request, res: Response) => {
  if (!isMarketplaceAvailable()) {
    return res.status(503).send('Marketplace not available');
  }

  try {
    const db = getMarketplaceDb();
    
    // Get all active listings
    const listings = await db
      .select({
        slug: marketplaceListings.slug,
        updatedAt: marketplaceListings.updatedAt,
        primaryImageUrl: marketplaceListings.primaryImageUrl,
        title: marketplaceListings.title,
      })
      .from(marketplaceListings)
      .where(eq(marketplaceListings.status, 'active'))
      .orderBy(desc(marketplaceListings.updatedAt));

    // Get chassis types for category pages
    const chassisTypes = await db
      .select({
        slug: marketplaceChassisTypes.slug,
      })
      .from(marketplaceChassisTypes)
      .where(eq(marketplaceChassisTypes.isActive, true));

    // Get conditions for filter pages
    const conditions = await db
      .select({
        slug: marketplaceConditions.slug,
      })
      .from(marketplaceConditions)
      .where(eq(marketplaceConditions.isActive, true));

    const now = new Date().toISOString();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Marketplace Landing Pages -->
  <url>
    <loc>${BASE_URL}/en/marketplace</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/marketplace"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/marketplace"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en/marketplace"/>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/es/marketplace</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/marketplace"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/marketplace"/>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Marketplace Browse Pages -->
  <url>
    <loc>${BASE_URL}/en/chassis-marketplace</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/chassis-marketplace"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/chassis-marketplace"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en/chassis-marketplace"/>
    <changefreq>hourly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>${BASE_URL}/es/chassis-marketplace</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/chassis-marketplace"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/chassis-marketplace"/>
    <changefreq>hourly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Category Pages by Chassis Type -->
${chassisTypes.map(type => `  <url>
    <loc>${BASE_URL}/en/chassis-marketplace?chassisType=${type.slug}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/chassis-marketplace?chassisType=${type.slug}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/chassis-marketplace?chassisType=${type.slug}"/>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Condition Filter Pages -->
${conditions.map(cond => `  <url>
    <loc>${BASE_URL}/en/chassis-marketplace?condition=${cond.slug}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/chassis-marketplace?condition=${cond.slug}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/chassis-marketplace?condition=${cond.slug}"/>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}

  <!-- Individual Listing Pages -->
${listings.map(listing => {
  const lastmod = listing.updatedAt ? new Date(listing.updatedAt).toISOString() : now;
  const imageTag = listing.primaryImageUrl 
    ? `
    <image:image>
      <image:loc>${listing.primaryImageUrl}</image:loc>
      <image:title>${escapeXml(listing.title || '')}</image:title>
    </image:image>` 
    : '';
  return `  <url>
    <loc>${BASE_URL}/en/chassis-marketplace/${listing.slug}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/chassis-marketplace/${listing.slug}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/chassis-marketplace/${listing.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/en/chassis-marketplace/${listing.slug}"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>${imageTag}
  </url>`;
}).join('\n')}

</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Sitemap index for robots.txt
router.get('/sitemap-index.xml', async (req: Request, res: Response) => {
  const now = new Date().toISOString();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/api/marketplace/sitemap-marketplace.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default router;
