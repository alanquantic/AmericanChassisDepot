import React, { useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ContactForm from '@/components/shared/ContactForm';
import Seo from '@/components/seo/Seo';
import { useLanguage } from '@/lib/i18n-simple';
import NotFound from '@/pages/not-found';
import { getResourceArticle, buildArticleJsonLdGraph, CATEGORY_LABELS, RESOURCE_ARTICLES } from '@shared/resources/index';
import { getLandingPage } from '@shared/landing-pages';

const SITE = 'https://www.americanchassisdepot.com';

interface ArticlePageProps {
  slug: string;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ slug }) => {
  const { language } = useLanguage();
  const lang: 'en' | 'es' = language === 'es' ? 'es' : 'en';
  const article = getResourceArticle(slug);

  useEffect(() => {
    if (!article) return;
    const id = 'article-jsonld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(buildArticleJsonLdGraph(article, lang, SITE));
    return () => { el?.remove(); };
  }, [article, lang]);

  if (!article) return <NotFound />;

  const c = article[lang];
  const relatedArticles = RESOURCE_ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);
  const relatedLandings = article.relatedLanding
    .map((s) => getLandingPage(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title={c.metaTitle}
        description={c.metaDescription}
        canonicalPath={`/${lang}/resources/${article.slug}`}
      />
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary py-12 md:py-16 relative">
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="container mx-auto px-4 relative z-10 text-white max-w-4xl">
            <nav className="text-sm mb-4 opacity-90">
              <Link href={`/${lang}/resources`} className="hover:underline">
                {lang === 'es' ? 'Recursos' : 'Resources'}
              </Link>
              <span className="mx-2">/</span>
              <span>{CATEGORY_LABELS[article.category][lang]}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-3 leading-tight">{c.title}</h1>
            <p className="text-sm opacity-80">
              {new Date(article.datePublished + 'T00:00:00').toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' · '}
              {article.readingMinutes} {lang === 'es' ? 'min de lectura' : 'min read'}
            </p>
          </div>
        </section>

        {/* Body */}
        <article className="py-10 md:py-14 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Lead */}
            <p className="text-lg text-neutral-800 leading-relaxed font-medium mb-8">{c.lead}</p>

            {/* Key takeaways */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-10">
              <h2 className="text-lg font-montserrat font-bold text-primary mb-3">
                {lang === 'es' ? 'Puntos Clave' : 'Key Takeaways'}
              </h2>
              <ul className="space-y-2">
                {c.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex gap-2 text-neutral-700">
                    <span className="text-blue-600 font-bold shrink-0">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {c.sections.map((sec, i) => (
              <section key={i} className="mb-10">
                <h2 className="text-2xl font-montserrat font-bold text-primary mb-4">{sec.heading}</h2>
                {sec.body.map((p, j) => (
                  <p key={j} className="text-neutral-700 leading-relaxed mb-4">{p}</p>
                ))}
                {sec.list && (
                  <ul className="space-y-2 mb-4 ml-1">
                    {sec.list.map((item, j) => (
                      <li key={j} className="flex gap-2 text-neutral-700">
                        <span className="text-[#E30D16] font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.table && (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-primary text-white">
                          {sec.table.headers.map((h, j) => (
                            <th key={j} className="text-left px-4 py-2.5 font-montserrat font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sec.table.rows.map((row, j) => (
                          <tr key={j} className={j % 2 ? 'bg-neutral-50' : 'bg-white'}>
                            {row.map((cell, k) => (
                              <td key={k} className="px-4 py-2.5 border-t text-neutral-700">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}

            {/* FAQs */}
            {c.faqs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-2xl font-montserrat font-bold text-primary mb-4">
                  {lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
                </h2>
                <div className="space-y-4">
                  {c.faqs.map((f, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{f.q}</h3>
                      <p className="text-neutral-700">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related landing pages (CTAs) */}
            {relatedLandings.length > 0 && (
              <section className="mb-10 bg-neutral-50 border rounded-lg p-6">
                <h2 className="text-lg font-montserrat font-bold text-primary mb-3">
                  {lang === 'es' ? 'Equipo y programas relacionados' : 'Related equipment & programs'}
                </h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  {relatedLandings.map((p) => (
                    <Link key={p.slug} href={`/${lang}/${p.slug}`} className="text-blue-700 hover:underline">
                      {p[lang].h1}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <section className="mb-4">
                <h2 className="text-lg font-montserrat font-bold text-primary mb-3">
                  {lang === 'es' ? 'Sigue leyendo' : 'Keep reading'}
                </h2>
                <ul className="space-y-2">
                  {relatedArticles.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/${lang}/resources/${a.slug}`} className="text-blue-700 hover:underline">
                        {a[lang].title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>

        {/* CTA + contact form */}
        <section className="py-14 bg-neutral-50" id="contact">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary text-center mb-2">
                {lang === 'es' ? '¿Preguntas sobre equipo?' : 'Questions about equipment?'}
              </h2>
              <p className="text-neutral-600 text-center mb-8">
                {lang === 'es'
                  ? 'Cuéntanos qué mueves y te recomendamos la configuración correcta — cotización el mismo día hábil.'
                  : 'Tell us what you haul and we will recommend the right configuration — same-business-day quote.'}
              </p>
              <ContactForm className="space-y-6" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default ArticlePage;
