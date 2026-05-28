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
  getManufacturers,
  getAxleConfigs,
  getSuspensions,
  getYearRange,
  getWheels,
  getConfigurations,
  getFeatures,
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
          {/* Year + Manufacturer chip (prominent) */}
          {(listing.year || listing.manufacturer) && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0A3161]/10 text-[#0A3161] text-xs font-semibold mb-1.5">
              {listing.year || ''}{listing.year && listing.manufacturer ? ' · ' : ''}{listing.manufacturer || ''}
            </div>
          )}

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

          {/* Feature tags (axle, suspension, wheels — first 3) */}
          {Array.isArray(listing.tags) && listing.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {listing.tags.slice(0, 3).map((tag: string, i: number) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-medium uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          )}

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
  manufacturers,
  axleConfigs,
  suspensions,
  wheels,
  configurations,
  features,
  yearRange,
  onClear
}: {
  filters: ListingFilters;
  setFilters: (filters: ListingFilters) => void;
  chassisTypes: any[];
  conditions: any[];
  states: string[];
  manufacturers: { name: string; count: number }[];
  axleConfigs: { name: string; count: number }[];
  suspensions: { name: string; count: number }[];
  wheels: { name: string; count: number }[];
  configurations: { name: string; count: number }[];
  features: { name: string; count: number }[];
  yearRange?: { minYear: number | null; maxYear: number | null };
  onClear: () => void;
}) {
  const lang = getCurrentLanguage();

  // Size buckets — backend handles three patterns:
  //  1. Standard "20'"-style: matches "20'", "20 ft", "20ft", "20 ft 6 in", etc.
  //  2. Non-standard range "30-39 ft": expands to all integer sizes in the range, excluding standards.
  //  3. Extendable combos with apostrophe "20-40'": exact match.
  // Note: removed "40-45-48-53'" because no listings currently use it (dead option in dropdown).
  const sizes = [
    "20'",
    "20-29 ft",
    "30-39 ft",
    "40'",
    "41-44 ft",
    "45'",
    "46-49 ft",
    "48'",
    "53'",
    "54+ ft",
    "20-40'",
    "40-45'",
    "40-45-48'",
  ];

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
            {chassisTypes.map((type: any) => (
              <SelectItem key={type.id} value={type.name}>
                {(lang === 'es' ? type.nameEs || type.name : type.name)}
                {typeof type.count === 'number' ? ` (${type.count})` : ''}
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
            {conditions.map((cond: any) => (
              <SelectItem key={cond.id} value={cond.name}>
                {(lang === 'es' ? cond.nameEs || cond.name : cond.name)}
                {typeof cond.count === 'number' ? ` (${cond.count})` : ''}
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

      {/* Manufacturer (only when reference returns ≥1) */}
      {manufacturers.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Fabricante' : 'Manufacturer'}
          </label>
          <Select
            value={filters.manufacturer || 'all'}
            onValueChange={(value) => setFilters({ ...filters, manufacturer: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todos los fabricantes' : 'All Manufacturers'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todos los fabricantes' : 'All Manufacturers'}</SelectItem>
              {manufacturers.map((m: any) => (
                <SelectItem key={m.name} value={m.name}>
                  {m.name}{typeof m.count === 'number' ? ` (${m.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Year Range */}
      {yearRange && yearRange.minYear && yearRange.maxYear && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Año' : 'Year'}
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder={`${yearRange.minYear}+`}
              min={yearRange.minYear}
              max={yearRange.maxYear}
              value={filters.yearMin || ''}
              onChange={(e) => setFilters({ ...filters, yearMin: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder={`≤${yearRange.maxYear}`}
              min={yearRange.minYear}
              max={yearRange.maxYear}
              value={filters.yearMax || ''}
              onChange={(e) => setFilters({ ...filters, yearMax: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
              className="w-1/2"
            />
          </div>
        </div>
      )}

      {/* Axle Configuration (only when extractor has populated specs) */}
      {axleConfigs.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Configuración de ejes' : 'Axle Configuration'}
          </label>
          <Select
            value={filters.axleConfig || 'all'}
            onValueChange={(value) => setFilters({ ...filters, axleConfig: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todas las configuraciones' : 'All'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todas las configuraciones' : 'All'}</SelectItem>
              {axleConfigs.map((a: any) => (
                <SelectItem key={a.name} value={a.name}>
                  {a.name}{typeof a.count === 'number' ? ` (${a.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Suspension */}
      {suspensions.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Suspensión' : 'Suspension'}
          </label>
          <Select
            value={filters.suspension || 'all'}
            onValueChange={(value) => setFilters({ ...filters, suspension: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todas' : 'All'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todas' : 'All'}</SelectItem>
              {suspensions.map((s: any) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name}{typeof s.count === 'number' ? ` (${s.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Wheels (Steel / Aluminum) */}
      {wheels.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Ruedas' : 'Wheels'}
          </label>
          <Select
            value={filters.wheels || 'all'}
            onValueChange={(value) => setFilters({ ...filters, wheels: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todas' : 'All'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todas' : 'All'}</SelectItem>
              {wheels.map((w: any) => (
                <SelectItem key={w.name} value={w.name}>
                  {w.name}{typeof w.count === 'number' ? ` (${w.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Configuration (Fixed / Sliding / Extendable) */}
      {configurations.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Configuración' : 'Configuration'}
          </label>
          <Select
            value={filters.configuration || 'all'}
            onValueChange={(value) => setFilters({ ...filters, configuration: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todas' : 'All'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todas' : 'All'}</SelectItem>
              {configurations.map((c: any) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}{typeof c.count === 'number' ? ` (${c.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Feature flags (Gooseneck, Lift Axle, Pintle Hook, ISO Tank, ...) */}
      {features.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {lang === 'es' ? 'Característica' : 'Feature'}
          </label>
          <Select
            value={filters.feature || 'all'}
            onValueChange={(value) => setFilters({ ...filters, feature: value === 'all' ? undefined : value, page: 1 })}
          >
            <SelectTrigger>
              <SelectValue placeholder={lang === 'es' ? 'Todas' : 'All'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{lang === 'es' ? 'Todas' : 'All'}</SelectItem>
              {features.map((f: any) => (
                <SelectItem key={f.name} value={f.name}>
                  {f.name}{typeof f.count === 'number' ? ` (${f.count})` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

function parseFiltersFromUrl(): Omit<ListingFilters, 'page'> {
  const params = new URLSearchParams(window.location.search);
  const parsed: Omit<ListingFilters, 'page'> = { limit: 12, sortBy: 'date_desc' };
  if (params.get('chassisType')) parsed.chassisType = params.get('chassisType')!;
  if (params.get('chassisSize')) parsed.chassisSize = params.get('chassisSize')!;
  if (params.get('condition')) parsed.condition = params.get('condition')!;
  if (params.get('state')) parsed.state = params.get('state')!;
  if (params.get('search')) parsed.search = params.get('search')!;
  if (params.get('minPrice')) parsed.minPrice = Number(params.get('minPrice'));
  if (params.get('maxPrice')) parsed.maxPrice = Number(params.get('maxPrice'));
  if (params.get('manufacturer')) parsed.manufacturer = params.get('manufacturer')!;
  if (params.get('yearMin')) parsed.yearMin = Number(params.get('yearMin'));
  if (params.get('yearMax')) parsed.yearMax = Number(params.get('yearMax'));
  if (params.get('axleConfig')) parsed.axleConfig = params.get('axleConfig')!;
  if (params.get('suspension')) parsed.suspension = params.get('suspension')!;
  if (params.get('wheels')) parsed.wheels = params.get('wheels')!;
  if (params.get('configuration')) parsed.configuration = params.get('configuration')!;
  if (params.get('feature')) parsed.feature = params.get('feature')!;
  if (params.get('sortBy')) parsed.sortBy = params.get('sortBy')!;
  return parsed;
}

function filtersToQueryString(f: Omit<ListingFilters, 'page'>): string {
  const params = new URLSearchParams();
  if (f.chassisType) params.set('chassisType', f.chassisType);
  if (f.chassisSize) params.set('chassisSize', f.chassisSize);
  if (f.condition) params.set('condition', f.condition);
  if (f.state) params.set('state', f.state);
  if (f.search) params.set('search', f.search);
  if (f.minPrice) params.set('minPrice', String(f.minPrice));
  if (f.maxPrice) params.set('maxPrice', String(f.maxPrice));
  if (f.manufacturer) params.set('manufacturer', f.manufacturer);
  if (f.yearMin) params.set('yearMin', String(f.yearMin));
  if (f.yearMax) params.set('yearMax', String(f.yearMax));
  if (f.axleConfig) params.set('axleConfig', f.axleConfig);
  if (f.suspension) params.set('suspension', f.suspension);
  if (f.wheels) params.set('wheels', f.wheels);
  if (f.configuration) params.set('configuration', f.configuration);
  if (f.feature) params.set('feature', f.feature);
  if (f.sortBy && f.sortBy !== 'date_desc') params.set('sortBy', f.sortBy);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// Main Marketplace Page
export default function MarketplacePage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<Omit<ListingFilters, 'page'>>(parseFiltersFromUrl);
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qs = filtersToQueryString(filters);
    const newUrl = `/${lang}/chassis-marketplace${qs}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters, lang]);

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

  const { data: manufacturers = [] } = useQuery({
    queryKey: ['manufacturers'],
    queryFn: () => getManufacturers(30),
  });

  const { data: axleConfigs = [] } = useQuery({
    queryKey: ['axle-configs'],
    queryFn: getAxleConfigs,
  });

  const { data: suspensions = [] } = useQuery({
    queryKey: ['suspensions'],
    queryFn: getSuspensions,
  });

  const { data: yearRange } = useQuery({
    queryKey: ['year-range'],
    queryFn: getYearRange,
  });

  const { data: wheels = [] } = useQuery({
    queryKey: ['wheels'],
    queryFn: getWheels,
  });

  const { data: configurations = [] } = useQuery({
    queryKey: ['configurations'],
    queryFn: getConfigurations,
  });

  const { data: features = [] } = useQuery({
    queryKey: ['features'],
    queryFn: getFeatures,
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
    filters.state || filters.minPrice || filters.maxPrice || filters.search ||
    filters.manufacturer || filters.yearMin || filters.yearMax ||
    filters.axleConfig || filters.suspension ||
    filters.wheels || filters.configuration || filters.feature;

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
        canonicalPath={`/${lang}/chassis-marketplace${filtersToQueryString(filters)}`}
        type="website"
        breadcrumbs={[
          { name: lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
          { name: 'Marketplace', url: `/${lang}/marketplace` },
          { name: lang === 'es' ? 'Catálogo' : 'Browse', url: `/${lang}/chassis-marketplace` },
        ]}
        itemList={allListings.slice(0, 30).map(l => ({
          name: l.title,
          url: `/${lang}/chassis-marketplace/${l.slug}`,
          image: l.primaryImageUrl || undefined,
          price: parseFloat(l.pricePerUnit),
          priceCurrency: 'USD',
        }))}
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
                  manufacturers={manufacturers}
                  axleConfigs={axleConfigs}
                  suspensions={suspensions}
                  wheels={wheels}
                  configurations={configurations}
                  features={features}
                  yearRange={yearRange}
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
                          manufacturers={manufacturers}
                          axleConfigs={axleConfigs}
                          suspensions={suspensions}
                          wheels={wheels}
                          configurations={configurations}
                          features={features}
                          yearRange={yearRange}
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
                  {filters.manufacturer && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.manufacturer}
                      <button onClick={() => setFilters({ ...filters, manufacturer: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {(filters.yearMin || filters.yearMax) && (
                    <Badge variant="secondary" className="pl-3">
                      {lang === 'es' ? 'Año' : 'Year'}: {filters.yearMin || '*'}–{filters.yearMax || '*'}
                      <button onClick={() => setFilters({ ...filters, yearMin: undefined, yearMax: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.axleConfig && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.axleConfig}
                      <button onClick={() => setFilters({ ...filters, axleConfig: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.suspension && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.suspension}
                      <button onClick={() => setFilters({ ...filters, suspension: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.wheels && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.wheels}
                      <button onClick={() => setFilters({ ...filters, wheels: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.configuration && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.configuration}
                      <button onClick={() => setFilters({ ...filters, configuration: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.feature && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.feature}
                      <button onClick={() => setFilters({ ...filters, feature: undefined })} className="ml-2 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant="secondary" className="pl-3">
                      {filters.minPrice ? `$${filters.minPrice.toLocaleString()}` : '$0'}–{filters.maxPrice ? `$${filters.maxPrice.toLocaleString()}` : '∞'}
                      <button onClick={() => setFilters({ ...filters, minPrice: undefined, maxPrice: undefined })} className="ml-2 hover:text-red-500">
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
