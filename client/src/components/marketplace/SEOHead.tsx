import { Helmet } from 'react-helmet-async';
import { getCurrentLanguage } from '@/lib/i18n-simple';

const BASE_URL = 'https://www.americanchassisdepot.com';

interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: number;
  priceCurrency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  brand?: string;
  sku?: string;
  category?: string;
  seller?: { name: string; url?: string };
  location?: { city: string; state: string; country?: string };
  offers?: { priceValidUntil?: string; itemCondition?: string };
}

interface ItemListItem {
  name: string;
  url: string;
  image?: string;
  price?: number;
  priceCurrency?: string;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  product?: ProductSchema;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  itemList?: ItemListItem[];
}

export function SEOHead({
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  noindex = false,
  product,
  breadcrumbs,
  faqs,
  itemList,
}: SEOHeadProps) {
  const lang = getCurrentLanguage();
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const defaultImage = `${BASE_URL}/og-marketplace.jpg`;
  const ogImage = image || defaultImage;
  const pathWithoutLang = canonicalPath.replace(/^\/(en|es)/, '');

  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || defaultImage,
    "brand": { "@type": "Brand", "name": product.brand || "American Chassis Depot" },
    "sku": product.sku,
    "category": product.category || "Container Chassis",
    "offers": {
      "@type": "Offer",
      "url": canonicalUrl,
      "priceCurrency": product.priceCurrency || "USD",
      "price": product.price,
      "availability": `https://schema.org/${product.availability}`,
      "itemCondition": `https://schema.org/${product.condition}`,
      "seller": {
        "@type": "Organization",
        "name": product.seller?.name || "American Chassis Depot",
        "url": product.seller?.url || BASE_URL
      },
      ...(product.offers?.priceValidUntil && { "priceValidUntil": product.offers.priceValidUntil })
    },
    ...(product.location && {
      "areaServed": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": product.location.city,
          "addressRegion": product.location.state,
          "addressCountry": product.location.country || "US"
        }
      }
    })
  } : null;

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${BASE_URL}${crumb.url}`
    }))
  } : null;

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "American Chassis Depot Marketplace",
    "url": `${BASE_URL}/en/chassis-marketplace`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/en/chassis-marketplace?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const itemListSchema = itemList && itemList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": itemList.length,
    "itemListElement": itemList.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "url": `${BASE_URL}${item.url}`,
      ...(item.image && { "image": item.image }),
    }))
  } : null;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en${pathWithoutLang}`} />
      <link rel="alternate" hrefLang="es" href={`${BASE_URL}/es${pathWithoutLang}`} />
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/en${pathWithoutLang}`} />
      
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="American Chassis Depot" />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_ES'} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {product && (
        <>
          <meta property="product:price:amount" content={product.price.toString()} />
          <meta property="product:price:currency" content={product.priceCurrency || 'USD'} />
          <meta property="product:availability" content={product.availability === 'InStock' ? 'in stock' : 'out of stock'} />
          <meta property="product:condition" content={product.condition === 'NewCondition' ? 'new' : 'used'} />
          {product.brand && <meta property="product:brand" content={product.brand} />}
        </>
      )}
      
      <meta name="author" content="American Chassis Depot" />
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Houston" />
      
      <script type="application/ld+json">
        {JSON.stringify(webSiteSchema)}
      </script>
      
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
      
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {itemListSchema && (
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;
