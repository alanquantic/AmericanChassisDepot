import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb, unique, check, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// =============================================
// USUARIOS DEL MARKETPLACE
// =============================================
export const marketplaceUsers = pgTable("marketplace_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("buyer"), // 'buyer', 'seller', 'admin', 'super_admin'
  
  // Información de perfil
  firstName: text("first_name"),
  lastName: text("last_name"),
  companyName: text("company_name"),
  phone: text("phone"),
  
  // Dirección
  addressLine1: text("address_line1"),
  addressLine2: text("address_line2"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("USA"),
  
  // Verificación y estado
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  sellerVerified: boolean("seller_verified").default(false),
  sellerVerificationDate: timestamp("seller_verification_date"),
  sellerVerificationNotes: text("seller_verification_notes"),
  isActive: boolean("is_active").default(true),
  isSuspended: boolean("is_suspended").default(false),
  suspensionReason: text("suspension_reason"),
  
  // Stripe
  stripeCustomerId: text("stripe_customer_id"),
  stripeConnectedAccountId: text("stripe_connected_account_id"),
  stripeAccountId: text("stripe_account_id"),
  stripeAccountStatus: text("stripe_account_status"),
  
  // Preferencias
  preferredLanguage: text("preferred_language").default("en"),
  notificationEmail: boolean("notification_email").default(true),
  notificationSms: boolean("notification_sms").default(false),
  newsletterSubscribed: boolean("newsletter_subscribed").default(true),
  
  // Metadata
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  website: text("website"),
  taxId: text("tax_id"),
  
  // Password reset
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  
  // Tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").default(0),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
});

// =============================================
// CATEGORÍAS DE CHASSIS
// =============================================
export const marketplaceChassisTypes = pgTable("marketplace_chassis_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEs: text("name_es"),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionEs: text("description_es"),
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// CONDICIONES DE CHASSIS
// =============================================
export const marketplaceConditions = pgTable("marketplace_conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEs: text("name_es"),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  descriptionEs: text("description_es"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// LISTINGS DEL MARKETPLACE
// =============================================
export const marketplaceListings = pgTable("marketplace_listings", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => marketplaceUsers.id),
  
  // Identificación
  listingNumber: text("listing_number").unique(),
  slug: text("slug").notNull().unique(),
  
  // Información del chassis
  title: text("title").notNull(),
  titleEs: text("title_es"),
  description: text("description"),
  descriptionEs: text("description_es"),
  
  // Tipo y especificaciones
  chassisTypeId: integer("chassis_type_id").references(() => marketplaceChassisTypes.id),
  chassisType: text("chassis_type").notNull(),
  chassisSize: text("chassis_size").notNull(),
  conditionId: integer("condition_id").references(() => marketplaceConditions.id),
  condition: text("condition").notNull(),
  manufacturer: text("manufacturer"),
  year: integer("year"),
  vin: text("vin"),
  
  // Ubicación
  state: text("state").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code"),
  locationDetails: text("location_details"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Inventario y precio
  quantity: integer("quantity").notNull().default(1),
  quantityAvailable: integer("quantity_available").notNull().default(1),
  quantitySold: integer("quantity_sold").default(0),
  quantityReserved: integer("quantity_reserved").default(0),
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }),
  priceNegotiable: boolean("price_negotiable").default(true),
  minimumOrder: integer("minimum_order").default(1),
  bulkDiscountPercent: decimal("bulk_discount_percent", { precision: 5, scale: 2 }),
  bulkDiscountMinQty: integer("bulk_discount_min_qty"),
  
  // Imágenes
  primaryImageUrl: text("primary_image_url"),
  images: jsonb("images").default([]),
  videoUrl: text("video_url"),
  
  // Estado del listing
  status: text("status").default("draft"), // 'draft', 'pending', 'active', 'inactive', 'sold', 'expired', 'rejected', 'suspended'
  featured: boolean("featured").default(false),
  featuredUntil: timestamp("featured_until"),
  verified: boolean("verified").default(false),
  verifiedBy: integer("verified_by").references(() => marketplaceUsers.id),
  verifiedAt: timestamp("verified_at"),
  
  // Visibilidad
  viewsCount: integer("views_count").default(0),
  uniqueViewsCount: integer("unique_views_count").default(0),
  inquiriesCount: integer("inquiries_count").default(0),
  offersCount: integer("offers_count").default(0),
  favoritesCount: integer("favorites_count").default(0),
  
  // Especificaciones técnicas adicionales
  specs: jsonb("specs").default({}),
  
  // Etiquetas para búsqueda
  tags: text("tags").array(),
  
  // Moderación
  rejectionReason: text("rejection_reason"),
  rejectedBy: integer("rejected_by").references(() => marketplaceUsers.id),
  rejectedAt: timestamp("rejected_at"),
  
  // Fechas
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  soldAt: timestamp("sold_at"),
  lastRenewedAt: timestamp("last_renewed_at"),
}, (table) => ({
  idxStatusCreated: index("idx_listings_status_created").on(table.status, table.createdAt),
  idxStatusTypeCondState: index("idx_listings_status_type_cond_state").on(table.status, table.chassisType, table.condition, table.state),
  idxStatusPrice: index("idx_listings_status_price").on(table.status, table.pricePerUnit),
  idxSellerId: index("idx_listings_seller_id").on(table.sellerId),
  idxSellerStatus: index("idx_listings_seller_status").on(table.sellerId, table.status),
  idxFeatured: index("idx_listings_featured").on(table.featured, table.status),
  idxUpdatedAt: index("idx_listings_updated_at").on(table.updatedAt),
}));

