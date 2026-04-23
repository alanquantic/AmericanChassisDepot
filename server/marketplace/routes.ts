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
import { 
  sendOfferNotification, 
  sendListingApprovalNotification,
  sendWelcomeEmail,
  sendOfferConfirmationToBuyer,
  sendNewListingNotificationToAdmin,
  sendMessageNotification,
  sendSellerApplicationEmail,
  sendSellerApprovalEmail,
  sendOfferResponseEmail,
  sendListingInquiryEmail,
} from './email.js';
import stripeRoutes from './stripe-routes.js';
import sitemapRoutes from './sitemap.js';
import { authRateLimiter, registerRateLimiter } from './rate-limiter.js';
import { auditUser, auditListing, auditOffer, auditOrder } from './audit-logger.js';
import * as cloudinaryService from './cloudinary.js';

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

router.post('/auth/register', registerRateLimiter, async (req: Request, res: Response) => {
  try {
    console.log('Registration attempt for:', req.body.email);
    const data = registerSchema.parse(req.body);
    console.log('Schema validated, registering user...');
    
    const user = await registerUser(data);
    console.log('User registered successfully:', user.id);
    
    // Audit log for registration (non-blocking)
    auditUser.create(req as AuthenticatedRequest, user.id, { email: user.email, role: user.role }).catch(e => console.error('Audit log error:', e));
    
    // Send welcome email to new user (non-blocking)
    const language = req.headers['accept-language']?.includes('es') ? 'es' : 'en';
    const userName = user.firstName || user.email.split('@')[0];
    sendWelcomeEmail(user.email, userName, language).catch(e => console.error('Welcome email error:', e));
    
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
    console.error('Registration error:', error.message, error.stack);
    if (error.message === 'Email already registered') {
      return res.status(400).json({ message: error.message });
    }
    // Return more specific error info in development
    const errorDetail = process.env.NODE_ENV === 'production' 
      ? 'Registration failed' 
      : `Registration failed: ${error.message}`;
    res.status(500).json({ message: errorDetail, error: error.message });
  }
});

// Login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/auth/login', authRateLimiter, async (req: Request, res: Response) => {
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

// Public inquiry on a listing (no auth required)
const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
  message: z.string().trim().min(1, 'Message is required'),
  language: z.enum(['en', 'es']).optional(),
});

