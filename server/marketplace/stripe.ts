import Stripe from 'stripe';
import { eq, sql } from 'drizzle-orm';
import { getMarketplaceDb } from './db';
import { marketplaceUsers, marketplaceOrders, marketplaceOffers, marketplaceListings } from '../../shared/marketplace-schema';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const platformFeePercent = parseFloat(process.env.STRIPE_PLATFORM_FEE_PERCENT || '3.5');

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey)
  : null;

export function isStripeAvailable(): boolean {
  return stripe !== null;
}

// =============================================
// CUSTOMER MANAGEMENT
// =============================================

export async function getOrCreateStripeCustomer(userId: number): Promise<string | null> {
  if (!stripe) return null;

  const db = getMarketplaceDb();
  
  // Get user
  const [user] = await db
    .select()
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId))
    .limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  // If user already has a Stripe customer ID, return it
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.companyName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
    phone: user.phone || undefined,
    metadata: {
      userId: user.id.toString(),
      role: user.role || 'buyer',
    },
  });

  // Save customer ID to user
  await db
    .update(marketplaceUsers)
    .set({ stripeCustomerId: customer.id })
    .where(eq(marketplaceUsers.id, userId));

  return customer.id;
}

// =============================================
// CONNECTED ACCOUNTS (for sellers)
// =============================================

