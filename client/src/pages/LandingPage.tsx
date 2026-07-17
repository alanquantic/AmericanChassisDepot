import React, { useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ContactForm from '@/components/shared/ContactForm';
import Seo from '@/components/seo/Seo';
import { useLanguage } from '@/lib/i18n-simple';
import NotFound from '@/pages/not-found';
import { getLandingPage, buildLandingJsonLdGraph, LANDING_PAGES } from '@shared/landing-pages';

const SITE = 'https://www.americanchassisdepot.com';

interface LandingPageProps {
  slug: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ slug }) => {
  const { language } = useLanguage();
  const lang: 'en' | 'es' = language === 'es' ? 'es' : 'en';
  const page = getLandingPage(slug);

  // JSON-LD (Product/Service/LocalBusiness + FAQPage + BreadcrumbList) — shared
  // builder keeps this identical to the server-rendered version bots receive.
  useEffect(() => {
    if (!page) return;
    const id = 'landing-jsonld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(buildLandingJsonLdGraph(page, lang, SITE));
    return () => { el?.remove(); };
  }, [page, lang]);

  if (!page) return <NotFound />;

  const c = page[lang];
  const related = LANDING_PAGES.filter((p) => p.slug !== page.slug).slice(0, 5);
  const asideHeading = page.type === 'product'
    ? (lang === 'es' ? 'Especificaciones' : 'Specifications')
    : page.type === 'service'
      ? (lang === 'es' ? 'Detalles del programa' : 'Program details')
      : (lang === 'es' ? 'En resumen' : 'At a glance');

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title={c.metaTitle}
        description={c.metaDescription}
        canonicalPath={`/${lang}/${page.slug}`}
        isProduct={page.type === 'product'}
      />
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-primary py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">{c.h1}</h1>
              <p className="text-lg md:text-xl mb-6">{c.heroSubtitle}</p>
              {page.priceRange && (
                <p className="text-base mb-6 opacity-90">
                  {lang === 'es' ? 'Rango de precio orientativo' : 'Typical price range'}:{' '}
                  <strong>{page.priceRange}</strong>
                </p>
              )}
              <Link
                href={`/${lang}/contact`}
                className="bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-8 py-3 rounded-md inline-block shadow-md transition-all duration-300 hover:scale-105"
              >
                {lang === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
              </Link>
            </div>
          </div>
        </section>

        {/* Intro + specs */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                {c.intro.map((p, i) => (
                  <p key={i} className="text-neutral-700 leading-relaxed">{p}</p>
                ))}
              </div>
              {page.specs?.length ? (
                <aside className="bg-neutral-50 rounded-lg p-5 border h-fit">
                  <h2 className="text-lg font-montserrat font-bold text-primary mb-3">
                    {asideHeading}
                  </h2>
                  <table className="w-full text-sm">
                    <tbody>
                      {page.specs.map((s, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <th className="text-left py-2 pr-2 font-medium text-neutral-600 align-top">
                            {lang === 'es' ? s.labelEs : s.label}
                          </th>
                          <td className="py-2 text-neutral-800">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </aside>
              ) : null}
            </div>
          </div>
        </section>

        {/* Content sections */}
        {c.sections.length > 0 && (
          <section className="py-12 bg-neutral-50">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">
              {c.sections.map((sec, i) => (
                <div key={i}>
                  <h2 className="text-2xl font-montserrat font-bold text-primary mb-3">{sec.heading}</h2>
                  {sec.body.map((p, j) => (
                    <p key={j} className="text-neutral-700 leading-relaxed mb-3">{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {c.faqs.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary mb-6">
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
            </div>
          </section>
        )}

        {/* Related links */}
        <section className="py-8 bg-neutral-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-lg font-montserrat font-semibold text-primary mb-3">
              {lang === 'es' ? 'Explora otros chasis' : 'Explore other chassis'}
            </h2>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {related.map((r) => (
                <Link key={r.slug} href={`/${lang}/${r.slug}`} className="text-blue-700 hover:underline">
                  {r[lang].h1}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA + contact form */}
        <section className="py-16 bg-white" id="contact">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary text-center mb-2">
                {c.ctaHeading}
              </h2>
              <p className="text-neutral-600 text-center mb-8">{c.ctaText}</p>
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

export default LandingPage;
