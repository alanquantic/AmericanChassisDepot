/**
 * Audit Logger for Administrative Actions
 * 
 * Tracks all administrative actions for compliance and security.
 * Stores logs in the database with full context.
 */

import { Request } from 'express';
import { getMarketplaceDb } from './db.js';
import { marketplaceAuditLogs } from '../../shared/marketplace-schema.js';
import { AuthenticatedRequest } from './auth.js';

export type AuditAction = 
  // User management
  | 'user.create'
  | 'user.update'
  | 'user.delete'
  | 'user.suspend'
  | 'user.activate'
  | 'user.role_change'
  | 'user.verify_seller'
  // Listing management
  | 'listing.create'
  | 'listing.update'
  | 'listing.delete'
  | 'listing.approve'
  | 'listing.reject'
  | 'listing.feature'
  | 'listing.unfeature'
  // Offer management
  | 'offer.approve'
  | 'offer.reject'
  | 'offer.counter'
  // Order management
  | 'order.create'
  | 'order.update'
  | 'order.refund'
  | 'order.cancel'
  // Financial
  | 'payment.process'
  | 'payment.refund'
  | 'payout.initiate'
  // System
  | 'settings.update'
  | 'system.maintenance'
  | 'export.data'
  | 'import.data';

export type AuditSeverity = 'info' | 'warning' | 'critical';

interface AuditLogData {
  action: AuditAction;
  entityType: 'user' | 'listing' | 'offer' | 'order' | 'payment' | 'system';
  entityId?: number | string;
  previousValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
  severity?: AuditSeverity;
  reason?: string;
}

/**
 * Get client IP from request, handling proxies
 */
function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    return Array.isArray(forwardedFor) 
      ? forwardedFor[0] 
      : forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(
  req: AuthenticatedRequest,
  data: AuditLogData
): Promise<void> {
  try {
    const db = getMarketplaceDb();
    
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    await db.insert(marketplaceAuditLogs).values({
      userId: userId || null,
      userEmail: userEmail || 'system',
      userRole: userRole || 'system',
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId?.toString() || null,
      previousValue: data.previousValue ? JSON.stringify(data.previousValue) : null,
      newValue: data.newValue ? JSON.stringify(data.newValue) : null,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      ipAddress,
      userAgent,
      severity: data.severity || 'info',
      reason: data.reason || null,
      createdAt: new Date(),
    });

    // Log critical actions to console as well
    if (data.severity === 'critical') {
      console.log(`[AUDIT CRITICAL] ${data.action} by ${userEmail} on ${data.entityType}:${data.entityId}`);
    }
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error('[Audit Logger] Failed to create audit log:', error);
  }
}

/**
 * Helper for logging user management actions
 */
export const auditUser = {
  create: (req: AuthenticatedRequest, userId: number, userData: any) =>
    createAuditLog(req, {
      action: 'user.create',
      entityType: 'user',
      entityId: userId,
      newValue: { email: userData.email, role: userData.role },
      severity: 'info',
    }),

  update: (req: AuthenticatedRequest, userId: number, changes: any) =>
    createAuditLog(req, {
      action: 'user.update',
      entityType: 'user',
      entityId: userId,
      newValue: changes,
      severity: 'info',
    }),

  delete: (req: AuthenticatedRequest, userId: number) =>
    createAuditLog(req, {
      action: 'user.delete',
      entityType: 'user',
      entityId: userId,
      severity: 'critical',
    }),

  suspend: (req: AuthenticatedRequest, userId: number, reason: string) =>
    createAuditLog(req, {
      action: 'user.suspend',
      entityType: 'user',
      entityId: userId,
      severity: 'warning',
      reason,
    }),

  activate: (req: AuthenticatedRequest, userId: number) =>
    createAuditLog(req, {
      action: 'user.activate',
      entityType: 'user',
      entityId: userId,
      severity: 'info',
    }),

  roleChange: (req: AuthenticatedRequest, userId: number, newRole: string, reason?: string) =>
    createAuditLog(req, {
      action: 'user.role_change',
      entityType: 'user',
      entityId: userId,
      newValue: { role: newRole },
      severity: 'warning',
      reason,
    }),

  verifySeller: (req: AuthenticatedRequest, userId: number) =>
    createAuditLog(req, {
      action: 'user.verify_seller',
      entityType: 'user',
      entityId: userId,
      severity: 'info',
    }),
};

