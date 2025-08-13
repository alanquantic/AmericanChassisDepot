# Contributing to American Chassis Depot

## 🎯 Overview

Thank you for your interest in contributing to American Chassis Depot! This project is a comprehensive bilingual platform for chassis dealership operations with advanced filtering and technical specifications.

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL (via Neon Database recommended)
- Git

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd american-chassis-depot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and email service credentials

# Initialize database
npm run db:push

# Start development server
npm run dev
```

## 📁 Project Structure

```
american-chassis-depot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and constants
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   ├── db.ts               # Database configuration
│   └── index.ts            # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Database schema with Drizzle
├── data/                   # Chassis data files
└── public/                 # Static assets
```

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Use strict mode, proper typing
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS with design system tokens
- **Database**: Drizzle ORM with type-safe operations

### Naming Conventions
- **Files**: kebab-case (e.g., `chassis-grid.tsx`)
- **Components**: PascalCase (e.g., `ChassisGrid`)
- **Variables**: camelCase (e.g., `chassisModels`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)

### Architecture Principles
- **Separation of Concerns**: Clear frontend/backend boundaries
- **Type Safety**: Shared schemas between frontend and backend
- **Performance**: Optimized queries and caching
- **Accessibility**: WCAG compliance throughout

## 🌐 Bilingual Support

### Language Separation
The application maintains complete separation between English and Spanish versions:

- **English**: condition_id 3 (new), 4 (used)
- **Spanish**: condition_id 5 (nuevos únicamente)
- **No Mixing**: Each language shows only its chassis
- **Separate Filtering**: Spanish version has simplified filters

### Adding Translations
1. Update language files in `client/src/lib/i18n-simple.ts`
2. Ensure technical terms are professionally translated
3. Test both language versions thoroughly
4. Maintain consistent terminology across all content

## 🔍 Feature Development

### Adding New Chassis
1. **Data Entry**: Add chassis data to appropriate file in `data/`
2. **Database**: Run `npm run db:push` to update schema if needed
3. **Images**: Add product images to appropriate directories
4. **Testing**: Verify filtering and display in both languages

### API Development
1. **Endpoints**: Add to `server/routes.ts`
2. **Validation**: Use Zod schemas for request/response validation
3. **Storage**: Implement data operations in `server/storage.ts`
4. **Types**: Update shared types in `shared/schema.ts`

### Frontend Components
1. **UI Components**: Use shadcn/ui components as base
2. **Responsive**: Mobile-first responsive design
3. **Accessibility**: Proper ARIA labels and keyboard navigation
4. **Performance**: Lazy loading and optimization

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Both language versions work independently
- [ ] All filters function correctly
- [ ] Contact forms submit successfully
- [ ] Responsive design works on all screen sizes
- [ ] Product pages display complete information
- [ ] Image galleries function properly

### Browser Testing
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Database Guidelines

### Schema Changes
1. **Drizzle Schema**: Update `shared/schema.ts`
2. **Migration**: Use `npm run db:generate` for migrations
3. **Push Changes**: Use `npm run db:push` for development
4. **Data Integrity**: Ensure existing data compatibility

### Data Quality
- **Consistency**: Maintain consistent data formats
- **Validation**: Proper Zod validation schemas
- **Relationships**: Maintain proper foreign key relationships
- **Performance**: Optimize queries for large datasets

## 🚀 Deployment

### Pre-deployment Checklist
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Email service tested

### Vercel Deployment
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main
4. Monitor deployment logs for issues

## 🐛 Bug Reports

### Required Information
- **Browser**: Version and type
- **Screen Size**: Desktop/tablet/mobile
- **Language**: English or Spanish version
- **Steps to Reproduce**: Detailed reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable

### Bug Fix Process
1. **Reproduce**: Confirm the bug exists
2. **Isolate**: Identify the root cause
3. **Fix**: Implement the minimal necessary fix
4. **Test**: Verify fix works in both languages
5. **Deploy**: Submit pull request with clear description

## 📝 Documentation

### Code Documentation
- **Functions**: JSDoc comments for complex functions
- **Components**: Props interface documentation
- **APIs**: Clear endpoint documentation
- **Database**: Schema relationship documentation

### README Updates
- Keep installation instructions current
- Update feature lists when adding functionality
- Maintain accurate environment variable lists
- Update troubleshooting sections

## 🔒 Security Guidelines

### Data Protection
- **Environment Variables**: Never commit secrets
- **User Input**: Validate and sanitize all inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Proper output encoding

### Authentication (Future)
- **Session Management**: Secure session handling
- **Password Security**: Proper hashing and salting
- **Access Control**: Role-based permissions
- **CSRF Protection**: Token-based protection

## 💬 Communication

### Pull Request Guidelines
1. **Clear Title**: Descriptive PR title
2. **Description**: Explain what and why
3. **Testing**: Include testing instructions
4. **Screenshots**: For UI changes
5. **Breaking Changes**: Clearly mark any breaking changes

### Issue Reporting
- Use issue templates when available
- Provide complete reproduction steps
- Include relevant logs or error messages
- Tag appropriately (bug, enhancement, documentation)

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes for significant contributions
- Special recognition for major feature additions

Thank you for helping make American Chassis Depot better! 🚛