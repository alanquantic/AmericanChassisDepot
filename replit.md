# American Chassis Depot - React/Express Full-Stack Application

## Overview

American Chassis Depot is a comprehensive full-stack web application for a chassis dealership specializing in container transportation equipment. The platform features a sophisticated product catalog with detailed technical specifications, bilingual support (English/Spanish), and professional presentation of new and used chassis inventory. The application targets transportation companies and logistics professionals seeking detailed chassis information and technical specifications.

The system follows a modern monorepo architecture with a React frontend and Express.js backend, designed to showcase detailed chassis specifications, facilitate customer inquiries, and provide comprehensive technical documentation with integrated contact management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Successful Changes (August 13, 2025)

✓ **Database Loading Process**: Successfully loaded exactly 20 new chassis from user specification files, replacing all test data
✓ **Home Page Configuration**: Fixed to display 6 random chassis (not sequential) with proper randomization
✓ **Data Separation**: Established complete separation between new (condition_id=3) and used (condition_id=4) chassis
✓ **Navigation Logic**: Corrected routing between HomePage (6 random new) and AllProductsPage (all 20 with filters)
✓ **Label Management**: Removed "USED" labels from home page while maintaining them on product pages
✓ **Filter System Overhaul**: Completely fixed characteristic filters with proper exclusion logic (gooseneck products no longer appear in tandem filter)
✓ **Download Brochure Feature**: Added complete brochure download functionality with contact form and backend integration

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom theme configuration supporting US flag-inspired color palette (blue #0A3161, red #B22234, white)
- **Build Tool**: Vite for fast development and optimized production builds
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with `/api` prefix for clear separation
- **Validation**: Zod schemas shared between frontend and backend for consistent data validation
- **File Structure**: Modular organization with separate routing, storage, and service layers

### Data Storage Solutions
- **Primary Database**: PostgreSQL accessed via Neon serverless platform
- **ORM**: Drizzle with schema-first approach for type safety
- **Migration Management**: Drizzle Kit for database schema migrations
- **Connection Pooling**: Connection pooling via @neondatabase/serverless for optimal performance
- **Schema Design**: Comprehensive normalized structure with detailed chassis specifications including:
  - Conditions table (new/used chassis classification)
  - Chassis models with extensive technical specifications
  - Frame components, suspension details, brake systems, electrical systems
  - Dimensional specifications (length, width, weight, payload)
  - Additional equipment arrays for detailed feature listings
  - Contact messages with integrated email notifications

### Authentication and Authorization
- **Current State**: No authentication system implemented
- **Session Management**: Express session infrastructure prepared but not actively used
- **Access Control**: Open access to all endpoints and content

### Key Features and Components
- **Comprehensive Product Catalog**: Advanced chassis filtering by condition, size, and manufacturer with detailed technical specifications
- **Technical Specifications Display**: Extensive product pages featuring frame components, suspension systems, brake details, electrical specifications, and dimensional data
- **Bilingual Content Support**: English and Spanish language support with professional technical translations
- **Photo Galleries**: Multiple image support with thumbnail navigation and high-resolution viewing
- **Contact Management**: Multi-channel contact forms with Mailgun email notifications
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts optimized for technical content
- **SEO Optimization**: Meta tags, structured data, and semantic HTML for technical product pages
- **Accessibility**: WCAG compliance with focus management and screen reader support
- **Performance**: Image optimization, lazy loading, and efficient caching strategies for technical content

## External Dependencies

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Environment Variables**: DATABASE_URL for database connectivity

### Email Services
- **Mailgun**: Email delivery service for contact form notifications
- **Configuration**: MAILGUN_API_KEY and MAILGUN_DOMAIN for email functionality
- **Fallback**: Graceful degradation when email services are unavailable

### Frontend Libraries
- **UI Framework**: Extensive Radix UI component suite for accessible primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **State Management**: TanStack React Query for server state synchronization
- **Form Management**: React Hook Form ecosystem with Zod resolvers
- **Icons**: Custom icon components with Lucide React as fallback
- **Development**: Replit-specific plugins for theme integration and development tools

### Development and Build Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Code Quality**: TypeScript compiler with strict type checking
- **Package Management**: npm with lockfile for reproducible builds

### Third-Party Integrations
- **Google Analytics**: GA4 implementation for user tracking and analytics
- **Social Media**: Prepared social media integration points
- **Maps**: Geographic positioning metadata for location-based services
- **Email Templates**: Structured email templates for customer notifications

### Asset Management
- **Images**: External CDN usage (Unsplash) for placeholder content
- **Videos**: Local video assets for hero sections with multiple format support
- **Fonts**: Google Fonts integration (Open Sans, Montserrat)
- **Static Assets**: Public directory structure for logos, favicons, and media files