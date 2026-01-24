import { queryClient } from './queryClient';

const API_BASE = '/api/marketplace';

// Types
export interface MarketplaceUser {
  id: number;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  emailVerified?: boolean;
  sellerVerified?: boolean;
  preferredLanguage?: string;
}

export interface MarketplaceListing {
  id: number;
  listingNumber: string;
  slug: string;
  title: string;
  titleEs?: string;
  description?: string;
  descriptionEs?: string;
  chassisType: string;
  chassisSize: string;
  condition: string;
  state: string;
  city: string;
  zipCode?: string;
  quantity: number;
  quantityAvailable: number;
  pricePerUnit: string;
  priceNegotiable: boolean;
  primaryImageUrl?: string;
  images?: any[];
  status: string;
  featured: boolean;
  verified: boolean;
  viewsCount: number;
  favoritesCount?: number;
  createdAt: string;
  sellerId?: number;
  sellerName?: string;
  sellerFirstName?: string;
  seller?: {
    id: number;
    companyName?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    state?: string;
    sellerVerified?: boolean;
    createdAt?: string;
  };
  isFavorited?: boolean;
}

export interface ListingFilters {
  status?: string;
  chassisType?: string;
  chassisSize?: string;
  condition?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  listings: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ChassisType {
  id: number;
  name: string;
  nameEs?: string;
  slug: string;
  description?: string;
  descriptionEs?: string;
}

export interface Condition {
  id: number;
  name: string;
  nameEs?: string;
  slug: string;
  description?: string;
  descriptionEs?: string;
  color?: string;
}

export interface AuthResponse {
  message: string;
  user: MarketplaceUser;
  accessToken: string;
  refreshToken: string;
}

// Token management
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('marketplace_access_token', token);
  } else {
    localStorage.removeItem('marketplace_access_token');
  }
}

export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem('marketplace_access_token');
  }
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem('marketplace_refresh_token', token);
  } else {
    localStorage.removeItem('marketplace_refresh_token');
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('marketplace_refresh_token');
}

export function clearTokens() {
  accessToken = null;
  localStorage.removeItem('marketplace_access_token');
  localStorage.removeItem('marketplace_refresh_token');
  localStorage.removeItem('marketplace_user');
}

// API helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// =============================================
// AUTH
// =============================================

export async function register(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
}): Promise<{ message: string; user: MarketplaceUser }> {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  setAccessToken(response.accessToken);
  setRefreshToken(response.refreshToken);
  localStorage.setItem('marketplace_user', JSON.stringify(response.user));
  
  return response;
}

export async function logout() {
  clearTokens();
  queryClient.clear();
}

export async function getCurrentUser(): Promise<{ user: MarketplaceUser }> {
  return apiRequest('/auth/me');
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  const refresh = getRefreshToken();
  if (!refresh) {
    throw new Error('No refresh token');
  }
  
  const response = await apiRequest<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refresh }),
  });
  
  setAccessToken(response.accessToken);
  return response;
}

export function getStoredUser(): MarketplaceUser | null {
  const stored = localStorage.getItem('marketplace_user');
  return stored ? JSON.parse(stored) : null;
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// =============================================
// LISTINGS
// =============================================

export async function getListings(
  filters: ListingFilters = {}
): Promise<PaginatedResponse<MarketplaceListing>> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  return apiRequest(`/listings?${params.toString()}`);
}

export async function getListingBySlug(slug: string): Promise<MarketplaceListing> {
  return apiRequest(`/listings/${slug}`);
}