router.post('/listings/:slug/inquire', async (req: Request, res: Response) => {
  try {
    const data = inquirySchema.parse(req.body);
    const listing = await storage.getListingBySlug(req.params.slug);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const language = data.language || 'en';

    await sendListingInquiryEmail(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
      },
      listing,
      language
    );

    res.json({ message: 'Inquiry sent successfully' });
  } catch (error: any) {
    console.error('Error sending listing inquiry:', error);
    if (error instanceof z.ZodError) {
      const first = error.errors[0];
      const field = first?.path?.join('.') || 'field';
      const msg = first?.message || 'Invalid data';
      return res.status(400).json({
        message: `${field}: ${msg}`,
        errors: error.errors,
      });
    }
    res.status(500).json({ message: 'Failed to send inquiry' });
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

// Update listing (owner or admin)
const updateListingSchema = z.object({
  title: z.string().min(1).optional(),
  titleEs: z.string().optional(),
  description: z.string().optional(),
  descriptionEs: z.string().optional(),
  chassisType: z.string().optional(),
  chassisSize: z.string().optional(),
  condition: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  quantity: z.number().min(1).optional(),
  quantityAvailable: z.number().min(0).optional(),
  pricePerUnit: z.coerce.number().min(0).optional(),
  priceNegotiable: z.boolean().optional(),
  minimumOrder: z.number().optional(),
  manufacturer: z.string().optional(),
  year: z.number().optional(),
  vin: z.string().optional(),
  primaryImageUrl: z.string().optional(),
  images: z.array(z.any()).optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  specs: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  locationDetails: z.string().optional(),
});

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
    
    const data = updateListingSchema.parse(req.body);
    const updatePayload: Record<string, any> = { ...data };
    if (data.pricePerUnit !== undefined) {
      updatePayload.pricePerUnit = data.pricePerUnit.toString();
    }
    const isAdmin = ['admin', 'super_admin'].includes(req.user!.role);
    if (!isAdmin) {
      delete updatePayload.featured;
      delete updatePayload.verified;
    } else {
      if (data.verified === true && !listing.verified) {
        updatePayload.verifiedBy = req.user!.id;
        updatePayload.verifiedAt = new Date();
      } else if (data.verified === false) {
        updatePayload.verifiedBy = null;
        updatePayload.verifiedAt = null;
      }
    }
    const updatedListing = await storage.updateListing(listingId, updatePayload);
    res.json({ message: 'Listing updated', listing: updatedListing });
  } catch (error: any) {
    console.error('Error updating listing:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
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
    
    // Verify user belongs to this conversation
    const conversation = await storage.getConversationById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (conversation.buyerId !== req.user!.id && conversation.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }
    
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
    
    // Verify user belongs to this conversation
    const conversationCheck = await storage.getConversationById(conversationId);
    if (!conversationCheck) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    if (conversationCheck.buyerId !== req.user!.id && conversationCheck.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this conversation' });
    }
    
    const newMessage = await storage.sendMessage({
      conversationId,
      senderId: req.user!.id,
      ...data,
    });
    
    // Get conversation details to send email notification
    try {
      const conversation = conversationCheck;
      if (conversation && conversation.listing) {
        // Determine who is the recipient (the other party in the conversation)
        const recipientId = conversation.buyerId === req.user!.id 
          ? conversation.sellerId 
          : conversation.buyerId;
        
        if (recipientId) {
          const recipient = await storage.getUserById(recipientId);
          if (recipient && recipient.email) {
            const senderName = req.user!.firstName || req.user!.companyName || req.user!.email.split('@')[0];
            const recipientName = recipient.firstName || recipient.companyName || recipient.email.split('@')[0];
            const recipientLanguage = recipient.preferredLanguage === 'es' ? 'es' : 'en';
            const messagePreview = data.message.length > 150 
              ? data.message.substring(0, 150) + '...' 
              : data.message;
            
            await sendMessageNotification(
              recipient.email,
              recipientName,
              senderName,
              req.user!.email,
              messagePreview,
              conversation.listing,
              recipientLanguage
            );
          }
        }
      }
    } catch (emailError) {
      console.error('Error sending message notification email:', emailError);
      // Don't fail the request if email fails
    }
    
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
    
    // Notify admins/seller
    await sendOfferNotification(offer, listing, req.user!);
    
    // Send confirmation email to buyer
    const buyerLanguage = req.user!.preferredLanguage === 'es' ? 'es' : 'en';
    const buyerName = req.user!.firstName || req.user!.email.split('@')[0];
    await sendOfferConfirmationToBuyer(req.user!.email, buyerName, offer, listing, buyerLanguage);
    
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
    
    // Get buyer and listing info for notifications
    if (!offer.buyerId || !offer.listingId) {
      return res.json({
        message: `Offer ${newStatus}`,
        offer: updatedOffer
      });
    }
    
    const buyer = await storage.getUserById(offer.buyerId);
    const listing = await storage.getListingById(offer.listingId);
    
    if (buyer && listing) {
      // Create notification for buyer
      await storage.createNotification({
        userId: buyer.id,
        type: `offer_${newStatus}`,
        category: 'offer',
        title: newStatus === 'accepted' ? 'Offer Accepted!' : 
               newStatus === 'rejected' ? 'Offer Rejected' : 'Counter Offer Received',
        titleEs: newStatus === 'accepted' ? '¡Oferta Aceptada!' : 
                 newStatus === 'rejected' ? 'Oferta Rechazada' : 'Contra Oferta Recibida',
        message: `Your offer on "${listing.title}" has been ${newStatus}`,
        messageEs: `Tu oferta en "${listing.titleEs || listing.title}" ha sido ${newStatus === 'accepted' ? 'aceptada' : newStatus === 'rejected' ? 'rechazada' : 'respondida con una contra oferta'}`,
        listingId: listing.id,
        offerId: offer.id,
        fromUserId: req.user!.id,
        actionUrl: `/marketplace/dashboard`,
      });
      
      // Send email notification to buyer
      const buyerName = buyer.firstName || buyer.companyName || buyer.email.split('@')[0];
      const buyerLanguage = buyer.preferredLanguage === 'es' ? 'es' : 'en';
      const counterOfferDetails = data.action === 'counter' && data.counterPrice ? {
        price: data.counterPrice,
        quantity: data.counterQuantity || offer.quantity,
      } : undefined;
      
      await sendOfferResponseEmail(
        buyer.email,
        buyerName,
        offer,
        listing,
        data.action as 'accepted' | 'rejected' | 'countered',
        counterOfferDetails,
        buyerLanguage
      );
    }
    
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
    
    // Audit log
    await auditListing.approve(req, listingId);
    
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
    
    // Audit log
    await auditListing.reject(req, listingId, reason);
    
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
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 20,
    };
    
    const result = await storage.getListings(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching admin listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// Update listing status (admin)
router.put('/admin/listings/:id/status', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const { status } = req.body;
    
    if (!['active', 'inactive', 'sold', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const listing = await storage.updateListingStatus(listingId, status);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    res.json({ message: 'Listing status updated', listing });
  } catch (error) {
    console.error('Error updating listing status:', error);
    res.status(500).json({ message: 'Failed to update listing status' });
  }
});

// Delete listing (admin)
router.delete('/admin/listings/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    
    await storage.deleteListing(listingId);
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Failed to delete listing' });
  }
});

// Get all offers (admin)
router.get('/admin/offers', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 20,
    };
    
    const result = await storage.getAllOffersAdmin(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching admin offers:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
});

