import { eq, and, or, desc, asc, sql, ilike, gte, lte, inArray } from 'drizzle-orm';
import { getMarketplaceDb } from './db.js';
import {
  marketplaceUsers,
  marketplaceListings,
  marketplaceChassisTypes,
  marketplaceConditions,
  marketplaceConversations,
  marketplaceMessages,
  marketplaceOffers,
  marketplaceOrders,
  marketplaceFavorites,
  marketplaceNotifications,
  marketplaceSellerStats,
  marketplaceActivityLog,
  marketplaceListingViews,
  listingImages,
  type MarketplaceUser,
  type MarketplaceListing,
  type MarketplaceConversation,
  type MarketplaceMessage,
  type MarketplaceOffer,
  type MarketplaceOrder,
  type MarketplaceNotification,
} from '../../shared/marketplace-schema.js';

// =============================================
// LISTINGS
// =============================================

export interface ListingFilters {
  status?: string;
  chassisType?: string;
  chassisSize?: string;
  condition?: string;
  state?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  featured?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc' | 'views';
  page?: number;
  limit?: number;
}

export async function getListings(filters: ListingFilters = {}) {
  const db = getMarketplaceDb();
  const {
    status = 'active',
    chassisType,
    chassisSize,
    condition,
    state,
    city,
    minPrice,
    maxPrice,
    sellerId,
    featured,
    search,
    sortBy = 'date_desc',
    page = 1,
    limit = 20
  } = filters;

  const conditions = [];

  // Status filter
  if (status && status !== 'all') {
    conditions.push(eq(marketplaceListings.status, status));
  }

  // Type filter
  if (chassisType && chassisType !== 'all') {
    conditions.push(eq(marketplaceListings.chassisType, chassisType));
  }

  // Size filter
  if (chassisSize && chassisSize !== 'all') {
    conditions.push(eq(marketplaceListings.chassisSize, chassisSize));
  }

  // Condition filter
  if (condition && condition !== 'all') {
    conditions.push(eq(marketplaceListings.condition, condition));
  }

  // State filter
  if (state && state !== 'all') {
    conditions.push(eq(marketplaceListings.state, state));
  }

  // City filter
  if (city) {
    conditions.push(ilike(marketplaceListings.city, `%${city}%`));
  }

  // Price range
  if (minPrice !== undefined) {
    conditions.push(gte(marketplaceListings.pricePerUnit, minPrice.toString()));
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(marketplaceListings.pricePerUnit, maxPrice.toString()));
  }

  // Seller filter
  if (sellerId) {
    conditions.push(eq(marketplaceListings.sellerId, sellerId));
  }

  // Featured filter
  if (featured !== undefined) {
    conditions.push(eq(marketplaceListings.featured, featured));
  }

  // Search filter
  if (search) {
    conditions.push(
      or(
        ilike(marketplaceListings.title, `%${search}%`),
        ilike(marketplaceListings.titleEs, `%${search}%`),
        ilike(marketplaceListings.city, `%${search}%`),
        ilike(marketplaceListings.state, `%${search}%`)
      )
    );
  }

  // Build order by
  let orderBy;
  switch (sortBy) {
    case 'price_asc':
      orderBy = asc(marketplaceListings.pricePerUnit);
      break;
    case 'price_desc':
      orderBy = desc(marketplaceListings.pricePerUnit);
      break;
    case 'date_asc':
      orderBy = asc(marketplaceListings.createdAt);
      break;
    case 'views':
      orderBy = desc(marketplaceListings.viewsCount);
      break;
    case 'date_desc':
    default:
      orderBy = desc(marketplaceListings.createdAt);
  }

  const offset = (page - 1) * limit;

  // Get listings with seller info
  const listings = await db
    .select({
      id: marketplaceListings.id,
      listingNumber: marketplaceListings.listingNumber,
      slug: marketplaceListings.slug,
      title: marketplaceListings.title,
      titleEs: marketplaceListings.titleEs,
      chassisType: marketplaceListings.chassisType,
      chassisSize: marketplaceListings.chassisSize,
      condition: marketplaceListings.condition,
      state: marketplaceListings.state,
      city: marketplaceListings.city,
      quantity: marketplaceListings.quantity,
      quantityAvailable: marketplaceListings.quantityAvailable,
      pricePerUnit: marketplaceListings.pricePerUnit,
      priceNegotiable: marketplaceListings.priceNegotiable,
      primaryImageUrl: marketplaceListings.primaryImageUrl,
      status: marketplaceListings.status,
      featured: marketplaceListings.featured,
      verified: marketplaceListings.verified,
      viewsCount: marketplaceListings.viewsCount,
      createdAt: marketplaceListings.createdAt,
      sellerId: marketplaceListings.sellerId,
      sellerName: marketplaceUsers.companyName,
      sellerFirstName: marketplaceUsers.firstName,
    })
    .from(marketplaceListings)
    .leftJoin(marketplaceUsers, eq(marketplaceListings.sellerId, marketplaceUsers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceListings)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = Number(countResult?.count || 0);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}

