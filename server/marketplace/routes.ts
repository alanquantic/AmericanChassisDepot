import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  authenticateToken,
  optionalAuth,
  requireSeller,
  requireAdmin,
  requireSuperAdmin,
  registerUser,
  loginUser,
  refreshAccessToken,
  AuthenticatedRequest,
} from './auth.js';
import * as storage from './storage.js';
import { isMarketplaceAvailable } from './db.js';
import { sendOfferNotification, sendListingApprovalNotification } from './email.js';
import stripeRoutes from './stripe-routes.js';
import sitemapRoutes from './sitemap.js';

const router = Router();

// Mount Stripe routes
router.use('/payments', stripeRoutes);

// Mount Sitemap routes (before marketplace availability check for SEO)
router.use(sitemapRoutes);

// Middleware to check if marketplace is available
router.use((req, res, next) => {
  if (!isMarketplaceAvailable()) {
    return res.status(503).json({ 
      message: 'Marketplace service is currently unavailable',
      error: 'DATABASE_NOT_CONFIGURED'
    });
  }
  next();
});

// =============================================
// AUTH ROUTES
// =============================================

// Register
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data);
    
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.message === 'Email already registered') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser(email, password);
    
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Login failed' });
  }
});

// Refresh token
router.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }
    
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Token refresh failed' });
  }
});

// Get current user
router.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// =============================================
// PUBLIC LISTING ROUTES
// =============================================

// Get listings with filters
router.get('/listings', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      chassisType: req.query.chassisType as string,
      chassisSize: req.query.chassisSize as string,
      condition: req.query.condition as string,
      state: req.query.state as string,
      city: req.query.city as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      search: req.query.search as string,
      sortBy: req.query.sortBy as any,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 50) : 20,
    };

    const result = await storage.getListings(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// Get listing by slug
router.get('/listings/:slug', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listing = await storage.getListingBySlug(req.params.slug);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user has favorited this listing
    let isFavorited = false;
    if (req.user) {
      const favorites = await storage.getUserFavorites(req.user.id);
      isFavorited = favorites.some(f => f.listingId === listing.id);
    }
    
    res.json({ ...listing, isFavorited });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ message: 'Failed to fetch listing' });
  }
});

// Get reference data (types, conditions, states)
router.get('/reference/chassis-types', async (_req: Request, res: Response) => {
  try {
    const types = await storage.getChassisTypes();
    res.json(types);
  } catch (error) {
    console.error('Error fetching chassis types:', error);
    res.status(500).json({ message: 'Failed to fetch chassis types' });
  }
});

router.get('/reference/conditions', async (_req: Request, res: Response) => {
  try {
    const conditions = await storage.getConditions();
    res.json(conditions);
  } catch (error) {
    console.error('Error fetching conditions:', error);
    res.status(500).json({ message: 'Failed to fetch conditions' });
  }
});

router.get('/reference/states', async (_req: Request, res: Response) => {
  try {
    const states = await storage.getStates();
    res.json(states);
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({ message: 'Failed to fetch states' });
  }
});

// =============================================
// SELLER LISTING ROUTES
// =============================================

// Create listing (requires seller role)
const createListingSchema = z.object({
  title: z.string().min(5),
  titleEs: z.string().optional(),
  description: z.string().optional(),
  descriptionEs: z.string().optional(),
  chassisType: z.string(),
  chassisSize: z.string(),
  condition: z.string(),
  state: z.string(),
  city: z.string(),
  zipCode: z.string().optional(),
  quantity: z.number().min(1),
  pricePerUnit: z.number().min(1000),
  priceNegotiable: z.boolean().optional(),
  minimumOrder: z.number().optional(),
  manufacturer: z.string().optional(),
  year: z.number().optional(),
  primaryImageUrl: z.string().optional(),
  images: z.array(z.any()).optional(),
});

router.post('/listings', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = createListingSchema.parse(req.body);
    
    const listing = await storage.createListing({
      ...data,
      sellerId: req.user!.id,
      quantityAvailable: data.quantity,
      pricePerUnit: data.pricePerUnit.toString(),
    } as any);
    
    // Notify admins of new listing
    // TODO: Send notification to admins
    
    res.status(201).json({
      message: 'Listing created successfully. It will be visible once approved.',
      listing
    });
  } catch (error: any) {
    console.error('Error creating listing:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create listing' });
  }
});

// Update listing (owner only)
router.put('/listings/:id', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership (unless admin)
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }
    
    const updatedListing = await storage.updateListing(listingId, req.body);
    res.json({ message: 'Listing updated', listing: updatedListing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Failed to update listing' });
  }
});

