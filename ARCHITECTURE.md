# American Chassis Depot — Documentación de Arquitectura

> Última actualización: 2 de Marzo, 2026

## Visión General

El proyecto tiene **dos sistemas completamente separados** que comparten el mismo frontend (React SPA) y servidor (Express), pero con bases de datos, rutas, y storage independientes:

| Sistema | Propósito | Base de datos | Prefijo API |
|---------|-----------|---------------|-------------|
| **Catálogo Legacy** | Productos nuevos de la empresa | `DATABASE_URL` (puede estar caído, tiene fallback) | `/api/` |
| **Marketplace** | Compra/venta de chassis usados entre terceros | `MARKETPLACE_DATABASE_URL` | `/api/marketplace/` |

**REGLA CRÍTICA:** Nunca mezclar código, datos, o dependencias entre estos dos sistemas.

---

## 1. Arquitectura de Archivos

```
AmericanChassisDepot/
├── client/                          # Frontend React SPA
│   └── src/
│       ├── App.tsx                  # Router principal (todas las rutas)
│       ├── lib/
│       │   ├── queryClient.ts       # TanStack Query (legacy)
│       │   ├── i18n-simple.ts       # i18n para sitio principal
│       │   ├── constants.ts         # Filtros, contacto
│       │   ├── marketplace-api.ts   # API client marketplace (separado)
│       │   └── marketplace-i18n.ts  # i18n marketplace (separado)
│       ├── pages/
│       │   ├── HomePage.tsx         # Home → usa ChassisTypeShowcase + ProductGrid
│       │   ├── ProductPage.tsx      # Detalle de producto legacy
│       │   ├── AllProductsPage.tsx  # Catálogo completo
│       │   └── marketplace/         # ← Todo el marketplace aquí
│       │       ├── MarketplacePage.tsx
│       │       ├── ListingDetailPage.tsx
│       │       ├── DashboardPage.tsx
│       │       ├── AdminPage.tsx
│       │       └── ...
│       └── components/
│           ├── home/                # Componentes del home/catálogo
│           │   ├── ChassisTypeShowcase.tsx  # Consulta /api/conditions
│           │   └── ProductGrid.tsx          # Consulta /api/chassis/filter
│           ├── marketplace/         # Componentes marketplace
│           └── ui/                  # shadcn/ui compartidos
│
├── server/
│   ├── index.ts                     # Express app + Vercel handler
│   ├── routes.ts                    # Rutas legacy + monta marketplace
│   ├── db.ts                        # Conexión DB legacy (Pool/WebSocket)
│   ├── storage.ts                   # CRUD legacy + PRODUCT_DATA embebido
│   ├── allowed-products.ts          # Lista de slugs permitidos
│   ├── services/
│   │   ├── mail.ts                  # Email legacy (SendGrid)
│   │   └── odoo.ts                  # Integración CRM Odoo
│   └── marketplace/                 # ← Sistema marketplace aislado
│       ├── db.ts                    # Conexión DB marketplace (Neon HTTP)
│       ├── routes.ts                # Todas las rutas marketplace
│       ├── storage.ts               # CRUD marketplace
│       ├── auth.ts                  # JWT authentication
│       ├── email.ts                 # Emails marketplace
│       ├── stripe.ts               # Stripe Connect
│       ├── stripe-routes.ts        # Rutas de pago
│       ├── cloudinary.ts           # Upload de imágenes
│       ├── rate-limiter.ts
│       ├── audit-logger.ts
│       └── sitemap.ts
│
├── shared/
│   ├── schema.ts                    # Schema legacy (conditions, chassis_models, contact_messages)
│   └── marketplace-schema.ts        # Schema marketplace (20+ tablas)
│
├── vercel.json                      # Deploy config
├── drizzle.config.ts               # Solo apunta a schema.ts legacy
└── package.json
```

---

## 2. Flujo de Datos — Catálogo Legacy

### Cómo se cargan los productos del home (`/en`)

```
HomePage.tsx
  ├── ChassisTypeShowcase
  │     └── useQuery('/api/conditions')
  │           └── server/routes.ts → storage.getAllConditions()
  │                 └── DB query → fallback FALLBACK_CONDITIONS si falla
  │
  └── ProductGrid (showOnlyNew=true)
        └── useQuery('/api/chassis/filter', {condition: 'new-chassis', ...})
              └── server/routes.ts → storage.filterChassisModels('new-chassis', ...)
                    └── getConditionBySlug('new-chassis') → fallback si DB falla
                    └── Filtra PRODUCT_DATA embebido en memoria
```

