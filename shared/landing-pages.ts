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
  specs?: LandingSpec[];
  en: LandingLocale;
  es: LandingLocale;
}

export function getLandingPage(slug: string): LandingPage | undefined {
  const clean = slug.replace(/\/+$/, '');
  return LANDING_PAGES.find((p) => p.slug === clean);
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
];