// =============================================
// SUPER ADMIN - USER MANAGEMENT ROUTES
// =============================================

// Get all users (admin/super_admin)
router.get('/admin/users', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      role: req.query.role as string,
      status: req.query.status as 'all' | 'active' | 'suspended',
      search: req.query.search as string,
      sortBy: req.query.sortBy as any,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Math.min(Number(req.query.limit), 100) : 20,
    };
    
    const result = await storage.getAllUsers(filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user details (admin)
router.get('/admin/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await storage.getUserFullDetails(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Update user info (admin)
const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().optional(),
});

router.put('/admin/users/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const data = updateUserSchema.parse(req.body);
    
    const user = await storage.updateUserByAdmin(userId, data);
    
    // Audit log
    auditUser.update(req, userId, data);
    
    res.json({ message: 'User updated successfully', user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Change user role (super_admin only)
router.put('/admin/users/:id/role', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    
    // Prevent changing own role
    if (userId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }
    
    const user = await storage.updateUserRole(userId, role);
    
    // Audit log
    auditUser.roleChange(req, userId, role);
    
    res.json({ message: `User role changed to ${role}`, user });
  } catch (error: any) {
    console.error('Error changing user role:', error);
    res.status(500).json({ message: error.message || 'Failed to change user role' });
  }
});

// Suspend user (admin)
router.put('/admin/users/:id/suspend', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Suspension reason is required' });
    }
    
    // Prevent suspending self or super_admin
    if (userId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot suspend yourself' });
    }
    
    const targetUser = await storage.getUserById(userId);
    if (targetUser?.role === 'super_admin' && req.user!.role !== 'super_admin') {
      return res.status(403).json({ message: 'Cannot suspend a super admin' });
    }
    
    const user = await storage.suspendUser(userId, reason);
    
    // Audit log
    auditUser.suspend(req, userId, reason);
    
    res.json({ message: 'User suspended', user });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

// Activate user (admin)
router.put('/admin/users/:id/activate', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const user = await storage.activateUser(userId);
    
    // Audit log
    auditUser.activate(req, userId);
    
    res.json({ message: 'User activated', user });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ message: 'Failed to activate user' });
  }
});

// Delete user (super_admin only)
router.delete('/admin/users/:id', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    
    // Prevent deleting self
    if (userId === req.user!.id) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }
    
    // Prevent deleting other super_admins
    const targetUser = await storage.getUserById(userId);
    if (targetUser?.role === 'super_admin') {
      return res.status(403).json({ message: 'Cannot delete a super admin' });
    }
    
    await storage.deleteUser(userId);
    
    // Audit log
    auditUser.delete(req, userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message || 'Failed to delete user' });
  }
});

// =============================================
// BULK IMPORT ROUTE (Admin only)
// =============================================