### Datos embebidos vs Base de datos

| Dato | Fuente | Notas |
|------|--------|-------|
| **Productos (chassis)** | `PRODUCT_DATA` array en `storage.ts` | ~43 productos hardcoded, NO dependen de DB |
| **Condiciones** | DB tabla `conditions` con fallback | Si DB falla, usa `FALLBACK_CONDITIONS` |
| **Slugs permitidos** | `ALLOWED_PRODUCT_SLUGS` en `allowed-products.ts` | 20 EN + 23 ES |

### Separación por idioma

| Idioma | conditionToUse en ProductGrid | Lógica de filtrado |
|--------|-------------------------------|-------------------|
| **Inglés (home)** | `'new-chassis'` | `conditionId === 1` |
| **Inglés (products)** | `'english-only'` | Excluye nombres con `" - Español"` |
| **Español** | `'chassis-nuevos-espanol'` | `conditionId === 5` o nombre con `" - Español"` |

---

## 3. Flujo de Datos — Marketplace

### Cómo se cargan los listings (`/en/chassis-marketplace`)

```
MarketplacePage.tsx
  ├── useInfiniteQuery(['marketplace-listings-infinite', filters])
  │     └── marketplace-api.ts → getListings(filters)
  │           └── fetch('/api/marketplace/listings?...')
  │                 └── marketplace/routes.ts → marketplace/storage.ts → getListings()
  │                       └── Query DB marketplace (marketplace_listings + marketplace_users)
  │
  ├── useQuery(['chassis-types']) → getChassisTypes()
  │     └── /api/marketplace/reference/chassis-types
  │
  ├── useQuery(['conditions']) → getConditions()
  │     └── /api/marketplace/reference/conditions
  │
  └── useQuery(['states']) → getStates()
        └── /api/marketplace/reference/states
```

### Filtros disponibles en marketplace

| Filtro | Campo DB | Tipo comparación | Valores posibles |
|--------|----------|-------------------|-----------------|
| chassisType | `marketplace_listings.chassis_type` | `eq()` exacto | Gooseneck, Slider, Extendable, Spread, Triaxle, Tank |
| chassisSize | `marketplace_listings.chassis_size` | `eq()` exacto | 20', 40', 45', 53', 20-40', 40-45', 40-45-48', 40-45-48-53' |
| condition | `marketplace_listings.condition` | `eq()` exacto | As-Is, Road-Worthy, New, Certified |
| state | `marketplace_listings.state` | `eq()` exacto | Códigos 2 letras (FL, CA, TX, etc.) |
| minPrice / maxPrice | `marketplace_listings.price_per_unit` | `gte()` / `lte()` | Numérico (decimal) |
| search | title, titleEs, city, state, listingNumber | `ilike()` | Texto libre |
| sortBy | - | ORDER BY | date_desc, date_asc, price_asc, price_desc, views |

### Autenticación marketplace

- JWT con access token (15min) + refresh token (7 días)
- Roles: `buyer`, `seller`, `admin`, `super_admin`
- Middleware: `authenticateToken`, `optionalAuth`, `requireSeller`, `requireAdmin`, `requireSuperAdmin`

---

## 4. Bases de Datos

### DB Legacy (`DATABASE_URL`)

```sql
-- Tablas (drizzle schema.ts)
conditions          (id, name, slug, description, image_url)
chassis_models      (id, name, slug, condition_id, manufacturer, size, ...)
contact_messages    (id, name, email, company, phone, message, ...)
```

> **Nota:** Los productos se cargan de `PRODUCT_DATA` embebido, NO de la tabla `chassis_models`. La tabla `conditions` tiene fallback hardcoded.

### DB Marketplace (`MARKETPLACE_DATABASE_URL`)

