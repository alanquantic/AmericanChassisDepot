import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Shield, 
  DollarSign, 
  Users, 
  MapPin, 
  CheckCircle, 
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  Search,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCurrentLanguage } from '@/lib/i18n-simple';
import { formatPrice } from '@/lib/marketplace-i18n';
import { getListings } from '@/lib/marketplace-api';
import SEOHead from '@/components/marketplace/SEOHead';
import { trackCTAClick, trackListingClick, trackListingImpressions } from '@/lib/marketplace-analytics';

// Landing page translations
const landingTranslations = {
  en: {
    // SEO
    metaTitle: 'Chassis Marketplace | Buy & Sell Container Chassis | American Chassis Depot',
    metaDescription: 'The largest B2B marketplace for container chassis in the USA. Find quality used and new chassis from verified sellers. Gooseneck, slider, extendable, and spread axle chassis available.',
    
    // Hero
    heroTitle: 'The #1 Marketplace for Container Chassis',
    heroSubtitle: 'Buy and sell quality chassis from verified dealers across the United States',
    heroCta: 'Browse Chassis',
    heroSecondaryCta: 'Become a Seller',
    heroStats1: '500+',
    heroStats1Label: 'Chassis Available',
    heroStats2: '20+',
    heroStats2Label: 'States Covered',
    heroStats3: '$6M+',
    heroStats3Label: 'Inventory Value',
    
    // What is
    whatIsTitle: 'What is the Chassis Marketplace?',
    whatIsDescription: 'The Chassis Marketplace is a B2B platform connecting chassis sellers with buyers across the United States. Whether you\'re looking to purchase quality used chassis or sell your existing inventory, our platform makes it simple, secure, and efficient.',
    whatIsPoint1: 'Direct connection between buyers and sellers',
    whatIsPoint2: 'Verified dealers and transparent pricing',
    whatIsPoint3: 'Secure transactions with Stripe',
    whatIsPoint4: 'Real-time inventory updates',
    
    // Benefits
    benefitsTitle: 'Why Choose Our Marketplace?',
    benefit1Title: 'Verified Sellers',
    benefit1Desc: 'All sellers are verified to ensure quality and reliability. Trade with confidence.',
    benefit2Title: 'Best Prices',
    benefit2Desc: 'Compare prices from multiple sellers and negotiate directly for the best deals.',
    benefit3Title: 'Nationwide Coverage',
    benefit3Desc: 'Find chassis across 20+ states. Filter by location to find inventory near you.',
    benefit4Title: 'Secure Payments',
    benefit4Desc: 'All transactions are protected by Stripe for secure and hassle-free payments.',
    benefit5Title: 'Direct Messaging',
    benefit5Desc: 'Communicate directly with sellers to ask questions and negotiate terms.',
    benefit6Title: 'Fast & Easy',
    benefit6Desc: 'Find what you need in seconds with our powerful search and filter system.',
    
    // How it works
    howItWorksTitle: 'How It Works',
    howStep1Title: 'Browse Listings',
    howStep1Desc: 'Search and filter through hundreds of chassis listings by type, condition, location, and price.',
    howStep2Title: 'Contact Seller',
    howStep2Desc: 'Send a message or make an offer directly to the seller through our secure platform.',
    howStep3Title: 'Negotiate & Buy',
    howStep3Desc: 'Agree on terms and complete your purchase securely through Stripe.',
    
    // Featured listings
    featuredTitle: 'Featured Chassis',
    featuredSubtitle: 'Browse our latest available inventory',
    viewAllListings: 'View All Listings',
    
    // CTA sections
    buyerCtaTitle: 'Looking to Buy?',
    buyerCtaDesc: 'Create a free buyer account to make offers, save favorites, and get notified about new listings.',
    buyerCtaButton: 'Register as Buyer',
    
    sellerCtaTitle: 'Want to Sell?',
    sellerCtaDesc: 'List your chassis inventory and reach thousands of potential buyers across the country.',
    sellerCtaButton: 'Become a Seller',
    
    // Stats
    statsTitle: 'Trusted by the Industry',
    stat1: 'Chassis Sold',
    stat2: 'Active Sellers',
    stat3: 'States Covered',
    stat4: 'Customer Satisfaction',
    
    // Final CTA
    finalCtaTitle: 'Ready to Get Started?',
    finalCtaDesc: 'Join the largest chassis marketplace in the USA today.',
    finalCtaButton: 'Browse Marketplace',
    
    // Cards
    perUnit: 'per unit',
    available: 'available',
    viewDetails: 'View Details',
  },
  es: {
    // SEO
    metaTitle: 'Mercado de Chassis | Compra y Vende Chassis de Contenedor | American Chassis Depot',
    metaDescription: 'El marketplace B2B más grande de chassis de contenedor en EE.UU. Encuentra chassis usados y nuevos de calidad de vendedores verificados.',
    
    // Hero
    heroTitle: 'El Marketplace #1 de Chassis de Contenedor',
    heroSubtitle: 'Compra y vende chassis de calidad de distribuidores verificados en todo Estados Unidos',
    heroCta: 'Explorar Chassis',
    heroSecondaryCta: 'Ser Vendedor',
    heroStats1: '500+',
    heroStats1Label: 'Chassis Disponibles',
    heroStats2: '20+',
    heroStats2Label: 'Estados Cubiertos',
    heroStats3: '$6M+',
    heroStats3Label: 'Valor de Inventario',
    
    // What is
    whatIsTitle: '¿Qué es el Mercado de Chassis?',
    whatIsDescription: 'El Mercado de Chassis es una plataforma B2B que conecta vendedores de chassis con compradores en todo Estados Unidos. Ya sea que busques comprar chassis usados de calidad o vender tu inventario existente, nuestra plataforma lo hace simple, seguro y eficiente.',
    whatIsPoint1: 'Conexión directa entre compradores y vendedores',
    whatIsPoint2: 'Distribuidores verificados y precios transparentes',
    whatIsPoint3: 'Transacciones seguras con Stripe',
    whatIsPoint4: 'Actualizaciones de inventario en tiempo real',
    
    // Benefits
    benefitsTitle: '¿Por Qué Elegir Nuestro Marketplace?',
    benefit1Title: 'Vendedores Verificados',
    benefit1Desc: 'Todos los vendedores son verificados para garantizar calidad y confiabilidad.',
    benefit2Title: 'Mejores Precios',
    benefit2Desc: 'Compara precios de múltiples vendedores y negocia directamente.',
    benefit3Title: 'Cobertura Nacional',
    benefit3Desc: 'Encuentra chassis en más de 20 estados. Filtra por ubicación cerca de ti.',
    benefit4Title: 'Pagos Seguros',
    benefit4Desc: 'Todas las transacciones están protegidas por Stripe para pagos seguros.',
    benefit5Title: 'Mensajería Directa',
    benefit5Desc: 'Comunícate directamente con vendedores para preguntar y negociar.',
    benefit6Title: 'Rápido y Fácil',
    benefit6Desc: 'Encuentra lo que necesitas en segundos con nuestro sistema de búsqueda.',
    
    // How it works
    howItWorksTitle: 'Cómo Funciona',
    howStep1Title: 'Explora Listings',
    howStep1Desc: 'Busca y filtra cientos de listings de chassis por tipo, condición, ubicación y precio.',
    howStep2Title: 'Contacta al Vendedor',
    howStep2Desc: 'Envía un mensaje o haz una oferta directamente al vendedor.',
    howStep3Title: 'Negocia y Compra',
    howStep3Desc: 'Acuerda términos y completa tu compra de forma segura con Stripe.',
    
    // Featured listings
    featuredTitle: 'Chassis Destacados',
    featuredSubtitle: 'Explora nuestro inventario disponible más reciente',
    viewAllListings: 'Ver Todos los Listings',
    
    // CTA sections
    buyerCtaTitle: '¿Buscas Comprar?',
    buyerCtaDesc: 'Crea una cuenta de comprador gratis para hacer ofertas, guardar favoritos y recibir notificaciones.',
    buyerCtaButton: 'Registrarse como Comprador',
    
    sellerCtaTitle: '¿Quieres Vender?',
    sellerCtaDesc: 'Lista tu inventario de chassis y alcanza miles de compradores potenciales.',
    sellerCtaButton: 'Ser Vendedor',
    
    // Stats
    statsTitle: 'Confianza de la Industria',
    stat1: 'Chassis Vendidos',
    stat2: 'Vendedores Activos',
    stat3: 'Estados Cubiertos',
    stat4: 'Satisfacción del Cliente',
    
    // Final CTA
    finalCtaTitle: '¿Listo para Comenzar?',
    finalCtaDesc: 'Únete al marketplace de chassis más grande de EE.UU. hoy.',
    finalCtaButton: 'Explorar Marketplace',
    
    // Cards
    perUnit: 'por unidad',
    available: 'disponible',
    viewDetails: 'Ver Detalles',
  }
};

