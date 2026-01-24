import { Helmet } from 'react-helmet-async';
import { getCurrentLanguage } from '@/lib/i18n-simple';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  // Product specific (for Schema.org)
  product?: {
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
    seller?: {
      name: string;
      url?: string;
    };
    location?: {
      city: string;
      state: string;
      country?: string;
    };
    offers?: {
      priceValidUntil?: string;
      itemCondition?: string;
    };
  };
  // Breadcrumbs for structured data
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  // FAQ for structured data
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
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
}: SEOHeadProps) {
  const lang = getCurrentLanguage();
  const baseUrl = 'https://www.americanchassisdepot.com';
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const defaultImage = `${baseUrl}/og-marketplace.jpg`;
  const ogImage = image || defaultImage;

  // Generate Product Schema.org structured data
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image || defaultImage,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "American Chassis Depot"
    },
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
        "url": product.seller?.url || baseUrl
      },
      ...(product.offers?.priceValidUntil && {
        "priceValidUntil": product.offers.priceValidUntil
      })
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

  // Generate BreadcrumbList Schema.org structured data
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${baseUrl}${crumb.url}`
    }))
  } : null;

  // Generate FAQ Schema.org structured data
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Organization Schema (for brand recognition)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "American Chassis Depot",
    "url": baseUrl,
    "logo": `${baseUrl}/acn.png`,
    "description": "The #1 B2B marketplace for container chassis in the USA",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-XXX-XXXX",
      "contactType": "sales",
      "availableLanguage": ["English", "Spanish"]
    },
    "sameAs": [
      "https://www.facebook.com/americanchassisdepot",
      "https://www.linkedin.com/company/american-chassis-depot"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language URLs */}
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${canonicalPath.replace(/^\/(en|es)/, '')}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${canonicalPath.replace(/^\/(en|es)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${canonicalPath.replace(/^\/(en|es)/, '')}`} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'product' ? 'product' : type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="American Chassis Depot Marketplace" />
      <meta property="og:locale" content={lang === 'es' ? 'es_ES' : 'en_US'} />
      <meta property="og:locale:alternate" content={lang === 'es' ? 'en_US' : 'es_ES'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Product specific Open Graph */}
      {product && (
        <>
          <meta property="product:price:amount" content={product.price.toString()} />
          <meta property="product:price:currency" content={product.priceCurrency || 'USD'} />
          <meta property="product:availability" content={product.availability === 'InStock' ? 'in stock' : 'out of stock'} />
          <meta property="product:condition" content={product.condition === 'NewCondition' ? 'new' : 'used'} />
          {product.brand && <meta property="product:brand" content={product.brand} />}
        </>
      )}
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="American Chassis Depot" />
      <meta name="publisher" content="American Chassis Depot" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
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
    </Helmet>
  );
}

export default SEOHead;
