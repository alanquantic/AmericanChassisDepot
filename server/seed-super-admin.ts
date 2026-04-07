/**
 * Seed Script: Create Super Admin for American Chassis Depot
 * 
 * Run this script to create the initial super_admin user.
 * 
 * Usage:
 *   npx tsx server/seed-super-admin.ts
 * 
 * Or add to package.json scripts:
 *   "seed:admin": "tsx server/seed-super-admin.ts"
 */

import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { marketplaceUsers } from '../shared/marketplace-schema.js';

// Configuration via environment variables
const ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || 'admin@americanchassis.com',
  password: process.env.ADMIN_PASSWORD || '',
  firstName: 'American',
  lastName: 'Chassis',
  companyName: 'AMERICAN CHASSIS DEPOT',
  phone: '',
  city: 'Houston',
  state: 'TX',
  bio: 'Official account for American Chassis Depot - Premium container chassis sales and marketplace.',
};

if (!ADMIN_CONFIG.password) {
  console.error('❌ Error: ADMIN_PASSWORD environment variable is required.');
  console.log('\nUsage: ADMIN_PASSWORD=YourSecurePassword npx tsx server/seed-super-admin.ts');
  process.exit(1);
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function seedSuperAdmin() {
  console.log('🚀 Starting Super Admin seed...\n');

  // Check for database URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL environment variable is not set.');
    console.log('\nPlease set the DATABASE_URL in your .env file or environment.');
    process.exit(1);
  }

  try {
    // Connect to database
    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    console.log('📦 Connected to database.\n');

    // Check if admin already exists
    const existingUser = await db
      .select()
      .from(marketplaceUsers)
      .where(eq(marketplaceUsers.email, ADMIN_CONFIG.email))
      .limit(1);

    if (existingUser.length > 0) {
      const user = existingUser[0];
      console.log(`⚠️  User with email "${ADMIN_CONFIG.email}" already exists.`);
      console.log(`   Current role: ${user.role}`);
      
      if (user.role !== 'super_admin') {
        // Update to super_admin
        await db
          .update(marketplaceUsers)
          .set({ 
            role: 'super_admin',
            sellerVerified: true,
            sellerVerificationDate: new Date(),
            isActive: true,
            updatedAt: new Date()
          })
          .where(eq(marketplaceUsers.id, user.id));
        
        console.log(`✅ User upgraded to super_admin role!`);
      } else {
        console.log(`   Already a super_admin. No changes made.`);
      }
      
      console.log(`\n📧 Email: ${ADMIN_CONFIG.email}`);
      console.log(`🔑 Use the existing password to login.`);
    } else {
      // Create new super_admin
      const hashedPassword = await hashPassword(ADMIN_CONFIG.password);

      const [newUser] = await db
        .insert(marketplaceUsers)
        .values({
          email: ADMIN_CONFIG.email,
          passwordHash: hashedPassword,
          role: 'super_admin',
          firstName: ADMIN_CONFIG.firstName,
          lastName: ADMIN_CONFIG.lastName,
          companyName: ADMIN_CONFIG.companyName,
          phone: ADMIN_CONFIG.phone || null,
          city: ADMIN_CONFIG.city,
          state: ADMIN_CONFIG.state,
          bio: ADMIN_CONFIG.bio,
          emailVerified: true,
          sellerVerified: true,
          sellerVerificationDate: new Date(),
          isActive: true,
          isSuspended: false,
          preferredLanguage: 'en',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      console.log(`✅ Super Admin created successfully!\n`);
      console.log(`📧 Email: ${ADMIN_CONFIG.email}`);
      console.log(`🏢 Company: ${ADMIN_CONFIG.companyName}`);
      console.log(`👤 User ID: ${newUser.id}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('='.repeat(50));
    console.log('1. Change the default password immediately after first login.');
    console.log('2. Update ADMIN_CONFIG in this script with secure values.');
    console.log('3. Delete or secure this script in production.');
    console.log('='.repeat(50) + '\n');

    console.log('✨ Seed completed successfully!\n');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

// Run the seed
seedSuperAdmin();
