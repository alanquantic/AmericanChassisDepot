import { Router, Request, Response } from 'express';
import { authenticateToken, requireSeller, requireAdmin, AuthenticatedRequest } from './auth.js';
import { 
  isStripeAvailable,
  stripe,
  createConnectedAccount,
  getConnectedAccountStatus,
  createCheckoutSession,
  handleCheckoutComplete,
  handlePaymentFailed,
  createRefund
} from './stripe.js';

const router = Router();

// Check if Stripe is available
router.use((req, res, next) => {
  if (!isStripeAvailable()) {
    return res.status(503).json({ 
      message: 'Payment service is currently unavailable',
      error: 'STRIPE_NOT_CONFIGURED'
    });
  }
  next();
});

// =============================================
// CONNECTED ACCOUNTS (for sellers)
// =============================================

// Start Stripe Connect onboarding
router.post('/connect/onboard', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await createConnectedAccount(req.user!.id);
    res.json({ 
      message: 'Stripe Connect onboarding started',
      url: result.url,
      accountId: result.accountId
    });
  } catch (error: any) {
    console.error('Connect onboarding error:', error);
    res.status(500).json({ message: error.message || 'Failed to start onboarding' });
  }
});

// Get connected account status
router.get('/connect/status', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = await getConnectedAccountStatus(req.user!.id);
    res.json(status);
  } catch (error: any) {
    console.error('Connect status error:', error);
    res.status(500).json({ message: 'Failed to get account status' });
  }
});

// Create dashboard link for connected account
router.get('/connect/dashboard', authenticateToken, requireSeller, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = await getConnectedAccountStatus(req.user!.id);
    
    if (!status.hasAccount || !status.accountId) {
      return res.status(400).json({ message: 'No connected account found' });
    }

    const loginLink = await stripe!.accounts.createLoginLink(status.accountId);
    res.json({ url: loginLink.url });
  } catch (error: any) {
    console.error('Dashboard link error:', error);
    res.status(500).json({ message: 'Failed to create dashboard link' });
  }
});

// =============================================
// CHECKOUT
// =============================================

// Create checkout session for an accepted offer
router.post('/checkout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { offerId } = req.body;

    if (!offerId) {
      return res.status(400).json({ message: 'Offer ID required' });
    }

    const lang = req.headers['accept-language']?.includes('es') ? 'es' : 'en';
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';

    const checkoutUrl = await createCheckoutSession({
      offerId: Number(offerId),
      buyerId: req.user!.id,
      successUrl: `${baseUrl}/${lang}/marketplace/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/${lang}/marketplace/checkout/cancel`,
    });

    res.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message || 'Failed to create checkout' });
  }
});

// Get checkout session status
router.get('/checkout/:sessionId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const session = await stripe!.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['payment_intent', 'line_items'],
    });

    res.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email,
    });
  } catch (error: any) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Failed to get checkout session' });
  }
});

// =============================================
// REFUNDS (admin only)
// =============================================

router.post('/refund', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId, reason } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID required' });
    }

    const refund = await createRefund(Number(orderId), reason);
    res.json({ 
      message: 'Refund processed',
      refundId: refund?.id
    });
  } catch (error: any) {
    console.error('Refund error:', error);
    res.status(500).json({ message: error.message || 'Failed to process refund' });
  }
});

// =============================================
// WEBHOOKS
// =============================================

// Stripe webhook handler (no auth - verified by signature)
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).json({ message: 'Missing signature or webhook secret' });
  }

  let event: any;

  try {
    // Note: For webhooks, the raw body is needed
    // This assumes express.raw() middleware is used for this route
    event = stripe!.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'account.updated':
        // Handle connected account updates
        console.log('Connected account updated:', event.data.object.id);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 200 to acknowledge receipt (Stripe will retry otherwise)
  }

  res.json({ received: true });
});

export default router;