export async function createListing(data: Partial<MarketplaceListing>): Promise<{ message: string; listing: MarketplaceListing }> {
  return apiRequest('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateListing(id: number, data: Partial<MarketplaceListing>): Promise<{ message: string; listing: MarketplaceListing }> {
  return apiRequest(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id: number): Promise<{ message: string }> {
  return apiRequest(`/listings/${id}`, {
    method: 'DELETE',
  });
}

export async function getSellerListings(filters: ListingFilters = {}): Promise<PaginatedResponse<MarketplaceListing>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return apiRequest(`/seller/listings?${params.toString()}`);
}

// =============================================
// REFERENCE DATA
// =============================================

export async function getChassisTypes(): Promise<ChassisType[]> {
  return apiRequest('/reference/chassis-types');
}

export async function getConditions(): Promise<Condition[]> {
  return apiRequest('/reference/conditions');
}

export async function getStates(): Promise<string[]> {
  return apiRequest('/reference/states');
}

// =============================================
// FAVORITES
// =============================================

export async function toggleFavorite(listingId: number): Promise<{ favorited: boolean }> {
  return apiRequest(`/favorites/${listingId}`, {
    method: 'POST',
  });
}

export async function getFavorites(): Promise<any[]> {
  return apiRequest('/favorites');
}

// =============================================
// OFFERS
// =============================================

export async function createOffer(data: {
  listingId: number;
  quantity: number;
  pricePerUnit: number;
  buyerNotes?: string;
}): Promise<{ message: string; offer: any }> {
  return apiRequest('/offers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSentOffers(): Promise<any[]> {
  return apiRequest('/offers/sent');
}

export async function getReceivedOffers(): Promise<any[]> {
  return apiRequest('/offers/received');
}

export async function respondToOffer(
  offerId: number,
  data: {
    action: 'accept' | 'reject' | 'counter';
    notes?: string;
    counterPrice?: number;
    counterQuantity?: number;
  }
): Promise<{ message: string; offer: any }> {
  return apiRequest(`/offers/${offerId}/respond`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// =============================================
// CONVERSATIONS
// =============================================

export async function getConversations(role?: 'buyer' | 'seller' | 'all'): Promise<any[]> {
  const params = role ? `?role=${role}` : '';
  return apiRequest(`/conversations${params}`);
}

export async function startConversation(listingId: number): Promise<any> {
  return apiRequest('/conversations', {
    method: 'POST',
    body: JSON.stringify({ listingId }),
  });
}

export async function getMessages(conversationId: number, page = 1): Promise<any[]> {
  return apiRequest(`/conversations/${conversationId}/messages?page=${page}`);
}

export async function sendMessage(
  conversationId: number,
  data: {
    message: string;
    messageType?: 'text' | 'offer';
    offerAmount?: number;
    offerQuantity?: number;
  }
): Promise<any> {
  return apiRequest(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =============================================
// NOTIFICATIONS
// =============================================

export async function getNotifications(unreadOnly = false): Promise<any[]> {
  return apiRequest(`/notifications?unreadOnly=${unreadOnly}`);
}

export async function markNotificationRead(id: number): Promise<void> {
  return apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
}

export async function markAllNotificationsRead(): Promise<void> {
  return apiRequest('/notifications/read-all', { method: 'PUT' });
}

// =============================================
// ADMIN
// =============================================

export async function getMarketplaceStats(): Promise<any> {
  return apiRequest('/admin/stats');
}

// =============================================
// STRIPE PAYMENTS
// =============================================

export async function startStripeOnboarding(): Promise<{ url: string; accountId: string }> {
  return apiRequest('/payments/connect/onboard', { method: 'POST' });
}

export async function getStripeAccountStatus(): Promise<{
  hasAccount: boolean;
  accountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
}> {
  return apiRequest('/payments/connect/status');
}

export async function getStripeDashboardUrl(): Promise<{ url: string }> {
  return apiRequest('/payments/connect/dashboard');
}

export async function createCheckout(offerId: number): Promise<{ url: string }> {
  return apiRequest('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ offerId }),
  });
}

export async function getCheckoutSession(sessionId: string): Promise<{
  id: string;
  status: string;
  paymentStatus: string;
  amountTotal: number;
  currency: string;
  customerEmail?: string;
}> {
  return apiRequest(`/payments/checkout/${sessionId}`);
}

export async function getPendingListings(): Promise<any[]> {
  return apiRequest('/admin/listings/pending');
}

export async function approveListing(id: number): Promise<{ message: string; listing: MarketplaceListing }> {
  return apiRequest(`/admin/listings/${id}/approve`, { method: 'PUT' });
}

export async function rejectListing(id: number, reason: string): Promise<{ message: string; listing: MarketplaceListing }> {
  return apiRequest(`/admin/listings/${id}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
}