export async function getListingBySlug(slug: string) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .select()
    .from(marketplaceListings)
    .where(eq(marketplaceListings.slug, slug))
    .limit(1);

  if (!listing) return null;

  // Get seller info
  let seller = null;
  if (listing.sellerId) {
    const [sellerData] = await db
      .select({
        id: marketplaceUsers.id,
        companyName: marketplaceUsers.companyName,
        firstName: marketplaceUsers.firstName,
        lastName: marketplaceUsers.lastName,
        city: marketplaceUsers.city,
        state: marketplaceUsers.state,
        sellerVerified: marketplaceUsers.sellerVerified,
        createdAt: marketplaceUsers.createdAt,
      })
      .from(marketplaceUsers)
      .where(eq(marketplaceUsers.id, listing.sellerId))
      .limit(1);
    
    seller = sellerData;
  }

  // Get images
  const images = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listing.id))
    .orderBy(asc(listingImages.sortOrder));

  // Increment view count
  await db
    .update(marketplaceListings)
    .set({ viewsCount: (listing.viewsCount || 0) + 1 })
    .where(eq(marketplaceListings.id, listing.id));

  return {
    ...listing,
    seller,
    images
  };
}

export async function getListingById(id: number) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .select()
    .from(marketplaceListings)
    .where(eq(marketplaceListings.id, id))
    .limit(1);

  return listing || null;
}