// =============================================
// IMÁGENES DE LISTINGS
// =============================================
export const listingImages = pgTable("listing_images", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  mediumUrl: text("medium_url"),
  altText: text("alt_text"),
  altTextEs: text("alt_text_es"),
  sortOrder: integer("sort_order").default(0),
  isPrimary: boolean("is_primary").default(false),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// CONVERSACIONES
// =============================================
export const marketplaceConversations = pgTable("marketplace_conversations", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => marketplaceListings.id),
  buyerId: integer("buyer_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  sellerId: integer("seller_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  
  // Estado
  status: text("status").default("active"), // 'active', 'closed', 'archived', 'blocked'
  
  // Última actividad
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  buyerUnreadCount: integer("buyer_unread_count").default(0),
  sellerUnreadCount: integer("seller_unread_count").default(0),
  
  // Moderación
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  flaggedBy: integer("flagged_by").references(() => marketplaceUsers.id),
  flaggedAt: timestamp("flagged_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  closedBy: integer("closed_by").references(() => marketplaceUsers.id),
}, (table) => ({
  idxConvBuyer: index("idx_conversations_buyer").on(table.buyerId),
  idxConvSeller: index("idx_conversations_seller").on(table.sellerId),
  idxConvListing: index("idx_conversations_listing").on(table.listingId),
}));

// =============================================
// MENSAJES
// =============================================
export const marketplaceMessages = pgTable("marketplace_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => marketplaceConversations.id, { onDelete: "cascade" }),
  senderId: integer("sender_id").references(() => marketplaceUsers.id),
  
  // Contenido
  message: text("message").notNull(),
  
  // Tipo de mensaje
  messageType: text("message_type").default("text"), // 'text', 'offer', 'counter_offer', 'system', 'attachment'
  
  // Para ofertas
  offerAmount: decimal("offer_amount", { precision: 12, scale: 2 }),
  offerQuantity: integer("offer_quantity"),
  offerStatus: text("offer_status"), // 'pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn'
  
  // Attachments
  attachments: jsonb("attachments").default([]),
  
  // Estado
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isDeletedBySender: boolean("is_deleted_by_sender").default(false),
  isDeletedByReceiver: boolean("is_deleted_by_receiver").default(false),
  
  // Moderación
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  
  createdAt: timestamp("created_at").defaultNow(),
  editedAt: timestamp("edited_at"),
}, (table) => ({
  idxMsgConversation: index("idx_messages_conversation").on(table.conversationId),
  idxMsgSender: index("idx_messages_sender").on(table.senderId),
}));

