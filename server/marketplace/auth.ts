import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { eq, and } from 'drizzle-orm';
import { getMarketplaceDb } from './db.js';
import { marketplaceUsers } from '../../shared/marketplace-schema.js';

// JWT Configuration
if (!process.env.JWT_SECRET) {
  console.error('⚠️ CRITICAL: JWT_SECRET environment variable is not set. Authentication will not work securely.');
}
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  const crypto = require('crypto');
  const generated = crypto.randomBytes(64).toString('hex');
  console.warn('⚠️ Using randomly generated JWT_SECRET. Tokens will be invalidated on restart. Set JWT_SECRET in environment.');
  return generated;
})();
const JWT_ACCESS_EXPIRY: SignOptions['expiresIn'] = (process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m') as SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRY: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d') as SignOptions['expiresIn'];

// Types
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    preferredLanguage?: string;
  };
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token generation
export function generateAccessToken(user: { id: number; email: string; role: string }): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'access'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRY });
}

export function generateRefreshToken(user: { id: number; email: string; role: string }): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    type: 'refresh'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const payload = verifyToken(token);
  
  if (!payload || payload.type !== 'access') {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  try {
    const db = getMarketplaceDb();
    const [user] = await db
      .select({
        id: marketplaceUsers.id,
        email: marketplaceUsers.email,
        role: marketplaceUsers.role,
        firstName: marketplaceUsers.firstName,
        lastName: marketplaceUsers.lastName,
        companyName: marketplaceUsers.companyName,
        isActive: marketplaceUsers.isActive,
        isSuspended: marketplaceUsers.isSuspended,
        preferredLanguage: marketplaceUsers.preferredLanguage,
      })
      .from(marketplaceUsers)
      .where(eq(marketplaceUsers.id, payload.userId))
      .limit(1);

    if (!user || !user.isActive || user.isSuspended) {
      return res.status(403).json({ message: 'Account is not active' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role || 'buyer',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      companyName: user.companyName || undefined,
      preferredLanguage: user.preferredLanguage || undefined,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
}

// Optional authentication (doesn't fail if no token)
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  const payload = verifyToken(token);
  
  if (!payload || payload.type !== 'access') {
    return next();
  }

  try {
    const db = getMarketplaceDb();
    const [user] = await db
      .select({
        id: marketplaceUsers.id,
        email: marketplaceUsers.email,
        role: marketplaceUsers.role,
        firstName: marketplaceUsers.firstName,
        lastName: marketplaceUsers.lastName,
        companyName: marketplaceUsers.companyName,
      })
      .from(marketplaceUsers)
      .where(eq(marketplaceUsers.id, payload.userId))
      .limit(1);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role || 'buyer',
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        companyName: user.companyName || undefined,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
}

// Role-based authorization middleware
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}

// Specific role checks
export const requireBuyer = requireRole('buyer', 'seller', 'admin', 'super_admin');
export const requireSeller = requireRole('seller', 'admin', 'super_admin');
export const requireAdmin = requireRole('admin', 'super_admin');
export const requireSuperAdmin = requireRole('super_admin');

// User registration
export async function registerUser(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  role?: string;
}) {
  const db = getMarketplaceDb();
  
  // Check if email already exists
  const [existingUser] = await db
    .select({ id: marketplaceUsers.id })
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.email, data.email.toLowerCase()))
    .limit(1);

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  // Create user
  const [newUser] = await db
    .insert(marketplaceUsers)
    .values({
      email: data.email.toLowerCase(),
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      phone: data.phone,
      role: data.role || 'buyer',
      emailVerified: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: marketplaceUsers.id,
      email: marketplaceUsers.email,
      role: marketplaceUsers.role,
      firstName: marketplaceUsers.firstName,
      lastName: marketplaceUsers.lastName,
    });

  return newUser;
}

// User login
export async function loginUser(email: string, password: string) {
  const db = getMarketplaceDb();
  
  const [user] = await db
    .select()
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  if (user.isSuspended) {
    throw new Error('Account is suspended');
  }

  // Check if account is locked
  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    throw new Error('Account is temporarily locked. Please try again later.');
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    // Increment failed login attempts
    await db
      .update(marketplaceUsers)
      .set({ 
        failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
        // Lock account after 5 failed attempts for 15 minutes
        lockedUntil: (user.failedLoginAttempts || 0) >= 4 
          ? new Date(Date.now() + 15 * 60 * 1000) 
          : null
      })
      .where(eq(marketplaceUsers.id, user.id));

    throw new Error('Invalid email or password');
  }

  // Reset failed attempts and update last login
  await db
    .update(marketplaceUsers)
    .set({ 
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
      loginCount: (user.loginCount || 0) + 1,
    })
    .where(eq(marketplaceUsers.id, user.id));

  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role || 'buyer'
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    email: user.email,
    role: user.role || 'buyer'
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      emailVerified: user.emailVerified,
      sellerVerified: user.sellerVerified,
      preferredLanguage: user.preferredLanguage,
    },
    accessToken,
    refreshToken
  };
}

// Refresh access token
export async function refreshAccessToken(refreshToken: string) {
  const payload = verifyToken(refreshToken);
  
  if (!payload || payload.type !== 'refresh') {
    throw new Error('Invalid refresh token');
  }

  const db = getMarketplaceDb();
  const [user] = await db
    .select({
      id: marketplaceUsers.id,
      email: marketplaceUsers.email,
      role: marketplaceUsers.role,
      isActive: marketplaceUsers.isActive,
      isSuspended: marketplaceUsers.isSuspended,
    })
    .from(marketplaceUsers)
    .where(eq(marketplaceUsers.id, payload.userId))
    .limit(1);

  if (!user || !user.isActive || user.isSuspended) {
    throw new Error('Account is not active');
  }

  const newAccessToken = generateAccessToken({
    id: user.id,
    email: user.email,
    role: user.role || 'buyer'
  });

  return { accessToken: newAccessToken };
}
