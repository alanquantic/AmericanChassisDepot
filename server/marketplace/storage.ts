import crypto from 'crypto';
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
// SIZE FILTER HELPER
// =============================================

// Sizes that have their own dedicated dropdown bucket. Ranges exclude these
// so e.g. "46-49 ft" does NOT pull in "48'" listings (those belong to the "48'" bucket).
const STANDARD_SIZE_BUCKETS = new Set([20, 40, 45, 48, 53]);

/**
 * Build a Drizzle SQL condition for the chassisSize filter.
 * Handles standard buckets (20', 40', …), non-standard ranges (30-39 ft, 41-44 ft),
 * open ranges (54+ ft) and extendable combos (20-40', 40-45-48', …).
 * Returns undefined if the value matches no possible listing (e.g. empty range after exclusions).
 */
function buildSizeFilterCondition(size: string) {
  const sizeColumn = marketplaceListings.chassisSize;

  // Closed range with " ft" suffix: "20-29 ft", "30-39 ft", "41-44 ft", "46-49 ft"
  const rangeMatch = size.match(/^(\d+)\s*-\s*(\d+)\s*ft$/i);
  // Open range: "54+ ft"
  const openMatch = size.match(/^(\d+)\s*\+\s*ft$/i);

  if (rangeMatch || openMatch) {
    const start = parseInt(rangeMatch ? rangeMatch[1] : openMatch![1], 10);
    const end = rangeMatch ? parseInt(rangeMatch[2], 10) : 999;
    const parts: any[] = [];
    for (let n = start; n <= end; n++) {
      if (STANDARD_SIZE_BUCKETS.has(n)) continue; // skip — own bucket
      parts.push(ilike(sizeColumn, `${n} ft%`));
      parts.push(ilike(sizeColumn, `${n}ft%`));
      parts.push(eq(sizeColumn, `${n}'`));
    }
    return parts.length ? or(...parts) : undefined;
  }

  // Standard bucket: single number with apostrophe like "40'"
  // Match exact + format variants ("40 ft", "40ft", "40 ft 6 in", etc.)
  const standardMatch = size.match(/^(\d+)'$/);
  if (standardMatch) {
    const n = standardMatch[1];
    return or(
      eq(sizeColumn, size),
      ilike(sizeColumn, `${n} ft%`),
      ilike(sizeColumn, `${n}ft%`)
    );
  }

  // Extendable combo with apostrophe ("20-40'", "40-45-48'") — exact match only
  return eq(sizeColumn, size);
}

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

  // Size filter — dropdown sends one of:
  //   - standard bucket with apostrophe: "20'", "40'", "45'", "48'", "53'"
  //   - non-standard range with " ft": "20-29 ft", "30-39 ft", "41-44 ft", "46-49 ft"
  //   - open range: "54+ ft"
  //   - extendable combo with apostrophe: "20-40'", "40-45'", "40-45-48'", "40-45-48-53'"
  // DB stores values in multiple formats: "40'", "40 ft", "40ft", "40 ft 6 in", etc.
  if (chassisSize && chassisSize !== 'all') {
    const cond = buildSizeFilterCondition(chassisSize);
    if (cond) conditions.push(cond);
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
        ilike(marketplaceListings.listingNumber, `%${search}%`),
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
      // Use updatedAt to show recently modified listings first
      orderBy = desc(marketplaceListings.updatedAt);
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

  // Atomic view count increment
  await db
    .update(marketplaceListings)
    .set({ viewsCount: sql`COALESCE(${marketplaceListings.viewsCount}, 0) + 1` })
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

function generateUniqueSlug(data: Partial<MarketplaceListing>): string {
  const base = `${data.chassisType || ''}-${data.chassisSize || ''}-${data.city || ''}-${data.state || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base}-${crypto.randomBytes(4).toString('hex')}`;
}

export async function createListing(data: Partial<MarketplaceListing>) {
  const db = getMarketplaceDb();

  // Atomic listing number via nextval (falls back to random hex if sequence unavailable)
  let listingNumber: string;
  try {
    const result = await db.execute(sql`SELECT nextval(pg_get_serial_sequence('marketplace_listings', 'id')) as val`);
    const rows = (result as any).rows || result;
    const num = Number(Array.isArray(rows) ? rows[0]?.val : (rows as any)?.val);
    listingNumber = `ACD-${new Date().getFullYear()}-${String(num).padStart(4, '0')}`;
  } catch {
    listingNumber = `ACD-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }

  const slug = generateUniqueSlug(data);

  const [listing] = await db
    .insert(marketplaceListings)
    .values({
      ...data,
      listingNumber,
      slug,
      status: 'pending',
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

// Bulk insert listings from CSV data — inserts in batches of BATCH_SIZE
export interface BulkListingInput {
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
  quantityAvailable?: number;
  pricePerUnit: number;
  priceNegotiable?: boolean;
  minimumOrder?: number;
  manufacturer?: string;
  year?: number;
  vin?: string;
  primaryImageUrl?: string;
  tags?: string[];
  sellerId: number;
  status?: string;
}

const BULK_BATCH_SIZE = 100;

export async function createListingsBatch(items: BulkListingInput[]): Promise<{ inserted: number; errors: Array<{ index: number; error: string }> }> {
  const db = getMarketplaceDb();
  const now = new Date();
  const year = now.getFullYear();
  let inserted = 0;
  const errors: Array<{ index: number; error: string }> = [];

  for (let batchStart = 0; batchStart < items.length; batchStart += BULK_BATCH_SIZE) {
    const batch = items.slice(batchStart, batchStart + BULK_BATCH_SIZE);

    const values = batch.map((item, i) => {
      const globalIndex = batchStart + i;
      const hex = crypto.randomBytes(4).toString('hex');
      const slug = `${item.chassisType}-${item.chassisSize}-${item.city}-${item.state}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        + `-${hex}`;
      const listingNumber = `ACD-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

      return {
        sellerId: item.sellerId,
        listingNumber,
        slug,
        title: item.title,
        titleEs: item.titleEs || null,
        description: item.description || null,
        descriptionEs: item.descriptionEs || null,
        chassisType: item.chassisType,
        chassisSize: item.chassisSize,
        condition: item.condition,
        state: item.state,
        city: item.city,
        zipCode: item.zipCode || null,
        quantity: item.quantity,
        quantityAvailable: item.quantityAvailable ?? item.quantity,
        pricePerUnit: item.pricePerUnit.toString(),
        priceNegotiable: item.priceNegotiable ?? true,
        minimumOrder: item.minimumOrder ?? 1,
        manufacturer: item.manufacturer || null,
        year: item.year || null,
        vin: item.vin || null,
        primaryImageUrl: item.primaryImageUrl || null,
        tags: item.tags || null,
        status: item.status || 'active',
        createdAt: now,
        updatedAt: now,
        publishedAt: (item.status || 'active') === 'active' ? now : null,
      } as any;
    });

    try {
      await db.insert(marketplaceListings).values(values);
      inserted += batch.length;
    } catch (err: any) {
      // If batch fails, try one-by-one to identify the bad rows
      for (let j = 0; j < batch.length; j++) {
        try {
          await db.insert(marketplaceListings).values(values[j]);
          inserted++;
        } catch (rowErr: any) {
          errors.push({ index: batchStart + j, error: rowErr.message || 'Insert failed' });
        }
      }
    }
  }

  return { inserted, errors };
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

  // Atomic offer number generation
  const offerNumber = `OFF-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  
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

// Aliased user tables for buyer/seller JOINs
const buyerUsers = marketplaceUsers;
const sellerUsers = marketplaceUsers;

// Get all offers for admin (single query with JOINs instead of N+1)
export async function getAllOffersAdmin(filters: { status?: string; search?: string; page?: number; limit?: number } = {}) {
  const db = getMarketplaceDb();
  const { status, search, page = 1, limit = 20 } = filters;

  const conditions = [];

  if (status && status !== 'all') {
    conditions.push(eq(marketplaceOffers.status, status));
  }

  if (search) {
    conditions.push(
      or(
        ilike(marketplaceOffers.offerNumber, `%${search}%`),
        ilike(marketplaceListings.title, `%${search}%`)
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const offset = (page - 1) * limit;

  // Single query: offers + listing + buyer + seller via raw SQL aliases
  const offers = await db.execute(sql`
    SELECT
      o.id, o.offer_number, o.listing_id, o.buyer_id, o.seller_id,
      o.quantity, o.price_per_unit, o.total_amount, o.status,
      o.buyer_notes, o.seller_notes, o.counter_price, o.counter_quantity,
      o.created_at, o.expires_at, o.responded_at,
      l.title as listing_title, l.listing_number as listing_number, l.slug as listing_slug,
      b.id as buyer_user_id, b.first_name as buyer_first_name, b.last_name as buyer_last_name,
      b.company_name as buyer_company_name, b.email as buyer_email,
      s.id as seller_user_id, s.first_name as seller_first_name, s.last_name as seller_last_name,
      s.company_name as seller_company_name, s.email as seller_email,
      count(*) OVER() as total_count
    FROM marketplace_offers o
    LEFT JOIN marketplace_listings l ON o.listing_id = l.id
    LEFT JOIN marketplace_users b ON o.buyer_id = b.id
    LEFT JOIN marketplace_users s ON o.seller_id = s.id
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `);

  const rows = (offers as any).rows || offers;
  const total = Number(rows[0]?.total_count || 0);

  const offersWithUsers = (Array.isArray(rows) ? rows : []).map((r: any) => ({
    id: r.id,
    offerNumber: r.offer_number,
    listingId: r.listing_id,
    buyerId: r.buyer_id,
    sellerId: r.seller_id,
    quantity: r.quantity,
    pricePerUnit: r.price_per_unit,
    totalAmount: r.total_amount,
    status: r.status,
    buyerNotes: r.buyer_notes,
    sellerNotes: r.seller_notes,
    counterPrice: r.counter_price,
    counterQuantity: r.counter_quantity,
    createdAt: r.created_at,
    expiresAt: r.expires_at,
    respondedAt: r.responded_at,
    listingTitle: r.listing_title,
    listingNumber: r.listing_number,
    listingSlug: r.listing_slug,
    buyer: r.buyer_user_id ? {
      id: r.buyer_user_id,
      firstName: r.buyer_first_name,
      lastName: r.buyer_last_name,
      companyName: r.buyer_company_name,
      email: r.buyer_email,
    } : null,
    seller: r.seller_user_id ? {
      id: r.seller_user_id,
      firstName: r.seller_first_name,
      lastName: r.seller_last_name,
      companyName: r.seller_company_name,
      email: r.seller_email,
    } : null,
  }));

  return {
    offers: offersWithUsers,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
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

  const refTypes = await db
    .select()
    .from(marketplaceChassisTypes)
    .where(eq(marketplaceChassisTypes.isActive, true))
    .orderBy(asc(marketplaceChassisTypes.sortOrder));

  // Group active listings by chassisType to know which dropdown values actually have inventory.
  const grouped = await db
    .select({
      name: marketplaceListings.chassisType,
      count: sql<number>`count(*)::int`,
    })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.status, 'active'))
    .groupBy(marketplaceListings.chassisType);

  const countByName = new Map<string, number>();
  for (const row of grouped) {
    if (row.name) countByName.set(row.name, Number(row.count) || 0);
  }

  // Keep only reference types that actually have ≥1 listing (avoids dead options like
  // "Triaxle" or "Tank" sitting next to "Tri-Axle Chassis" / "Tank Chassis").
  const liveRefs = refTypes
    .filter((t: any) => (countByName.get(t.name) || 0) > 0)
    .map((t: any) => ({ ...t, count: countByName.get(t.name) || 0 }));

  // Add DB-only values that aren't in the (filtered) reference table.
  const refNames = new Set(liveRefs.map((t: any) => t.name));
  const extras = Array.from(countByName.entries())
    .filter(([name, count]) => !!name && !refNames.has(name) && count > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count], i) => ({
      id: -1 - i,
      name,
      nameEs: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: null,
      descriptionEs: null,
      icon: null,
      sortOrder: 9000 + i,
      isActive: true,
      createdAt: new Date(),
      count,
    }));

  return [...liveRefs, ...extras];
}

export async function getConditions() {
  const db = getMarketplaceDb();

  const refConds = await db
    .select()
    .from(marketplaceConditions)
    .where(eq(marketplaceConditions.isActive, true))
    .orderBy(asc(marketplaceConditions.sortOrder));

  const grouped = await db
    .select({
      name: marketplaceListings.condition,
      count: sql<number>`count(*)::int`,
    })
    .from(marketplaceListings)
    .where(eq(marketplaceListings.status, 'active'))
    .groupBy(marketplaceListings.condition);

  const countByName = new Map<string, number>();
  for (const row of grouped) {
    if (row.name) countByName.set(row.name, Number(row.count) || 0);
  }

  const liveRefs = refConds
    .filter((c: any) => (countByName.get(c.name) || 0) > 0)
    .map((c: any) => ({ ...c, count: countByName.get(c.name) || 0 }));

  const refNames = new Set(liveRefs.map((c: any) => c.name));
  const extras = Array.from(countByName.entries())
    .filter(([name, count]) => !!name && !refNames.has(name) && count > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count], i) => ({
      id: -1 - i,
      name,
      nameEs: name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: null,
      descriptionEs: null,
      color: '#6B7280',
      sortOrder: 9000 + i,
      isActive: true,
      createdAt: new Date(),
      count,
    }));

  return [...liveRefs, ...extras];
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

  if (imageIds.length === 0) return { success: true };

  // Batch update in a single query using CASE WHEN
  const cases = imageIds.map((id, i) => sql`WHEN id = ${id} THEN ${i}`);
  await db.execute(sql`
    UPDATE listing_images
    SET sort_order = CASE ${sql.join(cases, sql` `)} END
    WHERE listing_id = ${listingId} AND id IN (${sql.join(imageIds.map(id => sql`${id}`), sql`, `)})
  `);

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
    const searchCondition = or(
      ilike(marketplaceListings.title, `%${search}%`),
      ilike(marketplaceListings.city, `%${search}%`),
      ilike(marketplaceListings.listingNumber, `%${search}%`)
    );
    if (searchCondition) conditions.push(searchCondition);
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