const bulkListingItemSchema = z.object({
  title: z.string().min(3),
  titleEs: z.string().optional(),
  description: z.string().optional(),
  descriptionEs: z.string().optional(),
  chassisType: z.string().min(1),
  chassisSize: z.string().min(1),
  condition: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().optional(),
  quantity: z.number().int().min(1),
  quantityAvailable: z.number().int().min(0).optional(),
  pricePerUnit: z.number().min(0),
  priceNegotiable: z.boolean().optional(),
  minimumOrder: z.number().int().min(1).optional(),
  manufacturer: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  vin: z.string().optional(),
  primaryImageUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'pending', 'draft']).optional(),
});

const bulkImportSchema = z.object({
  listings: z.array(bulkListingItemSchema).min(1).max(5000),
  sellerId: z.number().int().positive(),
});

router.post('/admin/bulk-import', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = bulkImportSchema.parse(req.body);

    const seller = await storage.getUserById(data.sellerId);
    if (!seller) {
      return res.status(400).json({ message: `Seller with ID ${data.sellerId} not found` });
    }

    const items = data.listings.map(item => ({
      ...item,
      sellerId: data.sellerId,
    }));

    const startTime = Date.now();
    const result = await storage.createListingsBatch(items);
    const elapsed = Date.now() - startTime;

    console.log(`[Bulk Import] ${result.inserted} listings inserted in ${elapsed}ms by admin ${req.user!.id}`);

    res.json({
      message: `Bulk import completed`,
      inserted: result.inserted,
      errors: result.errors,
      totalRequested: data.listings.length,
      elapsedMs: elapsed,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
      });
    }
    console.error('Bulk import error:', error);
    res.status(500).json({ message: error.message || 'Bulk import failed' });
  }
});

// =============================================
// SELLER MANAGEMENT ROUTES (Enhanced)
// =============================================

// Get seller's listings with stats
router.get('/seller/listings/stats', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const filters = {
      status: req.query.status as string,
      search: req.query.search as string,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };
    
    const result = await storage.getSellerListingsWithStats(req.user!.id, filters);
    res.json(result);
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    res.status(500).json({ message: 'Failed to fetch listings' });
  }
});

// Get listing for editing (owner or admin)
router.get('/seller/listings/:id/edit', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Get images
    const images = await storage.getListingImages(listingId);
    
    res.json({ ...listing, images });
  } catch (error) {
    console.error('Error fetching listing for edit:', error);
    res.status(500).json({ message: 'Failed to fetch listing' });
  }
});

// =============================================
// LISTING IMAGES ROUTES
// =============================================

// Get listing images
router.get('/listings/:id/images', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const images = await storage.getListingImages(listingId);
    res.json(images);
  } catch (error) {
    console.error('Error fetching listing images:', error);
    res.status(500).json({ message: 'Failed to fetch images' });
  }
});

// Add image to listing
const addImageSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  altText: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

router.post('/listings/:id/images', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const data = addImageSchema.parse(req.body);
    const image = await storage.addListingImage(listingId, data);
    
    res.status(201).json({ message: 'Image added', image });
  } catch (error: any) {
    console.error('Error adding image:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: 'Failed to add image' });
  }
});

// Delete image from listing
router.delete('/listings/:listingId/images/:imageId', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.listingId);
    const imageId = Number(req.params.imageId);
    
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await storage.deleteListingImage(imageId);
    res.json({ message: 'Image deleted' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: error.message || 'Failed to delete image' });
  }
});

// Set primary image
router.put('/listings/:listingId/images/:imageId/primary', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.listingId);
    const imageId = Number(req.params.imageId);
    
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const image = await storage.setListingPrimaryImage(listingId, imageId);
    res.json({ message: 'Primary image updated', image });
  } catch (error) {
    console.error('Error setting primary image:', error);
    res.status(500).json({ message: 'Failed to set primary image' });
  }
});

// Reorder images
router.put('/listings/:id/images/reorder', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const listingId = Number(req.params.id);
    const { imageIds } = req.body;
    
    if (!Array.isArray(imageIds)) {
      return res.status(400).json({ message: 'imageIds must be an array' });
    }
    
    const listing = await storage.getListingById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership or admin
    if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await storage.reorderListingImages(listingId, imageIds);
    res.json({ message: 'Images reordered' });
  } catch (error) {
    console.error('Error reordering images:', error);
    res.status(500).json({ message: 'Failed to reorder images' });
  }
});