```sql
-- Tablas principales (drizzle marketplace-schema.ts)
marketplace_users           -- Usuarios con roles
marketplace_chassis_types   -- Tipos de chassis (referencia)
marketplace_conditions      -- Condiciones (referencia)
marketplace_listings        -- Listings de venta
listing_images              -- Imágenes por listing
marketplace_conversations   -- Conversaciones buyer/seller
marketplace_messages        -- Mensajes
marketplace_offers          -- Ofertas
marketplace_orders          -- Órdenes/pagos
marketplace_favorites       -- Favoritos
marketplace_notifications   -- Notificaciones
marketplace_seller_stats    -- Estadísticas de vendedores
marketplace_listing_views   -- Tracking de vistas
marketplace_audit_logs      -- Auditoría admin
marketplace_activity_log    -- Log de actividad
marketplace_saved_searches  -- Búsquedas guardadas
marketplace_reviews         -- Reseñas
marketplace_reports         -- Reportes
marketplace_settings        -- Configuración
marketplace_email_templates -- Plantillas de email
```

---

## 5. API Endpoints — Referencia Completa

### Legacy `/api/`

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/conditions` | Condiciones (New/Used) | No |
| GET | `/api/conditions/:slug` | Condición por slug | No |
| GET | `/api/conditions/:slug/chassis` | Chassis por condición | No |
| GET | `/api/chassis` | Todos los modelos | No |
| GET | `/api/chassis/filter` | Filtrar chassis | No |
| GET | `/api/chassis/:slug` | Modelo por slug | No |
| POST | `/api/contact` | Formulario contacto | No |
| POST | `/api/download-brochure` | Request brochure | No |
| GET | `/api/odoo/test` | Test conexión Odoo | No |
| GET | `/api/odoo/stats` | Stats Odoo | No |
| POST | `/api/odoo/submit` | Enviar formulario a Odoo | No |
| GET | `/sitemap.xml` | Sitemap dinámico | No |

### Marketplace `/api/marketplace/`

| Método | Endpoint | Auth | Rol mínimo |
|--------|----------|------|------------|
| POST | `/auth/register` | No | - |
| POST | `/auth/login` | No | - |
| POST | `/auth/refresh` | No | - |
| GET | `/auth/me` | JWT | buyer |
| GET | `/listings` | Opcional | - |
| GET | `/listings/:slug` | Opcional | - |
| POST | `/listings` | JWT | seller |
| PUT | `/listings/:id` | JWT | seller (owner) |
| DELETE | `/listings/:id` | JWT | seller (owner) |
| GET | `/reference/chassis-types` | No | - |
| GET | `/reference/conditions` | No | - |
| GET | `/reference/states` | No | - |
| GET | `/seller/listings` | JWT | seller |
| GET | `/seller/listings/stats` | JWT | seller |
| GET | `/seller/listings/:id/edit` | JWT | seller |
| GET | `/conversations` | JWT | buyer |
| POST | `/conversations` | JWT | buyer |
| GET | `/conversations/:id/messages` | JWT | buyer |
| POST | `/conversations/:id/messages` | JWT | buyer |
| POST | `/offers` | JWT | buyer |
| GET | `/offers/sent` | JWT | buyer |
| GET | `/offers/received` | JWT | seller |
| PUT | `/offers/:id/respond` | JWT | seller |
| POST | `/favorites/:listingId` | JWT | buyer |
| GET | `/favorites` | JWT | buyer |
| GET | `/notifications` | JWT | buyer |
| PUT | `/notifications/:id/read` | JWT | buyer |
| PUT | `/notifications/read-all` | JWT | buyer |
| GET | `/admin/stats` | JWT | admin |
| GET | `/admin/listings` | JWT | admin |
| GET | `/admin/listings/pending` | JWT | admin |
| PUT | `/admin/listings/:id/approve` | JWT | admin |
| PUT | `/admin/listings/:id/reject` | JWT | admin |
| PUT | `/admin/listings/:id/status` | JWT | admin |
| DELETE | `/admin/listings/:id` | JWT | admin |
| GET | `/admin/offers` | JWT | admin |
| GET | `/admin/users` | JWT | admin |
| GET | `/admin/users/:id` | JWT | admin |
| PUT | `/admin/users/:id` | JWT | admin |
| PUT | `/admin/users/:id/role` | JWT | super_admin |
| PUT | `/admin/users/:id/suspend` | JWT | admin |
| PUT | `/admin/users/:id/activate` | JWT | admin |
| DELETE | `/admin/users/:id` | JWT | super_admin |
| GET | `/listings/:id/images` | JWT | seller |
| POST | `/listings/:id/images` | JWT | seller |
| DELETE | `/listings/:lid/images/:iid` | JWT | seller |
| PUT | `/listings/:lid/images/:iid/primary` | JWT | seller |
| PUT | `/listings/:id/images/reorder` | JWT | seller |
| GET | `/upload/status` | JWT | seller |
| POST | `/upload/image` | JWT | seller |
| POST | `/upload/image-url` | JWT | seller |
| GET | `/upload/signed-params` | JWT | seller |
| DELETE | `/upload/image/:publicId` | JWT | seller |
| POST | `/payments/connect/onboard` | JWT | seller |
| GET | `/payments/connect/status` | JWT | seller |
| GET | `/payments/connect/dashboard` | JWT | seller |
| POST | `/payments/checkout` | JWT | buyer |
| GET | `/payments/checkout/:sessionId` | JWT | buyer |

---

## 6. Rutas Frontend

### Sitio principal

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/:lang` | HomePage | Home con hero, showcase, productos, contacto |
| `/:lang/products` | AllProductsPage | Catálogo completo con filtros |
| `/:lang/products/:slug` | ProductPage | Detalle de producto |
| `/:lang/new-chassis` | NewChassisPage | Solo chassis nuevos |
| `/:lang/used-chassis` | UsedChassisPage | Solo chassis usados |
| `/:lang/brands/:slug` | BrandPage | Productos por marca |
| `/:lang/about` | AboutPage | Acerca de |
| `/:lang/contact` | ContactPage | Contacto |
| `/:lang/size/:size` | HomePage | Home filtrado por tamaño |