export async function createListing(data: Partial<MarketplaceListing>) {
  const db = getMarketplaceDb();
  
  // Generate listing number
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceListings);
  
  const listingNumber = `ACD-${new Date().getFullYear()}-${String(Number(countResult?.count || 0) + 1).padStart(4, '0')}`;
  
  // Generate slug
  const baseSlug = `${data.chassisType}-${data.chassisSize}-${data.city}-${data.state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const slug = `${baseSlug}-${Date.now()}`;

  const [listing] = await db
    .insert(marketplaceListings)
    .values({
      ...data,
      listingNumber,
      slug,
      status: 'pending', // New listings require approval
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)
    .returning();

  return listing;
}

export async function updateListing(id: number, data: Partial<MarketplaceListing>) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .update(marketplaceListings)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceListings.id, id))
    .returning();

  return listing;
}

export async function deleteListing(id: number) {
  const db = getMarketplaceDb();
  
  await db
    .delete(marketplaceListings)
    .where(eq(marketplaceListings.id, id));
}

export async function updateListingStatus(id: number, status: string) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .update(marketplaceListings)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceListings.id, id))
    .returning();

  return listing;
}

// =============================================
// CONVERSATIONS & MESSAGES
// =============================================

export async function getOrCreateConversation(listingId: number, buyerId: number, sellerId: number) {
  const db = getMarketplaceDb();
  
  // Check if conversation exists
  const [existing] = await db
    .select()
    .from(marketplaceConversations)
    .where(
      and(
        eq(marketplaceConversations.listingId, listingId),
        eq(marketplaceConversations.buyerId, buyerId),
        eq(marketplaceConversations.sellerId, sellerId)
      )
    )
    .limit(1);

  if (existing) return existing;

  // Create new conversation
  const [conversation] = await db
    .insert(marketplaceConversations)
    .values({
      listingId,
      buyerId,
      sellerId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return conversation;
}

export async function getUserConversations(userId: number, role: 'buyer' | 'seller' | 'all' = 'all') {
  const db = getMarketplaceDb();
  
  const conditions = [];
  
  if (role === 'buyer') {
    conditions.push(eq(marketplaceConversations.buyerId, userId));
  } else if (role === 'seller') {
    conditions.push(eq(marketplaceConversations.sellerId, userId));
  } else {
    conditions.push(
      or(
        eq(marketplaceConversations.buyerId, userId),
        eq(marketplaceConversations.sellerId, userId)
      )
    );
  }

  const conversations = await db
    .select({
      id: marketplaceConversations.id,
      listingId: marketplaceConversations.listingId,
      buyerId: marketplaceConversations.buyerId,
      sellerId: marketplaceConversations.sellerId,
      status: marketplaceConversations.status,
      lastMessageAt: marketplaceConversations.lastMessageAt,
      lastMessagePreview: marketplaceConversations.lastMessagePreview,
      buyerUnreadCount: marketplaceConversations.buyerUnreadCount,
      sellerUnreadCount: marketplaceConversations.sellerUnreadCount,
      createdAt: marketplaceConversations.createdAt,
      listingTitle: marketplaceListings.title,
      listingImage: marketplaceListings.primaryImageUrl,
    })
    .from(marketplaceConversations)
    .leftJoin(marketplaceListings, eq(marketplaceConversations.listingId, marketplaceListings.id))
    .where(and(...conditions))
    .orderBy(desc(marketplaceConversations.lastMessageAt));

  return conversations;
}

export async function getConversationMessages(conversationId: number, page = 1, limit = 50) {
  const db = getMarketplaceDb();
  const offset = (page - 1) * limit;

  const messages = await db
    .select({
      id: marketplaceMessages.id,
      conversationId: marketplaceMessages.conversationId,
      senderId: marketplaceMessages.senderId,
      message: marketplaceMessages.message,
      messageType: marketplaceMessages.messageType,
      offerAmount: marketplaceMessages.offerAmount,
      offerQuantity: marketplaceMessages.offerQuantity,
      offerStatus: marketplaceMessages.offerStatus,
      isRead: marketplaceMessages.isRead,
      createdAt: marketplaceMessages.createdAt,
      senderName: marketplaceUsers.firstName,
      senderCompany: marketplaceUsers.companyName,
    })
    .from(marketplaceMessages)
    .leftJoin(marketplaceUsers, eq(marketplaceMessages.senderId, marketplaceUsers.id))
    .where(eq(marketplaceMessages.conversationId, conversationId))
    .orderBy(desc(marketplaceMessages.createdAt))
    .limit(limit)
    .offset(offset);

  return messages.reverse(); // Return in chronological order
}

export async function sendMessage(data: {
  conversationId: number;
  senderId: number;
  message: string;
  messageType?: string;
  offerAmount?: number;
  offerQuantity?: number;
}) {
  const db = getMarketplaceDb();
  
  // Create message
  const [newMessage] = await db
    .insert(marketplaceMessages)
    .values({
      conversationId: data.conversationId,
      senderId: data.senderId,
      message: data.message,
      messageType: data.messageType || 'text',
      offerAmount: data.offerAmount?.toString(),
      offerQuantity: data.offerQuantity,
      offerStatus: data.messageType === 'offer' ? 'pending' : null,
      createdAt: new Date(),
    })
    .returning();

  // Update conversation
  const [conversation] = await db
    .select()
    .from(marketplaceConversations)
    .where(eq(marketplaceConversations.id, data.conversationId))
    .limit(1);

  if (conversation) {
    const isBuyer = data.senderId === conversation.buyerId;
    
    await db
      .update(marketplaceConversations)
      .set({
        lastMessageAt: new Date(),
        lastMessagePreview: data.message.substring(0, 100),
        buyerUnreadCount: isBuyer ? conversation.buyerUnreadCount : (conversation.buyerUnreadCount || 0) + 1,
        sellerUnreadCount: isBuyer ? (conversation.sellerUnreadCount || 0) + 1 : conversation.sellerUnreadCount,
        updatedAt: new Date(),
      })
      .where(eq(marketplaceConversations.id, data.conversationId));
  }

  return newMessage;
}

export async function markMessagesAsRead(conversationId: number, userId: number) {
  const db = getMarketplaceDb();
  
  // Get conversation to determine role
  const [conversation] = await db
    .select()
    .from(marketplaceConversations)
    .where(eq(marketplaceConversations.id, conversationId))
    .limit(1);

  if (!conversation) return;

  const isBuyer = userId === conversation.buyerId;

  // Mark messages as read
  await db
    .update(marketplaceMessages)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(marketplaceMessages.conversationId, conversationId),
        sql`${marketplaceMessages.senderId} != ${userId}`,
        eq(marketplaceMessages.isRead, false)
      )
    );

  // Reset unread count
  await db
    .update(marketplaceConversations)
    .set(isBuyer ? { buyerUnreadCount: 0 } : { sellerUnreadCount: 0 })
    .where(eq(marketplaceConversations.id, conversationId));
}

// =============================================
// OFFERS
// =============================================

export async function createOffer(data: {
  listingId: number;
  buyerId: number;
  sellerId: number;
  conversationId?: number;
  quantity: number;
  pricePerUnit: number;
  buyerNotes?: string;
}) {
  const db = getMarketplaceDb();
  
  // Generate offer number
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceOffers);
  
  const offerNumber = `OFF-${new Date().getFullYear()}-${String(Number(countResult?.count || 0) + 1).padStart(4, '0')}`;
  
  const totalAmount = data.quantity * data.pricePerUnit;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const [offer] = await db
    .insert(marketplaceOffers)
    .values({
      offerNumber,
      listingId: data.listingId,
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      conversationId: data.conversationId,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit.toString(),
      totalAmount: totalAmount.toString(),
      status: 'pending',
      buyerNotes: data.buyerNotes,
      adminNotified: true, // Notify admins of new offers
      adminNotifiedAt: new Date(),
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Update listing offers count
  await db
    .update(marketplaceListings)
    .set({ offersCount: sql`${marketplaceListings.offersCount} + 1` })
    .where(eq(marketplaceListings.id, data.listingId));

  return offer;
}

export async function getOffersByListing(listingId: number) {
  const db = getMarketplaceDb();
  
  return db
    .select({
      id: marketplaceOffers.id,
      offerNumber: marketplaceOffers.offerNumber,
      quantity: marketplaceOffers.quantity,
      pricePerUnit: marketplaceOffers.pricePerUnit,
      totalAmount: marketplaceOffers.totalAmount,
      status: marketplaceOffers.status,
      buyerNotes: marketplaceOffers.buyerNotes,
      createdAt: marketplaceOffers.createdAt,
      expiresAt: marketplaceOffers.expiresAt,
      buyerName: marketplaceUsers.companyName,
      buyerFirstName: marketplaceUsers.firstName,
    })
    .from(marketplaceOffers)
    .leftJoin(marketplaceUsers, eq(marketplaceOffers.buyerId, marketplaceUsers.id))
    .where(eq(marketplaceOffers.listingId, listingId))
    .orderBy(desc(marketplaceOffers.createdAt));
}

export async function getOffersByUser(userId: number, type: 'sent' | 'received') {
  const db = getMarketplaceDb();
  
  const condition = type === 'sent' 
    ? eq(marketplaceOffers.buyerId, userId)
    : eq(marketplaceOffers.sellerId, userId);

  return db
    .select({
      id: marketplaceOffers.id,
      offerNumber: marketplaceOffers.offerNumber,
      listingId: marketplaceOffers.listingId,
      buyerId: marketplaceOffers.buyerId,
      quantity: marketplaceOffers.quantity,
      pricePerUnit: marketplaceOffers.pricePerUnit,
      totalAmount: marketplaceOffers.totalAmount,
      status: marketplaceOffers.status,
      buyerNotes: marketplaceOffers.buyerNotes,
      sellerNotes: marketplaceOffers.sellerNotes,
      createdAt: marketplaceOffers.createdAt,
      expiresAt: marketplaceOffers.expiresAt,
      respondedAt: marketplaceOffers.respondedAt,
      listingTitle: marketplaceListings.title,
      listingImage: marketplaceListings.primaryImageUrl,
    })
    .from(marketplaceOffers)
    .leftJoin(marketplaceListings, eq(marketplaceOffers.listingId, marketplaceListings.id))
    .where(condition)
    .orderBy(desc(marketplaceOffers.createdAt));
}

export async function updateOfferStatus(
  offerId: number, 
  status: string, 
  notes?: string,
  counterPrice?: number,
  counterQuantity?: number
) {
  const db = getMarketplaceDb();
  
  const updateData: any = {
    status,
    respondedAt: new Date(),
    updatedAt: new Date(),
  };

  if (notes) {
    updateData.sellerNotes = notes;
  }

  if (counterPrice !== undefined) {
    updateData.counterPrice = counterPrice.toString();
  }

  if (counterQuantity !== undefined) {
    updateData.counterQuantity = counterQuantity;
  }

  const [offer] = await db
    .update(marketplaceOffers)
    .set(updateData)
    .where(eq(marketplaceOffers.id, offerId))
    .returning();

  return offer;
}

// =============================================
// FAVORITES
// =============================================

export async function toggleFavorite(userId: number, listingId: number) {
  const db = getMarketplaceDb();
  
  // Check if favorite exists
  const [existing] = await db
    .select()
    .from(marketplaceFavorites)
    .where(
      and(
        eq(marketplaceFavorites.userId, userId),
        eq(marketplaceFavorites.listingId, listingId)
      )
    )
    .limit(1);

  if (existing) {
    // Remove favorite
    await db
      .delete(marketplaceFavorites)
      .where(eq(marketplaceFavorites.id, existing.id));
    
    // Decrement listing favorites count
    await db
      .update(marketplaceListings)
      .set({ favoritesCount: sql`GREATEST(${marketplaceListings.favoritesCount} - 1, 0)` })
      .where(eq(marketplaceListings.id, listingId));
    
    return { favorited: false };
  } else {
    // Get listing price
    const [listing] = await db
      .select({ pricePerUnit: marketplaceListings.pricePerUnit })
      .from(marketplaceListings)
      .where(eq(marketplaceListings.id, listingId))
      .limit(1);

    // Add favorite
    await db
      .insert(marketplaceFavorites)
      .values({
        userId,
        listingId,
        priceAtSave: listing?.pricePerUnit,
        createdAt: new Date(),
      });
    
    // Increment listing favorites count
    await db
      .update(marketplaceListings)
      .set({ favoritesCount: sql`${marketplaceListings.favoritesCount} + 1` })
      .where(eq(marketplaceListings.id, listingId));
    
    return { favorited: true };
  }
}

export async function getUserFavorites(userId: number) {
  const db = getMarketplaceDb();
  
  return db
    .select({
      id: marketplaceFavorites.id,
      listingId: marketplaceFavorites.listingId,
      priceAtSave: marketplaceFavorites.priceAtSave,
      createdAt: marketplaceFavorites.createdAt,
      listing: {
        id: marketplaceListings.id,
        title: marketplaceListings.title,
        slug: marketplaceListings.slug,
        chassisType: marketplaceListings.chassisType,
        chassisSize: marketplaceListings.chassisSize,
        condition: marketplaceListings.condition,
        state: marketplaceListings.state,
        city: marketplaceListings.city,
        pricePerUnit: marketplaceListings.pricePerUnit,
        primaryImageUrl: marketplaceListings.primaryImageUrl,
        status: marketplaceListings.status,
      }
    })
    .from(marketplaceFavorites)
    .innerJoin(marketplaceListings, eq(marketplaceFavorites.listingId, marketplaceListings.id))
    .where(eq(marketplaceFavorites.userId, userId))
    .orderBy(desc(marketplaceFavorites.createdAt));
}

// =============================================
// NOTIFICATIONS
// =============================================

export async function createNotification(data: {
  userId: number;
  type: string;
  category?: string;
  title: string;
  titleEs?: string;
  message?: string;
  messageEs?: string;
  listingId?: number;
  conversationId?: number;
  orderId?: number;
  offerId?: number;
  fromUserId?: number;
  actionUrl?: string;
}) {
  const db = getMarketplaceDb();
  
  const [notification] = await db
    .insert(marketplaceNotifications)
    .values({
      ...data,
      category: data.category || 'general',
      createdAt: new Date(),
    })
    .returning();

  return notification;
}

export async function getUserNotifications(userId: number, unreadOnly = false, limit = 20) {
  const db = getMarketplaceDb();
  
  const conditions = [eq(marketplaceNotifications.userId, userId)];
  
  if (unreadOnly) {
    conditions.push(eq(marketplaceNotifications.isRead, false));
  }

  return db
    .select()
    .from(marketplaceNotifications)
    .where(and(...conditions))
    .orderBy(desc(marketplaceNotifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number, userId: number) {
  const db = getMarketplaceDb();
  
  await db
    .update(marketplaceNotifications)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(marketplaceNotifications.id, notificationId),
        eq(marketplaceNotifications.userId, userId)
      )
    );
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = getMarketplaceDb();
  
  await db
    .update(marketplaceNotifications)
    .set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(marketplaceNotifications.userId, userId),
        eq(marketplaceNotifications.isRead, false)
      )
    );
}

// =============================================
// REFERENCE DATA
// =============================================

export async function getChassisTypes() {
  const db = getMarketplaceDb();
  
  return db
    .select()
    .from(marketplaceChassisTypes)
    .where(eq(marketplaceChassisTypes.isActive, true))
    .orderBy(asc(marketplaceChassisTypes.sortOrder));
}

export async function getConditions() {
  const db = getMarketplaceDb();
  
  return db
    .select()
    .from(marketplaceConditions)
    .where(eq(marketplaceConditions.isActive, true))
    .orderBy(asc(marketplaceConditions.sortOrder));
}

export async function getStates() {
  const db = getMarketplaceDb();
  
  const result = await db
    .selectDistinct({ state: marketplaceListings.state })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.status, 'active'))
    .orderBy(asc(marketplaceListings.state));

  return result.map(r => r.state);
}

// =============================================
// ADMIN
// =============================================

export async function getPendingListings() {
  const db = getMarketplaceDb();
  
  return db
    .select({
      id: marketplaceListings.id,
      listingNumber: marketplaceListings.listingNumber,
      title: marketplaceListings.title,
      chassisType: marketplaceListings.chassisType,
      chassisSize: marketplaceListings.chassisSize,
      condition: marketplaceListings.condition,
      state: marketplaceListings.state,
      city: marketplaceListings.city,
      pricePerUnit: marketplaceListings.pricePerUnit,
      quantity: marketplaceListings.quantity,
      createdAt: marketplaceListings.createdAt,
      sellerName: marketplaceUsers.companyName,
      sellerEmail: marketplaceUsers.email,
    })
    .from(marketplaceListings)
    .leftJoin(marketplaceUsers, eq(marketplaceListings.sellerId, marketplaceUsers.id))
    .where(eq(marketplaceListings.status, 'pending'))
    .orderBy(asc(marketplaceListings.createdAt));
}

export async function approveListing(listingId: number, adminId: number) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .update(marketplaceListings)
    .set({
      status: 'active',
      verified: true,
      verifiedBy: adminId,
      verifiedAt: new Date(),
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(marketplaceListings.id, listingId))
    .returning();

  return listing;
}

export async function rejectListing(listingId: number, adminId: number, reason: string) {
  const db = getMarketplaceDb();
  
  const [listing] = await db
    .update(marketplaceListings)
    .set({
      status: 'rejected',
      rejectedBy: adminId,
      rejectedAt: new Date(),
      rejectionReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceListings.id, listingId))
    .returning();

  return listing;
}

export async function getMarketplaceStats() {
  const db = getMarketplaceDb();
  
  const [stats] = await db
    .select({
      totalListings: sql<number>`count(*)`,
      activeListings: sql<number>`count(*) filter (where status = 'active')`,
      pendingListings: sql<number>`count(*) filter (where status = 'pending')`,
      totalValue: sql<number>`sum(quantity_available * price_per_unit) filter (where status = 'active')`,
      totalUnits: sql<number>`sum(quantity_available) filter (where status = 'active')`,
    })
    .from(marketplaceListings);

  const [userStats] = await db
    .select({
      totalUsers: sql<number>`count(*)`,
      buyers: sql<number>`count(*) filter (where role = 'buyer')`,
      sellers: sql<number>`count(*) filter (where role = 'seller')`,
      admins: sql<number>`count(*) filter (where role in ('admin', 'super_admin'))`,
    })
    .from(marketplaceUsers);

  const [offerStats] = await db
    .select({
      totalOffers: sql<number>`count(*)`,
      pendingOffers: sql<number>`count(*) filter (where status = 'pending')`,
      acceptedOffers: sql<number>`count(*) filter (where status = 'accepted')`,
    })
    .from(marketplaceOffers);

  return {
    listings: stats,
    users: userStats,
    offers: offerStats,
  };
}

// =============================================
// ADDITIONAL HELPER FUNCTIONS
// =============================================

export async function getUserById(userId: number) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .select()
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId))
    .limit(1);
    
  return user || null;
}

export async function getConversationById(conversationId: number) {
  const db = getMarketplaceDb();
  
  const [conversation] = await db
    .select()
    .from(marketplaceConversations)
    .where(eq(marketplaceConversations.id, conversationId))
    .limit(1);
    
  if (!conversation) {
    return null;
  }
  
  // Get listing details if listingId exists
  let listing = null;
  if (conversation.listingId) {
    const [listingResult] = await db
      .select()
      .from(marketplaceListings)
      .where(eq(marketplaceListings.id, conversation.listingId))
      .limit(1);
    listing = listingResult || null;
  }
    
  return {
    ...conversation,
    listing,
  };
}

// =============================================
// USER MANAGEMENT (ADMIN/SUPER_ADMIN)
// =============================================

export interface UserFilters {
  role?: string;
  status?: 'all' | 'active' | 'suspended';
  search?: string;
  sortBy?: 'date_asc' | 'date_desc' | 'name' | 'email';
  page?: number;
  limit?: number;
}

export async function getAllUsers(filters: UserFilters = {}) {
  const db = getMarketplaceDb();
  const {
    role,
    status = 'all',
    search,
    sortBy = 'date_desc',
    page = 1,
    limit = 20
  } = filters;

  const conditions = [];

  // Role filter
  if (role && role !== 'all') {
    conditions.push(eq(marketplaceUsers.role, role));
  }

  // Status filter
  if (status === 'active') {
    conditions.push(eq(marketplaceUsers.isActive, true));
    conditions.push(eq(marketplaceUsers.isSuspended, false));
  } else if (status === 'suspended') {
    conditions.push(eq(marketplaceUsers.isSuspended, true));
  }

  // Search filter
  if (search) {
    conditions.push(
      or(
        ilike(marketplaceUsers.email, `%${search}%`),
        ilike(marketplaceUsers.firstName, `%${search}%`),
        ilike(marketplaceUsers.lastName, `%${search}%`),
        ilike(marketplaceUsers.companyName, `%${search}%`)
      )
    );
  }

  // Build order by
  let orderBy;
  switch (sortBy) {
    case 'date_asc':
      orderBy = asc(marketplaceUsers.createdAt);
      break;
    case 'name':
      orderBy = asc(marketplaceUsers.firstName);
      break;
    case 'email':
      orderBy = asc(marketplaceUsers.email);
      break;
    case 'date_desc':
    default:
      orderBy = desc(marketplaceUsers.createdAt);
  }

  const offset = (page - 1) * limit;

  const users = await db
    .select({
      id: marketplaceUsers.id,
      email: marketplaceUsers.email,
      role: marketplaceUsers.role,
      firstName: marketplaceUsers.firstName,
      lastName: marketplaceUsers.lastName,
      companyName: marketplaceUsers.companyName,
      phone: marketplaceUsers.phone,
      city: marketplaceUsers.city,
      state: marketplaceUsers.state,
      isActive: marketplaceUsers.isActive,
      isSuspended: marketplaceUsers.isSuspended,
      suspensionReason: marketplaceUsers.suspensionReason,
      emailVerified: marketplaceUsers.emailVerified,
      sellerVerified: marketplaceUsers.sellerVerified,
      createdAt: marketplaceUsers.createdAt,
      lastLoginAt: marketplaceUsers.lastLoginAt,
      loginCount: marketplaceUsers.loginCount,
    })
    .from(marketplaceUsers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceUsers)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = Number(countResult?.count || 0);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}

export async function getUserFullDetails(userId: number) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .select()
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId))
    .limit(1);

  if (!user) return null;

  // Get user's listing count if seller
  let listingStats = null;
  if (user.role === 'seller' || user.role === 'admin' || user.role === 'super_admin') {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(*) filter (where status = 'active')`,
        pending: sql<number>`count(*) filter (where status = 'pending')`,
        sold: sql<number>`count(*) filter (where status = 'sold')`,
      })
      .from(marketplaceListings)
      .where(eq(marketplaceListings.sellerId, userId));
    
    listingStats = stats;
  }

  // Get user's offer stats
  const [offerStats] = await db
    .select({
      sent: sql<number>`count(*) filter (where buyer_id = ${userId})`,
      received: sql<number>`count(*) filter (where seller_id = ${userId})`,
    })
    .from(marketplaceOffers);

  return {
    ...user,
    // Remove sensitive data
    passwordHash: undefined,
    passwordResetToken: undefined,
    emailVerificationToken: undefined,
    listingStats,
    offerStats,
  };
}

