// =============================================================
// SEO intent-based landing pages (Phase 2).
// Single source of truth consumed by BOTH the React client
// (client/src/pages/LandingPage.tsx) and the server bot renderer
// (server/routes.ts) so humans and crawlers see the same content.
// =============================================================

export type LandingType = 'product' | 'service' | 'location';

export interface LandingSpec {
  label: string;
  labelEs: string;
  value: string;
}

export interface LandingFaq {
  q: string;
  a: string;
}

export interface LandingSection {
  heading: string;
  body: string[];
}

export interface LandingLocale {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  intro: string[];
  sections: LandingSection[];
  faqs: LandingFaq[];
  ctaHeading: string;
  ctaText: string;
}

export interface LandingPage {
  slug: string; // path after /:lang/  e.g. 'container-chassis/20ft'
  type: LandingType;
  priceRange?: string;
  image?: string;
  keywords?: string;
  serviceType?: string; // for type='service' — schema.org Service.serviceType
  specs?: LandingSpec[];
  en: LandingLocale;
  es: LandingLocale;
}

export function getLandingPage(slug: string): LandingPage | undefined {
  const clean = slug.replace(/\/+$/, '');
  return LANDING_PAGES.find((p) => p.slug === clean);
}

// Shared JSON-LD builder so the React client and the server bot renderer emit
// the exact same structured data (Product / Service / LocalBusiness + FAQ + Breadcrumb).
export function buildLandingJsonLdGraph(page: LandingPage, lang: 'en' | 'es', siteBase: string): object {
  const c = page[lang];
  const url = `${siteBase}/${lang}/${page.slug}`;
  const graph: any[] = [];
  if (page.type === 'product') {
    graph.push({
      '@type': 'Product',
      name: c.h1,
      description: c.metaDescription,
      category: 'Container Chassis',
      brand: { '@type': 'Brand', name: 'American Chassis Depot' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'American Chassis Depot' },
      },
    });
  } else if (page.type === 'service') {
    graph.push({
      '@type': 'Service',
      name: c.h1,
      description: c.metaDescription,
      serviceType: page.serviceType || c.h1,
      provider: { '@type': 'Organization', name: 'American Chassis Depot' },
      areaServed: { '@type': 'Country', name: 'United States' },
    });
  } else if (page.type === 'location') {
    graph.push({
      '@type': 'LocalBusiness',
      name: 'American Chassis Depot',
      description: c.metaDescription,
      url,
      address: { '@type': 'PostalAddress', addressLocality: 'Houston', addressRegion: 'TX', addressCountry: 'US' },
      geo: { '@type': 'GeoCoordinates', latitude: 29.8171, longitude: -95.4026 },
    });
  }
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
      { '@type': 'ListItem', position: 2, name: c.h1, item: url },
    ],
  });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const LANDING_PAGES: LandingPage[] = [
  // ---------------------------------------------------------
  // PRODUCT — 20ft container chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/20ft',
    type: 'product',
    keywords: '20ft container chassis, 20 foot chassis for sale, tandem axle chassis, intermodal 20ft chassis',
    specs: [
      { label: 'Container size', labelEs: 'Tamaño de contenedor', value: '20 ft ISO' },
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tandem (2 axles)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '6,800 – 7,400 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 67,200 lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Spring ride or air ride' },
      { label: 'Tires', labelEs: 'Llantas', value: '11R22.5 radial' },
      { label: 'Twist locks', labelEs: 'Twist locks', value: '4 corner locks' },
      { label: 'Brakes', labelEs: 'Frenos', value: 'Air brakes, ABS' },
    ],
    en: {
      metaTitle: '20ft Container Chassis for Sale | New & Used | American Chassis Depot',
      metaDescription: 'Buy new and used 20ft container chassis. Tandem axle intermodal chassis for 20-foot ISO containers, with leasing and lease-to-own. Houston, TX — nationwide delivery.',
      h1: '20ft Container Chassis for Sale',
      heroSubtitle: 'New and used tandem-axle chassis built for 20-foot intermodal containers.',
      intro: [
        'A 20ft container chassis is the workhorse for moving standard 20-foot ISO containers between ports, rail yards, and distribution centers. American Chassis Depot supplies both new and inspected used 20ft chassis from Houston, Texas, with nationwide delivery for trucking, drayage, and logistics fleets.',
        'Because a loaded 20-foot box concentrates weight over a short wheelbase, our 20ft chassis are engineered for high axle loads while keeping tare weight low so you can maximize legal payload. Fixed-frame and slider models are available depending on how you spot and transfer containers.',
      ],
      sections: [
        {
          heading: 'Who buys a 20ft chassis',
          body: [
            'Owner-operators and drayage carriers running short-haul port moves are the most common buyers, along with warehouses that need an on-site spotter chassis. If most of your freight is heavy 20-foot loads — think metals, machinery, food-grade, or ISO tanks — a dedicated 20ft chassis is more efficient than pulling a 40ft slider set to 20-foot position.',
          ],
        },
        {
          heading: 'New vs. used, and financing',
          body: [
            'New 20ft chassis arrive with a full manufacturer warranty and the latest LED lighting and anti-lock braking. Quality used units cost less and are a smart fit for backup or seasonal capacity; every used chassis we sell is DOT-inspected before delivery.',
            'We offer direct purchase, chassis leasing, and lease-to-own financing so you can match the cost to how you actually use the equipment. Fleet discounts apply on orders of 10 units or more.',
          ],
        },
      ],
      faqs: [
        { q: 'How much does a 20ft container chassis cost?', a: 'Pricing depends on new vs. used condition, suspension type, axle configuration, and order quantity. We quote each order individually and fleet discounts apply on 10+ units — contact us for current pricing.' },
        { q: 'What is the weight capacity of a 20ft chassis?', a: 'Most 20ft tandem-axle chassis carry a GVWR up to 67,200 lb, which comfortably handles a fully loaded 20-foot ISO container within federal axle limits.' },
        { q: 'Can a 20ft chassis carry a 40ft container?', a: 'No. A dedicated 20ft chassis is sized for 20-foot boxes. To move both 20 and 40-foot containers on one unit, choose a 20-40ft extendable chassis instead.' },
        { q: 'Do you deliver outside Texas?', a: 'Yes. We are based in Houston but arrange delivery nationwide. Delivery time and cost depend on destination and quantity.' },
        { q: 'Is leasing available on 20ft chassis?', a: 'Yes — we offer both standard leasing and lease-to-own programs so you can preserve capital and scale capacity as needed.' },
      ],
      ctaHeading: 'Get a quote on a 20ft chassis',
      ctaText: 'Tell us your quantity, new or used, and delivery location — our team will send pricing and availability the same business day.',
    },
    es: {
      metaTitle: 'Chasis de Contenedor de 20ft en Venta | Nuevo y Usado | American Chassis Depot',
      metaDescription: 'Compra chasis de contenedor de 20ft nuevos y usados. Chasis intermodal de doble eje para contenedores ISO de 20 pies, con arrendamiento y lease-to-own. Houston, TX — envío nacional.',
      h1: 'Chasis de Contenedor de 20ft en Venta',
      heroSubtitle: 'Chasis de doble eje, nuevos y usados, para contenedores intermodales de 20 pies.',
      intro: [
        'El chasis de contenedor de 20ft es la pieza clave para mover contenedores ISO estándar de 20 pies entre puertos, patios ferroviarios y centros de distribución. American Chassis Depot ofrece chasis de 20ft nuevos y usados inspeccionados desde Houston, Texas, con envío a todo el país para flotas de transporte, drayage y logística.',
        'Como un contenedor cargado de 20 pies concentra el peso en una distancia corta, nuestros chasis de 20ft están diseñados para altas cargas por eje manteniendo bajo el peso vacío, para maximizar la carga legal. Hay modelos de marco fijo y deslizante según cómo manejes los contenedores.',
      ],
      sections: [
        {
          heading: 'Quién compra un chasis de 20ft',
          body: [
            'Los operadores independientes y transportistas de drayage en rutas cortas de puerto son los compradores más comunes, junto con almacenes que necesitan un chasis spotter en sitio. Si tu carga es principalmente de 20 pies y pesada —metales, maquinaria, grado alimenticio o tanques ISO— un chasis dedicado de 20ft es más eficiente que un slider de 40ft en posición de 20 pies.',
          ],
        },
        {
          heading: 'Nuevo vs. usado, y financiamiento',
          body: [
            'Los chasis de 20ft nuevos incluyen garantía completa del fabricante, iluminación LED y frenos antibloqueo. Las unidades usadas de calidad cuestan menos y son ideales como respaldo o capacidad estacional; cada chasis usado se inspecciona bajo normas DOT antes de la entrega.',
            'Ofrecemos compra directa, arrendamiento y financiamiento lease-to-own para ajustar el costo a tu uso real. Aplican descuentos de flota en pedidos de 10 unidades o más.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cuánto cuesta un chasis de contenedor de 20ft?', a: 'El precio depende de la condición (nuevo o usado), el tipo de suspensión, la configuración de ejes y la cantidad. Cotizamos cada pedido de forma individual y aplican descuentos de flota en 10+ unidades — contáctanos para precio actual.' },
        { q: '¿Cuál es la capacidad de peso de un chasis de 20ft?', a: 'La mayoría de los chasis de 20ft de doble eje tienen un GVWR de hasta 67,200 lb, suficiente para un contenedor ISO de 20 pies totalmente cargado dentro de los límites federales por eje.' },
        { q: '¿Un chasis de 20ft puede cargar un contenedor de 40ft?', a: 'No. Un chasis dedicado de 20ft es para contenedores de 20 pies. Para mover contenedores de 20 y 40 pies en una sola unidad, elige un chasis extendible de 20-40ft.' },
        { q: '¿Entregan fuera de Texas?', a: 'Sí. Estamos en Houston pero coordinamos entregas a todo el país. El tiempo y costo dependen del destino y la cantidad.' },
        { q: '¿Hay arrendamiento para chasis de 20ft?', a: 'Sí — ofrecemos arrendamiento estándar y programas lease-to-own para preservar capital y escalar capacidad según necesites.' },
      ],
      ctaHeading: 'Cotiza un chasis de 20ft',
      ctaText: 'Dinos cantidad, nuevo o usado, y lugar de entrega — nuestro equipo te envía precio y disponibilidad el mismo día hábil.',
    },
  },

  // ---------------------------------------------------------
  // PRODUCT — 40ft gooseneck container chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/40ft',
    type: 'product',
    keywords: '40ft container chassis, 40 foot gooseneck chassis, gooseneck chassis for sale, intermodal 40ft chassis',
    specs: [
      { label: 'Container size', labelEs: 'Tamaño de contenedor', value: '40 ft (and 45 ft on some models)' },
      { label: 'Frame type', labelEs: 'Tipo de marco', value: 'Gooseneck tunnel' },
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tandem (2 axles)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '8,900 – 10,200 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 70,000 lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Spring ride or air ride' },
      { label: 'Tires', labelEs: 'Llantas', value: '11R22.5 radial' },
      { label: 'Twist locks', labelEs: 'Twist locks', value: '4 corner locks' },
    ],
    en: {
      metaTitle: '40ft Gooseneck Container Chassis for Sale | American Chassis Depot',
      metaDescription: 'New and used 40ft gooseneck container chassis for intermodal 40-foot containers. Tandem axle, air or spring ride, leasing available. Houston, TX with nationwide delivery.',
      h1: '40ft Gooseneck Container Chassis for Sale',
      heroSubtitle: 'The most common intermodal chassis — built for standard 40-foot containers.',
      intro: [
        'The 40ft gooseneck chassis is the backbone of intermodal trucking. Its recessed gooseneck tunnel lets a 40-foot container sit low enough to stay within legal height, making it the default choice for the vast majority of container moves in North America.',
        'American Chassis Depot stocks new and DOT-inspected used 40ft gooseneck chassis in Houston, Texas, with nationwide delivery. Many of our 40ft models also accept 45-foot containers, giving you flexibility without buying a separate unit.',
      ],
      sections: [
        {
          heading: 'Why the gooseneck design matters',
          body: [
            'The gooseneck tunnel at the front of the frame drops the container down over the kingpin area, keeping the loaded height legal and improving stability. For any fleet running standard dry vans, reefers, or high-cube 40-foot boxes, the gooseneck chassis is the everyday tool.',
          ],
        },
        {
          heading: 'Spec options and financing',
          body: [
            'Choose spring ride for durability and lower cost, or air ride for sensitive freight. Slider (tri-axle-ready) and fixed-tandem versions are available. New units carry a full warranty; used units are inspected and priced to move.',
            'We provide purchase, leasing, and lease-to-own options, plus fleet pricing on 10+ unit orders. Tell us your typical loads and we will spec the right configuration.',
          ],
        },
      ],
      faqs: [
        { q: 'How much is a 40ft gooseneck chassis?', a: 'It varies with condition (new or used), suspension (spring or air ride), and slider options. We price each order individually — send your quantity and specs for a same-day quote.' },
        { q: 'Can a 40ft chassis carry a 45ft container?', a: 'Many 40ft gooseneck chassis are rated for 45-foot containers as well. Confirm the model — we will point you to the units that carry both.' },
        { q: 'What is the difference between gooseneck and straight-frame?', a: 'A gooseneck chassis has a recessed front tunnel so the container rides lower and stays within legal height. It is the standard for 40-foot intermodal containers.' },
        { q: 'Spring ride or air ride — which should I choose?', a: 'Spring ride is durable and economical for general freight. Air ride is gentler on fragile or high-value loads. We can quote both.' },
        { q: 'Do you offer lease-to-own on 40ft chassis?', a: 'Yes. Lease-to-own lets you build equity in the chassis while spreading the cost, and we also offer straight leasing and purchase.' },
      ],
      ctaHeading: 'Get a quote on a 40ft gooseneck chassis',
      ctaText: 'Send us your quantity, suspension preference, and delivery location for same-day pricing and availability.',
    },
    es: {
      metaTitle: 'Chasis Gooseneck de 40ft en Venta | American Chassis Depot',
      metaDescription: 'Chasis gooseneck de 40ft nuevos y usados para contenedores intermodales de 40 pies. Doble eje, suspensión de aire o resorte, arrendamiento disponible. Houston, TX con envío nacional.',
      h1: 'Chasis Gooseneck de Contenedor de 40ft en Venta',
      heroSubtitle: 'El chasis intermodal más común — diseñado para contenedores estándar de 40 pies.',
      intro: [
        'El chasis gooseneck de 40ft es la columna vertebral del transporte intermodal. Su túnel gooseneck rebajado permite que un contenedor de 40 pies quede lo suficientemente bajo para respetar la altura legal, lo que lo convierte en la opción predeterminada para la gran mayoría de los movimientos de contenedores en Norteamérica.',
        'American Chassis Depot ofrece chasis gooseneck de 40ft nuevos y usados inspeccionados bajo DOT en Houston, Texas, con envío nacional. Muchos de nuestros modelos de 40ft también aceptan contenedores de 45 pies, dándote flexibilidad sin comprar otra unidad.',
      ],
      sections: [
        {
          heading: 'Por qué importa el diseño gooseneck',
          body: [
            'El túnel gooseneck al frente del marco baja el contenedor sobre la zona del kingpin, manteniendo la altura cargada dentro de lo legal y mejorando la estabilidad. Para cualquier flota que mueva dry vans, reefers o contenedores high-cube de 40 pies, el chasis gooseneck es la herramienta diaria.',
          ],
        },
        {
          heading: 'Opciones de especificación y financiamiento',
          body: [
            'Elige suspensión de resorte por durabilidad y menor costo, o de aire para carga sensible. Hay versiones slider (listas para tri-axle) y de tándem fijo. Las unidades nuevas incluyen garantía completa; las usadas se inspeccionan y se cotizan a buen precio.',
            'Ofrecemos compra, arrendamiento y lease-to-own, además de precios de flota en pedidos de 10+ unidades. Cuéntanos tus cargas típicas y te configuramos la unidad correcta.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cuánto cuesta un chasis gooseneck de 40ft?', a: 'Varía según la condición (nuevo o usado), la suspensión (resorte o aire) y las opciones slider. Cotizamos cada pedido de forma individual — envíanos cantidad y especificaciones para una cotización el mismo día.' },
        { q: '¿Un chasis de 40ft puede cargar un contenedor de 45ft?', a: 'Muchos chasis gooseneck de 40ft también están certificados para contenedores de 45 pies. Confirma el modelo — te indicamos las unidades que cargan ambos.' },
        { q: '¿Cuál es la diferencia entre gooseneck y marco recto?', a: 'Un chasis gooseneck tiene un túnel frontal rebajado para que el contenedor vaya más bajo y respete la altura legal. Es el estándar para contenedores intermodales de 40 pies.' },
        { q: 'Suspensión de resorte o de aire, ¿cuál elijo?', a: 'La de resorte es durable y económica para carga general. La de aire es más suave para carga frágil o de alto valor. Podemos cotizar ambas.' },
        { q: '¿Ofrecen lease-to-own en chasis de 40ft?', a: 'Sí. El lease-to-own te permite generar equity en el chasis mientras distribuyes el costo, y también ofrecemos arrendamiento y compra directa.' },
      ],
      ctaHeading: 'Cotiza un chasis gooseneck de 40ft',
      ctaText: 'Envíanos cantidad, preferencia de suspensión y lugar de entrega para precio y disponibilidad el mismo día.',
    },
  },

  // ---------------------------------------------------------
  // PRODUCT — 45ft container chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/45ft',
    type: 'product',
    keywords: '45ft container chassis, 45 foot chassis for sale, intermodal 45ft chassis',
    specs: [
      { label: 'Container size', labelEs: 'Tamaño de contenedor', value: '45 ft (often 40 ft compatible)' },
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tandem (2 axles)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '9,400 – 10,600 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 70,000 lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Spring ride or air ride' },
      { label: 'Tires', labelEs: 'Llantas', value: '11R22.5 radial' },
      { label: 'Twist locks', labelEs: 'Twist locks', value: '4 corner locks' },
    ],
    en: {
      metaTitle: '45ft Container Chassis for Sale | New & Used | American Chassis Depot',
      metaDescription: 'Buy 45ft container chassis for high-cube 45-foot intermodal containers. New and used, tandem axle, leasing and lease-to-own. Houston, TX with nationwide delivery.',
      h1: '45ft Container Chassis for Sale',
      heroSubtitle: 'Extended-length chassis for 45-foot high-cube intermodal containers.',
      intro: [
        'A 45ft container chassis carries the longer 45-foot high-cube containers common in domestic intermodal and specialized international freight. American Chassis Depot offers new and inspected used 45ft chassis from Houston, Texas, with nationwide delivery.',
        'Many 45ft chassis are also compatible with 40-foot containers, so a single unit can cover two of the most common box sizes — a practical choice for fleets that see mixed freight.',
      ],
      sections: [
        {
          heading: 'When to choose a 45ft chassis',
          body: [
            'If your lanes include 45-foot high-cube containers — frequently used in cross-border and domestic intermodal — a 45ft chassis is essential. The extended frame and rear bolster position the container correctly and keep axle loading legal.',
          ],
        },
        {
          heading: 'New, used, and financing',
          body: [
            'New 45ft chassis include full warranty coverage and modern lighting and braking. Used units are DOT-inspected and offer strong value for backup or seasonal capacity. Purchase, leasing, and lease-to-own are all available, with fleet pricing on volume orders.',
          ],
        },
      ],
      faqs: [
        { q: 'How much does a 45ft chassis cost?', a: 'Pricing depends on new vs. used condition, suspension, and options. Contact us with your quantity and delivery location for a current quote; fleet discounts apply on volume orders.' },
        { q: 'Can a 45ft chassis also carry a 40ft container?', a: 'Many 45ft chassis are dual-rated for 40 and 45-foot containers. Ask us to confirm which units in stock carry both.' },
        { q: 'What is the GVWR of a 45ft chassis?', a: 'Most tandem-axle 45ft chassis are rated up to 70,000 lb GVWR, sufficient for a loaded 45-foot high-cube within federal limits.' },
        { q: 'Is financing available?', a: 'Yes — purchase, leasing, and lease-to-own programs are all available, with fleet discounts on 10+ units.' },
        { q: 'Do you deliver nationwide?', a: 'Yes. We are in Houston, TX and arrange delivery across the country; cost and timing depend on destination and quantity.' },
      ],
      ctaHeading: 'Get a quote on a 45ft chassis',
      ctaText: 'Share your quantity, condition preference, and delivery city for same-day pricing.',
    },
    es: {
      metaTitle: 'Chasis de Contenedor de 45ft en Venta | Nuevo y Usado | American Chassis Depot',
      metaDescription: 'Compra chasis de contenedor de 45ft para contenedores intermodales high-cube de 45 pies. Nuevos y usados, doble eje, arrendamiento y lease-to-own. Houston, TX con envío nacional.',
      h1: 'Chasis de Contenedor de 45ft en Venta',
      heroSubtitle: 'Chasis de longitud extendida para contenedores high-cube de 45 pies.',
      intro: [
        'El chasis de 45ft transporta los contenedores high-cube de 45 pies, comunes en el intermodal doméstico y en carga internacional especializada. American Chassis Depot ofrece chasis de 45ft nuevos y usados inspeccionados desde Houston, Texas, con envío nacional.',
        'Muchos chasis de 45ft también son compatibles con contenedores de 40 pies, así una sola unidad cubre dos de los tamaños más comunes — una opción práctica para flotas con carga mixta.',
      ],
      sections: [
        {
          heading: 'Cuándo elegir un chasis de 45ft',
          body: [
            'Si tus rutas incluyen contenedores high-cube de 45 pies —frecuentes en el intermodal transfronterizo y doméstico— un chasis de 45ft es esencial. El marco extendido y el soporte trasero posicionan el contenedor correctamente y mantienen la carga por eje dentro de lo legal.',
          ],
        },
        {
          heading: 'Nuevo, usado y financiamiento',
          body: [
            'Los chasis de 45ft nuevos incluyen garantía completa e iluminación y frenos modernos. Las unidades usadas se inspeccionan bajo DOT y ofrecen gran valor como respaldo o capacidad estacional. Hay compra, arrendamiento y lease-to-own, con precios de flota en pedidos por volumen.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cuánto cuesta un chasis de 45ft?', a: 'El precio depende de la condición (nuevo o usado), la suspensión y las opciones. Contáctanos con tu cantidad y lugar de entrega para una cotización actual; aplican descuentos de flota por volumen.' },
        { q: '¿Un chasis de 45ft también carga un contenedor de 40ft?', a: 'Muchos chasis de 45ft están certificados para contenedores de 40 y 45 pies. Pregúntanos qué unidades en inventario cargan ambos.' },
        { q: '¿Cuál es el GVWR de un chasis de 45ft?', a: 'La mayoría de los chasis de 45ft de doble eje están certificados hasta 70,000 lb de GVWR, suficiente para un high-cube de 45 pies cargado dentro de los límites federales.' },
        { q: '¿Hay financiamiento disponible?', a: 'Sí — hay compra, arrendamiento y lease-to-own, con descuentos de flota en 10+ unidades.' },
        { q: '¿Entregan a todo el país?', a: 'Sí. Estamos en Houston, TX y coordinamos entregas a todo el país; el costo y el tiempo dependen del destino y la cantidad.' },
      ],
      ctaHeading: 'Cotiza un chasis de 45ft',
      ctaText: 'Comparte cantidad, preferencia de condición y ciudad de entrega para precio el mismo día.',
    },
  },

  // ---------------------------------------------------------
  // PRODUCT — 33ft container chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/33ft',
    type: 'product',
    keywords: '33ft container chassis, 33 foot chassis, specialty intermodal chassis',
    specs: [
      { label: 'Container size', labelEs: 'Tamaño de contenedor', value: '33 ft / specialty' },
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tandem (2 axles)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '8,000 – 9,500 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 68,000 lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Spring ride or air ride' },
      { label: 'Tires', labelEs: 'Llantas', value: '11R22.5 radial' },
    ],
    en: {
      metaTitle: '33ft Container Chassis for Sale | Specialty Intermodal | American Chassis Depot',
      metaDescription: '33ft container chassis for specialty and regional intermodal freight. New and used, tandem axle, leasing available. Houston, TX with nationwide delivery.',
      h1: '33ft Container Chassis for Sale',
      heroSubtitle: 'Specialty-length chassis for regional and non-standard intermodal loads.',
      intro: [
        'The 33ft container chassis serves specialty and regional applications where a standard 20 or 40-foot unit does not fit the freight profile. American Chassis Depot sources new and used 33ft chassis and can advise on the right configuration for your operation.',
        'Because 33-foot equipment is less common, availability moves quickly. If you run this size, tell us your requirements and we will match you to in-stock units or an incoming build.',
      ],
      sections: [
        {
          heading: 'Typical applications',
          body: [
            'Regional intermodal, specialized domestic containers, and certain reefer and tank operations use 33-foot equipment. The tandem-axle frame balances payload and maneuverability for shorter, denser loads.',
          ],
        },
        {
          heading: 'Buying and financing',
          body: [
            'We offer new units with warranty and inspected used units at value pricing. Purchase, leasing, and lease-to-own are available, and fleet discounts apply on volume orders. Because this size is specialized, we recommend reserving early.',
          ],
        },
      ],
      faqs: [
        { q: 'Is a 33ft chassis common?', a: 'It is a specialty size, less common than 20, 40, or 45-foot chassis. Availability is limited, so we recommend contacting us early to reserve units.' },
        { q: 'What freight uses a 33ft chassis?', a: 'Regional intermodal, specialized domestic containers, and some reefer and tank operations that require this specific length.' },
        { q: 'Can you source a 33ft chassis if none are in stock?', a: 'Yes. If we do not have one on the yard, we can often locate or build to your spec. Share your timeline and requirements.' },
        { q: 'Is leasing available?', a: 'Yes — purchase, leasing, and lease-to-own programs are all offered on specialty sizes too.' },
      ],
      ctaHeading: 'Ask about 33ft chassis availability',
      ctaText: 'Tell us your specs and timeline — we will confirm stock or a build slot and send pricing.',
    },
    es: {
      metaTitle: 'Chasis de Contenedor de 33ft en Venta | Intermodal Especializado | American Chassis Depot',
      metaDescription: 'Chasis de contenedor de 33ft para carga intermodal especializada y regional. Nuevos y usados, doble eje, arrendamiento disponible. Houston, TX con envío nacional.',
      h1: 'Chasis de Contenedor de 33ft en Venta',
      heroSubtitle: 'Chasis de longitud especial para carga intermodal regional y no estándar.',
      intro: [
        'El chasis de 33ft cubre aplicaciones especiales y regionales donde una unidad estándar de 20 o 40 pies no se ajusta al perfil de la carga. American Chassis Depot consigue chasis de 33ft nuevos y usados y asesora sobre la configuración correcta para tu operación.',
        'Como el equipo de 33 pies es menos común, la disponibilidad se mueve rápido. Si operas este tamaño, dinos tus requisitos y te enlazamos con unidades en inventario o una producción en camino.',
      ],
      sections: [
        {
          heading: 'Aplicaciones típicas',
          body: [
            'Intermodal regional, contenedores domésticos especializados y ciertas operaciones de reefer y tanque usan equipo de 33 pies. El marco de doble eje equilibra carga y maniobrabilidad para cargas más cortas y densas.',
          ],
        },
        {
          heading: 'Compra y financiamiento',
          body: [
            'Ofrecemos unidades nuevas con garantía y usadas inspeccionadas a buen precio. Hay compra, arrendamiento y lease-to-own, y aplican descuentos de flota en pedidos por volumen. Al ser un tamaño especializado, recomendamos reservar con anticipación.',
          ],
        },
      ],
      faqs: [
        { q: '¿Es común un chasis de 33ft?', a: 'Es un tamaño especializado, menos común que los de 20, 40 o 45 pies. La disponibilidad es limitada, así que recomendamos contactarnos pronto para reservar.' },
        { q: '¿Qué carga usa un chasis de 33ft?', a: 'Intermodal regional, contenedores domésticos especializados y algunas operaciones de reefer y tanque que requieren esta longitud específica.' },
        { q: '¿Pueden conseguir un chasis de 33ft si no hay en inventario?', a: 'Sí. Si no tenemos uno en el patio, con frecuencia podemos localizarlo o fabricarlo a tu especificación. Comparte tu plazo y requisitos.' },
        { q: '¿Hay arrendamiento disponible?', a: 'Sí — también ofrecemos compra, arrendamiento y lease-to-own en tamaños especializados.' },
      ],
      ctaHeading: 'Consulta disponibilidad de chasis de 33ft',
      ctaText: 'Dinos especificaciones y plazo — confirmamos inventario o un espacio de producción y te enviamos precio.',
    },
  },

  // ---------------------------------------------------------
  // PRODUCT — 20-40ft extendable chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/20-40-extendable',
    type: 'product',
    keywords: '20-40 extendable chassis, extendable container chassis, adjustable chassis for sale, slider chassis',
    specs: [
      { label: 'Container sizes', labelEs: 'Tamaños de contenedor', value: '20, 40 and 45 ft' },
      { label: 'Frame type', labelEs: 'Tipo de marco', value: 'Extendable / telescoping' },
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tandem (2 axles)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '10,500 – 12,000 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 70,000 lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Spring ride or air ride' },
      { label: 'Twist locks', labelEs: 'Twist locks', value: 'Multi-position for 20/40/45 ft' },
    ],
    en: {
      metaTitle: '20-40ft Extendable Container Chassis for Sale | American Chassis Depot',
      metaDescription: 'One chassis for 20, 40 and 45-foot containers. Buy new and used extendable (telescoping) container chassis with leasing and lease-to-own. Houston, TX, nationwide delivery.',
      h1: '20-40ft Extendable Container Chassis for Sale',
      heroSubtitle: 'One flexible chassis that hauls 20, 40, and 45-foot containers.',
      intro: [
        'An extendable container chassis telescopes to carry 20, 40, and often 45-foot containers on a single unit. For fleets that see a mix of box sizes, this flexibility replaces two or three dedicated chassis and keeps utilization high.',
        'American Chassis Depot supplies new and inspected used 20-40ft extendable chassis from Houston, Texas, with nationwide delivery, leasing, and lease-to-own financing.',
      ],
      sections: [
        {
          heading: 'The flexibility advantage',
          body: [
            'With multi-position twist locks and a telescoping frame, one extendable chassis adapts to whatever container comes off the ship or rail. That means fewer assets sitting idle, simpler yard management, and the ability to accept mixed freight without turning work away.',
          ],
        },
        {
          heading: 'Cost, weight, and financing',
          body: [
            'Extendable chassis cost more up front and weigh more than a fixed unit, so they make the most sense when your freight mix truly varies. New units carry a warranty; used units are DOT-inspected. Purchase, leasing, and lease-to-own are available with fleet pricing on volume orders.',
          ],
        },
      ],
      faqs: [
        { q: 'What container sizes does an extendable chassis carry?', a: 'Most 20-40 extendable chassis handle 20, 40, and 45-foot containers using multi-position twist locks and a telescoping frame.' },
        { q: 'How much does an extendable chassis cost?', a: 'Extendable chassis cost more than fixed units because of the telescoping frame; final pricing depends on condition, suspension, and quantity. Contact us for a current quote.' },
        { q: 'Is an extendable chassis worth it vs. a fixed one?', a: 'If your freight mix varies across box sizes, yes — one extendable unit replaces multiple dedicated chassis. For single-size operations, a fixed chassis is lighter and cheaper.' },
        { q: 'Do extendable chassis weigh more?', a: 'Yes, the telescoping frame adds tare weight (typically 10,500–12,000 lb), which slightly reduces max payload compared with a fixed chassis.' },
        { q: 'Is leasing available?', a: 'Yes — purchase, leasing, and lease-to-own are all available, with fleet discounts on 10+ units.' },
      ],
      ctaHeading: 'Get a quote on an extendable chassis',
      ctaText: 'Tell us your container mix and quantity — we will recommend the right extendable configuration and send pricing.',
    },
    es: {
      metaTitle: 'Chasis Extendible de 20-40ft en Venta | American Chassis Depot',
      metaDescription: 'Un chasis para contenedores de 20, 40 y 45 pies. Compra chasis extendible (telescópico) nuevo y usado con arrendamiento y lease-to-own. Houston, TX, envío nacional.',
      h1: 'Chasis Extendible de Contenedor de 20-40ft en Venta',
      heroSubtitle: 'Un chasis flexible que transporta contenedores de 20, 40 y 45 pies.',
      intro: [
        'Un chasis extendible se telescopia para cargar contenedores de 20, 40 y con frecuencia 45 pies en una sola unidad. Para flotas con mezcla de tamaños, esta flexibilidad reemplaza dos o tres chasis dedicados y mantiene alta la utilización.',
        'American Chassis Depot ofrece chasis extendibles de 20-40ft nuevos y usados inspeccionados desde Houston, Texas, con envío nacional, arrendamiento y financiamiento lease-to-own.',
      ],
      sections: [
        {
          heading: 'La ventaja de la flexibilidad',
          body: [
            'Con twist locks de múltiples posiciones y un marco telescópico, un solo chasis extendible se adapta a cualquier contenedor que baje del barco o del tren. Eso significa menos activos parados, gestión de patio más simple y la capacidad de aceptar carga mixta sin rechazar trabajo.',
          ],
        },
        {
          heading: 'Costo, peso y financiamiento',
          body: [
            'Los chasis extendibles cuestan y pesan más que una unidad fija, por lo que convienen cuando tu mezcla de carga realmente varía. Las unidades nuevas incluyen garantía; las usadas se inspeccionan bajo DOT. Hay compra, arrendamiento y lease-to-own con precios de flota en pedidos por volumen.',
          ],
        },
      ],
      faqs: [
        { q: '¿Qué tamaños de contenedor carga un chasis extendible?', a: 'La mayoría de los chasis extendibles de 20-40 manejan contenedores de 20, 40 y 45 pies con twist locks de múltiples posiciones y marco telescópico.' },
        { q: '¿Cuánto cuesta un chasis extendible?', a: 'Los chasis extendibles cuestan más que las unidades fijas por el marco telescópico; el precio final depende de la condición, la suspensión y la cantidad. Contáctanos para una cotización actual.' },
        { q: '¿Vale la pena un extendible frente a uno fijo?', a: 'Si tu mezcla de carga varía entre tamaños, sí — una unidad extendible reemplaza varios chasis dedicados. Para operaciones de un solo tamaño, un chasis fijo es más ligero y económico.' },
        { q: '¿Los chasis extendibles pesan más?', a: 'Sí, el marco telescópico agrega peso vacío (típicamente 10,500–12,000 lb), lo que reduce un poco la carga máxima frente a un chasis fijo.' },
        { q: '¿Hay arrendamiento disponible?', a: 'Sí — hay compra, arrendamiento y lease-to-own, con descuentos de flota en 10+ unidades.' },
      ],
      ctaHeading: 'Cotiza un chasis extendible',
      ctaText: 'Dinos tu mezcla de contenedores y cantidad — recomendamos la configuración extendible correcta y enviamos precio.',
    },
  },

  // ---------------------------------------------------------
  // PRODUCT — triaxle container chassis
  // ---------------------------------------------------------
  {
    slug: 'container-chassis/triaxle',
    type: 'product',
    keywords: 'triaxle container chassis, tri-axle chassis for sale, heavy duty chassis, 3 axle chassis',
    specs: [
      { label: 'Axle configuration', labelEs: 'Configuración de ejes', value: 'Tri-axle (3 axles)' },
      { label: 'Container sizes', labelEs: 'Tamaños de contenedor', value: '20, 40, 45 ft (model dependent)' },
      { label: 'Typical tare weight', labelEs: 'Peso vacío típico', value: '11,500 – 13,500 lb' },
      { label: 'GVWR', labelEs: 'GVWR', value: 'up to 90,000+ lb' },
      { label: 'Suspension', labelEs: 'Suspensión', value: 'Air ride or spring ride' },
      { label: 'Tires', labelEs: 'Llantas', value: '11R22.5 radial (6)' },
      { label: 'Best for', labelEs: 'Ideal para', value: 'Overweight / heavy containers' },
    ],
    en: {
      metaTitle: 'Triaxle Container Chassis for Sale | Heavy-Duty | American Chassis Depot',
      metaDescription: 'Tri-axle container chassis for heavy and overweight intermodal containers. Higher GVWR, new and used, leasing available. Houston, TX with nationwide delivery.',
      h1: 'Triaxle Container Chassis for Sale',
      heroSubtitle: 'Three-axle chassis built for heavy and overweight container loads.',
      intro: [
        'A triaxle (tri-axle) container chassis adds a third axle to spread weight and legally carry heavier loads than a standard tandem unit. For overweight international containers, dense commodities, and permitted heavy-haul lanes, the triaxle is the right tool.',
        'American Chassis Depot supplies new and DOT-inspected used triaxle chassis from Houston, Texas, with nationwide delivery, leasing, and lease-to-own financing.',
      ],
      sections: [
        {
          heading: 'When you need a third axle',
          body: [
            'The extra axle raises the legal weight you can carry and distributes load to protect bridges and pavement, which matters for overweight ocean containers and heavy bulk. Many ports and heavy corridors effectively require tri-axle equipment for the densest freight.',
          ],
        },
        {
          heading: 'Capacity, cost, and financing',
          body: [
            'Triaxle chassis carry a higher GVWR — often 90,000 lb or more depending on configuration and permits — at a higher purchase price and tare weight than a tandem. New units include warranty; used units are inspected. Purchase, leasing, and lease-to-own are available with fleet pricing.',
          ],
        },
      ],
      faqs: [
        { q: 'How much weight can a triaxle chassis carry?', a: 'Tri-axle container chassis are commonly rated to 90,000 lb GVWR or more, depending on configuration and applicable permits, well above a standard tandem chassis.' },
        { q: 'When should I buy a triaxle instead of a tandem?', a: 'Choose tri-axle when you regularly move overweight or heavy containers, or when your lanes or ports require the extra axle for legal weight distribution.' },
        { q: 'How much does a triaxle chassis cost?', a: 'Tri-axle chassis cost more than tandem units due to the extra axle and higher capacity; final pricing depends on condition, suspension, and options. Contact us for a current quote.' },
        { q: 'Does a triaxle chassis need permits?', a: 'Carrying overweight loads typically requires state permits. The chassis provides the capacity; you obtain the permits for the specific load and route.' },
        { q: 'Is financing available?', a: 'Yes — purchase, leasing, and lease-to-own programs are available, with fleet discounts on volume orders.' },
      ],
      ctaHeading: 'Get a quote on a triaxle chassis',
      ctaText: 'Tell us your target weight rating, quantity, and delivery location for same-day pricing and availability.',
    },
    es: {
      metaTitle: 'Chasis Triaxle de Contenedor en Venta | Alta Resistencia | American Chassis Depot',
      metaDescription: 'Chasis triaxle de contenedor para contenedores intermodales pesados y con sobrepeso. Mayor GVWR, nuevos y usados, arrendamiento disponible. Houston, TX con envío nacional.',
      h1: 'Chasis Triaxle de Contenedor en Venta',
      heroSubtitle: 'Chasis de tres ejes diseñado para contenedores pesados y con sobrepeso.',
      intro: [
        'Un chasis triaxle (tri-axle) agrega un tercer eje para distribuir el peso y cargar legalmente más que una unidad tándem estándar. Para contenedores internacionales con sobrepeso, materias densas y rutas de carga pesada con permiso, el triaxle es la herramienta correcta.',
        'American Chassis Depot ofrece chasis triaxle nuevos y usados inspeccionados bajo DOT desde Houston, Texas, con envío nacional, arrendamiento y financiamiento lease-to-own.',
      ],
      sections: [
        {
          heading: 'Cuándo necesitas un tercer eje',
          body: [
            'El eje adicional aumenta el peso legal que puedes cargar y distribuye la carga para proteger puentes y pavimento, algo clave para contenedores marítimos con sobrepeso y granel pesado. Muchos puertos y corredores pesados prácticamente exigen equipo tri-axle para la carga más densa.',
          ],
        },
        {
          heading: 'Capacidad, costo y financiamiento',
          body: [
            'Los chasis triaxle tienen un GVWR mayor —con frecuencia 90,000 lb o más según configuración y permisos— a un precio y peso vacío mayores que un tándem. Las unidades nuevas incluyen garantía; las usadas se inspeccionan. Hay compra, arrendamiento y lease-to-own con precios de flota.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cuánto peso puede cargar un chasis triaxle?', a: 'Los chasis triaxle de contenedor suelen estar certificados a 90,000 lb de GVWR o más, según configuración y permisos aplicables, muy por encima de un chasis tándem estándar.' },
        { q: '¿Cuándo conviene un triaxle en vez de un tándem?', a: 'Elige tri-axle cuando muevas regularmente contenedores pesados o con sobrepeso, o cuando tus rutas o puertos exijan el eje extra para una distribución de peso legal.' },
        { q: '¿Cuánto cuesta un chasis triaxle?', a: 'Los chasis triaxle cuestan más que los tándem por el eje adicional y la mayor capacidad; el precio final depende de la condición, la suspensión y las opciones. Contáctanos para una cotización actual.' },
        { q: '¿Un chasis triaxle necesita permisos?', a: 'Transportar carga con sobrepeso normalmente requiere permisos estatales. El chasis aporta la capacidad; tú obtienes los permisos para la carga y ruta específicas.' },
        { q: '¿Hay financiamiento disponible?', a: 'Sí — hay compra, arrendamiento y lease-to-own, con descuentos de flota en pedidos por volumen.' },
      ],
      ctaHeading: 'Cotiza un chasis triaxle',
      ctaText: 'Dinos el rating de peso objetivo, cantidad y lugar de entrega para precio y disponibilidad el mismo día.',
    },
  },

  // ---------------------------------------------------------
  // SERVICE — chassis leasing
  // ---------------------------------------------------------
  {
    slug: 'chassis-leasing',
    type: 'service',
    serviceType: 'Container Chassis Leasing',
    keywords: 'chassis leasing, container chassis rental, chassis lease program, lease intermodal chassis',
    specs: [
      { label: 'Equipment available', labelEs: 'Equipo disponible', value: '20ft, 40ft, 45ft, extendable, triaxle' },
      { label: 'Lease terms', labelEs: 'Plazos', value: 'Flexible — short and long term' },
      { label: 'Fleet volume', labelEs: 'Volumen de flota', value: 'Single units to full fleets' },
      { label: 'Coverage', labelEs: 'Cobertura', value: 'Nationwide from Houston, TX' },
    ],
    en: {
      metaTitle: 'Container Chassis Leasing | Flexible Terms | American Chassis Depot',
      metaDescription: 'Lease container chassis instead of buying — flexible terms, low upfront cost, and nationwide delivery from Houston, TX. 20ft to triaxle units for trucking and drayage fleets.',
      h1: 'Container Chassis Leasing',
      heroSubtitle: 'Get the chassis your fleet needs without tying up capital.',
      intro: [
        'Leasing a container chassis lets you put equipment to work immediately while preserving cash for drivers, fuel, and growth. Instead of a large upfront purchase, you pay a predictable monthly rate for the term you actually need.',
        'American Chassis Depot leases new and inspected used chassis — 20ft, 40ft gooseneck, 45ft, extendable, and triaxle — from Houston, Texas, with nationwide delivery. Terms flex from short-term surge capacity to multi-year fleet agreements.',
      ],
      sections: [
        {
          heading: 'When leasing beats buying',
          body: [
            'Leasing shines when demand is seasonal, when you are testing a new lane, or when capital is better spent elsewhere in the business. Port surges, retail peak season, and new customer contracts are classic moments to lease instead of buy: you scale capacity up while volumes are high and return units when the surge ends.',
            'Leasing also removes resale risk. When the term ends you hand the equipment back — no wondering what a five-year-old chassis will fetch on the used market.',
          ],
        },
        {
          heading: 'How our lease program works',
          body: [
            'Tell us the sizes you run, how many units you need, and for how long. We quote a monthly rate, arrange delivery, and your fleet is rolling. Need to convert a lease into ownership later? Ask about our lease-to-own program — payments can build toward a purchase.',
          ],
        },
      ],
      faqs: [
        { q: 'What chassis types can I lease?', a: 'Every configuration we sell is also available to lease: 20ft, 40ft gooseneck, 45ft, 20-40 extendable, and triaxle units, new or used.' },
        { q: 'What lease terms do you offer?', a: 'Terms are flexible — from short-term seasonal needs to multi-year fleet agreements. Rates improve with longer terms and higher unit counts.' },
        { q: 'Is there a minimum number of units?', a: 'No. We lease single units to owner-operators as well as full fleets to carriers, with volume pricing as the count grows.' },
        { q: 'Can a lease turn into ownership?', a: 'Yes — our lease-to-own program applies part of your payments toward the purchase, so you can build equity while you operate the equipment.' },
        { q: 'Do you deliver leased chassis nationwide?', a: 'Yes. Units ship from Houston, TX to anywhere in the country; delivery time and cost depend on destination and quantity.' },
      ],
      ctaHeading: 'Get a leasing quote',
      ctaText: 'Tell us the equipment, quantity, and term you need — we will send a monthly rate the same business day.',
    },
    es: {
      metaTitle: 'Arrendamiento de Chasis de Contenedor | Plazos Flexibles | American Chassis Depot',
      metaDescription: 'Arrienda chasis de contenedor en vez de comprar — plazos flexibles, baja inversión inicial y envío nacional desde Houston, TX. Unidades de 20ft a triaxle para flotas.',
      h1: 'Arrendamiento de Chasis de Contenedor',
      heroSubtitle: 'Consigue los chasis que tu flota necesita sin inmovilizar capital.',
      intro: [
        'Arrendar un chasis de contenedor te permite poner el equipo a trabajar de inmediato mientras conservas efectivo para conductores, combustible y crecimiento. En lugar de una compra grande por adelantado, pagas una renta mensual predecible por el plazo que realmente necesitas.',
        'American Chassis Depot arrienda chasis nuevos y usados inspeccionados — 20ft, 40ft gooseneck, 45ft, extendibles y triaxle — desde Houston, Texas, con envío nacional. Los plazos van desde capacidad temporal hasta acuerdos de flota multianuales.',
      ],
      sections: [
        {
          heading: 'Cuándo conviene arrendar en vez de comprar',
          body: [
            'El arrendamiento brilla cuando la demanda es estacional, cuando pruebas una ruta nueva o cuando el capital rinde más en otra parte del negocio. Los picos de puerto, la temporada alta de retail y los contratos nuevos son momentos clásicos para arrendar: escalas capacidad mientras el volumen es alto y devuelves las unidades cuando baja.',
            'Arrendar también elimina el riesgo de reventa. Al terminar el plazo entregas el equipo — sin preguntarte cuánto valdrá un chasis de cinco años en el mercado de usados.',
          ],
        },
        {
          heading: 'Cómo funciona nuestro programa',
          body: [
            'Dinos qué tamaños operas, cuántas unidades necesitas y por cuánto tiempo. Cotizamos una renta mensual, coordinamos la entrega y tu flota queda rodando. ¿Quieres convertir el arrendamiento en propiedad después? Pregunta por nuestro programa lease-to-own — los pagos pueden abonar a la compra.',
          ],
        },
      ],
      faqs: [
        { q: '¿Qué tipos de chasis puedo arrendar?', a: 'Toda configuración que vendemos también se arrienda: 20ft, 40ft gooseneck, 45ft, extendibles de 20-40 y triaxle, nuevos o usados.' },
        { q: '¿Qué plazos ofrecen?', a: 'Los plazos son flexibles — desde necesidades estacionales de corto plazo hasta acuerdos de flota multianuales. La tarifa mejora con plazos más largos y más unidades.' },
        { q: '¿Hay un mínimo de unidades?', a: 'No. Arrendamos desde una unidad para operadores independientes hasta flotas completas, con precio por volumen conforme crece la cantidad.' },
        { q: '¿Un arrendamiento puede convertirse en propiedad?', a: 'Sí — nuestro programa lease-to-own aplica parte de tus pagos a la compra, así generas equity mientras operas el equipo.' },
        { q: '¿Entregan chasis arrendados a todo el país?', a: 'Sí. Las unidades salen de Houston, TX hacia cualquier punto del país; el tiempo y costo dependen del destino y la cantidad.' },
      ],
      ctaHeading: 'Cotiza tu arrendamiento',
      ctaText: 'Dinos equipo, cantidad y plazo — te enviamos la renta mensual el mismo día hábil.',
    },
  },

  // ---------------------------------------------------------
  // SERVICE — lease-to-own
  // ---------------------------------------------------------
  {
    slug: 'lease-to-own',
    type: 'service',
    serviceType: 'Chassis Lease-to-Own Financing',
    keywords: 'chassis lease to own, lease to own container chassis, chassis financing, rent to own chassis',
    specs: [
      { label: 'Path to ownership', labelEs: 'Camino a la propiedad', value: 'Payments build equity' },
      { label: 'Equipment available', labelEs: 'Equipo disponible', value: '20ft, 40ft, 45ft, extendable, triaxle' },
      { label: 'Terms', labelEs: 'Plazos', value: 'Structured to your cash flow' },
      { label: 'End of term', labelEs: 'Al final del plazo', value: 'The chassis is yours' },
    ],
    en: {
      metaTitle: 'Chassis Lease-to-Own Financing | Own While You Operate | American Chassis Depot',
      metaDescription: 'Lease-to-own container chassis financing: predictable payments that build toward full ownership. New and used units from Houston, TX with nationwide delivery.',
      h1: 'Chassis Lease-to-Own Financing',
      heroSubtitle: 'Run the equipment today, own it at the end — payments that build equity.',
      intro: [
        'Lease-to-own combines the low entry cost of leasing with the long-term value of ownership. You start operating the chassis right away, make predictable payments, and at the end of the term the equipment is yours — no balloon surprise, no returning units you have already maintained and depended on.',
        'It is the natural fit for owner-operators and growing carriers that want to build assets without draining working capital. American Chassis Depot structures lease-to-own on new and inspected used chassis in every configuration we carry.',
      ],
      sections: [
        {
          heading: 'How lease-to-own compares',
          body: [
            'Versus a straight lease, part of every payment builds toward ownership instead of being pure rent — at the end you hold an asset, not a return receipt. Versus a cash purchase, you keep capital free for fuel, drivers, insurance, and growth while the chassis earns its keep.',
            'Because the equipment generates revenue while you pay for it, many operators find the chassis effectively pays for itself over the term.',
          ],
        },
        {
          heading: 'Getting started',
          body: [
            'Pick the configuration you need, tell us the term that matches your cash flow, and we structure the agreement. At the end of the schedule, title transfers to you. Fleet operators can combine lease-to-own with volume pricing on multi-unit orders.',
          ],
        },
      ],
      faqs: [
        { q: 'How does lease-to-own work?', a: 'You make fixed payments over an agreed term while operating the chassis. Payments build toward the purchase, and at the end of the term ownership transfers to you.' },
        { q: 'Is lease-to-own available on used chassis?', a: 'Yes — both new and DOT-inspected used units qualify, across all configurations: 20ft, 40ft, 45ft, extendable, and triaxle.' },
        { q: 'What happens at the end of the term?', a: 'The chassis is yours. Title transfers once the payment schedule is complete — no balloon payment surprises.' },
        { q: 'Who is lease-to-own best for?', a: 'Owner-operators and growing fleets that want to build equity in their equipment while preserving working capital for operations.' },
        { q: 'Can I do lease-to-own on multiple units?', a: 'Yes. Multi-unit agreements are common and can be combined with fleet pricing on 10+ unit orders.' },
      ],
      ctaHeading: 'Ask about lease-to-own',
      ctaText: 'Tell us the equipment you need and the term that fits your cash flow — we will send a structured proposal.',
    },
    es: {
      metaTitle: 'Financiamiento Lease-to-Own de Chasis | Opera y Sé Dueño | American Chassis Depot',
      metaDescription: 'Financiamiento lease-to-own de chasis de contenedor: pagos predecibles que construyen la propiedad. Unidades nuevas y usadas desde Houston, TX con envío nacional.',
      h1: 'Financiamiento Lease-to-Own de Chasis',
      heroSubtitle: 'Opera el equipo hoy y sé el dueño al final — pagos que generan equity.',
      intro: [
        'El lease-to-own combina la baja inversión inicial del arrendamiento con el valor de largo plazo de la propiedad. Empiezas a operar el chasis de inmediato, haces pagos predecibles y al final del plazo el equipo es tuyo — sin sorpresas de pago final ni devolver unidades que ya mantuviste y de las que dependes.',
        'Es la opción natural para operadores independientes y transportistas en crecimiento que quieren construir activos sin drenar capital de trabajo. American Chassis Depot estructura lease-to-own en chasis nuevos y usados inspeccionados de todas las configuraciones que manejamos.',
      ],
      sections: [
        {
          heading: 'Cómo se compara el lease-to-own',
          body: [
            'Frente a un arrendamiento puro, parte de cada pago abona a la propiedad en lugar de ser renta — al final tienes un activo, no un recibo de devolución. Frente a una compra de contado, mantienes capital libre para combustible, conductores, seguros y crecimiento mientras el chasis genera ingresos.',
            'Como el equipo produce mientras lo pagas, muchos operadores encuentran que el chasis prácticamente se paga solo durante el plazo.',
          ],
        },
        {
          heading: 'Cómo empezar',
          body: [
            'Elige la configuración que necesitas, dinos el plazo que se ajusta a tu flujo y estructuramos el acuerdo. Al completar el calendario de pagos, el título pasa a tu nombre. Los operadores de flota pueden combinar lease-to-own con precio por volumen en pedidos de varias unidades.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cómo funciona el lease-to-own?', a: 'Haces pagos fijos durante un plazo acordado mientras operas el chasis. Los pagos abonan a la compra y al final del plazo la propiedad se transfiere a ti.' },
        { q: '¿Hay lease-to-own en chasis usados?', a: 'Sí — califican unidades nuevas y usadas inspeccionadas bajo DOT, en todas las configuraciones: 20ft, 40ft, 45ft, extendibles y triaxle.' },
        { q: '¿Qué pasa al final del plazo?', a: 'El chasis es tuyo. El título se transfiere al completar el calendario de pagos — sin sorpresas de pago global.' },
        { q: '¿Para quién es mejor el lease-to-own?', a: 'Operadores independientes y flotas en crecimiento que quieren generar equity en su equipo mientras conservan capital de trabajo para la operación.' },
        { q: '¿Puedo hacer lease-to-own de varias unidades?', a: 'Sí. Los acuerdos multi-unidad son comunes y se combinan con precios de flota en pedidos de 10+ unidades.' },
      ],
      ctaHeading: 'Pregunta por lease-to-own',
      ctaText: 'Dinos el equipo que necesitas y el plazo que se ajusta a tu flujo — te enviamos una propuesta estructurada.',
    },
  },

  // ---------------------------------------------------------
  // SERVICE — fleet sales (10+ units)
  // ---------------------------------------------------------
  {
    slug: 'fleet-sales',
    type: 'service',
    serviceType: 'Fleet Chassis Sales',
    keywords: 'fleet chassis sales, bulk container chassis, volume chassis discount, buy chassis fleet',
    specs: [
      { label: 'Volume threshold', labelEs: 'Umbral de volumen', value: '10+ units' },
      { label: 'Mix and match', labelEs: 'Mezcla de modelos', value: 'Combine sizes and configurations' },
      { label: 'Scheduling', labelEs: 'Programación', value: 'Staged deliveries available' },
      { label: 'Financing', labelEs: 'Financiamiento', value: 'Purchase, lease, lease-to-own' },
    ],
    en: {
      metaTitle: 'Fleet Chassis Sales — Volume Discounts on 10+ Units | American Chassis Depot',
      metaDescription: 'Buying 10 or more container chassis? Get fleet pricing, mixed-model orders, staged nationwide delivery, and volume financing from American Chassis Depot in Houston, TX.',
      h1: 'Fleet Chassis Sales — Volume Discounts',
      heroSubtitle: 'Fleet pricing, mixed configurations, and staged delivery on orders of 10+ units.',
      intro: [
        'Outfitting or expanding a fleet is a different purchase than buying a single chassis. Volume unlocks better unit pricing, but it also demands consistent build quality, predictable delivery windows, and one accountable point of contact. That is what our fleet sales program is built around.',
        'American Chassis Depot supplies fleets of new and inspected used chassis — mixing 20ft, 40ft gooseneck, 45ft, extendable, and triaxle configurations in a single order — with staged deliveries scheduled around your ramp-up.',
      ],
      sections: [
        {
          heading: 'What fleet buyers get',
          body: [
            'Fleet pricing starts at 10 units and improves with scale. You can mix configurations in one order — say, thirty 40ft goosenecks, ten 20ft units, and five triaxles — and stage deliveries across weeks or months so equipment arrives as drivers and freight come online, not all at once in your yard.',
            'Every used unit is DOT-inspected before delivery, and new units carry full manufacturer warranties. One account manager owns your order end to end.',
          ],
        },
        {
          heading: 'Financing at volume',
          body: [
            'Fleet orders can be structured as direct purchase, lease, or lease-to-own — or a blend, such as buying the core fleet and leasing surge capacity. Tell us your growth plan and we will structure equipment and financing around it.',
          ],
        },
      ],
      faqs: [
        { q: 'How many units qualify for fleet pricing?', a: 'Fleet pricing starts at 10 units, and per-unit pricing improves as the order grows. Contact us with your target count for a volume quote.' },
        { q: 'Can I mix chassis types in one fleet order?', a: 'Yes. Orders can combine 20ft, 40ft, 45ft, extendable, and triaxle units — new, used, or both — in whatever mix your freight requires.' },
        { q: 'Can deliveries be staged?', a: 'Yes. We schedule staged deliveries across weeks or months so equipment arrives as you scale, anywhere in the country.' },
        { q: 'Is financing available on fleet orders?', a: 'Yes — direct purchase, leasing, and lease-to-own can all be applied to volume orders, individually or blended.' },
        { q: 'Do you supply both new and used units for fleets?', a: 'Yes. Many fleets blend new units for core lanes with DOT-inspected used units for surge or backup capacity.' },
      ],
      ctaHeading: 'Request a fleet quote',
      ctaText: 'Tell us your unit count, configuration mix, and delivery timeline — we will send volume pricing the same business day.',
    },
    es: {
      metaTitle: 'Venta de Flotas de Chasis — Descuentos por Volumen 10+ | American Chassis Depot',
      metaDescription: '¿Compras 10 o más chasis de contenedor? Obtén precio de flota, pedidos con modelos mixtos, entregas programadas a todo el país y financiamiento por volumen. Houston, TX.',
      h1: 'Venta de Flotas de Chasis — Descuentos por Volumen',
      heroSubtitle: 'Precio de flota, configuraciones mixtas y entregas programadas en pedidos de 10+ unidades.',
      intro: [
        'Equipar o expandir una flota es una compra distinta a adquirir un solo chasis. El volumen desbloquea mejor precio por unidad, pero también exige calidad consistente, ventanas de entrega predecibles y un solo punto de contacto responsable. Alrededor de eso está construido nuestro programa de ventas de flota.',
        'American Chassis Depot surte flotas de chasis nuevos y usados inspeccionados — mezclando configuraciones de 20ft, 40ft gooseneck, 45ft, extendibles y triaxle en un solo pedido — con entregas escalonadas según tu plan de crecimiento.',
      ],
      sections: [
        {
          heading: 'Qué recibe un comprador de flota',
          body: [
            'El precio de flota inicia en 10 unidades y mejora con la escala. Puedes mezclar configuraciones en un pedido — por ejemplo, treinta gooseneck de 40ft, diez unidades de 20ft y cinco triaxle — y escalonar entregas por semanas o meses para que el equipo llegue conforme suben conductores y carga, no todo de golpe en tu patio.',
            'Cada unidad usada se inspecciona bajo DOT antes de la entrega, y las nuevas incluyen garantía completa del fabricante. Un gerente de cuenta es dueño de tu pedido de principio a fin.',
          ],
        },
        {
          heading: 'Financiamiento por volumen',
          body: [
            'Los pedidos de flota pueden estructurarse como compra directa, arrendamiento o lease-to-own — o una mezcla, como comprar la flota base y arrendar la capacidad pico. Cuéntanos tu plan de crecimiento y estructuramos equipo y financiamiento a su alrededor.',
          ],
        },
      ],
      faqs: [
        { q: '¿Cuántas unidades califican para precio de flota?', a: 'El precio de flota inicia en 10 unidades y el precio por unidad mejora conforme crece el pedido. Contáctanos con tu cantidad objetivo para una cotización por volumen.' },
        { q: '¿Puedo mezclar tipos de chasis en un pedido de flota?', a: 'Sí. Los pedidos pueden combinar unidades de 20ft, 40ft, 45ft, extendibles y triaxle — nuevas, usadas o ambas — en la mezcla que tu carga requiera.' },
        { q: '¿Las entregas pueden escalonarse?', a: 'Sí. Programamos entregas escalonadas por semanas o meses para que el equipo llegue conforme escalas, a cualquier punto del país.' },
        { q: '¿Hay financiamiento en pedidos de flota?', a: 'Sí — compra directa, arrendamiento y lease-to-own aplican a pedidos por volumen, por separado o combinados.' },
        { q: '¿Surten unidades nuevas y usadas para flotas?', a: 'Sí. Muchas flotas combinan unidades nuevas para rutas principales con usadas inspeccionadas bajo DOT para picos o respaldo.' },
      ],
      ctaHeading: 'Solicita una cotización de flota',
      ctaText: 'Dinos cantidad de unidades, mezcla de configuraciones y calendario de entrega — enviamos precio por volumen el mismo día hábil.',
    },
  },

  // ---------------------------------------------------------
  // LOCATION — Houston, TX
  // ---------------------------------------------------------
  {
    slug: 'locations/houston',
    type: 'location',
    keywords: 'container chassis Houston, chassis dealer Houston TX, buy chassis Houston, Port of Houston chassis',
    specs: [
      { label: 'Location', labelEs: 'Ubicación', value: 'Houston, Texas' },
      { label: 'Serves', labelEs: 'Atiende', value: 'Port of Houston drayage & Gulf Coast' },
      { label: 'Inventory', labelEs: 'Inventario', value: 'New & used, 20ft to triaxle' },
      { label: 'Delivery', labelEs: 'Entrega', value: 'Local pickup & nationwide shipping' },
    ],
    en: {
      metaTitle: 'Container Chassis in Houston, TX | Local Dealer | American Chassis Depot',
      metaDescription: 'Houston-based container chassis dealer serving Port of Houston drayage and Gulf Coast fleets. New and used chassis in stock, local pickup, leasing, and nationwide delivery.',
      h1: 'Container Chassis in Houston, Texas',
      heroSubtitle: 'Your local chassis dealer serving the Port of Houston and the Gulf Coast.',
      intro: [
        'American Chassis Depot is headquartered in Houston, Texas — in the middle of one of the busiest container corridors in the country. If you run drayage at the Port of Houston, serve the petrochemical corridor, or move intermodal freight across the Gulf Coast, our inventory is minutes from your lanes, not weeks away on a production schedule.',
        'We stock new and DOT-inspected used chassis in the configurations Houston freight actually demands: 20ft and 40ft goosenecks for container moves, triaxles for overweight loads out of the port, and extendables for mixed traffic.',
      ],
      sections: [
        {
          heading: 'Why buy local in Houston',
          body: [
            'Local stock means you can inspect units in person before committing, pick up the same week, and skip long-haul delivery fees entirely. When a customer contract starts Monday, equipment sitting in Houston beats equipment sitting in a factory queue.',
            'Port of Houston drayage operators also value having a nearby source for rapid replacement — a damaged chassis does not have to sideline a power unit for weeks.',
          ],
        },
        {
          heading: 'Sales, leasing, and support from Houston',
          body: [
            'Every program we offer runs from our Houston base: direct purchase, leasing, lease-to-own, and fleet volume orders. Come inspect the yard, or send your specs and we will match units from current inventory.',
          ],
        },
      ],
      faqs: [
        { q: 'Where is American Chassis Depot located?', a: 'We are based in Houston, Texas, serving Port of Houston drayage operators and Gulf Coast fleets, with nationwide delivery from our Houston base.' },
        { q: 'Can I inspect a chassis before buying?', a: 'Yes. Local buyers are welcome to inspect units in person in Houston before purchasing — contact us to schedule a visit.' },
        { q: 'Do you serve Port of Houston drayage companies?', a: 'Yes — port drayage is our core local market. We stock the configurations port freight demands, including triaxles for overweight containers.' },
        { q: 'Can I pick up locally instead of paying for delivery?', a: 'Yes. Local pickup in Houston is available on in-stock units, often the same week.' },
        { q: 'Do you deliver outside the Houston area?', a: 'Yes. We arrange delivery across Texas and nationwide; cost and timing depend on destination and quantity.' },
      ],
      ctaHeading: 'Talk to our Houston team',
      ctaText: 'Tell us what you need — inspect in person or get a quote with local pickup or delivery options.',
    },
    es: {
      metaTitle: 'Chasis de Contenedor en Houston, TX | Distribuidor Local | American Chassis Depot',
      metaDescription: 'Distribuidor de chasis de contenedor en Houston al servicio del drayage del Puerto de Houston y flotas de la Costa del Golfo. Chasis nuevos y usados en inventario, recolección local y envío nacional.',
      h1: 'Chasis de Contenedor en Houston, Texas',
      heroSubtitle: 'Tu distribuidor local de chasis para el Puerto de Houston y la Costa del Golfo.',
      intro: [
        'American Chassis Depot tiene su sede en Houston, Texas — en medio de uno de los corredores de contenedores más activos del país. Si haces drayage en el Puerto de Houston, atiendes el corredor petroquímico o mueves carga intermodal por la Costa del Golfo, nuestro inventario está a minutos de tus rutas, no a semanas en una cola de producción.',
        'Tenemos en inventario chasis nuevos y usados inspeccionados bajo DOT en las configuraciones que la carga de Houston realmente exige: gooseneck de 20ft y 40ft para movimientos de contenedores, triaxle para cargas con sobrepeso saliendo del puerto y extendibles para tráfico mixto.',
      ],
      sections: [
        {
          heading: 'Por qué comprar local en Houston',
          body: [
            'El inventario local significa que puedes inspeccionar unidades en persona antes de comprometerte, recoger la misma semana y evitar por completo los fletes de larga distancia. Cuando un contrato arranca el lunes, el equipo en Houston le gana al equipo en una fila de fábrica.',
            'Los operadores de drayage del Puerto de Houston también valoran tener una fuente cercana de reemplazo rápido — un chasis dañado no tiene que parar una unidad motriz por semanas.',
          ],
        },
        {
          heading: 'Venta, arrendamiento y soporte desde Houston',
          body: [
            'Todos nuestros programas operan desde nuestra base en Houston: compra directa, arrendamiento, lease-to-own y pedidos de flota por volumen. Ven a inspeccionar el patio, o envíanos tus especificaciones y te enlazamos con unidades del inventario actual.',
          ],
        },
      ],
      faqs: [
        { q: '¿Dónde está American Chassis Depot?', a: 'Nuestra sede está en Houston, Texas, al servicio de operadores de drayage del Puerto de Houston y flotas de la Costa del Golfo, con envío nacional desde nuestra base.' },
        { q: '¿Puedo inspeccionar un chasis antes de comprar?', a: 'Sí. Los compradores locales pueden inspeccionar unidades en persona en Houston antes de comprar — contáctanos para agendar una visita.' },
        { q: '¿Atienden empresas de drayage del Puerto de Houston?', a: 'Sí — el drayage de puerto es nuestro mercado local principal. Tenemos las configuraciones que la carga de puerto exige, incluidos triaxle para contenedores con sobrepeso.' },
        { q: '¿Puedo recoger localmente en vez de pagar entrega?', a: 'Sí. La recolección local en Houston está disponible en unidades en inventario, con frecuencia la misma semana.' },
        { q: '¿Entregan fuera del área de Houston?', a: 'Sí. Coordinamos entregas en todo Texas y a nivel nacional; el costo y el tiempo dependen del destino y la cantidad.' },
      ],
      ctaHeading: 'Habla con nuestro equipo de Houston',
      ctaText: 'Dinos qué necesitas — inspecciona en persona u obtén una cotización con opciones de recolección local o entrega.',
    },
  },

  // ---------------------------------------------------------
  // LOCATION — Texas (statewide)
  // ---------------------------------------------------------
  {
    slug: 'locations/texas',
    type: 'location',
    keywords: 'container chassis Texas, chassis dealer Texas, buy chassis Dallas, chassis Laredo border, Texas intermodal chassis',
    specs: [
      { label: 'Home base', labelEs: 'Base', value: 'Houston, TX' },
      { label: 'Coverage', labelEs: 'Cobertura', value: 'Statewide — DFW, San Antonio, Austin, Laredo, El Paso' },
      { label: 'Key markets', labelEs: 'Mercados clave', value: 'Ports, border crossings, intermodal ramps' },
      { label: 'Delivery', labelEs: 'Entrega', value: 'Scheduled statewide from Houston' },
    ],
    en: {
      metaTitle: 'Container Chassis Across Texas | Statewide Delivery | American Chassis Depot',
      metaDescription: 'Container chassis for Texas fleets — Houston, Dallas-Fort Worth, San Antonio, Austin, Laredo, and El Paso. New and used units with statewide delivery from our Houston base.',
      h1: 'Container Chassis Across Texas',
      heroSubtitle: 'Statewide chassis supply for Texas ports, border crossings, and intermodal ramps.',
      intro: [
        'Texas moves more international freight than any other state — through the Port of Houston, the Laredo border crossing, and the intermodal ramps of Dallas-Fort Worth and San Antonio. American Chassis Depot supplies the chassis behind that freight, delivering new and inspected used units to every corner of the state from our Houston base.',
        'Whether you run cross-border loads out of Laredo, ramp traffic in DFW, or Gulf drayage out of Houston, we stock the configurations your lanes demand — 20ft, 40ft gooseneck, 45ft, extendable, and triaxle.',
      ],
      sections: [
        {
          heading: 'Where we deliver in Texas',
          body: [
            'Scheduled deliveries run statewide: Houston and the Gulf Coast, Dallas-Fort Worth, San Antonio, Austin, Laredo and the border corridor, El Paso, and points between. Single units and staged fleet orders both ship from our Houston yard.',
            'Cross-border operators appreciate one detail in particular: equipment sourced in Texas is positioned exactly where southbound and northbound freight actually flows, cutting repositioning miles.',
          ],
        },
        {
          heading: 'One supplier for the whole state',
          body: [
            'Every program — purchase, leasing, lease-to-own, and 10+ unit fleet pricing — is available anywhere in Texas. Centralizing your chassis supply with one Texas source simplifies maintenance records, warranty claims, and future expansion orders.',
          ],
        },
      ],
      faqs: [
        { q: 'Do you deliver chassis anywhere in Texas?', a: 'Yes — scheduled deliveries run statewide from our Houston base, including DFW, San Antonio, Austin, Laredo, El Paso, and the Gulf Coast.' },
        { q: 'How long does delivery within Texas take?', a: 'In-stock units typically deliver within days, depending on destination and quantity. Staged schedules are available for fleet orders.' },
        { q: 'Do you serve cross-border carriers in Laredo?', a: 'Yes. The Laredo corridor is a key market — Texas-positioned equipment cuts repositioning miles for cross-border freight.' },
        { q: 'Can I combine Texas delivery with fleet pricing?', a: 'Yes. Orders of 10+ units get fleet pricing plus staged statewide delivery scheduled around your ramp-up.' },
        { q: 'Where does the equipment ship from?', a: 'Our yard in Houston, TX. Local buyers can also pick up in person.' },
      ],
      ctaHeading: 'Get a quote with Texas delivery',
      ctaText: 'Tell us your city, equipment, and quantity — we will quote unit pricing plus delivery to your location.',
    },
    es: {
      metaTitle: 'Chasis de Contenedor en Todo Texas | Entrega Estatal | American Chassis Depot',
      metaDescription: 'Chasis de contenedor para flotas de Texas — Houston, Dallas-Fort Worth, San Antonio, Austin, Laredo y El Paso. Unidades nuevas y usadas con entrega estatal desde Houston.',
      h1: 'Chasis de Contenedor en Todo Texas',
      heroSubtitle: 'Suministro estatal de chasis para puertos, cruces fronterizos y rampas intermodales de Texas.',
      intro: [
        'Texas mueve más carga internacional que cualquier otro estado — por el Puerto de Houston, el cruce fronterizo de Laredo y las rampas intermodales de Dallas-Fort Worth y San Antonio. American Chassis Depot suministra los chasis detrás de esa carga, entregando unidades nuevas y usadas inspeccionadas a todo el estado desde nuestra base en Houston.',
        'Ya sea que muevas carga transfronteriza desde Laredo, tráfico de rampa en DFW o drayage del Golfo desde Houston, tenemos las configuraciones que tus rutas exigen — 20ft, 40ft gooseneck, 45ft, extendibles y triaxle.',
      ],
      sections: [
        {
          heading: 'Dónde entregamos en Texas',
          body: [
            'Las entregas programadas cubren todo el estado: Houston y la Costa del Golfo, Dallas-Fort Worth, San Antonio, Austin, Laredo y el corredor fronterizo, El Paso y puntos intermedios. Tanto unidades individuales como pedidos de flota escalonados salen de nuestro patio en Houston.',
            'Los operadores transfronterizos aprecian un detalle en particular: el equipo adquirido en Texas queda posicionado exactamente donde fluye la carga hacia el sur y el norte, reduciendo millas de reposicionamiento.',
          ],
        },
        {
          heading: 'Un proveedor para todo el estado',
          body: [
            'Todos los programas — compra, arrendamiento, lease-to-own y precio de flota en 10+ unidades — están disponibles en cualquier punto de Texas. Centralizar tu suministro de chasis con una sola fuente en Texas simplifica registros de mantenimiento, garantías y pedidos de expansión futuros.',
          ],
        },
      ],
      faqs: [
        { q: '¿Entregan chasis en cualquier punto de Texas?', a: 'Sí — las entregas programadas cubren todo el estado desde nuestra base en Houston, incluyendo DFW, San Antonio, Austin, Laredo, El Paso y la Costa del Golfo.' },
        { q: '¿Cuánto tarda la entrega dentro de Texas?', a: 'Las unidades en inventario suelen entregarse en días, según destino y cantidad. Hay calendarios escalonados para pedidos de flota.' },
        { q: '¿Atienden transportistas transfronterizos en Laredo?', a: 'Sí. El corredor de Laredo es un mercado clave — el equipo posicionado en Texas reduce millas de reposicionamiento para la carga transfronteriza.' },
        { q: '¿Puedo combinar entrega en Texas con precio de flota?', a: 'Sí. Los pedidos de 10+ unidades obtienen precio de flota más entrega estatal escalonada según tu plan de crecimiento.' },
        { q: '¿De dónde sale el equipo?', a: 'De nuestro patio en Houston, TX. Los compradores locales también pueden recoger en persona.' },
      ],
      ctaHeading: 'Cotiza con entrega en Texas',
      ctaText: 'Dinos tu ciudad, equipo y cantidad — cotizamos precio por unidad más la entrega a tu ubicación.',
    },
  },
];