### Marketplace

| Ruta | Componente | Auth |
|------|------------|------|
| `/:lang/marketplace` | MarketplaceLandingPage | No |
| `/:lang/chassis-marketplace` | MarketplacePage | No |
| `/:lang/chassis-marketplace/:slug` | ListingDetailPage | No |
| `/:lang/marketplace/login` | LoginPage | No |
| `/:lang/marketplace/register` | RegisterPage | No |
| `/:lang/marketplace/dashboard` | DashboardPage | JWT |
| `/:lang/marketplace/seller/listings` | SellerListingsPage | JWT + seller |
| `/:lang/marketplace/seller/create` | CreateListingPage | JWT + seller |
| `/:lang/marketplace/seller/listings/:id/images` | ListingImagesPage | JWT + seller |
| `/:lang/marketplace/admin` | AdminPage | JWT + admin |

---

## 7. Variables de Entorno

### Obligatorias

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL legacy (pool/WebSocket) |
| `MARKETPLACE_DATABASE_URL` | PostgreSQL marketplace (Neon HTTP). Si no se define, usa `DATABASE_URL` |
| `JWT_SECRET` | Secreto para tokens JWT (mínimo 32 chars) |
| `SENDGRID_API_KEY` | API key de SendGrid para emails |
| `SENDGRID_FROM_EMAIL` | Email remitente |

### Opcionales

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno | `development` |
| `VERCEL` | Auto-detectado en Vercel | - |
| `VERCEL_URL` | URL del proyecto en Vercel | - |
| `APP_URL` | URL base del sitio | - |
| `CLOUDINARY_CLOUD_NAME` | Nombre cloud Cloudinary | - |
| `CLOUDINARY_API_KEY` | API key Cloudinary | - |
| `CLOUDINARY_API_SECRET` | Secreto Cloudinary | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | - |
| `STRIPE_PLATFORM_FEE_PERCENT` | Comisión plataforma | `3.5` |
| `ODOO_URL` | URL de Odoo CRM | - |
| `ODOO_USERNAME` | Usuario Odoo | - |
| `ODOO_PASSWORD` | Contraseña Odoo | - |
| `ODOO_COMPANY_ID` | ID empresa Odoo | - |
| `ODOO_DATABASE` | Base de datos Odoo | - |
| `MARKETPLACE_ADMIN_EMAIL` | Email admin marketplace | - |

---

## 8. Guía para Agregar Cosas Sin Romper Nada

### Agregar un nuevo producto al catálogo legacy

