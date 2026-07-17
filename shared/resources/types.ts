// =============================================================
// /resources blog (SEO Phase 3.2) — shared types + JSON-LD builder.
// Articles live in shared/resources/articles/*.ts, one file each,
// and are consumed by BOTH the React client and the server bot
// renderer so humans and crawlers read identical content.
// =============================================================

export interface ArticleFaq {
  q: string;
  a: string;
}

export interface ArticleTable {
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  heading: string;
  body: string[];
  table?: ArticleTable;
  list?: string[];
}

export interface ArticleLocale {
  metaTitle: string;
  metaDescription: string;
  title: string; // H1 — matches the search question
  lead: string; // first paragraph: answers the title question directly
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
}

export type ArticleCategory = 'buying-guide' | 'comparison' | 'finance' | 'regulations' | 'operations';

export interface ResourceArticle {
  slug: string; // path after /:lang/resources/
  category: ArticleCategory;
  datePublished: string; // ISO date, static
  readingMinutes: number;
  /** Landing-page slugs (from shared/landing-pages.ts) to cross-link as CTAs */
  relatedLanding: string[];
  en: ArticleLocale;
  es: ArticleLocale;
}

export const CATEGORY_LABELS: Record<ArticleCategory, { en: string; es: string }> = {
  'buying-guide': { en: 'Buying Guide', es: 'Guía de Compra' },
  comparison: { en: 'Comparison', es: 'Comparativa' },
  finance: { en: 'Financing', es: 'Financiamiento' },
  regulations: { en: 'Regulations', es: 'Regulaciones' },
  operations: { en: 'Operations', es: 'Operaciones' },
};

// JSON-LD graph for one article page (Article + FAQPage + BreadcrumbList).
export function buildArticleJsonLdGraph(article: ResourceArticle, lang: 'en' | 'es', siteBase: string): object {
  const c = article[lang];
  const url = `${siteBase}/${lang}/resources/${article.slug}`;
  const graph: any[] = [
    {
      '@type': 'Article',
      headline: c.title,
      description: c.metaDescription,
      inLanguage: lang,
      datePublished: article.datePublished,
      dateModified: article.datePublished,
      author: { '@type': 'Organization', name: 'American Chassis Depot' },
      publisher: { '@type': 'Organization', name: 'American Chassis Depot' },
      mainEntityOfPage: url,
    },
  ];
  if (c.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteBase}/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Resources', item: `${siteBase}/${lang}/resources` },
      { '@type': 'ListItem', position: 3, name: c.title, item: url },
    ],
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}
