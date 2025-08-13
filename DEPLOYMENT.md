# Deployment Guide - American Chassis Depot

## 🚀 Vercel Deployment Setup

### Prerequisites
- Git repository with your code
- Vercel account (free tier available)
- Environment variables ready

### Step 1: Repository Connection
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Select "american-chassis-depot" repository

### Step 2: Project Configuration
Vercel will automatically detect the configuration from `vercel.json`:

```json
{
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json", 
      "use": "@vercel/static-build"
    }
  ]
}
```

### Step 3: Environment Variables Setup
In Vercel Dashboard → Project → Settings → Environment Variables, add:

#### Database Variables
```
DATABASE_URL=postgresql://username:password@host/database
PGHOST=your-neon-host.neon.tech
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name
PGPORT=5432
```

#### Email Service Variables  
```
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mg.yourdomain.com
```

#### Additional Variables
```
NODE_ENV=production
```

### Step 4: Build Configuration
The project uses these build settings (auto-configured):

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

## 🗄️ Database Setup

### Neon Database (Recommended)
1. Create account at [Neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations: `npm run db:push`

### Alternative Database Providers
- **Supabase**: Compatible PostgreSQL service
- **PlanetScale**: MySQL alternative (requires schema changes)
- **Railway**: Full-stack hosting with PostgreSQL

## 📧 Email Service Setup

### Mailgun Configuration
1. Sign up at [Mailgun](https://mailgun.com)
2. Verify your domain
3. Get API key and domain from dashboard
4. Add to environment variables

### Alternative Email Providers
- **SendGrid**: Update `server/email.ts` configuration
- **AWS SES**: Requires different SDK setup
- **Resend**: Modern alternative with good React support

## 🔄 Deployment Process

### Automatic Deployment
1. Push to main branch
2. Vercel automatically builds and deploys
3. Live at `https://your-project.vercel.app`

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from local
vercel --prod
```

## 🌐 Domain Configuration

### Custom Domain
1. Go to Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. SSL automatically provisioned

### DNS Configuration Example
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A  
Name: @
Value: 76.76.19.19
```

## ⚡ Performance Optimization

### Vercel Specific Optimizations
- **Edge Functions**: API routes run at edge locations
- **Static Generation**: Pre-built pages for fast loading
- **Image Optimization**: Automatic WebP conversion
- **Bundle Analysis**: Built-in bundle analyzer

### Configuration Optimizations
```json
// vercel.json
{
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=300, stale-while-revalidate=59"
        }
      ]
    }
  ]
}
```

## 🔍 Monitoring & Analytics

### Vercel Analytics
1. Enable in Project Settings
2. Add `@vercel/analytics` package
3. Import in main component

### Error Monitoring
- **Vercel Functions**: Built-in error logging
- **Sentry**: Advanced error tracking
- **LogRocket**: Session replay and monitoring

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run type-check  # Fix TypeScript errors
npm run lint        # Fix linting issues
```

#### Database Connection Issues
```bash
# Test connection locally
npm run db:push
# Check environment variables in Vercel
# Verify Neon database is active
```

#### Email Service Issues
```bash
# Test Mailgun configuration
# Check API key validity
# Verify domain DNS settings
```

### Environment-Specific Issues

#### Production vs Development
- Database URLs different
- CORS settings may need adjustment
- Environment variable case sensitivity

#### Serverless Limitations
- Function timeout: 30 seconds max
- Cold starts: First request may be slower
- File system is read-only

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
```

### Deployment Hooks
- **Pre-deploy**: Run tests and type checking
- **Post-deploy**: Database migrations and health checks
- **Rollback**: Automatic rollback on critical failures

## 📱 Mobile Optimization

### PWA Configuration
The app includes PWA capabilities:
- Service worker for offline functionality  
- Manifest.json for app-like experience
- Responsive design for all screen sizes

### Performance Metrics
- **Lighthouse Score**: Aim for 90+ in all categories
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Mobile-First**: Optimized for mobile performance

## 🔒 Security Considerations

### Environment Security
- Never commit `.env` files
- Use Vercel's encrypted environment variables
- Regular security audits with `npm audit`

### Database Security
- Use connection pooling
- Implement proper SQL injection protection
- Regular backup verification

### API Security
- Rate limiting on contact forms
- CORS configuration
- Input validation and sanitization

---

**Need Help?** 
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Neon Documentation: [neon.tech/docs](https://neon.tech/docs)
- Project Issues: Create issue in repository