/**
 * Helper for logging listing management actions
 */
export const auditListing = {
  create: (req: AuthenticatedRequest, listingId: number, listingData: any) =>
    createAuditLog(req, {
      action: 'listing.create',
      entityType: 'listing',
      entityId: listingId,
      newValue: { title: listingData.title, price: listingData.pricePerUnit },
      severity: 'info',
    }),

  update: (req: AuthenticatedRequest, listingId: number, changes: any) =>
    createAuditLog(req, {
      action: 'listing.update',
      entityType: 'listing',
      entityId: listingId,
      newValue: changes,
      severity: 'info',
    }),

  delete: (req: AuthenticatedRequest, listingId: number, reason?: string) =>
    createAuditLog(req, {
      action: 'listing.delete',
      entityType: 'listing',
      entityId: listingId,
      severity: 'warning',
      reason,
    }),

  approve: (req: AuthenticatedRequest, listingId: number) =>
    createAuditLog(req, {
      action: 'listing.approve',
      entityType: 'listing',
      entityId: listingId,
      severity: 'info',
    }),

  reject: (req: AuthenticatedRequest, listingId: number, reason: string) =>
    createAuditLog(req, {
      action: 'listing.reject',
      entityType: 'listing',
      entityId: listingId,
      severity: 'info',
      reason,
    }),

  feature: (req: AuthenticatedRequest, listingId: number) =>
    createAuditLog(req, {
      action: 'listing.feature',
      entityType: 'listing',
      entityId: listingId,
      severity: 'info',
    }),
};

/**
 * Helper for logging offer actions
 */
export const auditOffer = {
  approve: (req: AuthenticatedRequest, offerId: number) =>
    createAuditLog(req, {
      action: 'offer.approve',
      entityType: 'offer',
      entityId: offerId,
      severity: 'info',
    }),

  reject: (req: AuthenticatedRequest, offerId: number, reason?: string) =>
    createAuditLog(req, {
      action: 'offer.reject',
      entityType: 'offer',
      entityId: offerId,
      severity: 'info',
      reason,
    }),

  counter: (req: AuthenticatedRequest, offerId: number, counterAmount: number) =>
    createAuditLog(req, {
      action: 'offer.counter',
      entityType: 'offer',
      entityId: offerId,
      newValue: { counterAmount },
      severity: 'info',
    }),
};

/**
 * Helper for logging order actions
 */
export const auditOrder = {
  create: (req: AuthenticatedRequest, orderId: number, orderData: any) =>
    createAuditLog(req, {
      action: 'order.create',
      entityType: 'order',
      entityId: orderId,
      newValue: { total: orderData.totalAmount },
      severity: 'info',
    }),

  refund: (req: AuthenticatedRequest, orderId: number, amount: number, reason: string) =>
    createAuditLog(req, {
      action: 'order.refund',
      entityType: 'order',
      entityId: orderId,
      newValue: { refundAmount: amount },
      severity: 'warning',
      reason,
    }),

  cancel: (req: AuthenticatedRequest, orderId: number, reason: string) =>
    createAuditLog(req, {
      action: 'order.cancel',
      entityType: 'order',
      entityId: orderId,
      severity: 'warning',
      reason,
    }),
};

/**
 * Helper for logging payment actions
 */
export const auditPayment = {
  process: (req: AuthenticatedRequest, paymentId: string, amount: number) =>
    createAuditLog(req, {
      action: 'payment.process',
      entityType: 'payment',
      entityId: paymentId,
      newValue: { amount },
      severity: 'info',
    }),

  refund: (req: AuthenticatedRequest, paymentId: string, amount: number, reason: string) =>
    createAuditLog(req, {
      action: 'payment.refund',
      entityType: 'payment',
      entityId: paymentId,
      newValue: { refundAmount: amount },
      severity: 'critical',
      reason,
    }),
};

/**
 * Helper for logging system actions
 */
export const auditSystem = {
  settingsUpdate: (req: AuthenticatedRequest, changes: any) =>
    createAuditLog(req, {
      action: 'settings.update',
      entityType: 'system',
      newValue: changes,
      severity: 'warning',
    }),

  dataExport: (req: AuthenticatedRequest, exportType: string, recordCount: number) =>
    createAuditLog(req, {
      action: 'export.data',
      entityType: 'system',
      metadata: { exportType, recordCount },
      severity: 'warning',
    }),
};

export default createAuditLog;
