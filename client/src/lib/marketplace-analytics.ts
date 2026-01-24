/**
 * Marketplace Analytics - Google Analytics 4 Event Tracking
 * 
 * This module provides functions to track important marketplace events
 * for measuring conversions and user behavior.
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Check if gtag is available
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// Helper to safely call gtag
const trackEvent = (eventName: string, params: Record<string, any>) => {
  if (isGtagAvailable()) {
    window.gtag('event', eventName, params);
    console.log(`[Analytics] Event: ${eventName}`, params);
  }
};

// =============================================
// PAGE VIEW EVENTS
// =============================================

export const trackMarketplacePageView = (pagePath: string, pageTitle: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    content_group: 'marketplace',
  });
};

// =============================================
// LISTING EVENTS
// =============================================

export const trackListingView = (listing: {
  id: number;
  title: string;
  price: number;
  chassisType: string;
  condition: string;
  city: string;
  state: string;
  sellerId?: number;
}) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: listing.price,
    items: [{
      item_id: listing.id.toString(),
      item_name: listing.title,
      item_category: listing.chassisType,
      item_variant: listing.condition,
      price: listing.price,
      item_brand: 'American Chassis Depot',
      location_id: `${listing.city}, ${listing.state}`,
    }],
  });
};

export const trackListingSearch = (filters: {
  searchTerm?: string;
  chassisType?: string;
  condition?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  resultsCount: number;
}) => {
  trackEvent('search', {
    search_term: filters.searchTerm || '',
    content_type: 'chassis',
    results_count: filters.resultsCount,
    filters_applied: JSON.stringify({
      chassisType: filters.chassisType,
      condition: filters.condition,
      state: filters.state,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    }),
  });
};

export const trackListingFilter = (filterType: string, filterValue: string) => {
  trackEvent('select_content', {
    content_type: 'filter',
    item_id: `${filterType}:${filterValue}`,
  });
};

// =============================================
// USER ENGAGEMENT EVENTS
// =============================================

export const trackFavoriteToggle = (listingId: number, isFavorited: boolean) => {
  trackEvent(isFavorited ? 'add_to_wishlist' : 'remove_from_wishlist', {
    currency: 'USD',
    items: [{
      item_id: listingId.toString(),
    }],
  });
};

export const trackShareListing = (listingId: number, method: string) => {
  trackEvent('share', {
    content_type: 'listing',
    item_id: listingId.toString(),
    method: method, // 'native_share', 'copy_link', 'email', etc.
  });
};

export const trackContactSeller = (listingId: number, sellerId: number) => {
  trackEvent('contact', {
    content_type: 'seller',
    item_id: listingId.toString(),
    seller_id: sellerId.toString(),
    contact_method: 'message',
  });
};

// =============================================
// CONVERSION EVENTS
// =============================================

export const trackMakeOffer = (offer: {
  listingId: number;
  listingTitle: string;
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  sellerId: number;
}) => {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value: offer.totalValue,
    items: [{
      item_id: offer.listingId.toString(),
      item_name: offer.listingTitle,
      quantity: offer.quantity,
      price: offer.pricePerUnit,
    }],
    checkout_type: 'offer',
  });
};

export const trackOfferSubmitted = (offer: {
  offerId: number;
  listingId: number;
  totalValue: number;
}) => {
  trackEvent('add_shipping_info', { // Using as step 2 of funnel
    currency: 'USD',
    value: offer.totalValue,
    items: [{
      item_id: offer.listingId.toString(),
    }],
    offer_id: offer.offerId.toString(),
  });
};

export const trackOfferAccepted = (offer: {
  offerId: number;
  listingId: number;
  totalValue: number;
  sellerId: number;
}) => {
  trackEvent('add_payment_info', { // Using as step 3 of funnel
    currency: 'USD',
    value: offer.totalValue,
    items: [{
      item_id: offer.listingId.toString(),
    }],
    offer_id: offer.offerId.toString(),
  });
};

export const trackPurchaseComplete = (order: {
  orderId: number;
  transactionId: string;
  totalValue: number;
  items: Array<{
    listingId: number;
    title: string;
    quantity: number;
    pricePerUnit: number;
  }>;
}) => {
  trackEvent('purchase', {
    currency: 'USD',
    value: order.totalValue,
    transaction_id: order.transactionId,
    items: order.items.map(item => ({
      item_id: item.listingId.toString(),
      item_name: item.title,
      quantity: item.quantity,
      price: item.pricePerUnit,
    })),
  });
};

// =============================================
// AUTH EVENTS
// =============================================

export const trackSignUp = (method: string, userRole: string) => {
  trackEvent('sign_up', {
    method: method, // 'email', 'google', etc.
    user_role: userRole, // 'buyer', 'seller'
  });
};

export const trackLogin = (method: string) => {
  trackEvent('login', {
    method: method,
  });
};

// =============================================
// SELLER EVENTS
// =============================================

export const trackListingCreated = (listing: {
  listingId: number;
  chassisType: string;
  condition: string;
  price: number;
  quantity: number;
}) => {
  trackEvent('generate_lead', {
    currency: 'USD',
    value: listing.price * listing.quantity,
    lead_type: 'listing_created',
    listing_id: listing.listingId.toString(),
    chassis_type: listing.chassisType,
    condition: listing.condition,
  });
};

// =============================================
// ENHANCED ECOMMERCE - IMPRESSIONS
// =============================================

export const trackListingImpressions = (listings: Array<{
  id: number;
  title: string;
  price: number;
  chassisType: string;
  position: number;
}>) => {
  trackEvent('view_item_list', {
    item_list_id: 'marketplace_browse',
    item_list_name: 'Marketplace Listings',
    items: listings.map(listing => ({
      item_id: listing.id.toString(),
      item_name: listing.title,
      item_category: listing.chassisType,
      price: listing.price,
      index: listing.position,
    })),
  });
};

export const trackListingClick = (listing: {
  id: number;
  title: string;
  price: number;
  chassisType: string;
  position: number;
}) => {
  trackEvent('select_item', {
    item_list_id: 'marketplace_browse',
    item_list_name: 'Marketplace Listings',
    items: [{
      item_id: listing.id.toString(),
      item_name: listing.title,
      item_category: listing.chassisType,
      price: listing.price,
      index: listing.position,
    }],
  });
};

// =============================================
// CTA TRACKING
// =============================================

export const trackCTAClick = (ctaName: string, ctaLocation: string, destination?: string) => {
  trackEvent('select_promotion', {
    promotion_id: ctaName,
    promotion_name: ctaName,
    creative_name: ctaLocation,
    creative_slot: destination || '',
  });
};

// Export helper for checking analytics availability
export const isAnalyticsEnabled = isGtagAvailable;