// Delete listing (owner only)
router.delete('/listings/:id', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership (unless admin)
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    
    await storage.deleteListing(listingId);
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
});

// Get seller's own listings
router.get('/seller/listings', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      sellerId: req.user!.id,
      status: req.query.status as string || 'all',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: 20,
    };
    
    const result = await storage.getListings(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// =============================================
// CONVERSATION & MESSAGE ROUTES
// =============================================

// Get user's conversations
router.get('/conversations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const role = req.query.role as 'buyer' | 'seller' | 'all' || 'all';
    const conversations = await storage.getUserConversations(req.user!.id, role);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// Start or get conversation for a listing
router.post('/conversations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { listingId } = req.body;
    
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID required' });
    }
    
    const listing = await storage.getListingById(Number(listingId));
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.sellerId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot start conversation with yourself' });
    }
    
    const conversation = await storage.getOrCreateConversation(
      listing.id,
      req.user!.id,
      listing.sellerId!
    );
    
    res.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
});

// Get conversation messages
router.get('/conversations/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversationId = Number(req.params.id);
    const page = req.query.page ? Number(req.query.page) : 1;
    
    const messages = await storage.getConversationMessages(conversationId, page);
    
    // Mark messages as read
    await storage.markMessagesAsRead(conversationId, req.user!.id);
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send message
const sendMessageSchema = z.object({
  message: z.string().min(1),
  messageType: z.enum(['text', 'offer']).optional(),
  offerAmount: z.number().optional(),
  offerQuantity: z.number().optional(),
});

router.post('/conversations/:id/messages', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversationId = Number(req.params.id);
    const data = sendMessageSchema.parse(req.body);
    
    const newMessage = await storage.sendMessage({
      conversationId,
      senderId: req.user!.id,
      ...data,
    });
    
    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error('Error sending message:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// =============================================
// OFFER ROUTES
// =============================================

// Create offer
const createOfferSchema = z.object({
  listingId: z.number(),
  quantity: z.number().min(1),
  pricePerUnit: z.number().min(1),
  buyerNotes: z.string().optional(),
});

router.post('/offers', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = createOfferSchema.parse(req.body);
    
    const listing = await storage.getListingById(data.listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    if (listing.status !== 'active') {
      return res.status(400).json({ message: 'Listing is not available' });
    }
    
    if (listing.sellerId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot make offer on your own listing' });
    }
    
    if (data.quantity > (listing.quantityAvailable || 0)) {
      return res.status(400).json({ message: 'Requested quantity not available' });
    }
    
    // Create or get conversation
    const conversation = await storage.getOrCreateConversation(
      listing.id,
      req.user!.id,
      listing.sellerId!
    );
    
    const offer = await storage.createOffer({
      listingId: data.listingId,
      buyerId: req.user!.id,
      sellerId: listing.sellerId!,
      conversationId: conversation.id,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      buyerNotes: data.buyerNotes,
    });
    
    // Create notification for seller
    await storage.createNotification({
      userId: listing.sellerId!,
      type: 'new_offer',
      category: 'offer',
      title: 'New Offer Received',
      titleEs: 'Nueva Oferta Recibida',
      message: `You have a new offer of $${data.pricePerUnit.toLocaleString()} for ${data.quantity} unit(s) on "${listing.title}"`,
      messageEs: `Has recibido una nueva oferta de $${data.pricePerUnit.toLocaleString()} por ${data.quantity} unidad(es) en "${listing.titleEs || listing.title}"`,
      listingId: listing.id,
      offerId: offer.id,
      fromUserId: req.user!.id,
      actionUrl: `/marketplace/seller/offers`,
    });
    
    // Also notify admins
    await sendOfferNotification(offer, listing, req.user!);
    
    res.status(201).json({
      message: 'Offer submitted successfully',
      offer
    });
  } catch (error: any) {
    console.error('Error creating offer:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to create offer' });
  }
});

// Get user's offers (sent)
router.get('/offers/sent', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const offers = await storage.getOffersByUser(req.user!.id, 'sent');
    res.json(offers);
  } catch (error) {
    console.error('Error fetching sent offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
});

// Get user's offers (received - for sellers)
router.get('/offers/received', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const offers = await storage.getOffersByUser(req.user!.id, 'received');
    res.json(offers);
  } catch (error) {
    console.error('Error fetching received offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
});

// Respond to offer (accept/reject/counter)
const respondOfferSchema = z.object({
  action: z.enum(['accept', 'reject', 'counter']),
  notes: z.string().optional(),
  counterPrice: z.number().optional(),
  counterQuantity: z.number().optional(),
});

router.put('/offers/:id/respond', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const offerId = Number(req.params.id);
    const data = respondOfferSchema.parse(req.body);
    
    // Get offer and verify ownership
    const offers = await storage.getOffersByUser(req.user!.id, 'received');
    const offer = offers.find(o => o.id === offerId);
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    if (offer.status !== 'pending') {
      return res.status(400).json({ message: 'Offer has already been responded to' });
    }
    
    let newStatus: string;
    switch (data.action) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'counter':
        if (!data.counterPrice) {
          return res.status(400).json({ message: 'Counter price required' });
        }
        newStatus = 'countered';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }
    
    const updatedOffer = await storage.updateOfferStatus(
      offerId,
      newStatus,
      data.notes,
      data.counterPrice,
      data.counterQuantity
    );
    
    // TODO: Create notification for buyer
    // TODO: If accepted, create order
    
    res.json({
      message: `Offer ${newStatus}`,
      offer: updatedOffer
    });
  } catch (error: any) {
    console.error('Error responding to offer:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to respond to offer' });
  }
});