1. Editar `server/storage.ts` → agregar objeto al array `PRODUCT_DATA`
2. Agregar el slug a `server/allowed-products.ts` → `ALLOWED_PRODUCT_SLUGS`
3. Usar `conditionId: 1` para productos EN, `conditionId: 5` para ES
4. Incluir sufijo `-esp` en el slug para productos en español
5. **NO tocar** `server/marketplace/` ni `shared/marketplace-schema.ts`

### Agregar un nuevo tipo de chassis al marketplace

1. Insertar en tabla `marketplace_chassis_types` vía DB o seed script
2. Los filtros del frontend se actualizan automáticamente (cargan de `/api/marketplace/reference/chassis-types`)
3. **NO tocar** `server/storage.ts` ni `shared/schema.ts`

### Agregar una nueva condición al marketplace

1. Insertar en tabla `marketplace_conditions` vía DB
2. Al crear listings, el valor de `condition` debe coincidir exactamente (case-sensitive)
3. **NO tocar** nada del catálogo legacy

### Agregar una nueva ruta frontend

1. Agregar `<Route>` en `client/src/App.tsx`
2. Crear componente en `client/src/pages/` (o `client/src/pages/marketplace/` si es marketplace)
3. Siempre usar prefijo `/:lang` en la ruta

### Agregar un nuevo endpoint API

- **Legacy:** Agregar en `server/routes.ts`
- **Marketplace:** Agregar en `server/marketplace/routes.ts`
- **NUNCA** cruzar imports entre `server/storage.ts` y `server/marketplace/storage.ts`

### Modificar el schema de base de datos

- **Legacy:** Editar `shared/schema.ts` → ejecutar `npm run db:push`
- **Marketplace:** Editar `shared/marketplace-schema.ts` → aplicar migration manualmente en la DB marketplace
- `drizzle.config.ts` solo apunta a `shared/schema.ts` (legacy)

---

## 9. Deploy

### Proceso automático

1. Push a `main` en GitHub
2. Vercel detecta el cambio y ejecuta build
3. Build: `vite build` (frontend) + `esbuild` (servidor)
4. Deploy a producción en ~90 segundos

### Verificación post-deploy

```bash
# Catálogo legacy
curl -s https://www.americanchassisdepot.com/api/conditions | python3 -m json.tool
curl -s "https://www.americanchassisdepot.com/api/chassis/filter?condition=english-only&size=all" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))"

# Marketplace
curl -s "https://www.americanchassisdepot.com/api/marketplace/listings?limit=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['pagination']['total'])"
curl -s "https://www.americanchassisdepot.com/api/marketplace/reference/conditions" | python3 -m json.tool
```

---

## 10. Decisiones de Arquitectura y Contexto

### Por qué los productos están embebidos en código

Los productos del catálogo principal se cargan de `PRODUCT_DATA` (array hardcoded en `server/storage.ts`) en lugar de la base de datos. Esto fue una decisión para:
- Evitar dependencia de DB para el catálogo principal
- Garantizar disponibilidad del sitio aunque la DB falle
- Simplificar el deploy (no requiere migrations)

### Por qué hay fallback en conditions

La tabla `conditions` de la DB legacy puede no estar disponible en producción. Se agregó `FALLBACK_CONDITIONS` (2026-03-02) para que el home no se rompa si la DB falla. Los IDs del fallback coinciden con los `conditionId` de `PRODUCT_DATA`.

### Separación de bases de datos

El marketplace usa una DB separada (`MARKETPLACE_DATABASE_URL`) para:
- Aislamiento total de datos de terceros vs productos propios
- Escalabilidad independiente
- Seguridad (credenciales separadas)

---

## 11. Stack Tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React + TypeScript | 18.3 |
| Routing | Wouter | 3.3 |
| State | TanStack Query | 5.60 |
| UI | Radix UI + shadcn/ui + Tailwind CSS | - |
| Animations | Framer Motion | 11.13 |
| Backend | Express.js + TypeScript | 4.21 |
| ORM | Drizzle | 0.39 |
| DB | PostgreSQL (Neon) | - |
| Auth | JWT (jsonwebtoken + bcryptjs) | - |
| Payments | Stripe Connect | - |
| Images | Cloudinary | 2.9 |
| Email | SendGrid | 8.1 |
| CRM | Odoo (XML-RPC) | - |
| Deploy | Vercel (Node + Static) | - |