export async function updateUserByAdmin(userId: number, data: {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  city?: string;
  state?: string;
  bio?: string;
}) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .update(marketplaceUsers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceUsers.id, userId))
    .returning();

  return user;
}

export async function updateUserRole(userId: number, newRole: string) {
  const db = getMarketplaceDb();
  
  // Validate role
  const validRoles = ['buyer', 'seller', 'admin', 'super_admin'];
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role');
  }

  const [user] = await db
    .update(marketplaceUsers)
    .set({
      role: newRole,
      // If upgrading to seller, mark as seller verified
      sellerVerified: newRole === 'seller' || newRole === 'admin' || newRole === 'super_admin' ? true : undefined,
      sellerVerificationDate: newRole === 'seller' || newRole === 'admin' || newRole === 'super_admin' ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceUsers.id, userId))
    .returning();

  return user;
}

export async function suspendUser(userId: number, reason: string) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .update(marketplaceUsers)
    .set({
      isSuspended: true,
      suspensionReason: reason,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceUsers.id, userId))
    .returning();

  return user;
}

export async function activateUser(userId: number) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .update(marketplaceUsers)
    .set({
      isSuspended: false,
      isActive: true,
      suspensionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceUsers.id, userId))
    .returning();

  return user;
}

export async function deleteUser(userId: number) {
  const db = getMarketplaceDb();
  
  // First check if user has any active listings
  const [listingCheck] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceListings)
    .where(and(
      eq(marketplaceListings.sellerId, userId),
      eq(marketplaceListings.status, 'active')
    ));

  if (Number(listingCheck?.count || 0) > 0) {
    throw new Error('Cannot delete user with active listings');
  }

  // Delete user (related records will cascade due to FK constraints)
  await db
    .delete(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId));

  return { success: true };
}

