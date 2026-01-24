import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Heart, 
  Share2, 
  MessageSquare, 
  DollarSign, 
  Truck,
  Calendar,
  Eye,
  CheckCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/marketplace/SEOHead';
import { 
  getListingBySlug, 
  toggleFavorite,
  createOffer,
  startConversation,
  isAuthenticated,
  getStoredUser,
} from '@/lib/marketplace-api';
import { t, formatPrice, formatDate, getLocalizedField, getReferenceImage } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

interface Props {
  slug: string;
}

export default function ListingDetailPage({ slug }: Props) {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const { toast } = useToast();
  const user = getStoredUser();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [offerData, setOfferData] = useState({
    quantity: 1,
    pricePerUnit: 0,
    buyerNotes: '',
  });

  // Fetch listing
  const { data: listing, isLoading, error, refetch } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => getListingBySlug(slug),
  });

  // Toggle favorite mutation
  const favoriteMutation = useMutation({
    mutationFn: () => toggleFavorite(listing!.id),
    onSuccess: () => {
      refetch();
      toast({
        title: listing?.isFavorited ? 'Removed from favorites' : 'Added to favorites',
      });
    },
  });

  // Create offer mutation
  const offerMutation = useMutation({
    mutationFn: () => createOffer({
      listingId: listing!.id,
      quantity: offerData.quantity,
      pricePerUnit: offerData.pricePerUnit,
      buyerNotes: offerData.buyerNotes || undefined,
    }),
    onSuccess: () => {
      setIsOfferDialogOpen(false);
      toast({
        title: t('offerSubmitted'),
        description: t('offerSubmittedMessage'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Start conversation
  const handleContactSeller = async () => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    try {
      await startConversation(listing!.id);
      toast({
        title: lang === 'es' ? 'Conversación iniciada' : 'Conversation started',
        description: lang === 'es' ? 'Ve a tu dashboard para ver los mensajes' : 'Go to your dashboard to view messages',
      });
      navigate(`/${lang}/marketplace/dashboard`);
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleMakeOffer = () => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOfferData({
      ...offerData,
      pricePerUnit: parseFloat(listing?.pricePerUnit || '0'),
    });
    setIsOfferDialogOpen(true);
  };

  const handleFavorite = () => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    favoriteMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(`/${lang}/chassis-marketplace`)}>
            Back to Marketplace
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const hasOwnImages = !!(listing.primaryImageUrl || listing.images?.length);
  const images = listing.images?.length 
    ? [listing.primaryImageUrl, ...listing.images.map((img: any) => img.url || img)].filter(Boolean)
    : listing.primaryImageUrl 
      ? [listing.primaryImageUrl] 
      : [getReferenceImage(listing.chassisType, listing.chassisSize)]; // Use reference image as fallback

  const conditionColors: Record<string, string> = {
    'ASIS': 'bg-red-500',
    'Road-worthy': 'bg-green-500',
    'New': 'bg-blue-500',
    'Certified': 'bg-purple-500',
  };

  // SEO data
  const seoTitle = `${getLocalizedField(listing, 'title')} | ${formatPrice(listing.pricePerUnit)} | American Chassis Depot`;
  const seoDescription = listing.description 
    ? `${getLocalizedField(listing, 'description')?.slice(0, 155)}...`
    : `${listing.chassisType} ${listing.chassisSize} chassis in ${listing.condition} condition. Located in ${listing.city}, ${listing.state}. ${listing.quantityAvailable} units available at ${formatPrice(listing.pricePerUnit)} per unit.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={`/${lang}/chassis-marketplace/${listing.slug}`}
        image={listing.primaryImageUrl || undefined}
        type="product"
        product={{
          name: getLocalizedField(listing, 'title') || listing.title,
          description: seoDescription,
          image: listing.primaryImageUrl || '',
          price: parseFloat(listing.pricePerUnit),
          priceCurrency: 'USD',
          availability: listing.quantityAvailable > 0 ? 'InStock' : 'OutOfStock',
          condition: listing.condition === 'New' ? 'NewCondition' : 'UsedCondition',
          brand: listing.seller?.companyName || 'American Chassis Depot',
          sku: listing.listingNumber,
          category: `${listing.chassisType} Chassis`,
          seller: {
            name: listing.seller?.companyName || 'American Chassis Depot',
          },
          location: {
            city: listing.city,
            state: listing.state,
            country: 'US',
          },
        }}
        breadcrumbs={[
          { name: lang === 'es' ? 'Inicio' : 'Home', url: `/${lang}` },
          { name: 'Marketplace', url: `/${lang}/marketplace` },
          { name: lang === 'es' ? 'Catálogo' : 'Browse', url: `/${lang}/chassis-marketplace` },
          { name: getLocalizedField(listing, 'title') || listing.title, url: `/${lang}/chassis-marketplace/${listing.slug}` },
        ]}
      />
      
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => navigate(`/${lang}/chassis-marketplace`)}
              className="text-[#0A3161] hover:underline"
            >
              {t('marketplace')}
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 truncate">{getLocalizedField(listing, 'title')}</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Image */}
            <motion.div 
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src={images[currentImageIndex]}
                alt={getLocalizedField(listing, 'title')}
                className={`w-full h-full object-cover ${!hasOwnImages ? 'opacity-90' : ''}`}
              />
              
              {/* Reference image indicator */}
              {!hasOwnImages && (
                <div className="absolute bottom-4 left-4">
                  <span className="text-xs px-3 py-1.5 bg-black/60 text-white rounded-full backdrop-blur-sm">
                    {t('referenceImage')}
                  </span>
                </div>
              )}
              
              {images.length > 1 && hasOwnImages && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors ${
                          i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {listing.featured && (
                  <Badge className="bg-amber-500 text-white border-0">Featured</Badge>
                )}
                {listing.verified && (
                  <Badge className="bg-[#0A3161] text-white border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && hasOwnImages && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === currentImageIndex ? 'border-[#0A3161]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>{t('description')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {getLocalizedField(listing, 'description') || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>{t('specifications')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('chassisType')}</span>
                    <span className="font-medium">{listing.chassisType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('size')}</span>
                    <span className="font-medium">{listing.chassisSize}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('condition')}</span>
                    <Badge className={`${conditionColors[listing.condition]} text-white border-0`}>
                      {listing.condition}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">{t('location')}</span>
                    <span className="font-medium">{listing.city}, {listing.state}</span>
                  </div>
                  {listing.manufacturer && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Manufacturer</span>
                      <span className="font-medium">{listing.manufacturer}</span>
                    </div>
                  )}
                  {listing.year && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-500">Year</span>
                      <span className="font-medium">{listing.year}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Card */}
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('listingNumber')}</p>
                    <p className="font-mono text-sm">{listing.listingNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFavorite}
                      className={`p-2 rounded-full border transition-colors ${
                        listing.isFavorited 
                          ? 'bg-red-50 border-red-200 text-red-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${listing.isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border hover:bg-gray-50"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {getLocalizedField(listing, 'title')}
                </h1>
                
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}, {listing.state}</span>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('askingPrice')}</p>
                    <p className="text-4xl font-bold text-[#0A3161]">
                      {formatPrice(listing.pricePerUnit)}
                    </p>
                    <p className="text-sm text-gray-500">{t('perUnit')}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">{t('quantityAvailable')}</p>
                      <p className="text-2xl font-bold">
                        {listing.quantityAvailable} <span className="text-base font-normal text-gray-500">{listing.quantityAvailable === 1 ? t('unit') : t('units')}</span>
                      </p>
                    </div>
                    {listing.priceNegotiable && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {t('negotiable')}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{listing.viewsCount} {t('views')}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(listing.createdAt)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-[#B22234] hover:bg-[#8B1A28]"
                    size="lg"
                    onClick={handleMakeOffer}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    {t('makeOffer')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    size="lg"
                    onClick={handleContactSeller}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    {t('contactSeller')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            {listing.seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {t('sellerInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#0A3161] flex items-center justify-center text-white text-xl font-bold">
                      {(listing.seller.companyName || listing.seller.firstName || 'S')[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">
                        {listing.seller.companyName || `${listing.seller.firstName} ${listing.seller.lastName || ''}`}
                      </p>
                      {listing.seller.city && listing.seller.state && (
                        <p className="text-sm text-gray-500">
                          {listing.seller.city}, {listing.seller.state}
                        </p>
                      )}
                      {listing.seller.sellerVerified && (
                        <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {t('verifiedSeller')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {listing.seller.createdAt && (
                    <p className="text-sm text-gray-500 mt-4">
                      {t('memberSince')} {formatDate(listing.seller.createdAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Make Offer Dialog */}
      <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('makeOffer')}</DialogTitle>
            <DialogDescription>
              Make an offer on "{getLocalizedField(listing, 'title')}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t('quantity')}</label>
              <Input
                type="number"
                min={1}
                max={listing.quantityAvailable}
                value={offerData.quantity}
                onChange={(e) => setOfferData({ ...offerData, quantity: parseInt(e.target.value) || 1 })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max: {listing.quantityAvailable} {t('units')}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t('offerPrice')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  min={1}
                  step={100}
                  value={offerData.pricePerUnit}
                  onChange={(e) => setOfferData({ ...offerData, pricePerUnit: parseFloat(e.target.value) || 0 })}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Asking price: {formatPrice(listing.pricePerUnit)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Offer Amount</span>
                <span className="font-bold text-lg">
                  {formatPrice(offerData.quantity * offerData.pricePerUnit)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">{t('notes')}</label>
              <Textarea
                placeholder="Add any notes or questions for the seller..."
                value={offerData.buyerNotes}
                onChange={(e) => setOfferData({ ...offerData, buyerNotes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOfferDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => offerMutation.mutate()}
              disabled={offerMutation.isPending || !offerData.pricePerUnit || !offerData.quantity}
              className="bg-[#B22234] hover:bg-[#8B1A28]"
            >
              {offerMutation.isPending ? 'Submitting...' : t('submitOffer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