// =============================================
// IMAGE UPLOAD ROUTES (Cloudinary)
// =============================================

// Check if Cloudinary is configured
router.get('/upload/status', authenticateToken, requireSeller, async (_req: AuthenticatedRequest, res: Response) => {
  res.json({ 
    configured: cloudinaryService.isCloudinaryConfigured(),
    message: cloudinaryService.isCloudinaryConfigured() 
      ? 'Image upload is available' 
      : 'Image upload is not configured. Contact admin.'
  });
});

// Upload image (base64)
const uploadSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  listingId: z.number().optional(),
  isPrimary: z.boolean().optional(),
  altText: z.string().optional(),
});

router.post('/upload/image', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Image upload is not configured' });
    }

    const data = uploadSchema.parse(req.body);
    
    // Check listing ownership if listingId provided
    if (data.listingId) {
      const listing = await storage.getListingById(data.listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadBase64Image(data.image, {
      folder: `marketplace/listings/${req.user!.id}`,
    });

    if (!uploadResult.success) {
      return res.status(500).json({ message: uploadResult.error || 'Upload failed' });
    }

    // If listingId provided, save to database
    let savedImage = null;
    if (data.listingId) {
      savedImage = await storage.addListingImage(data.listingId, {
        url: uploadResult.url!,
        thumbnailUrl: uploadResult.thumbnailUrl,
        altText: data.altText,
        isPrimary: data.isPrimary,
      });
    }

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        ...(savedImage && { id: savedImage.id }),
      },
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid data', errors: error.errors });
    }
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Upload image from URL
router.post('/upload/image-url', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Image upload is not configured' });
    }

    const { url, listingId, isPrimary, altText } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Check listing ownership if listingId provided
    if (listingId) {
      const listing = await storage.getListingById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      if (listing.sellerId !== req.user!.id && !['admin', 'super_admin'].includes(req.user!.role)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinaryService.uploadFromUrl(url, {
      folder: `marketplace/listings/${req.user!.id}`,
    });

    if (!uploadResult.success) {
      return res.status(500).json({ message: uploadResult.error || 'Upload failed' });
    }

    // If listingId provided, save to database
    let savedImage = null;
    if (listingId) {
      savedImage = await storage.addListingImage(listingId, {
        url: uploadResult.url!,
        thumbnailUrl: uploadResult.thumbnailUrl,
        altText,
        isPrimary,
      });
    }

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        url: uploadResult.url,
        thumbnailUrl: uploadResult.thumbnailUrl,
        publicId: uploadResult.publicId,
        ...(savedImage && { id: savedImage.id }),
      },
    });
  } catch (error: any) {
    console.error('Error uploading image from URL:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

// Get signed upload parameters for direct browser upload
router.get('/upload/signed-params', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Image upload is not configured' });
    }

    const params = cloudinaryService.generateSignedUploadParams({
      folder: `marketplace/listings/${req.user!.id}`,
    });

    if (!params) {
      return res.status(503).json({ message: 'Could not generate upload parameters' });
    }

    res.json(params);
  } catch (error: any) {
    console.error('Error generating upload params:', error);
    res.status(500).json({ message: 'Failed to generate upload parameters' });
  }
});

// Delete uploaded image from Cloudinary
router.delete('/upload/image/:publicId(*)', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!cloudinaryService.isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Image upload is not configured' });
    }

    const publicId = req.params.publicId;
    
    if (!publicId) {
      return res.status(400).json({ message: 'Public ID is required' });
    }

    // Verify the publicId belongs to the user's folder (security check)
    const userFolder = `marketplace/listings/${req.user!.id}`;
    if (!publicId.startsWith(userFolder) && !['admin', 'super_admin'].includes(req.user!.role)) {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }

    const result = await cloudinaryService.deleteImage(publicId);

    if (!result.success) {
      return res.status(500).json({ message: result.error || 'Delete failed' });
    }

    res.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: error.message || 'Delete failed' });
  }
});

export default router;