// =============================================
// OFERTAS FORMALES
// =============================================
export const marketplaceOffers = pgTable("marketplace_offers", {
  id: serial("id").primaryKey(),
  offerNumber: text("offer_number").unique(),
  listingId: integer("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }),
  buyerId: integer("buyer_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  sellerId: integer("seller_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  conversationId: integer("conversation_id").references(() => marketplaceConversations.id),
  parentOfferId: integer("parent_offer_id"),
  
  // Detalles de la oferta
  quantity: integer("quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Estado
  status: text("status").default("pending"), // 'pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn', 'cancelled'
  
  // Contra-oferta
  counterPrice: decimal("counter_price", { precision: 12, scale: 2 }),
  counterQuantity: integer("counter_quantity"),
  counterMessage: text("counter_message"),
  
  // Notas
  buyerNotes: text("buyer_notes"),
  sellerNotes: text("seller_notes"),
  
  // Admin review
  adminNotified: boolean("admin_notified").default(false),
  adminNotifiedAt: timestamp("admin_notified_at"),
  adminReviewedBy: integer("admin_reviewed_by").references(() => marketplaceUsers.id),
  adminNotes: text("admin_notes"),
  
  // Stripe
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  
  // Fechas
  expiresAt: timestamp("expires_at"),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  idxOfferListing: index("idx_offers_listing").on(table.listingId),
  idxOfferBuyer: index("idx_offers_buyer").on(table.buyerId),
  idxOfferSeller: index("idx_offers_seller").on(table.sellerId),
  idxOfferStatus: index("idx_offers_status").on(table.status),
}));

// =============================================
// ÓRDENES
// =============================================
export const marketplaceOrders = pgTable("marketplace_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").unique(),
  
  listingId: integer("listing_id").references(() => marketplaceListings.id),
  buyerId: integer("buyer_id").references(() => marketplaceUsers.id),
  sellerId: integer("seller_id").references(() => marketplaceUsers.id),
  offerId: integer("offer_id").references(() => marketplaceOffers.id),
  
  // Detalles de compra
  quantity: integer("quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 12, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 12, scale: 2 }).default("0"),
  platformFeePercent: decimal("platform_fee_percent", { precision: 5, scale: 2 }).default("3.50"),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Estado
  status: text("status").default("pending"),
  
  // Stripe
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeChargeId: text("stripe_charge_id"),
  stripeTransferId: text("stripe_transfer_id"),
  stripeRefundId: text("stripe_refund_id"),
  
  // Información de pago
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status"),
  paidAt: timestamp("paid_at"),
  
  // Pickup info
  fulfillmentType: text("fulfillment_type").default("pickup"),
  pickupAddress: text("pickup_address"),
  pickupCity: text("pickup_city"),
  pickupState: text("pickup_state"),
  pickupZip: text("pickup_zip"),
  pickupInstructions: text("pickup_instructions"),
  pickupContactName: text("pickup_contact_name"),
  pickupContactPhone: text("pickup_contact_phone"),
  pickupContactEmail: text("pickup_contact_email"),
  pickupScheduledAt: timestamp("pickup_scheduled_at"),
  pickedUpAt: timestamp("picked_up_at"),
  
  // Delivery info
  deliveryAddress: text("delivery_address"),
  deliveryCity: text("delivery_city"),
  deliveryState: text("delivery_state"),
  deliveryZip: text("delivery_zip"),
  deliveryTrackingNumber: text("delivery_tracking_number"),
  deliveryCarrier: text("delivery_carrier"),
  estimatedDeliveryAt: timestamp("estimated_delivery_at"),
  deliveredAt: timestamp("delivered_at"),
  
  // Notas
  buyerNotes: text("buyer_notes"),
  sellerNotes: text("seller_notes"),
  adminNotes: text("admin_notes"),
  internalNotes: text("internal_notes"),
  
  // Dispute
  disputeReason: text("dispute_reason"),
  disputeOpenedAt: timestamp("dispute_opened_at"),
  disputeResolvedAt: timestamp("dispute_resolved_at"),
  disputeResolution: text("dispute_resolution"),
  
  // Fechas
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancelledBy: integer("cancelled_by").references(() => marketplaceUsers.id),
  cancellationReason: text("cancellation_reason"),
});

// =============================================
// FAVORITOS
// =============================================
export const marketplaceFavorites = pgTable("marketplace_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  listingId: integer("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }),
  notes: text("notes"),
  priceAtSave: decimal("price_at_save", { precision: 12, scale: 2 }),
  notifyPriceDrop: boolean("notify_price_drop").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  uniqueUserListing: unique().on(table.userId, table.listingId),
}));