export async function createConnectedAccount(userId: number): Promise<{ url: string; accountId: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const db = getMarketplaceDb();
  
  // Get user
  const [user] = await db
    .select()
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId))
    .limit(1);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if user already has a connected account
  if (user.stripeConnectedAccountId) {
    // Create new onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeConnectedAccountId,
      refresh_url: `${process.env.APP_URL || 'http://localhost:5000'}/marketplace/seller/stripe/refresh`,
      return_url: `${process.env.APP_URL || 'http://localhost:5000'}/marketplace/seller/stripe/return`,
      type: 'account_onboarding',
    });

    return { url: accountLink.url, accountId: user.stripeConnectedAccountId };
  }

  // Create new connected account
  const account = await stripe.accounts.create({
    type: 'express',
    email: user.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: user.companyName ? 'company' : 'individual',
    metadata: {
      userId: user.id.toString(),
    },
  });

  // Save account ID to user
  await db
    .update(marketplaceUsers)
    .set({ stripeConnectedAccountId: account.id })
    .where(eq(marketplaceUsers.id, userId));

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.APP_URL || 'http://localhost:5000'}/marketplace/seller/stripe/refresh`,
    return_url: `${process.env.APP_URL || 'http://localhost:5000'}/marketplace/seller/stripe/return`,
    type: 'account_onboarding',
  });

  return { url: accountLink.url, accountId: account.id };
}

export async function getConnectedAccountStatus(userId: number): Promise<{
  hasAccount: boolean;
  accountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  detailsSubmitted?: boolean;
}> {
  if (!stripe) {
    return { hasAccount: false };
  }

  const db = getMarketplaceDb();
  
  const [user] = await db
    .select({ stripeConnectedAccountId: marketplaceUsers.stripeConnectedAccountId })
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, userId))
    .limit(1);

  if (!user?.stripeConnectedAccountId) {
    return { hasAccount: false };
  }

  try {
    const account = await stripe.accounts.retrieve(user.stripeConnectedAccountId);
    
    return {
      hasAccount: true,
      accountId: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    };
  } catch (error) {
    return { hasAccount: false };
  }
}

// =============================================
// CHECKOUT & PAYMENTS
// =============================================

export interface CreateCheckoutParams {
  offerId: number;
  buyerId: number;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams): Promise<string> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const db = getMarketplaceDb();
  const { offerId, buyerId, successUrl, cancelUrl } = params;

  // Get the offer
  const [offer] = await db
    .select()
    .from(marketplaceOffers)
    .where(eq(marketplaceOffers.id, offerId))
    .limit(1);

  if (!offer) {
    throw new Error('Offer not found');
  }

  if (offer.status !== 'accepted') {
    throw new Error('Offer must be accepted before checkout');
  }

  if (offer.buyerId !== buyerId) {
    throw new Error('Only the buyer can checkout');
  }

  if (!offer.listingId) {
    throw new Error('Offer has no associated listing');
  }

  // Get the listing
  const [listing] = await db
    .select()
    .from(marketplaceListings)
    .where(eq(marketplaceListings.id, offer.listingId))
    .limit(1);

  if (!listing) {
    throw new Error('Listing not found');
  }

  if (!offer.sellerId) {
    throw new Error('Offer has no associated seller');
  }

  // Get seller's connected account
  const [seller] = await db
    .select({ stripeConnectedAccountId: marketplaceUsers.stripeConnectedAccountId })
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, offer.sellerId))
    .limit(1);

  // Get or create customer
  const customerId = await getOrCreateStripeCustomer(buyerId);

  // Calculate amounts
  const totalAmount = offer.quantity * parseFloat(offer.pricePerUnit);
  const platformFee = Math.round(totalAmount * (platformFeePercent / 100) * 100); // In cents
  const totalAmountCents = Math.round(totalAmount * 100);

  // Create line items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: listing.title,
          description: `${offer.quantity} x ${listing.chassisType} ${listing.chassisSize} - ${listing.condition}`,
          images: listing.primaryImageUrl ? [listing.primaryImageUrl] : undefined,
        },
        unit_amount: Math.round(parseFloat(offer.pricePerUnit) * 100),
      },
      quantity: offer.quantity,
    },
  ];

  // Session params
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    customer: customerId || undefined,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      offerId: offer.id.toString(),
      buyerId: buyerId.toString(),
      sellerId: offer.sellerId.toString(),
      listingId: listing.id.toString(),
    },
    payment_intent_data: {
      metadata: {
        offerId: offer.id.toString(),
        buyerId: buyerId.toString(),
        sellerId: offer.sellerId.toString(),
      },
    },
  };

  // If seller has connected account, use Connect
  if (seller?.stripeConnectedAccountId) {
    sessionParams.payment_intent_data = {
      ...sessionParams.payment_intent_data,
      application_fee_amount: platformFee,
      transfer_data: {
        destination: seller.stripeConnectedAccountId,
      },
    };
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  // Update offer with session ID
  await db
    .update(marketplaceOffers)
    .set({ stripeSessionId: session.id })
    .where(eq(marketplaceOffers.id, offerId));

  return session.url!;
}

// =============================================
// WEBHOOK HANDLERS
// =============================================

export async function handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
  const db = getMarketplaceDb();
  
  const offerId = parseInt(session.metadata?.offerId || '0');
  const buyerId = parseInt(session.metadata?.buyerId || '0');
  const sellerId = parseInt(session.metadata?.sellerId || '0');
  const listingId = parseInt(session.metadata?.listingId || '0');

  if (!offerId || !buyerId || !sellerId || !listingId) {
    console.error('Missing metadata in checkout session', session.id);
    return;
  }

  // Get the offer
  const [offer] = await db
    .select()
    .from(marketplaceOffers)
    .where(eq(marketplaceOffers.id, offerId))
    .limit(1);

  if (!offer) {
    console.error('Offer not found for session', session.id);
    return;
  }

  // Calculate amounts
  const totalAmount = offer.quantity * parseFloat(offer.pricePerUnit);
  const platformFee = totalAmount * (platformFeePercent / 100);
  const sellerAmount = totalAmount - platformFee;

  // Create order
  const [countResult] = await db
    .select({ count: sql<number>`count(*)` })
    .from(marketplaceOrders);
  
  const orderNumber = `ORD-${new Date().getFullYear()}-${String(Number(countResult?.count || 0) + 1).padStart(5, '0')}`;

  const [order] = await db
    .insert(marketplaceOrders)
    .values({
      orderNumber,
      buyerId,
      sellerId,
      listingId,
      offerId,
      quantity: offer.quantity,
      pricePerUnit: offer.pricePerUnit,
      subtotal: totalAmount.toString(),
      platformFee: platformFee.toString(),
      totalAmount: totalAmount.toString(),
      status: 'paid',
      paymentStatus: 'completed',
      stripePaymentIntentId: session.payment_intent as string,
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Update offer status
  await db
    .update(marketplaceOffers)
    .set({ 
      status: 'completed',
      stripePaymentIntentId: session.payment_intent as string,
      updatedAt: new Date(),
    })
    .where(eq(marketplaceOffers.id, offerId));

  // Update listing quantity
  const [listing] = await db
    .select()
    .from(marketplaceListings)
    .where(eq(marketplaceListings.id, listingId))
    .limit(1);

  if (listing) {
    const newQuantity = (listing.quantityAvailable || 0) - offer.quantity;
    const updates: any = {
      quantityAvailable: newQuantity,
      quantitySold: (listing.quantitySold || 0) + offer.quantity,
      updatedAt: new Date(),
    };

    // If no more quantity, mark as sold
    if (newQuantity <= 0) {
      updates.status = 'sold';
    }

    await db
      .update(marketplaceListings)
      .set(updates)
      .where(eq(marketplaceListings.id, listingId));
  }

  console.log(`Order ${orderNumber} created for session ${session.id}`);
}

export async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const db = getMarketplaceDb();
  
  const offerId = parseInt(paymentIntent.metadata?.offerId || '0');
  
  if (!offerId) return;

  // Update offer status
  await db
    .update(marketplaceOffers)
    .set({ 
      status: 'payment_failed',
      updatedAt: new Date(),
    })
    .where(eq(marketplaceOffers.id, offerId));
}

// =============================================
// REFUNDS
// =============================================

export async function createRefund(orderId: number, reason?: string): Promise<Stripe.Refund | null> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const db = getMarketplaceDb();
  
  const [order] = await db
    .select()
    .from(marketplaceOrders)
    .where(eq(marketplaceOrders.id, orderId))
    .limit(1);

  if (!order || !order.stripePaymentIntentId) {
    throw new Error('Order not found or no payment intent');
  }

  const refund = await stripe.refunds.create({
    payment_intent: order.stripePaymentIntentId,
    reason: 'requested_by_customer',
    metadata: {
      orderId: order.id.toString(),
      reason: reason || 'Customer requested refund',
    },
  });

  // Update order status
  await db
    .update(marketplaceOrders)
    .set({
      status: 'refunded',
      paymentStatus: 'refunded',
      updatedAt: new Date(),
    })
    .where(eq(marketplaceOrders.id, orderId));

  return refund;
}

// =============================================
// UTILITIES
// =============================================

export function formatStripeAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