// =============================================
// FAVORITES ROUTES
// =============================================

// Toggle favorite
router.post('/favorites/:listingId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.listingId);
    const result = await storage.toggleFavorite(req.user!.id, listingId);
    res.json(result);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Failed to toggle favorite' });
  }
});

// Get user's favorites
router.get('/favorites', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const favorites = await storage.getUserFavorites(req.user!.id);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// =============================================
// NOTIFICATION ROUTES
// =============================================

// Get notifications
router.get('/notifications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const unreadOnly = req.query.unreadOnly === 'true';
    const notifications = await storage.getUserNotifications(req.user!.id, unreadOnly);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await storage.markNotificationAsRead(Number(req.params.id), req.user!.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/notifications/read-all', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await storage.markAllNotificationsAsRead(req.user!.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
});

// =============================================
// ADMIN ROUTES
// =============================================

// Get marketplace stats
router.get('/admin/stats', authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const stats = await storage.getMarketplaceStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get pending listings
router.get('/admin/listings/pending', authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const listings = await storage.getPendingListings();
    res.json(listings);
  } catch (error) {
    console.error('Error fetching pending listings:', error);
    res.status(500).json({ message: 'Failed to fetch pending listings' });
  }
});

// Approve listing
router.put('/admin/listings/:id/approve', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.approveListing(listingId, req.user!.id);
    
    // Notify seller
    if (listing.sellerId) {
      await storage.createNotification({
        userId: listing.sellerId,
        type: 'listing_approved',
        category: 'listing',
        title: 'Listing Approved',
        titleEs: 'Listing Aprobado',
        message: `Your listing "${listing.title}" has been approved and is now live!`,
        messageEs: `Tu listing "${listing.titleEs || listing.title}" ha sido aprobado y ahora está activo!`,
        listingId: listing.id,
        actionUrl: `/chassis-marketplace/${listing.slug}`,
      });
      
      await sendListingApprovalNotification(listing, true);
    }
    
    res.json({ message: 'Listing approved', listing });
  } catch (error) {
    console.error('Error approving listing:', error);
    res.status(500).json({ message: 'Failed to approve listing' });
  }
});

// Reject listing
router.put('/admin/listings/:id/reject', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason required' });
    }
    
    const listing = await storage.rejectListing(listingId, req.user!.id, reason);
    
    // Notify seller
    if (listing.sellerId) {
      await storage.createNotification({
        userId: listing.sellerId,
        type: 'listing_rejected',
        category: 'listing',
        title: 'Listing Rejected',
        titleEs: 'Listing Rechazado',
        message: `Your listing "${listing.title}" has been rejected. Reason: ${reason}`,
        messageEs: `Tu listing "${listing.titleEs || listing.title}" ha sido rechazado. Razón: ${reason}`,
        listingId: listing.id,
        actionUrl: `/marketplace/seller/listings`,
      });
      
      await sendListingApprovalNotification(listing, false, reason);
    }
    
    res.json({ message: 'Listing rejected', listing });
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).json({ message: 'Failed to reject listing' });
  }
});

// Get all listings (admin view)
router.get('/admin/listings', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string || 'all',
      page: req.query.page ? Number(req.query.page) : 1,
      limit: 50,
    };
    
    const result = await storage.getListings(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching admin listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

export default router;
