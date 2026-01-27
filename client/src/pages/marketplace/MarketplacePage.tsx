import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  DollarSign, 
  Truck, 
  Heart,
  Eye,
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/marketplace/SEOHead';
import { 
  getListings, 
  getChassisTypes, 
  getConditions, 
  getStates,
  toggleFavorite,
  isAuthenticated,
  type MarketplaceListing,
  type ListingFilters 
} from '@/lib/marketplace-api';
import { t, formatPrice, getLocalizedField, getReferenceImage } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

// Listing Card Component
function ListingCard({ listing, onFavoriteToggle }: { 
  listing: MarketplaceListing; 
  onFavoriteToggle?: (id: number) => void;
}) {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const [isFavorited, setIsFavorited] = useState(listing.isFavorited || false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
      return;
    }
    try {
      const result = await toggleFavorite(listing.id);
      setIsFavorited(result.favorited);
      onFavoriteToggle?.(listing.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const conditionColors: Record<string, string> = {
    'ASIS': 'bg-red-100 text-red-800 border-red-200',
    'Road-worthy': 'bg-green-100 text-green-800 border-green-200',
    'New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Certified': 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group cursor-pointer overflow-hidden border-gray-200 hover:border-[#0A3161] hover:shadow-xl transition-all duration-300"
        onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {listing.primaryImageUrl ? (
            <img
              src={listing.primaryImageUrl}
              alt={getLocalizedField(listing, 'title')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <>
              <img
                src={getReferenceImage(listing.chassisType, listing.chassisSize)}
                alt={getLocalizedField(listing, 'title')}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              {/* Reference image indicator */}
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] px-2 py-0.5 bg-black/60 text-white rounded-full backdrop-blur-sm">
                  {t('referenceImage')}
                </span>
              </div>
            </>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {listing.featured && (
              <Badge className="bg-amber-500 text-white border-0">
                {t('featured')}
              </Badge>
            )}
            {listing.verified && (
              <Badge className="bg-[#0A3161] text-white border-0">
                {t('verified')}
              </Badge>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </button>

          {/* Condition badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={`${conditionColors[listing.condition] || 'bg-gray-100 text-gray-800'} border`}>
              {listing.condition}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title & Location */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-[#0A3161] transition-colors">
            {getLocalizedField(listing, 'title')}
          </h3>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.city}, {listing.state}</span>
          </div>

          {/* Type & Size */}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {listing.chassisType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {listing.chassisSize}
            </Badge>
          </div>

          {/* Price & Quantity */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div>
              <p className="text-2xl font-bold text-[#0A3161]">
                {formatPrice(listing.pricePerUnit)}
              </p>
              <p className="text-xs text-gray-500">{t('perUnit')}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {listing.quantityAvailable} {listing.quantityAvailable === 1 ? t('unit') : t('units')}
              </p>
              <p className="text-xs text-gray-500">{t('available')}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{listing.viewsCount} {t('views')}</span>
            </div>
            {listing.priceNegotiable && (
              <Badge variant="secondary" className="text-xs">
                {t('negotiable')}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Loading Skeleton
function ListingSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3]" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex justify-between pt-3 border-t">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

// Filter Sidebar Component
function FilterSidebar({ 
  filters, 
  setFilters,
  chassisTypes,
  conditions,
  states,
  onClear
}: {
  filters: ListingFilters;
  setFilters: (filters: ListingFilters) => void;
  chassisTypes: any[];
  conditions: any[];
  states: string[];
  onClear: () => void;
}) {
  const lang = getCurrentLanguage();

  // Sizes must match database values (with apostrophe format)
  const sizes = ["20'", "40'", "45'", "53'", "20-40'", "40-45'", "40-45-48'", "40-45-48-53'"];

  return (
    <div className="space-y-6">
      {/* Chassis Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('chassisType')}
        </label>
        <Select
          value={filters.chassisType || 'all'}
          onValueChange={(value) => setFilters({ ...filters, chassisType: value === 'all' ? undefined : value, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTypes')}</SelectItem>
            {chassisTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {lang === 'es' ? type.nameEs || type.name : type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('size')}
        </label>
        <Select
          value={filters.chassisSize || 'all'}
          onValueChange={(value) => setFilters({ ...filters, chassisSize: value === 'all' ? undefined : value, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allSizes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allSizes')}</SelectItem>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('condition')}
        </label>
        <Select
          value={filters.condition || 'all'}
          onValueChange={(value) => setFilters({ ...filters, condition: value === 'all' ? undefined : value, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allConditions')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allConditions')}</SelectItem>
            {conditions.map((cond) => (
              <SelectItem key={cond.id} value={cond.name}>
                {lang === 'es' ? cond.nameEs || cond.name : cond.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('state')}
        </label>
        <Select
          value={filters.state || 'all'}
          onValueChange={(value) => setFilters({ ...filters, state: value === 'all' ? undefined : value, page: 1 })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('allStates')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allStates')}</SelectItem>
            {states.map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {t('priceRange')}
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={t('minPrice')}
            value={filters.minPrice || ''}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="w-1/2"
          />
          <Input
            type="number"
            placeholder={t('maxPrice')}
            value={filters.maxPrice || ''}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="w-1/2"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={onClear}>
        <X className="w-4 h-4 mr-2" />
        {t('clearFilters')}
      </Button>
    </div>
  );
}

// Main Marketplace Page
export default function MarketplacePage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Omit<ListingFilters, 'page'>>({
    limit: 12,
    sortBy: 'date_desc',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Infinite scroll query
  const { 
    data: listingsData, 
    isLoading: listingsLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch 
  } = useInfiniteQuery({
    queryKey: ['marketplace-listings-infinite', filters],
    queryFn: ({ pageParam = 1 }) => getListings({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return (lastPage.pagination.page || 1) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten all listings from all pages
  const allListings = listingsData?.pages.flatMap(page => page.listings) || [];
  const totalCount = listingsData?.pages[0]?.pagination.total || 0;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const { data: chassisTypes = [] } = useQuery({
    queryKey: ['chassis-types'],
    queryFn: getChassisTypes,
  });

  const { data: conditions = [] } = useQuery({
    queryKey: ['conditions'],
    queryFn: getConditions,
  });

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: getStates,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery });
  };

  const clearFilters = () => {
    setFilters({ limit: 12, sortBy: 'date_desc' });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.chassisType || filters.chassisSize || filters.condition || 
    filters.state || filters.minPrice || filters.maxPrice || filters.search;

  // SEO translations
  const seoContent = {
    en: {
      title: 'Browse Container Chassis for Sale | Marketplace | American Chassis Depot',
      description: 'Find quality used and new container chassis from verified sellers across the USA. Gooseneck, slider, extendable, and spread axle chassis. Compare prices and make offers directly.',
    },
    es: {
      title: 'Comprar Chassis para Contenedores | Marketplace | American Chassis Depot',
      description: 'Encuentra chassis para contenedores usados y nuevos de vendedores verificados en EE.UU. Chassis Gooseneck, slider, extensibles. Compara precios y haz ofertas directamente.',
    }
  };
  const seo = seoContent[lang as keyof typeof seoContent] || seoContent.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonicalPath={`/${lang}/chassis-marketplace`}
        type="website"
        breadcrumbs={[
          { name: lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
          { name: 'Marketplace', url: `/${lang}/marketplace` },
          { name: lang === 'es' ? 'Catálogo' : 'Browse', url: `/${lang}/chassis-marketplace` },
        ]}
        faqs={[
          {
            question: lang === 'es' ? '¿Cómo compro un chassis?' : 'How do I buy a chassis?',
            answer: lang === 'es' 
              ? 'Navega por los listings, contacta al vendedor para discutir detalles y acordar términos de la compra.'
              : 'Browse listings, contact the seller to discuss details and agree on purchase terms.'
          },
          {
            question: lang === 'es' ? '¿Los vendedores están verificados?' : 'Are sellers verified?',
            answer: lang === 'es'
              ? 'Sí, todos los vendedores pasan por un proceso de verificación para garantizar transacciones seguras.'
              : 'Yes, all sellers go through a verification process to ensure safe transactions.'
          },
          {
            question: lang === 'es' ? '¿Puedo negociar el precio?' : 'Can I negotiate the price?',
            answer: lang === 'es'
              ? 'Sí, la mayoría de los listings permiten ofertas. Puedes enviar una oferta directamente al vendedor.'
              : 'Yes, most listings accept offers. You can send an offer directly to the seller.'
          }
        ]}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0A3161] to-[#1a4a8a] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('marketplace')}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              {t('marketplaceSubtitle')}
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white text-gray-900 border-0 text-lg"
                />
              </div>
              <Button type="submit" size="lg" className="bg-[#B22234] hover:bg-[#8B1A28] h-12 px-8">
                {t('search')}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4 bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {t('filters')}
                </h2>
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  chassisTypes={chassisTypes}
                  conditions={conditions}
                  states={states}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            {/* Listings */}
            <main className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        {t('filters')}
                        {hasActiveFilters && (
                          <Badge className="ml-2 bg-[#0A3161]">!</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>{t('filters')}</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar
                          filters={filters}
                          setFilters={setFilters}
                          chassisTypes={chassisTypes}
                          conditions={conditions}
                          states={states}
                          onClear={clearFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Results count */}
                  {totalCount > 0 && (
                    <p className="text-sm text-gray-600">
                      {t('showingResults')
                        .replace('{count}', String(allListings.length))
                        .replace('{total}', String(totalCount))}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <Select
                    value={filters.sortBy || 'date_desc'}
                    onValueChange={(value) => setFilters({ ...filters, sortBy: value as any })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date_desc">{t('newestFirst')}</SelectItem>
                      <SelectItem value="date_asc">{t('oldestFirst')}</SelectItem>
                      <SelectItem value="price_asc">{t('priceLowHigh')}</SelectItem>
                      <SelectItem value="price_desc">{t('priceHighLow')}</SelectItem>
                      <SelectItem value="views">{t('mostViewed')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Toggle */}
                  <div className="hidden sm:flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-[#0A3161] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-[#0A3161] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.chassisType && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.chassisType}
                      <button 
                        onClick={() => setFilters({ ...filters, chassisType: undefined })}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.chassisSize && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.chassisSize}
                      <button 
                        onClick={() => setFilters({ ...filters, chassisSize: undefined })}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.condition && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.condition}
                      <button 
                        onClick={() => setFilters({ ...filters, condition: undefined })}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.state && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.state}
                      <button 
                        onClick={() => setFilters({ ...filters, state: undefined })}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.search && (
                    <Badge variant="secondary" className="pl-3">
                      "{filters.search}"
                      <button 
                        onClick={() => { setFilters({ ...filters, search: undefined }); setSearchQuery(''); }}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}

              {/* Listings Grid */}
              {listingsLoading && allListings.length === 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {[...Array(6)].map((_, i) => (
                    <ListingSkeleton key={i} />
                  ))}
                </div>
              ) : allListings.length === 0 ? (
                <div className="text-center py-16">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    {t('noListingsFound')}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {t('tryAdjustingFilters')}
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    {t('clearFilters')}
                  </Button>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {allListings.map((listing) => (
                        <ListingCard 
                          key={listing.id} 
                          listing={listing}
                          onFavoriteToggle={() => refetch()}
                        />
                      ))}
                    </div>
                  </AnimatePresence>

                  {/* Infinite Scroll Sentinel */}
                  <div ref={loadMoreRef} className="w-full py-8">
                    {isFetchingNextPage && (
                      <div className="flex justify-center items-center gap-3">
                        <div className="w-6 h-6 border-2 border-[#0A3161] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-600">
                          {lang === 'es' ? 'Cargando más...' : 'Loading more...'}
                        </span>
                      </div>
                    )}
                    {!hasNextPage && allListings.length > 0 && (
                      <p className="text-center text-sm text-gray-500">
                        {lang === 'es' 
                          ? `Mostrando todos los ${totalCount} chassis` 
                          : `Showing all ${totalCount} chassis`}
                      </p>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