type LangKey = keyof typeof landingTranslations;
type TranslationKey = keyof typeof landingTranslations.en;

function useLandingTranslation() {
  const lang = getCurrentLanguage() as LangKey;
  const translations = landingTranslations[lang] || landingTranslations.en;
  return (key: TranslationKey) => translations[key] || key;
}

interface Listing {
  id: number;
  slug: string;
  title: string;
  titleEs: string | null;
  chassisType: string;
  chassisSize: string;
  condition: string;
  state: string;
  city: string;
  quantity: number;
  quantityAvailable: number;
  pricePerUnit: string;
  priceNegotiable: boolean;
  primaryImageUrl: string | null;
}

export function MarketplaceLandingPage() {
  const t = useLandingTranslation();
  const lang = getCurrentLanguage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch random listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getListings({ limit: 12 });
        // Shuffle and take 6
        const shuffled = response.listings.sort(() => 0.5 - Math.random());
        setListings(shuffled.slice(0, 6));
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Rotate featured listings every 5 seconds
  useEffect(() => {
    if (listings.length <= 3) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, listings.length - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, [listings.length]);

  const visibleListings = listings.slice(currentIndex, currentIndex + 3);
  if (visibleListings.length < 3 && listings.length > 0) {
    visibleListings.push(...listings.slice(0, 3 - visibleListings.length));
  }

  const benefits = [
    { icon: Shield, title: t('benefit1Title'), desc: t('benefit1Desc') },
    { icon: DollarSign, title: t('benefit2Title'), desc: t('benefit2Desc') },
    { icon: MapPin, title: t('benefit3Title'), desc: t('benefit3Desc') },
    { icon: CheckCircle, title: t('benefit4Title'), desc: t('benefit4Desc') },
    { icon: MessageSquare, title: t('benefit5Title'), desc: t('benefit5Desc') },
    { icon: Clock, title: t('benefit6Title'), desc: t('benefit6Desc') },
  ];

  const getTitle = (listing: Listing) => {
    return lang === 'es' && listing.titleEs ? listing.titleEs : listing.title;
  };

  // Track listing impressions when they load
  useEffect(() => {
    if (listings.length > 0) {
      trackListingImpressions(
        listings.slice(0, 6).map((listing, index) => ({
          id: listing.id,
          title: listing.title,
          price: parseFloat(listing.pricePerUnit),
          chassisType: listing.chassisType,
          position: index + 1,
        }))
      );
    }
  }, [listings]);

  // FAQ content for SEO structured data
  const faqContent = [
    {
      question: lang === 'es' ? '¿Qué es el Chassis Marketplace?' : 'What is the Chassis Marketplace?',
      answer: lang === 'es' 
        ? 'Es la plataforma B2B más grande para comprar y vender chassis para contenedores en EE.UU., conectando vendedores verificados con compradores.'
        : 'It\'s the largest B2B platform for buying and selling container chassis in the USA, connecting verified sellers with buyers.'
    },
    {
      question: lang === 'es' ? '¿Cómo funciona?' : 'How does it work?',
      answer: lang === 'es'
        ? 'Busca chassis disponibles, contacta al vendedor, negocia el precio y completa la transacción de forma segura con Stripe.'
        : 'Browse available chassis, contact the seller, negotiate the price, and complete the transaction securely with Stripe.'
    },
    {
      question: lang === 'es' ? '¿Qué tipos de chassis están disponibles?' : 'What types of chassis are available?',
      answer: lang === 'es'
        ? 'Tenemos Gooseneck, Slider, Spread Axle, Extendables y más en tamaños de 20ft a 53ft.'
        : 'We have Gooseneck, Slider, Spread Axle, Extendables and more in sizes from 20ft to 53ft.'
    },
    {
      question: lang === 'es' ? '¿Los vendedores están verificados?' : 'Are sellers verified?',
      answer: lang === 'es'
        ? 'Sí, todos los vendedores pasan por un proceso de verificación para garantizar transacciones seguras y confiables.'
        : 'Yes, all sellers go through a verification process to ensure safe and reliable transactions.'
    },
  ];

  return (
    <>
      <SEOHead
        title={t('metaTitle')}
        description={t('metaDescription')}
        canonicalPath={`/${lang}/marketplace`}
        type="website"
        breadcrumbs={[
          { name: lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
          { name: 'Marketplace', url: `/${lang}/marketplace` },
        ]}
        faqs={faqContent}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5F] via-[#1B3A5F] to-[#0D1F33] text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge className="mb-6 bg-[#A93226] hover:bg-[#922B21] text-white px-4 py-1.5 text-sm">
                <Star className="w-4 h-4 mr-2 inline" />
                #1 B2B Chassis Marketplace
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t('heroTitle')}
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
                {t('heroSubtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href={`/${lang}/chassis-marketplace`}>
                  <Button 
                    size="lg" 
                    className="bg-[#A93226] hover:bg-[#922B21] text-white px-8 py-6 text-lg"
                    onClick={() => trackCTAClick('browse_chassis', 'hero', '/chassis-marketplace')}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {t('heroCta')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/marketplace/register?role=seller">
                  <Button 
                    size="lg" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1B3A5F] px-8 py-6 text-lg"
                    onClick={() => trackCTAClick('become_seller', 'hero', '/marketplace/register')}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    {t('heroSecondaryCta')}
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">{t('heroStats1')}</div>
                  <div className="text-blue-200 text-sm md:text-base">{t('heroStats1Label')}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">{t('heroStats2')}</div>
                  <div className="text-blue-200 text-sm md:text-base">{t('heroStats2Label')}</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-white">{t('heroStats3')}</div>
                  <div className="text-blue-200 text-sm md:text-base">{t('heroStats3Label')}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
            </svg>
          </div>
        </section>

        {/* What Is Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-6">
                    {t('whatIsTitle')}
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    {t('whatIsDescription')}
                  </p>
                  <ul className="space-y-4">
                    {[t('whatIsPoint1'), t('whatIsPoint2'), t('whatIsPoint3'), t('whatIsPoint4')].map((point, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-[#A93226] flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#1B3A5F] to-[#0D1F33] rounded-2xl p-8 text-white shadow-2xl">
                    <Truck className="w-16 h-16 mb-6 text-[#A93226]" />
                    <h3 className="text-2xl font-bold mb-4">American Chassis Depot</h3>
                    <p className="text-blue-100 mb-6">
                      Your trusted source for premium container chassis solutions from leading manufacturers.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold">50+</div>
                        <div className="text-sm text-blue-200">Active Listings</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl font-bold">501</div>
                        <div className="text-sm text-blue-200">Units Available</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
                {t('benefitsTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-[#1B3A5F]/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-[#A93226]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1B3A5F] mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
                {t('howItWorksTitle')}
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { num: '1', title: t('howStep1Title'), desc: t('howStep1Desc'), icon: Search },
                  { num: '2', title: t('howStep2Title'), desc: t('howStep2Desc'), icon: MessageSquare },
                  { num: '3', title: t('howStep3Title'), desc: t('howStep3Desc'), icon: CheckCircle },
                ].map((step, index) => (
                  <div key={index} className="text-center relative">
                    {index < 2 && (
                      <div className="hidden md:block absolute top-12 left-[60%] w-[80%]">
                        <ChevronRight className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                    <div className="w-24 h-24 rounded-full bg-[#1B3A5F] text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <step.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1B3A5F] mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5F] mb-4">
                {t('featuredTitle')}
              </h2>
              <p className="text-gray-600 text-lg">{t('featuredSubtitle')}</p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg" />
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  {visibleListings.map((listing, index) => (
                    <motion.div
                      key={`${listing.id}-${currentIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/${lang}/chassis-marketplace/${listing.slug}`}>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden">
                          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            {listing.primaryImageUrl ? (
                              <img 
                                src={listing.primaryImageUrl} 
                                alt={getTitle(listing)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <Truck className="w-20 h-20 text-gray-400" />
                            )}
                            <Badge className="absolute top-3 left-3 bg-[#1B3A5F] text-white">
                              {listing.condition}
                            </Badge>
                          </div>
                          <CardContent className="p-5">
                            <h3 className="font-semibold text-[#1B3A5F] mb-2 line-clamp-2 group-hover:text-[#A93226] transition-colors">
                              {getTitle(listing)}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                              <MapPin className="w-4 h-4" />
                              {listing.city}, {listing.state}
                            </div>
                            <div className="flex justify-between items-end">
                              <div>
                                <div className="text-2xl font-bold text-[#A93226]">
                                  {formatPrice(listing.pricePerUnit)}
                                </div>
                                <div className="text-sm text-gray-500">{t('perUnit')}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-[#1B3A5F]">
                                  {listing.quantityAvailable}
                                </div>
                                <div className="text-sm text-gray-500">{t('available')}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href={`/${lang}/chassis-marketplace`}>
                <Button size="lg" className="bg-[#1B3A5F] hover:bg-[#0D1F33]">
                  {t('viewAllListings')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dual CTA Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Buyer CTA */}
              <Card className="h-full bg-white border-2 border-[#1B3A5F]/10 hover:border-[#1B3A5F]/30 transition-colors">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-[#1B3A5F]/10 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-[#1B3A5F]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1B3A5F] mb-4">
                    {t('buyerCtaTitle')}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('buyerCtaDesc')}
                  </p>
                  <Link href="/marketplace/register?role=buyer">
                    <Button className="w-full bg-[#1B3A5F] hover:bg-[#0D1F33]">
                      {t('buyerCtaButton')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Seller CTA */}
              <Card className="h-full bg-gradient-to-br from-[#A93226] to-[#7D241C] text-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">
                    {t('sellerCtaTitle')}
                  </h3>
                  <p className="text-red-100 mb-6">
                    {t('sellerCtaDesc')}
                  </p>
                  <Link href="/marketplace/register?role=seller">
                    <Button className="w-full bg-white text-[#A93226] hover:bg-gray-100">
                      {t('sellerCtaButton')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-[#1B3A5F] to-[#0D1F33] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('finalCtaTitle')}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('finalCtaDesc')}
            </p>
            <Link href={`/${lang}/chassis-marketplace`}>
              <Button size="lg" className="bg-[#A93226] hover:bg-[#922B21] px-8 py-6 text-lg">
                {t('finalCtaButton')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default MarketplaceLandingPage;