// =============================================
// LISTING IMAGES MANAGEMENT
// =============================================

export async function addListingImage(listingId: number, imageData: {
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}) {
  const db = getMarketplaceDb();
  
  // If this is primary, unset other primaries
  if (imageData.isPrimary) {
    await db
      .update(listingImages)
      .set({ isPrimary: false })
      .where(eq(listingImages.listingId, listingId));
  }

  // Get current max sort order
  const [maxOrder] = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(sort_order), -1)` })
    .from(listingImages)
    .where(eq(listingImages.listingId, listingId));

  const [image] = await db
    .insert(listingImages)
    .values({
      listingId,
      url: imageData.url,
      thumbnailUrl: imageData.thumbnailUrl,
      altText: imageData.altText,
      sortOrder: imageData.sortOrder ?? (Number(maxOrder?.maxOrder || 0) + 1),
      isPrimary: imageData.isPrimary || false,
      createdAt: new Date(),
    })
    .returning();

  // Update listing primary image if this is primary
  if (imageData.isPrimary) {
    await db
      .update(marketplaceListings)
      .set({ primaryImageUrl: imageData.url, updatedAt: new Date() })
      .where(eq(marketplaceListings.id, listingId));
  }

  return image;
}

export async function deleteListingImage(imageId: number) {
  const db = getMarketplaceDb();
  
  // Get image info first
  const [image] = await db
    .select()
    .from(listingImages)
    .where(eq(listingImages.id, imageId))
    .limit(1);

  if (!image) {
    throw new Error('Image not found');
  }

  // Delete image
  await db
    .delete(listingImages)
    .where(eq(listingImages.id, imageId));

  // If this was primary, set another image as primary
  if (image.isPrimary && image.listingId) {
    const [nextImage] = await db
      .select()
      .from(listingImages)
      .where(eq(listingImages.listingId, image.listingId))
      .orderBy(asc(listingImages.sortOrder))
      .limit(1);

    if (nextImage) {
      await db
        .update(listingImages)
        .set({ isPrimary: true })
        .where(eq(listingImages.id, nextImage.id));
      
      await db
        .update(marketplaceListings)
        .set({ primaryImageUrl: nextImage.url, updatedAt: new Date() })
        .where(eq(marketplaceListings.id, image.listingId));
    } else {
      // No more images, clear primary
      await db
        .update(marketplaceListings)
        .set({ primaryImageUrl: null, updatedAt: new Date() })
        .where(eq(marketplaceListings.id, image.listingId));
    }
  }

  return { success: true };
}

export async function setListingPrimaryImage(listingId: number, imageId: number) {
  const db = getMarketplaceDb();
  
  // Unset all primaries for this listing
  await db
    .update(listingImages)
    .set({ isPrimary: false })
    .where(eq(listingImages.listingId, listingId));

  // Set the new primary
  const [image] = await db
    .update(listingImages)
    .set({ isPrimary: true })
    .where(eq(listingImages.id, imageId))
    .returning();

  // Update listing primary image URL
  if (image) {
    await db
      .update(marketplaceListings)
      .set({ primaryImageUrl: image.url, updatedAt: new Date() })
      .where(eq(marketplaceListings.id, listingId));
  }

  return image;
}

export async function reorderListingImages(listingId: number, imageIds: number[]) {
  const db = getMarketplaceDb();
  
  // Update sort order for each image
  for (let i = 0; i < imageIds.length; i++) {
    await db
      .update(listingImages)
      .set({ sortOrder: i })
      .where(and(
        eq(listingImages.id, imageIds[i]),
        eq(listingImages.listingId, listingId)
      ));
  }

  return { success: true };
}

export async function getListingImages(listingId: number) {
  const db = getMarketplaceDb();
  
  return db
    .select()
    .from(listingImages)
    .where(eq(listingImages.listingId, listingId))
    .orderBy(asc(listingImages.sortOrder));
}

// =============================================
// SELLER LISTINGS MANAGEMENT
// =============================================

export async function getSellerListingsWithStats(sellerId: number, filters: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const db = getMarketplaceDb();
  const { status = 'all', search, page = 1, limit = 20 } = filters;

  const conditions = [eq(marketplaceListings.sellerId, sellerId)];

  if (status && status !== 'all') {
    conditions.push(eq(marketplaceListings.status, status));
  }

  if (search) {
    conditions.push(
      or(
        ilike(marketplaceListings.title, `%${search}%`),
        ilike(marketplaceListings.city, `%${search}%`),
        ilike(marketplaceListings.listingNumber, `%${search}%`)
      )
    );
  }

  const offset = (page - 1) * limit;

  const listings = await db
    .select({
      id: marketplaceListings.id,
      listingNumber: marketplaceListings.listingNumber,
      slug: marketplaceListings.slug,
      title: marketplaceListings.title,
      titleEs: marketplaceListings.titleEs,
      description: marketplaceListings.description,
      chassisType: marketplaceListings.chassisType,
      chassisSize: marketplaceListings.chassisSize,
      condition: marketplaceListings.condition,
      manufacturer: marketplaceListings.manufacturer,
      year: marketplaceListings.year,
      state: marketplaceListings.state,
      city: marketplaceListings.city,
      zipCode: marketplaceListings.zipCode,
      quantity: marketplaceListings.quantity,
      quantityAvailable: marketplaceListings.quantityAvailable,
      quantitySold: marketplaceListings.quantitySold,
      pricePerUnit: marketplaceListings.pricePerUnit,
      priceNegotiable: marketplaceListings.priceNegotiable,
      primaryImageUrl: marketplaceListings.primaryImageUrl,
      status: marketplaceListings.status,
      featured: marketplaceListings.featured,
      verified: marketplaceListings.verified,
      viewsCount: marketplaceListings.viewsCount,
      inquiriesCount: marketplaceListings.inquiriesCount,
      offersCount: marketplaceListings.offersCount,
      favoritesCount: marketplaceListings.favoritesCount,
      createdAt: marketplaceListings.createdAt,
      publishedAt: marketplaceListings.publishedAt,
      rejectionReason: marketplaceListings.rejectionReason,
    })
    .from(marketplaceListings)
    .where(and(...conditions))
    .orderBy(desc(marketplaceListings.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceListings)
    .where(and(...conditions));

  const total = Number(countResult?.count || 0);

  // Get status counts
  const [statusCounts] = await db
    .select({
      all: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where status = 'active')`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
      draft: sql<number>`count(*) filter (where status = 'draft')`,
      sold: sql<number>`count(*) filter (where status = 'sold')`,
      rejected: sql<number>`count(*) filter (where status = 'rejected')`,
    })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.sellerId, sellerId));

  return {
    listings,
    statusCounts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  };
}
