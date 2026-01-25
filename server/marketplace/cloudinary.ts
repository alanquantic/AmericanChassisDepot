/**
 * Cloudinary Image Upload Service
 * 
 * Handles image uploads, transformations, and management for marketplace listings.
 * 
 * Required environment variables:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Initialize Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('[Cloudinary] Configured successfully');
} else {
  console.warn('[Cloudinary] Missing configuration - image uploads will be disabled');
}

// Types
export interface UploadResult {
  success: boolean;
  url?: string;
  thumbnailUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

export interface CloudinaryOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

/**
 * Check if Cloudinary is properly configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!(cloudName && apiKey && apiSecret);
}

/**
 * Upload a base64 image to Cloudinary
 */
export async function uploadBase64Image(
  base64Data: string,
  options: CloudinaryOptions = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: 'Cloudinary is not configured' };
  }

  try {
    // Ensure base64 has proper data URI prefix
    let dataUri = base64Data;
    if (!base64Data.startsWith('data:')) {
      dataUri = `data:image/jpeg;base64,${base64Data}`;
    }

    const uploadOptions: any = {
      folder: options.folder || 'marketplace/listings',
      resource_type: options.resourceType || 'image',
      // Optimize on upload: resize large images, convert to WebP, compress
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' }, // Max 1920px, maintain aspect ratio
        { quality: 'auto:good' }, // Smart compression
        { fetch_format: 'webp' }, // Force WebP for smaller file size
      ],
      // Additional optimizations
      eager: [
        // Pre-generate thumbnail
        { width: 400, height: 300, crop: 'fill', quality: 'auto:good', fetch_format: 'webp' },
      ],
      eager_async: true,
    };

    if (options.transformation) {
      uploadOptions.transformation.push(options.transformation);
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, uploadOptions);

    // Generate thumbnail URL (WebP format)
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 400, height: 300, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'webp' },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('[Cloudinary] Upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Upload image from URL to Cloudinary
 */
export async function uploadFromUrl(
  imageUrl: string,
  options: CloudinaryOptions = {}
): Promise<UploadResult> {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: 'Cloudinary is not configured' };
  }

  try {
    const uploadOptions: any = {
      folder: options.folder || 'marketplace/listings',
      resource_type: options.resourceType || 'image',
      // Optimize on upload: resize large images, convert to WebP, compress
      transformation: [
        { width: 1920, height: 1920, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'webp' },
      ],
      eager: [
        { width: 400, height: 300, crop: 'fill', quality: 'auto:good', fetch_format: 'webp' },
      ],
      eager_async: true,
    };

    const result: UploadApiResponse = await cloudinary.uploader.upload(imageUrl, uploadOptions);

    // Generate thumbnail URL (WebP format)
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 400, height: 300, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'webp' },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      thumbnailUrl,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error: any) {
    console.error('[Cloudinary] Upload from URL error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: 'Cloudinary is not configured' };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === 'ok' };
  } catch (error: any) {
    console.error('[Cloudinary] Delete error:', error);
    return { success: false, error: error.message || 'Delete failed' };
  }
}

/**
 * Generate a signed upload URL for direct client uploads
 * This allows uploading directly from the browser to Cloudinary
 */
export function generateSignedUploadParams(options: {
  folder?: string;
  maxFileSize?: number; // in bytes
}): { 
  timestamp: number; 
  signature: string; 
  apiKey: string;
  cloudName: string;
  folder: string;
} | null {
  if (!isCloudinaryConfigured()) {
    return null;
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = options.folder || 'marketplace/listings';
  
  const paramsToSign = {
    timestamp,
    folder,
    upload_preset: 'marketplace_unsigned', // Create this preset in Cloudinary dashboard
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret!);

  return {
    timestamp,
    signature,
    apiKey: apiKey!,
    cloudName: cloudName!,
    folder,
  };
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  } = {}
): string {
  if (!isCloudinaryConfigured()) {
    return '';
  }

  const transformations: any[] = [];
  
  if (options.width || options.height) {
    const t: any = {};
    if (options.width) t.width = options.width;
    if (options.height) t.height = options.height;
    if (options.crop) t.crop = options.crop;
    transformations.push(t);
  }

  transformations.push({ quality: options.quality || 'auto:good' });
  transformations.push({ fetch_format: 'webp' }); // Always use WebP for smaller files

  return cloudinary.url(publicId, { transformation: transformations });
}

export default {
  isCloudinaryConfigured,
  uploadBase64Image,
  uploadFromUrl,
  deleteImage,
  generateSignedUploadParams,
  getOptimizedUrl,
};
