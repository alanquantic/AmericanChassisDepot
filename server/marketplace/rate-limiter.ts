/**
 * Rate Limiter Middleware for Auth Endpoints
 * 
 * Uses in-memory sliding window algorithm for rate limiting.
 * In production, consider using Redis for distributed rate limiting.
 */

import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

// In-memory store (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of Array.from(rateLimitStore.entries())) {
    if (entry.blockedUntil && entry.blockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (now - entry.firstRequest > 60000) { // 1 minute window
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  windowMs?: number;      // Time window in milliseconds
  maxRequests?: number;   // Max requests per window
  blockDurationMs?: number; // How long to block after exceeding limit
  keyGenerator?: (req: Request) => string;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute
    maxRequests = 5,
    blockDurationMs = 15 * 60 * 1000, // 15 minutes
    keyGenerator = (req) => {
      // Use IP + user agent for more accurate limiting
      const ip = req.ip || 
                 req.headers['x-forwarded-for']?.toString().split(',')[0] || 
                 req.socket.remoteAddress || 
                 'unknown';
      return `${ip}:${req.path}`;
    },
    message = 'Too many requests. Please try again later.',
    skipSuccessfulRequests = false,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockedUntil) {
      if (now < entry.blockedUntil) {
        const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
        res.set('Retry-After', String(retryAfter));
        res.set('X-RateLimit-Limit', String(maxRequests));
        res.set('X-RateLimit-Remaining', '0');
        res.set('X-RateLimit-Reset', String(Math.ceil(entry.blockedUntil / 1000)));
        
        return res.status(429).json({
          error: 'Too Many Requests',
          message,
          retryAfter,
        });
      } else {
        // Block expired, reset
        rateLimitStore.delete(key);
        entry = undefined;
      }
    }

    // Initialize or update entry
    if (!entry || now - entry.firstRequest > windowMs) {
      entry = {
        count: 1,
        firstRequest: now,
        blocked: false,
      };
    } else {
      entry.count++;
    }

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + blockDurationMs;
      rateLimitStore.set(key, entry);

      const retryAfter = Math.ceil(blockDurationMs / 1000);
      res.set('Retry-After', String(retryAfter));
      res.set('X-RateLimit-Limit', String(maxRequests));
      res.set('X-RateLimit-Remaining', '0');
      res.set('X-RateLimit-Reset', String(Math.ceil(entry.blockedUntil / 1000)));

      // Log the rate limit event
      console.warn(`[Rate Limit] IP blocked: ${key}, attempts: ${entry.count}`);

      return res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter,
      });
    }

    // Set rate limit headers
    const remaining = Math.max(0, maxRequests - entry.count);
    res.set('X-RateLimit-Limit', String(maxRequests));
    res.set('X-RateLimit-Remaining', String(remaining));
    res.set('X-RateLimit-Reset', String(Math.ceil((entry.firstRequest + windowMs) / 1000)));

    rateLimitStore.set(key, entry);

    // Option to not count successful requests
    if (skipSuccessfulRequests) {
      const originalJson = res.json.bind(res);
      res.json = function(body: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const currentEntry = rateLimitStore.get(key);
          if (currentEntry && currentEntry.count > 0) {
            currentEntry.count--;
            rateLimitStore.set(key, currentEntry);
          }
        }
        return originalJson(body);
      };
    }

    next();
  };
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,       // 1 minute window
  maxRequests: 5,            // 5 attempts
  blockDurationMs: 15 * 60 * 1000, // 15 minute block
  message: 'Too many login attempts. Please try again in 15 minutes.',
  keyGenerator: (req) => {
    const ip = req.ip || 
               req.headers['x-forwarded-for']?.toString().split(',')[0] || 
               'unknown';
    // Include email if provided to track by account too
    const email = req.body?.email?.toLowerCase() || '';
    return `auth:${ip}:${email}`;
  },
});

export const registerRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  maxRequests: 3,            // 3 registrations per hour
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
  message: 'Too many registration attempts. Please try again in 1 hour.',
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,  // 1 hour window
  maxRequests: 3,            // 3 resets per hour
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
  message: 'Too many password reset attempts. Please try again in 1 hour.',
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,       // 1 minute window
  maxRequests: 60,           // 60 requests per minute
  blockDurationMs: 5 * 60 * 1000, // 5 minute block
  message: 'API rate limit exceeded. Please slow down.',
});

export default createRateLimiter;
