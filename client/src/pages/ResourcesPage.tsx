import React, { useEffect } from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import Seo from '@/components/seo/Seo';
import { useLanguage } from '@/lib/i18n-simple';
import { RESOURCE_ARTICLES, CATEGORY_LABELS } from '@shared/resources/index';

const SITE = 'https://www.americanchassisdepot.com';

const ResourcesPage: React.FC = () => {
  const { language } = useLanguage();
  const lang: 'en' | 'es' = language === 'es' ? 'es' : 'en';

  // CollectionPage + ItemList JSON-LD for the blog index
  useEffect(() => {
    const id = 'resources-jsonld';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: lang === 'es' ? 'Recursos y Guías de Chasis' : 'Chassis Resources & Guides',
      url: `${SITE}/${lang}/resources`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: RESOURCE_ARTICLES.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: a[lang].title,
          url: `${SITE}/${lang}/resources/${a.slug}`,
        })),
      },
    });
    return () => { el?.remove(); };
  }, [lang]);

  return (
    <div className="flex flex-col min-h-screen">
      <Seo
        title={lang === 'es'
          ? 'Recursos y Guías de Chasis | American Chassis Depot'
          : 'Chassis Resources & Guides | American Chassis Depot'}
        description={lang === 'es'
          ? 'Guías de compra, comparativas, financiamiento y regulaciones de chasis de contenedor — escritas para transportistas y flotas de drayage.'
          : 'Container chassis buying guides, comparisons, financing, and regulations — written for truckers and drayage fleets.'}
        canonicalPath={`/${lang}/resources`}
      />
      <Header />
      <main className="flex-grow">
        <section className="bg-primary py-14 md:py-18 relative">
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="container mx-auto px-4 relative z-10 text-white">
            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-4">
              {lang === 'es' ? 'Recursos y Guías de Chasis' : 'Chassis Resources & Guides'}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl">
              {lang === 'es'
                ? 'Respuestas directas sobre compra, financiamiento, regulaciones y operación de chasis de contenedor — escritas para transportistas.'
                : 'Straight answers on buying, financing, regulations, and operating container chassis — written for truckers.'}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESOURCE_ARTICLES.map((a) => {
                const c = a[lang];
                return (
                  <Link
                    key={a.slug}
                    href={`/${lang}/resources/${a.slug}`}
                    className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 font-medium">
                        {CATEGORY_LABELS[a.category][lang]}
                      </span>
                      <span className="text-neutral-400">
                        {a.readingMinutes} min
                      </span>
                    </div>
                    <h2 className="text-lg font-montserrat font-semibold text-primary mb-2 leading-snug">
                      {c.title}
                    </h2>
                    <p className="text-sm text-neutral-600 flex-grow">{c.metaDescription}</p>
                    <span className="mt-4 text-sm font-medium text-[#E30D16]">
                      {lang === 'es' ? 'Leer guía →' : 'Read guide →'}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-montserrat font-bold text-primary mb-4">
              {lang === 'es' ? '¿Listo para cotizar?' : 'Ready for a quote?'}
            </h2>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              {lang === 'es'
                ? 'Nuestro equipo en Houston responde el mismo día hábil con precio y disponibilidad.'
                : 'Our Houston team responds the same business day with pricing and availability.'}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="inline-block bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-8 py-3 rounded-md shadow-md transition-all duration-300 hover:scale-105"
            >
              {lang === 'es' ? 'Solicitar Cotización' : 'Request Quote'}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default ResourcesPage;
