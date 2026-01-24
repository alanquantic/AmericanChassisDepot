# 🚀 PLAN MAESTRO: Chassis Marketplace

## Índice
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelo de Base de Datos](#modelo-de-base-de-datos)
4. [Fases de Implementación](#fases-de-implementación)
5. [Estructura de Archivos](#estructura-de-archivos)
6. [API Endpoints](#api-endpoints)
7. [Sistema de Pagos (Stripe)](#sistema-de-pagos-stripe)
8. [Sistema de Usuarios](#sistema-de-usuarios)
9. [Panel de Administración](#panel-de-administración)
10. [Internacionalización](#internacionalización)
11. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
12. [Roadmap y Timeline](#roadmap-y-timeline)

---

## 1. Visión General

### 1.1 Concepto del Marketplace
El **Chassis Marketplace** será una plataforma B2B dentro de American Chassis Depot donde:

- **Vendedores** pueden listar chassis usados (y eventualmente nuevos)
- **Compradores** pueden buscar, filtrar y contactar vendedores
- **American Chassis Depot** actúa como vendedor principal + administrador de la plataforma
- Sistema de **mensajería interna** para negociaciones
- **Pagos seguros** via Stripe

### 1.2 Usuarios del Sistema

| Rol | Capacidades |
|-----|-------------|
| **Buyer (Comprador)** | Buscar listings, enviar mensajes, realizar ofertas/compras |
| **Seller (Vendedor)** | Todo lo anterior + crear/gestionar listings propios |
| **Admin** | Todo lo anterior + aprobar/rechazar listings, gestionar usuarios, ver analytics |

### 1.3 Diferenciación con Catálogo Actual
- **Catálogo actual**: Chassis nuevos con especificaciones técnicas detalladas (sin precios directos)
- **Marketplace**: Listings de inventario real con precios, ubicaciones, cantidades y transacciones

---

## 2. Arquitectura del Sistema

### 2.1 Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React + TypeScript + Vite + TailwindCSS + shadcn/ui            │
│  + React Query + Wouter + Framer Motion                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  Express.js + TypeScript + Drizzle ORM                          │
│  + Passport.js (Auth) + Stripe SDK                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│  PostgreSQL (Neon) - Drizzle ORM                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICIOS EXTERNOS                          │
│  Stripe (Pagos) + SendGrid (Emails) + Cloudinary (Imágenes)     │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Arquitectura de Módulos

```
/chassis-marketplace
├── /listings          # Gestión de listings
├── /auth             # Autenticación y usuarios
├── /messages         # Sistema de mensajería
├── /payments         # Integración Stripe
├── /admin            # Panel de administración
└── /dashboard        # Dashboard de vendedor
```

---

## 3. Modelo de Base de Datos

### 3.1 Nuevas Tablas

```sql
-- =============================================
-- USUARIOS DEL MARKETPLACE
-- =============================================
CREATE TABLE marketplace_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'buyer', -- 'buyer', 'seller', 'admin'
  
  -- Información de perfil
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company_name VARCHAR(200),
  phone VARCHAR(50),
  
  -- Dirección
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(50) DEFAULT 'USA',
  
  -- Verificación y estado
  email_verified BOOLEAN DEFAULT FALSE,
  seller_verified BOOLEAN DEFAULT FALSE, -- Verificación como vendedor
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Stripe
  stripe_customer_id VARCHAR(255),
  stripe_account_id VARCHAR(255), -- Para vendedores (Stripe Connect)
  
  -- Preferencias
  preferred_language VARCHAR(5) DEFAULT 'en',
  notification_email BOOLEAN DEFAULT TRUE,
  notification_sms BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  avatar_url VARCHAR(500),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- =============================================
-- LISTINGS DEL MARKETPLACE
-- =============================================
CREATE TABLE marketplace_listings (
  id SERIAL PRIMARY KEY,
  seller_id INTEGER REFERENCES marketplace_users(id),
  
  -- Identificación
  listing_number VARCHAR(50) UNIQUE, -- ACD-2024-0001
  slug VARCHAR(255) UNIQUE NOT NULL,
  
  -- Información del chassis
  title VARCHAR(255) NOT NULL,
  title_es VARCHAR(255), -- Título en español
  description TEXT,
  description_es TEXT,
  
  -- Tipo y especificaciones
  chassis_type VARCHAR(50) NOT NULL, -- 'Gooseneck', 'Slider', 'Extendable', 'Spread'
  chassis_size VARCHAR(50) NOT NULL, -- '20ft', '40ft', '45ft', '53ft', '20-40ft', '40-45ft', '40-45-48ft'
  condition VARCHAR(50) NOT NULL, -- 'ASIS', 'Road-worthy', 'New', 'Certified'
  manufacturer VARCHAR(100),
  year INTEGER,
  
  -- Ubicación
  state VARCHAR(50) NOT NULL,
  city VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20),
  location_details TEXT, -- Instrucciones adicionales
  
  -- Inventario y precio
  quantity INTEGER NOT NULL DEFAULT 1,
  quantity_available INTEGER NOT NULL DEFAULT 1,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  price_negotiable BOOLEAN DEFAULT TRUE,
  minimum_order INTEGER DEFAULT 1,
  
  -- Imágenes
  primary_image_url VARCHAR(500),
  images JSONB DEFAULT '[]', -- Array de URLs de imágenes
  
  -- Estado del listing
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'pending', 'active', 'sold', 'expired', 'rejected'
  featured BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE, -- Verificado por ACD
  
  -- Visibilidad
  views_count INTEGER DEFAULT 0,
  inquiries_count INTEGER DEFAULT 0,
  
  -- Fechas
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  sold_at TIMESTAMP,
  
  -- Metadata adicional
  specs JSONB DEFAULT '{}', -- Especificaciones adicionales
  tags TEXT[], -- Tags para búsqueda
  rejection_reason TEXT
);

-- =============================================
-- IMÁGENES DE LISTINGS
-- =============================================
CREATE TABLE listing_images (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES marketplace_listings(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- MENSAJES / CONVERSACIONES
-- =============================================
CREATE TABLE marketplace_conversations (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES marketplace_listings(id),
  buyer_id INTEGER REFERENCES marketplace_users(id),
  seller_id INTEGER REFERENCES marketplace_users(id),
  
  -- Estado
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'closed', 'archived'
  
  -- Última actividad
  last_message_at TIMESTAMP,
  buyer_unread_count INTEGER DEFAULT 0,
  seller_unread_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marketplace_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES marketplace_conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES marketplace_users(id),
  
  -- Contenido
  message TEXT NOT NULL,
  
  -- Tipo de mensaje
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'offer', 'system'
  
  -- Para ofertas
  offer_amount DECIMAL(12, 2),
  offer_quantity INTEGER,
  offer_status VARCHAR(20), -- 'pending', 'accepted', 'rejected', 'countered', 'expired'
  
  -- Estado
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- OFERTAS FORMALES
-- =============================================
CREATE TABLE marketplace_offers (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER REFERENCES marketplace_listings(id),
  buyer_id INTEGER REFERENCES marketplace_users(id),
  seller_id INTEGER REFERENCES marketplace_users(id),
  conversation_id INTEGER REFERENCES marketplace_conversations(id),
  
  -- Detalles de la oferta
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn'
  
  -- Contra-oferta (si aplica)
  counter_price DECIMAL(12, 2),
  counter_quantity INTEGER,
  
  -- Notas
  buyer_notes TEXT,
  seller_notes TEXT,
  
  -- Fechas
  expires_at TIMESTAMP,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- TRANSACCIONES / ÓRDENES
-- =============================================
CREATE TABLE marketplace_orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE, -- ORD-2024-0001
  
  listing_id INTEGER REFERENCES marketplace_listings(id),
  buyer_id INTEGER REFERENCES marketplace_users(id),
  seller_id INTEGER REFERENCES marketplace_users(id),
  offer_id INTEGER REFERENCES marketplace_offers(id),
  
  -- Detalles de compra
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  platform_fee DECIMAL(12, 2) DEFAULT 0, -- Comisión de ACD
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  
  -- Estado
  status VARCHAR(30) DEFAULT 'pending', 
  -- 'pending', 'payment_pending', 'paid', 'processing', 
  -- 'ready_pickup', 'completed', 'cancelled', 'refunded', 'disputed'
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  stripe_transfer_id VARCHAR(255), -- Para pago al vendedor
  
  -- Información de pago
  payment_method VARCHAR(50), -- 'card', 'ach', 'wire'
  payment_status VARCHAR(20), -- 'pending', 'succeeded', 'failed', 'refunded'
  paid_at TIMESTAMP,
  
  -- Información de pickup/delivery
  pickup_address TEXT,
  pickup_instructions TEXT,
  pickup_contact_name VARCHAR(200),
  pickup_contact_phone VARCHAR(50),
  pickup_scheduled_at TIMESTAMP,
  picked_up_at TIMESTAMP,
  
  -- Notas
  buyer_notes TEXT,
  seller_notes TEXT,
  admin_notes TEXT,
  
  -- Fechas
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP
);

-- =============================================
-- FAVORITOS / WATCHLIST
-- =============================================
CREATE TABLE marketplace_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES marketplace_users(id),
  listing_id INTEGER REFERENCES marketplace_listings(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- =============================================
-- BÚSQUEDAS GUARDADAS
-- =============================================
CREATE TABLE saved_searches (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES marketplace_users(id),
  name VARCHAR(100),
  filters JSONB NOT NULL, -- Filtros guardados
  notify_new_matches BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- REVIEWS / VALORACIONES
-- =============================================
CREATE TABLE marketplace_reviews (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES marketplace_orders(id),
  reviewer_id INTEGER REFERENCES marketplace_users(id),
  reviewed_user_id INTEGER REFERENCES marketplace_users(id),
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  
  -- Respuesta del vendedor
  seller_response TEXT,
  seller_response_at TIMESTAMP,
  
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- NOTIFICACIONES
-- =============================================
CREATE TABLE marketplace_notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES marketplace_users(id),
  
  type VARCHAR(50) NOT NULL, 
  -- 'new_message', 'new_offer', 'offer_accepted', 'offer_rejected',
  -- 'listing_approved', 'listing_rejected', 'order_paid', 'order_completed'
  
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  -- Referencias
  listing_id INTEGER,
  conversation_id INTEGER,
  order_id INTEGER,
  
  -- Estado
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Acciones
  action_url VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ACTIVITY LOG / AUDITORÍA
-- =============================================
CREATE TABLE marketplace_activity_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES marketplace_users(id),
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50), -- 'listing', 'order', 'message', 'user'
  entity_id INTEGER,
  
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX idx_listings_status ON marketplace_listings(status);
CREATE INDEX idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX idx_listings_location ON marketplace_listings(state, city);
CREATE INDEX idx_listings_type ON marketplace_listings(chassis_type, chassis_size);
CREATE INDEX idx_listings_price ON marketplace_listings(price_per_unit);
CREATE INDEX idx_listings_created ON marketplace_listings(created_at DESC);

CREATE INDEX idx_conversations_buyer ON marketplace_conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON marketplace_conversations(seller_id);
CREATE INDEX idx_messages_conversation ON marketplace_messages(conversation_id);

CREATE INDEX idx_orders_buyer ON marketplace_orders(buyer_id);
CREATE INDEX idx_orders_seller ON marketplace_orders(seller_id);
CREATE INDEX idx_orders_status ON marketplace_orders(status);

CREATE INDEX idx_notifications_user ON marketplace_notifications(user_id, is_read);
```

### 3.2 Diagrama de Relaciones

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ marketplace_users│     │marketplace_listings│    │ listing_images   │
│                  │────▶│                  │◀────│                  │
│ id               │     │ id               │     │ listing_id       │
│ email            │     │ seller_id        │     │ url              │
│ role             │     │ title            │     └──────────────────┘
│ company_name     │     │ chassis_type     │
│ stripe_account_id│     │ price_per_unit   │
└──────────────────┘     │ status           │
         │               └──────────────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐     ┌──────────────────┐
│  conversations   │     │    offers        │
│                  │     │                  │
│ buyer_id         │     │ listing_id       │
│ seller_id        │     │ buyer_id         │
│ listing_id       │     │ price_per_unit   │
└──────────────────┘     │ status           │
         │               └──────────────────┘
         ▼                        │
┌──────────────────┐              │
│    messages      │              ▼
│                  │     ┌──────────────────┐
│ conversation_id  │     │    orders        │
│ sender_id        │     │                  │
│ message          │     │ offer_id         │
└──────────────────┘     │ stripe_payment_id│
                         │ status           │
                         └──────────────────┘
```

---

## 4. Fases de Implementación

### FASE 1: Fundamentos (Semana 1-2)
**Objetivo**: Establecer la base del marketplace

#### 1.1 Base de Datos
- [ ] Crear todas las nuevas tablas en el schema
- [ ] Migrar datos del CSV inicial
- [ ] Configurar índices y relaciones

#### 1.2 Autenticación
- [ ] Sistema de registro/login con Passport.js
- [ ] Verificación de email
- [ ] Recuperación de contraseña
- [ ] Sesiones seguras con JWT

#### 1.3 API Base
- [ ] CRUD de listings
- [ ] Endpoints de búsqueda y filtros
- [ ] Middleware de autenticación

### FASE 2: Frontend del Marketplace (Semana 2-3)
**Objetivo**: Interfaz de usuario completa

#### 2.1 Páginas Públicas
- [ ] `/chassis-marketplace` - Listado principal con filtros
- [ ] `/chassis-marketplace/:slug` - Detalle de listing
- [ ] Componentes de búsqueda avanzada
- [ ] Cards de listings responsivas

#### 2.2 Área de Usuario
- [ ] `/marketplace/login` y `/marketplace/register`
- [ ] `/marketplace/dashboard` - Dashboard del usuario
- [ ] `/marketplace/favorites` - Lista de favoritos
- [ ] `/marketplace/messages` - Centro de mensajes

#### 2.3 Área de Vendedor
- [ ] `/marketplace/seller/listings` - Mis listings
- [ ] `/marketplace/seller/create` - Crear listing
- [ ] `/marketplace/seller/edit/:id` - Editar listing
- [ ] `/marketplace/seller/orders` - Órdenes recibidas

### FASE 3: Sistema de Mensajería (Semana 3-4)
**Objetivo**: Comunicación entre compradores y vendedores

#### 3.1 Backend
- [ ] API de conversaciones
- [ ] API de mensajes
- [ ] Sistema de notificaciones
- [ ] Emails de notificación

#### 3.2 Frontend
- [ ] Componente de chat
- [ ] Lista de conversaciones
- [ ] Indicadores de mensajes no leídos
- [ ] Notificaciones en tiempo real (opcional: WebSockets)

### FASE 4: Sistema de Ofertas (Semana 4-5)
**Objetivo**: Permitir negociaciones formales

#### 4.1 Backend
- [ ] API de ofertas
- [ ] Lógica de contra-ofertas
- [ ] Expiración automática
- [ ] Notificaciones

#### 4.2 Frontend
- [ ] Modal de hacer oferta
- [ ] Vista de ofertas recibidas/enviadas
- [ ] Flujo de aceptar/rechazar/contrar

### FASE 5: Integración Stripe (Semana 5-6)
**Objetivo**: Pagos seguros

#### 5.1 Configuración
- [ ] Stripe Connect para vendedores
- [ ] Payment Intents
- [ ] Webhooks de Stripe

#### 5.2 Flujos de Pago
- [ ] Checkout de orden
- [ ] Retención de fondos (escrow)
- [ ] Liberación a vendedor
- [ ] Manejo de disputas

### FASE 6: Panel de Administración (Semana 6-7)
**Objetivo**: Control total de la plataforma

#### 6.1 Dashboard Admin
- [ ] `/admin/marketplace` - Vista general
- [ ] Estadísticas y métricas
- [ ] Gestión de listings (aprobar/rechazar)
- [ ] Gestión de usuarios
- [ ] Gestión de órdenes
- [ ] Reportes y exports

### FASE 7: Internacionalización (Semana 7-8)
**Objetivo**: Soporte completo EN/ES

#### 7.1 Traducciones
- [ ] Todas las páginas en inglés y español
- [ ] Emails en ambos idiomas
- [ ] Notificaciones bilingües
- [ ] URLs con prefijo de idioma

### FASE 8: Optimización y Launch (Semana 8)
**Objetivo**: Preparar para producción

#### 8.1 Performance
- [ ] Optimización de queries
- [ ] Caching estratégico
- [ ] Lazy loading de imágenes
- [ ] Compresión de assets

#### 8.2 SEO
- [ ] Meta tags dinámicos
- [ ] Sitemap del marketplace
- [ ] Schema.org para listings

#### 8.3 Testing
- [ ] Tests de integración
- [ ] Tests de pago en sandbox
- [ ] Testing de seguridad

---

## 5. Estructura de Archivos

```
/client/src/
├── components/
│   └── marketplace/
│       ├── ListingCard.tsx
│       ├── ListingGrid.tsx
│       ├── ListingFilters.tsx
│       ├── ListingDetail.tsx
│       ├── ListingForm.tsx
│       ├── ListingGallery.tsx
│       ├── SearchBar.tsx
│       ├── PriceDisplay.tsx
│       ├── LocationBadge.tsx
│       ├── ConditionBadge.tsx
│       ├── SellerInfo.tsx
│       ├── ContactSellerButton.tsx
│       ├── MakeOfferModal.tsx
│       ├── MessageThread.tsx
│       ├── ConversationList.tsx
│       ├── CheckoutForm.tsx
│       ├── OrderSummary.tsx
│       └── ui/
│           ├── MarketplaceHeader.tsx
│           ├── MarketplaceSidebar.tsx
│           └── MarketplaceFooter.tsx
├── pages/
│   └── marketplace/
│       ├── MarketplacePage.tsx        # /chassis-marketplace
│       ├── ListingDetailPage.tsx      # /chassis-marketplace/:slug
│       ├── LoginPage.tsx              # /marketplace/login
│       ├── RegisterPage.tsx           # /marketplace/register
│       ├── DashboardPage.tsx          # /marketplace/dashboard
│       ├── FavoritesPage.tsx          # /marketplace/favorites
│       ├── MessagesPage.tsx           # /marketplace/messages
│       ├── seller/
│       │   ├── MyListingsPage.tsx     # /marketplace/seller/listings
│       │   ├── CreateListingPage.tsx  # /marketplace/seller/create
│       │   ├── EditListingPage.tsx    # /marketplace/seller/edit/:id
│       │   ├── OrdersPage.tsx         # /marketplace/seller/orders
│       │   └── AnalyticsPage.tsx      # /marketplace/seller/analytics
│       ├── buyer/
│       │   ├── MyOrdersPage.tsx       # /marketplace/buyer/orders
│       │   ├── OffersPage.tsx         # /marketplace/buyer/offers
│       │   └── CheckoutPage.tsx       # /marketplace/checkout/:orderId
│       └── admin/
│           ├── AdminDashboard.tsx     # /admin/marketplace
│           ├── ListingsAdmin.tsx      # /admin/marketplace/listings
│           ├── UsersAdmin.tsx         # /admin/marketplace/users
│           └── OrdersAdmin.tsx        # /admin/marketplace/orders
├── hooks/
│   └── marketplace/
│       ├── useMarketplaceAuth.ts
│       ├── useListings.ts
│       ├── useListingDetail.ts
│       ├── useConversations.ts
│       ├── useMessages.ts
│       ├── useOffers.ts
│       ├── useOrders.ts
│       └── useFavorites.ts
├── lib/
│   └── marketplace/
│       ├── api.ts                     # API client
│       ├── types.ts                   # TypeScript types
│       ├── constants.ts               # Constantes del marketplace
│       ├── utils.ts                   # Utilidades
│       ├── validators.ts              # Validadores Zod
│       └── i18n-marketplace.ts        # Traducciones específicas

/server/
├── routes/
│   └── marketplace/
│       ├── index.ts                   # Router principal
│       ├── auth.ts                    # Autenticación
│       ├── listings.ts                # CRUD de listings
│       ├── conversations.ts           # Mensajería
│       ├── offers.ts                  # Sistema de ofertas
│       ├── orders.ts                  # Órdenes y pagos
│       ├── users.ts                   # Gestión de usuarios
│       └── admin.ts                   # Endpoints de admin
├── services/
│   └── marketplace/
│       ├── stripe.ts                  # Integración Stripe
│       ├── notifications.ts           # Sistema de notificaciones
│       ├── email.ts                   # Emails del marketplace
│       └── search.ts                  # Motor de búsqueda
├── middleware/
│   └── marketplace/
│       ├── auth.ts                    # Middleware de autenticación
│       ├── roles.ts                   # Verificación de roles
│       └── validation.ts              # Validación de requests

/shared/
├── marketplace-schema.ts              # Schema Drizzle del marketplace
└── marketplace-types.ts               # Tipos compartidos
```

---

## 6. API Endpoints

### 6.1 Autenticación
```
POST   /api/marketplace/auth/register      # Registro
POST   /api/marketplace/auth/login         # Login
POST   /api/marketplace/auth/logout        # Logout
POST   /api/marketplace/auth/forgot-password
POST   /api/marketplace/auth/reset-password
GET    /api/marketplace/auth/me            # Usuario actual
PUT    /api/marketplace/auth/profile       # Actualizar perfil
```

### 6.2 Listings
```
GET    /api/marketplace/listings           # Listar con filtros
GET    /api/marketplace/listings/:slug     # Detalle
POST   /api/marketplace/listings           # Crear (seller)
PUT    /api/marketplace/listings/:id       # Actualizar (seller)
DELETE /api/marketplace/listings/:id       # Eliminar (seller)
POST   /api/marketplace/listings/:id/images # Subir imágenes
```

### 6.3 Mensajería
```
GET    /api/marketplace/conversations                    # Mis conversaciones
POST   /api/marketplace/conversations                    # Iniciar conversación
GET    /api/marketplace/conversations/:id                # Detalle
GET    /api/marketplace/conversations/:id/messages       # Mensajes
POST   /api/marketplace/conversations/:id/messages       # Enviar mensaje
PUT    /api/marketplace/conversations/:id/read           # Marcar leído
```

### 6.4 Ofertas
```
GET    /api/marketplace/offers             # Mis ofertas
POST   /api/marketplace/offers             # Crear oferta
GET    /api/marketplace/offers/:id         # Detalle
PUT    /api/marketplace/offers/:id/accept  # Aceptar
PUT    /api/marketplace/offers/:id/reject  # Rechazar
PUT    /api/marketplace/offers/:id/counter # Contra-oferta
```

### 6.5 Órdenes
```
GET    /api/marketplace/orders             # Mis órdenes
POST   /api/marketplace/orders             # Crear orden
GET    /api/marketplace/orders/:id         # Detalle
PUT    /api/marketplace/orders/:id/status  # Actualizar estado
POST   /api/marketplace/orders/:id/pay     # Procesar pago
```

### 6.6 Favoritos
```
GET    /api/marketplace/favorites          # Mis favoritos
POST   /api/marketplace/favorites/:listingId
DELETE /api/marketplace/favorites/:listingId
```

### 6.7 Admin
```
GET    /api/marketplace/admin/stats        # Estadísticas
GET    /api/marketplace/admin/listings     # Todos los listings
PUT    /api/marketplace/admin/listings/:id/approve
PUT    /api/marketplace/admin/listings/:id/reject
GET    /api/marketplace/admin/users        # Todos los usuarios
PUT    /api/marketplace/admin/users/:id/verify-seller
GET    /api/marketplace/admin/orders       # Todas las órdenes
```

---

## 7. Sistema de Pagos (Stripe)

### 7.1 Flujo de Pago

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Buyer     │     │   Platform  │     │   Seller    │
│             │     │    (ACD)    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │  1. Acepta oferta │                   │
       │──────────────────▶│                   │
       │                   │                   │
       │  2. Checkout      │                   │
       │──────────────────▶│                   │
       │                   │                   │
       │  3. Pago (Stripe) │                   │
       │──────────────────▶│                   │
       │                   │                   │
       │                   │  4. Fondos retenidos
       │                   │  (escrow)         │
       │                   │                   │
       │  5. Confirmación  │                   │
       │◀──────────────────│                   │
       │                   │                   │
       │                   │  6. Pickup        │
       │                   │  completado       │
       │                   │                   │
       │                   │  7. Liberación    │
       │                   │  de fondos        │
       │                   │──────────────────▶│
       │                   │                   │
       │                   │  8. Pago          │
       │                   │  (menos comisión) │
       │                   │──────────────────▶│
```

### 7.2 Configuración de Stripe

```typescript
// Stripe Connect para vendedores
interface StripeConfig {
  // Modo de conexión
  accountType: 'express', // Onboarding simplificado
  
  // Comisiones
  platformFee: 3.5, // % de comisión de ACD
  
  // Flujo de fondos
  paymentFlow: 'destination_charges', // Pago va directo a vendedor menos comisión
  
  // Métodos de pago aceptados
  paymentMethods: ['card', 'us_bank_account'],
  
  // Retención de fondos
  escrowDays: 3, // Días de retención después de pickup
}
```

### 7.3 Webhooks de Stripe

```typescript
// Eventos a manejar
const stripeWebhooks = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.refunded',
  'charge.dispute.created',
  'account.updated', // Stripe Connect
  'transfer.created',
];
```

---

## 8. Sistema de Usuarios

### 8.1 Roles y Permisos

```typescript
const permissions = {
  buyer: {
    canBrowseListings: true,
    canContactSellers: true,
    canMakeOffers: true,
    canPurchase: true,
    canCreateListings: false,
    canManageUsers: false,
  },
  seller: {
    canBrowseListings: true,
    canContactSellers: true,
    canMakeOffers: true,
    canPurchase: true,
    canCreateListings: true,
    canManageOwnListings: true,
    canManageUsers: false,
  },
  admin: {
    // Todo lo anterior +
    canApproveListings: true,
    canManageUsers: true,
    canViewReports: true,
    canManageOrders: true,
  },
};
```

### 8.2 Proceso de Verificación de Vendedor

1. Usuario se registra como "buyer"
2. Solicita upgrade a "seller"
3. Proporciona información de empresa:
   - Nombre legal de la empresa
   - Dirección comercial
   - Tax ID / EIN
   - Documentos de verificación
4. Admin revisa y aprueba
5. Vendedor configura Stripe Connect
6. Vendedor puede crear listings

---

## 9. Panel de Administración

### 9.1 Dashboard Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                    MARKETPLACE ADMIN                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Listings │  │  Users   │  │  Orders  │  │ Revenue  │        │
│  │   127    │  │   438    │  │    52    │  │ $125.4K  │        │
│  │  Active  │  │  Total   │  │  Month   │  │  Month   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ LISTINGS PENDIENTES DE APROBACIÓN                           ││
│  │                                                              ││
│  │ • Gooseneck 40' in Phoenix - $11,700 (hace 2h)    [✓] [✗]  ││
│  │ • Slider 20' in Oakland - $6,500 (hace 5h)        [✓] [✗]  ││
│  │ • Extendable 20-40 in Houston - $20,800 (hace 1d) [✓] [✗]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ÓRDENES RECIENTES                                           ││
│  │                                                              ││
│  │ ORD-2024-0052 | $19,500 | Paid     | Miami → Los Angeles   ││
│  │ ORD-2024-0051 | $7,150  | Pending  | Chicago → ...         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Funcionalidades Admin

1. **Gestión de Listings**
   - Ver todos los listings
   - Aprobar/Rechazar pendientes
   - Editar cualquier listing
   - Marcar como featured
   - Suspender listings

2. **Gestión de Usuarios**
   - Ver todos los usuarios
   - Aprobar vendedores
   - Suspender/Reactivar cuentas
   - Ver historial de actividad

3. **Gestión de Órdenes**
   - Ver todas las órdenes
   - Resolver disputas
   - Procesar reembolsos
   - Liberar pagos manualmente

4. **Reportes**
   - Revenue por período
   - Listings más vistos
   - Vendedores top
   - Conversiones

---

## 10. Internacionalización

### 10.1 Estructura de URLs

```
# Inglés (default)
/en/chassis-marketplace
/en/chassis-marketplace/gooseneck-40-phoenix-az
/en/marketplace/login
/en/marketplace/dashboard

# Español
/es/chassis-marketplace
/es/chassis-marketplace/gooseneck-40-phoenix-az
/es/marketplace/login
/es/marketplace/dashboard
```

### 10.2 Traducciones Clave

```typescript
const marketplaceI18n = {
  en: {
    marketplace: {
      title: 'Chassis Marketplace',
      subtitle: 'Buy & Sell Quality Chassis',
      filters: {
        type: 'Chassis Type',
        size: 'Size',
        condition: 'Condition',
        location: 'Location',
        priceRange: 'Price Range',
      },
      listing: {
        askingPrice: 'Asking Price',
        quantity: 'Available Quantity',
        location: 'Location',
        contactSeller: 'Contact Seller',
        makeOffer: 'Make an Offer',
        addToFavorites: 'Add to Favorites',
      },
      conditions: {
        asis: 'As-Is',
        roadworthy: 'Road-Worthy',
        new: 'New',
        certified: 'Certified Pre-Owned',
      },
    },
  },
  es: {
    marketplace: {
      title: 'Mercado de Chassis',
      subtitle: 'Compra y Vende Chassis de Calidad',
      filters: {
        type: 'Tipo de Chassis',
        size: 'Tamaño',
        condition: 'Condición',
        location: 'Ubicación',
        priceRange: 'Rango de Precio',
      },
      listing: {
        askingPrice: 'Precio',
        quantity: 'Cantidad Disponible',
        location: 'Ubicación',
        contactSeller: 'Contactar Vendedor',
        makeOffer: 'Hacer Oferta',
        addToFavorites: 'Agregar a Favoritos',
      },
      conditions: {
        asis: 'Como Está',
        roadworthy: 'Listo para Circular',
        new: 'Nuevo',
        certified: 'Certificado',
      },
    },
  },
};
```

---

## 11. Consideraciones de Seguridad

### 11.1 Autenticación
- Passwords hasheados con bcrypt (salt rounds: 12)
- JWT con expiración corta (15 min access, 7 días refresh)
- Rate limiting en endpoints de auth
- CAPTCHA en registro/login

### 11.2 Autorización
- Middleware de verificación de roles
- Verificación de ownership en recursos
- API keys para endpoints sensibles

### 11.3 Datos
- Validación con Zod en todos los inputs
- Sanitización de HTML/XSS
- SQL injection prevention (Drizzle ORM)
- HTTPS obligatorio

### 11.4 Pagos
- PCI compliance via Stripe
- No almacenar datos de tarjetas
- Verificación de webhooks con signature
- Logs de todas las transacciones

---

## 12. Roadmap y Timeline

### Semana 1-2: Fundamentos
```
[ ] Schema de base de datos completo
[ ] Migración de datos CSV
[ ] Sistema de autenticación
[ ] API CRUD de listings
[ ] Página de listado básica
```

### Semana 2-3: Frontend Core
```
[ ] Página de marketplace con filtros
[ ] Página de detalle de listing
[ ] Registro/Login de usuarios
[ ] Dashboard básico
[ ] Área de vendedor
```

### Semana 3-4: Mensajería
```
[ ] Sistema de conversaciones
[ ] Chat en tiempo real
[ ] Notificaciones por email
[ ] Indicadores de no leídos
```

### Semana 4-5: Ofertas y Órdenes
```
[ ] Sistema de ofertas
[ ] Flujo de negociación
[ ] Creación de órdenes
[ ] Historial de transacciones
```

### Semana 5-6: Pagos
```
[ ] Integración Stripe
[ ] Stripe Connect para vendedores
[ ] Checkout completo
[ ] Webhooks y confirmaciones
```

### Semana 6-7: Admin y Pulido
```
[ ] Panel de administración
[ ] Aprobación de listings
[ ] Gestión de usuarios
[ ] Reportes básicos
```

### Semana 7-8: i18n y Launch
```
[ ] Traducciones completas
[ ] SEO optimization
[ ] Testing final
[ ] Deploy a producción
```

---

## 13. Métricas de Éxito

### KPIs del Marketplace

| Métrica | Objetivo Mes 1 | Objetivo Mes 6 |
|---------|----------------|----------------|
| Listings activos | 50 | 200+ |
| Usuarios registrados | 100 | 500+ |
| Mensajes enviados | 200 | 1000+ |
| Transacciones completadas | 10 | 50+ |
| GMV (Gross Merchandise Value) | $100K | $500K+ |
| Tasa de conversión | 2% | 5% |

---

## 14. Próximos Pasos Inmediatos

1. **Aprobar este plan** y ajustar según feedback
2. **Crear las tablas** en el schema de Drizzle
3. **Importar datos del CSV** como listings iniciales
4. **Implementar autenticación** básica
5. **Crear la página** `/chassis-marketplace` con filtros

---

**¿Listo para comenzar la implementación?** 🚀
