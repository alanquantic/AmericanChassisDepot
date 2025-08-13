# American Chassis Depot - Full-Stack Web Application

## 🚀 Overview

American Chassis Depot is a comprehensive bilingual web platform for a chassis dealership specializing in container transportation equipment. The application features a sophisticated product catalog with detailed technical specifications, bilingual support (English/Spanish), and professional presentation of new and used chassis inventory targeting transportation companies and logistics professionals.

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom theme configuration
- **Radix UI** primitives with shadcn/ui components
- **Wouter** for lightweight client-side routing
- **TanStack Query v5** for server state management
- **React Hook Form** with Zod validation
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js framework
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Neon Database** for serverless PostgreSQL hosting
- **Mailgun** for email notifications
- **Express Session** infrastructure

### Development Tools
- **Drizzle Kit** for database migrations
- **PostCSS** for CSS processing
- **ESBuild** for fast bundling
- **TypeScript** strict mode enabled

## 🌐 Bilingual Support

### Complete Language Separation
- **English Version**: Contains all original chassis (condition_id: 3 for new, 4 for used)
- **Spanish Version**: Completely separate catalog with 15 Spanish chassis (condition_id: 5)
- **No Content Mixing**: Each language version shows only its corresponding chassis
- **Independent Filtering**: Spanish version has simplified filters (no condition filters)

### Language Features
- Dynamic language switching with URL persistence
- Professional technical translations
- Localized product descriptions and specifications
- Separate database conditions for complete content isolation

## 📊 Database Architecture

### Schema Overview
```typescript
// Core tables
- conditions: Chassis categories (New, Used, Spanish New)
- chassisModels: Complete chassis specifications
- contactMessages: Customer inquiries with email integration

// Key condition IDs
- 3: New Chassis (English)
- 4: Used Chassis (English) 
- 5: Chassis Nuevos Español (Spanish)
```

### Data Specifications
- **21 English Chassis**: Mix of new and used inventory
- **15 Spanish Chassis**: All new chassis with Spanish descriptions
- **Comprehensive Technical Data**: Frame specs, suspension, brakes, electrical, dimensions
- **Multiple Images**: Thumbnail and gallery support per chassis

## 🎯 Core Features

### Advanced Product Catalog
- **Intelligent Filtering**: By condition, size, characteristics, and manufacturer
- **Smart Filter Logic**: Prevents invalid combinations (e.g., gooseneck excluded from tandem filter)
- **Real-time Search**: Instant results with caching optimization
- **Responsive Grid**: Optimized for mobile, tablet, and desktop

### Technical Specifications
- **Detailed Product Pages**: Complete chassis specifications
- **Photo Galleries**: Multiple high-resolution images with navigation
- **Technical Documentation**: Frame, suspension, brake, and electrical details
- **Dimensional Data**: Length, width, weight, and payload specifications

### Contact Management
- **Multi-channel Forms**: General contact and quote requests
- **Email Integration**: Mailgun-powered notifications
- **Brochure Downloads**: PDF generation with contact form requirement
- **Customer Tracking**: Message persistence and follow-up capability

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Mailgun account for email functionality

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...
PGHOST=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
PGPORT=...

# Email Service
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

### Installation Steps
```bash
# Clone repository
git clone <repository-url>
cd american-chassis-depot

# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

## 📝 Available Scripts

### Development
```bash
npm run dev          # Start development server (frontend + backend)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Database Management
```bash
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio for database management
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply pending migrations
```

### Code Quality
```bash
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code analysis
npm run format       # Prettier code formatting
```

## 🏗️ Project Structure

```
american-chassis-depot/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API endpoint definitions
│   ├── storage.ts          # Database operations
│   ├── db.ts              # Database configuration
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema and types
├── data/                  # Chassis data files
├── attached_assets/       # User-uploaded assets
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: #0A3161 (US Flag inspired)
- **Accent Red**: #B22234 (US Flag inspired) 
- **Neutral Gray**: #6B7280 (Content text)
- **Background**: #F8F9FA (Light background)

### Typography
- **Headings**: Montserrat (Bold, Semi-bold)
- **Body Text**: Open Sans (Regular, Medium)
- **Technical Specs**: Monospace for precision

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔄 Filtering System

### Filter Categories
1. **Condition** (English only): New Chassis, Used Chassis, All
2. **Size**: 20ft, 33ft, 40ft, 45ft, 53ft, and combinations
3. **Characteristics**: Tandem, Triaxle, Gooseneck, Extendable
4. **Manufacturer**: Various chassis manufacturers

### Filter Logic
- **Exclusion Rules**: Gooseneck chassis excluded from tandem filter
- **Range Matching**: Size filters handle multiple format variations
- **Language Separation**: Spanish version uses simplified filtering
- **Cache Management**: Query invalidation for real-time updates

## 📱 API Endpoints

### Chassis Management
```
GET /api/chassis/filter     # Filter chassis with parameters
GET /api/chassis/:slug      # Get single chassis by slug
```

### Conditions
```
GET /api/conditions         # Get all chassis conditions
```

### Contact Management
```
POST /api/contact           # Submit contact form
POST /api/brochure-request  # Request brochure download
```

## 🚀 Deployment

### Vercel Configuration
The project includes Vercel-specific configuration for seamless deployment:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x
- **Environment Variables**: Set in Vercel dashboard

### Deployment Steps
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Production Considerations
- Database connection pooling optimized for serverless
- Static asset optimization with Vite
- Email service failover handling
- Responsive image loading

## 🔍 SEO & Performance

### Search Optimization
- **Meta Tags**: Dynamic meta descriptions per product
- **Structured Data**: Schema.org markup for chassis specifications
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Mobile-First**: Responsive design with mobile optimization

### Performance Features
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: TanStack Query with optimized invalidation
- **Bundle Optimization**: Tree shaking and minification

## 🧪 Testing & Quality

### Code Quality
- **TypeScript**: Strict mode with comprehensive type coverage
- **ESLint**: Custom rules for React and TypeScript
- **Prettier**: Consistent code formatting
- **Type Safety**: Shared schemas between frontend and backend

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Graceful Degradation**: Progressive enhancement approach

## 📞 Support & Maintenance

### Monitoring
- **Error Tracking**: Console logging with error boundaries
- **Performance Monitoring**: Core Web Vitals tracking
- **Database Health**: Connection monitoring and pooling
- **Email Delivery**: Mailgun webhook monitoring

### Maintenance Tasks
- **Database Backups**: Automated Neon backups
- **Dependency Updates**: Regular security updates
- **Content Updates**: New chassis addition workflow
- **Performance Optimization**: Continuous monitoring and improvement

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Implement changes with tests
4. Submit pull request with detailed description

### Code Standards
- Follow TypeScript strict mode guidelines
- Use Prettier for formatting
- Implement proper error handling
- Write descriptive commit messages

## 📄 License

This project is proprietary software developed for American Chassis Depot. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: August 2025  
**Maintainer**: Development Team  
**Contact**: [Your Contact Information]