// =============================================
// BÚSQUEDAS GUARDADAS
// =============================================
export const marketplaceSavedSearches = pgTable("marketplace_saved_searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  name: text("name"),
  filters: jsonb("filters").notNull(),
  notifyNewMatches: boolean("notify_new_matches").default(true),
  notificationFrequency: text("notification_frequency").default("daily"),
  lastNotifiedAt: timestamp("last_notified_at"),
  matchCount: integer("match_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// REVIEWS
// =============================================
export const marketplaceReviews = pgTable("marketplace_reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => marketplaceOrders.id),
  listingId: integer("listing_id").references(() => marketplaceListings.id),
  reviewerId: integer("reviewer_id").references(() => marketplaceUsers.id),
  reviewedUserId: integer("reviewed_user_id").references(() => marketplaceUsers.id),
  
  reviewType: text("review_type"), // 'buyer_to_seller', 'seller_to_buyer'
  
  overallRating: integer("overall_rating"),
  communicationRating: integer("communication_rating"),
  accuracyRating: integer("accuracy_rating"),
  timelinessRating: integer("timeliness_rating"),
  
  title: text("title"),
  comment: text("comment"),
  
  sellerResponse: text("seller_response"),
  sellerResponseAt: timestamp("seller_response_at"),
  
  images: jsonb("images").default([]),
  
  isVerifiedPurchase: boolean("is_verified_purchase").default(true),
  isVisible: boolean("is_visible").default(true),
  isFeatured: boolean("is_featured").default(false),
  
  isFlagged: boolean("is_flagged").default(false),
  flaggedReason: text("flagged_reason"),
  moderatedBy: integer("moderated_by").references(() => marketplaceUsers.id),
  moderatedAt: timestamp("moderated_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// NOTIFICACIONES
// =============================================
export const marketplaceNotifications = pgTable("marketplace_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }),
  
  type: text("type").notNull(),
  category: text("category").default("general"),
  
  title: text("title").notNull(),
  titleEs: text("title_es"),
  message: text("message"),
  messageEs: text("message_es"),
  
  listingId: integer("listing_id").references(() => marketplaceListings.id),
  conversationId: integer("conversation_id").references(() => marketplaceConversations.id),
  orderId: integer("order_id").references(() => marketplaceOrders.id),
  offerId: integer("offer_id").references(() => marketplaceOffers.id),
  fromUserId: integer("from_user_id").references(() => marketplaceUsers.id),
  
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isEmailSent: boolean("is_email_sent").default(false),
  emailSentAt: timestamp("email_sent_at"),
  isSmsSent: boolean("is_sms_sent").default(false),
  smsSentAt: timestamp("sms_sent_at"),
  
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  
  metadata: jsonb("metadata").default({}),
  
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
}, (table) => ({
  idxNotifUser: index("idx_notifications_user").on(table.userId),
  idxNotifUnread: index("idx_notifications_unread").on(table.userId, table.isRead),
}));

// =============================================
// ACTIVITY LOG
// =============================================
export const marketplaceActivityLog = pgTable("marketplace_activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => marketplaceUsers.id),
  
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  details: jsonb("details"),
  
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  requestId: text("request_id"),
  
  severity: text("severity").default("info"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// CONFIGURACIÓN
// =============================================
export const marketplaceSettings = pgTable("marketplace_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value"),
  valueType: text("value_type").default("string"),
  description: text("description"),
  category: text("category"),
  isPublic: boolean("is_public").default(false),
  updatedBy: integer("updated_by").references(() => marketplaceUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// REPORTES
// =============================================
export const marketplaceReports = pgTable("marketplace_reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").references(() => marketplaceUsers.id),
  
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  
  reason: text("reason").notNull(),
  description: text("description"),
  evidenceUrls: jsonb("evidence_urls").default([]),
  
  status: text("status").default("pending"),
  
  resolvedBy: integer("resolved_by").references(() => marketplaceUsers.id),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  actionTaken: text("action_taken"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// ESTADÍSTICAS DE VENDEDOR
// =============================================
export const marketplaceSellerStats = pgTable("marketplace_seller_stats", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => marketplaceUsers.id, { onDelete: "cascade" }).unique(),
  
  totalListings: integer("total_listings").default(0),
  activeListings: integer("active_listings").default(0),
  totalSales: integer("total_sales").default(0),
  totalRevenue: decimal("total_revenue", { precision: 14, scale: 2 }).default("0"),
  
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  totalReviews: integer("total_reviews").default(0),
  
  avgResponseTimeHours: decimal("avg_response_time_hours", { precision: 6, scale: 2 }),
  responseRatePercent: decimal("response_rate_percent", { precision: 5, scale: 2 }),
  
  badges: jsonb("badges").default([]),
  
  memberSince: timestamp("member_since"),
  lastActiveAt: timestamp("last_active_at"),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// VISTAS DE LISTINGS
// =============================================
export const marketplaceListingViews = pgTable("marketplace_listing_views", {
  id: serial("id").primaryKey(),
  listingId: integer("listing_id").references(() => marketplaceListings.id, { onDelete: "cascade" }),
  viewerId: integer("viewer_id").references(() => marketplaceUsers.id),
  
  sessionId: text("session_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  
  country: text("country"),
  region: text("region"),
  city: text("city"),
  
  viewedAt: timestamp("viewed_at").defaultNow(),
}, (table) => ({
  idxViewsListing: index("idx_listing_views_listing").on(table.listingId),
  idxViewsDate: index("idx_listing_views_date").on(table.viewedAt),
}));

// =============================================
// EMAIL TEMPLATES
// =============================================
export const marketplaceEmailTemplates = pgTable("marketplace_email_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  subject: text("subject").notNull(),
  subjectEs: text("subject_es"),
  bodyHtml: text("body_html").notNull(),
  bodyHtmlEs: text("body_html_es"),
  bodyText: text("body_text"),
  bodyTextEs: text("body_text_es"),
  variables: jsonb("variables").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================
// AUDIT LOGS (Administrative Actions)
// =============================================
export const marketplaceAuditLogs = pgTable("marketplace_audit_logs", {
  id: serial("id").primaryKey(),
  
  // Who performed the action
  userId: integer("user_id").references(() => marketplaceUsers.id),
  userEmail: text("user_email").notNull(),
  userRole: text("user_role").notNull(),
  
  // What action was performed
  action: text("action").notNull(), // e.g., 'user.suspend', 'listing.approve', 'order.refund'
  entityType: text("entity_type").notNull(), // 'user', 'listing', 'offer', 'order', 'payment', 'system'
  entityId: text("entity_id"), // ID of the affected entity
  
  // Change details
  previousValue: text("previous_value"), // JSON string of previous state
  newValue: text("new_value"), // JSON string of new state
  metadata: text("metadata"), // Additional context as JSON
  
  // Request context
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  // Classification
  severity: text("severity").default("info"), // 'info', 'warning', 'critical'
  reason: text("reason"), // Optional reason/notes for the action
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// ZOD SCHEMAS & TYPES
// =============================================

// User schemas
export const insertMarketplaceUserSchema = createInsertSchema(marketplaceUsers).omit({ id: true });
export const selectMarketplaceUserSchema = createSelectSchema(marketplaceUsers);
export type MarketplaceUser = typeof marketplaceUsers.$inferSelect;
export type InsertMarketplaceUser = typeof marketplaceUsers.$inferInsert;

// Listing schemas
export const insertMarketplaceListingSchema = createInsertSchema(marketplaceListings).omit({ id: true });
export const selectMarketplaceListingSchema = createSelectSchema(marketplaceListings);
export type MarketplaceListing = typeof marketplaceListings.$inferSelect;
export type InsertMarketplaceListing = typeof marketplaceListings.$inferInsert;

// Conversation schemas
export const insertConversationSchema = createInsertSchema(marketplaceConversations).omit({ id: true });
export type MarketplaceConversation = typeof marketplaceConversations.$inferSelect;
export type InsertConversation = typeof marketplaceConversations.$inferInsert;

// Message schemas
export const insertMessageSchema = createInsertSchema(marketplaceMessages).omit({ id: true });
export type MarketplaceMessage = typeof marketplaceMessages.$inferSelect;
export type InsertMessage = typeof marketplaceMessages.$inferInsert;

// Offer schemas
export const insertOfferSchema = createInsertSchema(marketplaceOffers).omit({ id: true });
export type MarketplaceOffer = typeof marketplaceOffers.$inferSelect;
export type InsertOffer = typeof marketplaceOffers.$inferInsert;

// Order schemas
export const insertOrderSchema = createInsertSchema(marketplaceOrders).omit({ id: true });
export type MarketplaceOrder = typeof marketplaceOrders.$inferSelect;
export type InsertOrder = typeof marketplaceOrders.$inferInsert;

// Favorite schemas
export const insertFavoriteSchema = createInsertSchema(marketplaceFavorites).omit({ id: true });
export type MarketplaceFavorite = typeof marketplaceFavorites.$inferSelect;
export type InsertFavorite = typeof marketplaceFavorites.$inferInsert;

// Review schemas
export const insertReviewSchema = createInsertSchema(marketplaceReviews).omit({ id: true });
export type MarketplaceReview = typeof marketplaceReviews.$inferSelect;
export type InsertReview = typeof marketplaceReviews.$inferInsert;

// Notification schemas
export const insertNotificationSchema = createInsertSchema(marketplaceNotifications).omit({ id: true });
export type MarketplaceNotification = typeof marketplaceNotifications.$inferSelect;
export type InsertNotification = typeof marketplaceNotifications.$inferInsert;

// Chassis type schemas
export type MarketplaceChassisType = typeof marketplaceChassisTypes.$inferSelect;
export type MarketplaceCondition = typeof marketplaceConditions.$inferSelect;

// Settings
export type MarketplaceSetting = typeof marketplaceSettings.$inferSelect;

// Seller stats
export type MarketplaceSellerStats = typeof marketplaceSellerStats.$inferSelect;

// Audit logs
export type MarketplaceAuditLog = typeof marketplaceAuditLogs.$inferSelect;
export type InsertAuditLog = typeof marketplaceAuditLogs.$inferInsert;

// =============================================
// CRM LEADS
// =============================================
export const crmLeads = pgTable("crm_leads", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  status: text("status").notNull().default("new"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  message: text("message"),
  notes: text("notes"),
  metadata: jsonb("metadata").default({}),
  archived: boolean("archived").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  idxCrmStatus: index("idx_crm_leads_status").on(table.status),
  idxCrmSource: index("idx_crm_leads_source").on(table.source),
  idxCrmCreatedAt: index("idx_crm_leads_created_at").on(table.createdAt),
  idxCrmEmail: index("idx_crm_leads_email").on(table.email),
  idxCrmArchived: index("idx_crm_leads_archived").on(table.archived),
}));

export const insertCrmLeadSchema = createInsertSchema(crmLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = z.infer<typeof insertCrmLeadSchema>;
