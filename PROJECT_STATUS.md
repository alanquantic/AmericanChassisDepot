# American Chassis Depot — Documentación Maestra del Proyecto

**Última actualización:** 7 de abril de 2026  
**Rama principal:** `main`  
**Repositorio:** https://github.com/alanquantic/AmericanChassisDepot  
**Deploy:** Vercel  
**Líneas de código:** ~28,000 (client + server + shared)

---

## Tabla de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitectura General](#3-arquitectura-general)
4. [Estructura de Archivos](#4-estructura-de-archivos)
5. [Módulo 1: Sitio Corporativo (Catálogo)](#5-módulo-1-sitio-corporativo-catálogo)
6. [Módulo 2: Marketplace B2B](#6-módulo-2-marketplace-b2b)
7. [Base de Datos](#7-base-de-datos)
8. [Internacionalización (i18n)](#8-internacionalización-i18n)
9. [Integraciones Externas](#9-integraciones-externas)
10. [Autenticación y Seguridad](#10-autenticación-y-seguridad)
11. [Variables de Entorno](#11-variables-de-entorno)
12. [Deploy y Configuración](#12-deploy-y-configuración)
13. [Scripts Disponibles](#13-scripts-disponibles)
14. [Problemas Conocidos y Deuda Técnica](#14-problemas-conocidos-y-deuda-técnica)
15. [Cambios Recientes de Seguridad (Abril 2026)](#15-cambios-recientes-de-seguridad-abril-2026)
16. [Próximos Pasos / Roadmap](#16-próximos-pasos--roadmap)

---

## 1. Resumen del Proyecto

**American Chassis Depot** es una plataforma web full-stack para la venta de chasis de contenedores marítimos. Tiene dos módulos principales:

| Módulo | Descripción |
|--------|-------------|
| **Sitio Corporativo** | Catálogo bilingüe (EN/ES) de chasis nuevos y usados con fichas técnicas, brochures PDF, formularios de contacto/cotización y SEO optimizado. |
| **Marketplace B2B** | Plataforma de compra/venta entre dealers con listados, ofertas, mensajería, favoritos, panel de administración, pagos Stripe y subida de imágenes Cloudinary. |

---

## 2. Stack Tecnológico

### Frontend
| Tecnología | Uso |
|-----------|-----|
| React 18 | UI framework |
| Vite 5 | Bundler y dev server |
| TypeScript | Tipado |
| Tailwind CSS | Estilos |
| shadcn/ui (Radix UI) | Componentes UI |
| Wouter | Enrutamiento (SPA) |
| TanStack Query v5 | Estado del servidor / cache |
| React Hook Form + Zod | Formularios y validación |
| Framer Motion | Animaciones |
| Recharts | Gráficas (admin) |
| lucide-react | Iconos |

### Backend
| Tecnología | Uso |
|-----------|-----|
| Express.js | Servidor HTTP |
| TypeScript (tsx/esbuild) | Lenguaje y compilación |
| Drizzle ORM | Acceso a base de datos |
| Neon Serverless | PostgreSQL serverless |
| JWT (jsonwebtoken + bcryptjs) | Autenticación marketplace |
| Zod | Validación de datos en API |

### Servicios Externos
| Servicio | Uso | Estado |
|----------|-----|--------|
| **Neon PostgreSQL** | Base de datos (2 DBs separadas) | ✅ Activo |
| **SendGrid** | Envío de emails transaccionales | ✅ Activo |
| **Stripe + Connect** | Pagos y onboarding de sellers | ⚙️ Configurado |
| **Cloudinary** | Subida y hosting de imágenes | ⚙️ Configurado |
| **Odoo CRM** | Leads desde formularios de contacto | ⏳ **Pendiente migrar a Google Sheets** |
| **Vercel** | Hosting y deploy | ✅ Activo |
| **ElevenLabs** | Widget de voz | ⚙️ Opcional |
| **Google Analytics** | Tracking | ⚙️ Configurado |

---

## 3. Arquitectura General

```
┌────────────────────────────────────────────────────────┐
│                     VERCEL                              │
│  ┌──────────────┐         ┌──────────────────────────┐ │
│  │  Static Build │         │   Node.js (Serverless)   │ │
│  │  (Vite → dist)│         │   Express API Handler    │ │
│  │               │         │                          │ │
│  │  React SPA    │ ──API──▶│  /api/*  (server/routes) │ │
│  │  /:lang/*     │         │  /api/marketplace/*      │ │
│  └──────────────┘         └───────────┬──────────────┘ │
└────────────────────────────────────────┼────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                     │
              ┌─────▼─────┐    ┌────────▼──────┐    ┌───────▼───────┐
              │  Neon DB   │    │   Neon DB      │    │  Servicios    │
              │  (Catálogo)│    │  (Marketplace) │    │  Externos     │
              │  3 tablas  │    │  20 tablas     │    │  SendGrid     │
              └────────────┘    └───────────────┘    │  Stripe       │
                                                      │  Cloudinary   │
                                                      │  Odoo → Sheets│
                                                      └───────────────┘
```

---

## 4. Estructura de Archivos

```
AmericanChassisDepot/
├── client/                          # Frontend React
│   ├── index.html                   # Entry point HTML
│   ├── public/                      # Archivos estáticos
│   │   ├── assets/                  # Imágenes de productos (.webp, .jpg)
│   │   ├── brochures/en/            # PDFs de fichas técnicas (inglés)
│   │   ├── brochures/es/            # PDFs de fichas técnicas (español)
│   │   └── videos/                  # Videos hero
│   └── src/
│       ├── App.tsx                  # Router principal (Wouter)
│       ├── main.tsx                 # Entry point React
│       ├── components/
│       │   ├── home/                # Secciones del homepage (Hero, ProductGrid, etc.)
│       │   ├── layout/              # Header, Footer, FloatingButton
│       │   ├── marketplace/         # Componentes marketplace (SEOHead, PasswordStrength)
│       │   ├── seo/                 # Meta tags SEO
│       │   ├── shared/              # ContactForm, LanguageSelector, etc.
│       │   └── ui/                  # 47 componentes shadcn/ui
│       ├── hooks/                   # use-mobile, use-toast, use-page-tracking
│       ├── lib/
│       │   ├── i18n-simple.ts       # ★ Sistema i18n principal (traducciones EN/ES)
│       │   ├── marketplace-i18n.ts  # Traducciones del marketplace
│       │   ├── marketplace-api.ts   # Cliente API marketplace (fetch + JWT refresh)
│       │   ├── queryClient.ts       # Config TanStack Query
│       │   ├── chassisUtils.ts      # Utils de chasis + traducciones ES técnicas
│       │   ├── i18n.ts              # ⚠️ Sistema i18n alternativo (NO USADO)
│       │   ├── i18n-working.ts      # ⚠️ Otra variante (NO USADO)
│       │   └── clearCache.ts        # ⚠️ No importado por nadie
│       └── pages/
│           ├── HomePage.tsx         # Homepage principal
│           ├── ProductPage.tsx      # Detalle de producto
│           ├── AboutPage.tsx        # Acerca de (⚠️ solo inglés)
│           ├── ContactPage.tsx      # Contacto
│           ├── NewChassisPage.tsx   # Landing chasis nuevos
│           ├── UsedChassisPage.tsx  # Consulta de usados
│           ├── AllProductsPage.tsx  # Catálogo completo
│           ├── BrandPage.tsx        # Marca
│           └── marketplace/         # 12 páginas del marketplace
│               ├── MarketplacePage.tsx       # Listado público
│               ├── ListingDetailPage.tsx     # Detalle anuncio
│               ├── AuthPages.tsx             # Login + Register
│               ├── DashboardPage.tsx         # Panel usuario
│               ├── AdminPage.tsx             # Consola admin
│               ├── CreateListingPage.tsx     # Crear anuncio
│               ├── SellerListingsPage.tsx    # Gestión de anuncios
│               ├── ListingImagesPage.tsx     # Subir imágenes
│               ├── MarketplaceLandingPage.tsx # Landing marketing
│               ├── ManualUserPage.tsx        # Manual de usuario (EN/ES)
│               └── ManualAdminPage.tsx       # Manual admin (EN/ES)
│
├── server/                          # Backend Express
│   ├── index.ts                     # Entry point + bootstrap
│   ├── routes.ts                    # Rutas API del catálogo + Odoo
│   ├── storage.ts                   # ★ Capa de datos catálogo (PRODUCT_DATA embebido)
│   ├── db.ts                        # Conexión PostgreSQL (Neon Pool)
│   ├── chassis-data.ts              # Datos de chasis (seed)
│   ├── allowed-products.ts          # Slugs permitidos
│   ├── seed-super-admin.ts          # Script seed admin
│   ├── vite.ts                      # Vite middleware (dev) / static (prod)
│   ├── services/
│   │   ├── mail.ts                  # ★ SendGrid (sitio corporativo)
│   │   └── odoo.ts                  # Odoo CRM (⏳ migrar a Google Sheets)
│   └── marketplace/
│       ├── routes.ts                # ★ ~70 endpoints API marketplace
│       ├── auth.ts                  # JWT + middleware autenticación
│       ├── storage.ts               # Capa de datos marketplace (Drizzle)
│       ├── db.ts                    # Conexión marketplace (Neon HTTP)
│       ├── email.ts                 # SendGrid (marketplace emails)
│       ├── stripe.ts                # Stripe service
│       ├── stripe-routes.ts         # Endpoints Stripe
│       ├── cloudinary.ts            # Cloudinary service
│       ├── rate-limiter.ts          # Rate limiting auth
│       ├── audit-logger.ts          # Logs de auditoría admin
│       └── sitemap.ts               # Sitemap marketplace
│
├── shared/                          # Tipos compartidos client ↔ server
│   ├── schema.ts                    # Drizzle schema (catálogo: 3 tablas)
│   └── marketplace-schema.ts        # Drizzle schema (marketplace: 20 tablas)
│
├── data/                            # Datos estáticos y mappings
│   ├── image_mapping.csv            # Mapeo producto → imagen (EN)
│   ├── image_mapping_es.csv         # Mapeo producto → imagen (ES)
│   ├── uploads_en/                  # Imágenes webp (EN)
│   └── uploads_es/                  # Imágenes webp (ES)
│
├── attached_assets/                 # Fichas técnicas originales (.txt, .jpg, .docx)
│
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # TypeScript config
├── vite.config.ts                   # Vite config (React + shadcn theme)
├── tailwind.config.ts               # Tailwind config
├── drizzle.config.ts                # Drizzle Kit config (solo schema principal)
├── vercel.json                      # Deploy Vercel
├── env.example                      # Plantilla de variables de entorno
└── *.md                             # Documentación (ver abajo)
```

---

## 5. Módulo 1: Sitio Corporativo (Catálogo)

### Páginas y Rutas

Todas las rutas usan el prefijo `/:lang` (en | es):

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/:lang` | HomePage | Hero, productos, ventajas, contacto |
| `/:lang/products` | AllProductsPage | Catálogo filtrable |
| `/:lang/products/:slug` | ProductPage | Detalle con specs y brochure |
| `/:lang/brands/:slug` | BrandPage | Marca y modelos |
| `/:lang/contact` | ContactPage | Formulario de contacto |
| `/:lang/about` | AboutPage | Acerca de la empresa |
| `/:lang/new-chassis` | NewChassisPage | Landing de chasis nuevos |
| `/:lang/used-chassis` | UsedChassisPage | Consulta de chasis usados |

### API del Catálogo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/conditions` | Listar condiciones (New/Used) |
| GET | `/api/conditions/:slug` | Condición por slug |
| GET | `/api/chassis` | Todos los modelos |
| GET | `/api/chassis/filter` | Filtrar modelos (condition, size, manufacturer, characteristic) |
| GET | `/api/chassis/:slug` | Modelo por slug |
| GET | `/api/conditions/:slug/chassis` | Modelos por condición |
| POST | `/api/contact` | Enviar formulario de contacto |
| POST | `/api/download-brochure` | Solicitar brochure |
| GET | `/sitemap.xml` | Sitemap dinámico EN/ES |

### Origen de Datos del Catálogo

Los productos **NO provienen de la base de datos** en su mayoría. El catálogo se lee de:

1. **`server/storage.ts` → `PRODUCT_DATA`**: Array gigante embebido con todos los modelos, imágenes, specs y traducciones
2. **`server/chassis-data.ts`**: Datos de seed (chasis nuevos)
3. **`data/image_mapping.csv` / `image_mapping_es.csv`**: Mapeos de imágenes

La tabla `chassis_models` en PostgreSQL existe pero solo se usa parcialmente.

### Formularios de Contacto

Los formularios envían datos vía:
1. **SendGrid** → Notificación interna a admins + confirmación al cliente
2. **Odoo CRM** → Crea lead y contacto (⏳ **pendiente migrar a Google Sheets**)
3. **PostgreSQL** → Guarda en `contact_messages` (fallback si DB no disponible)

Protecciones: honeypot field + validación de timestamp (5 min expiry).

---

## 6. Módulo 2: Marketplace B2B

### Páginas del Marketplace

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/:lang/marketplace` | Público | Landing de marketing |
| `/:lang/chassis-marketplace` | Público | Listado con filtros |
| `/:lang/chassis-marketplace/:slug` | Público | Detalle de anuncio |
| `/:lang/marketplace/login` | Público | Login JWT |
| `/:lang/marketplace/register` | Público | Registro |
| `/:lang/marketplace/dashboard` | Auth requerida | Panel de usuario |
| `/:lang/marketplace/seller/listings` | Seller+ | Gestión de anuncios |
| `/:lang/marketplace/seller/create` | Seller+ | Crear anuncio |
| `/:lang/marketplace/seller/listings/:id/images` | Seller+ | Subir imágenes |
| `/:lang/marketplace/admin` | Admin+ | Consola de administración |
| `/:lang/marketplace/manual/user` | Público | Manual de usuario EN/ES |
| `/:lang/marketplace/manual/admin` | Público | Manual de admin EN/ES |

### Roles de Usuario

| Rol | Capacidades |
|-----|-------------|
| `buyer` | Buscar, consultar, favoritos, ofertas, mensajes |
| `seller` | Todo de buyer + crear/gestionar listings, recibir ofertas |
| `admin` | Todo de seller + aprobar/rechazar listings, gestionar usuarios, ver stats |
| `super_admin` | Todo de admin + cambiar roles, eliminar usuarios |

### API del Marketplace (~70 endpoints)

**Auth:** register, login, refresh, me  
**Listings:** CRUD, filtros, slug, inquiries públicas  
**Seller:** listings propias, stats, edición, imágenes (CRUD + reorder)  
**Conversations:** crear, listar, mensajes (con validación de pertenencia ✅)  
**Offers:** crear, enviadas, recibidas, responder (accept/reject/counter)  
**Favorites:** toggle, listar  
**Notifications:** listar, marcar leídas  
**Admin:** stats, listings pendientes, aprobar/rechazar, gestión de usuarios  
**Upload:** Cloudinary (base64, URL, signed params, delete)  
**Payments:** Stripe Connect onboard, checkout, refund, webhook  
**SEO:** sitemap-marketplace.xml, sitemap-index.xml

---

## 7. Base de Datos

### BD Principal (Catálogo) — `DATABASE_URL`

Conexión: Neon Serverless (WebSocket Pool)

| Tabla | Columnas clave | Uso |
|-------|---------------|-----|
| `conditions` | id, name, slug, description, imageUrl | Tipos de condición (New/Used) |
| `chassis_models` | id, name, slug, conditionId, specs... | Modelos de chasis (parcialmente usado) |
| `contact_messages` | id, name, email, message, createdAt(text) | Mensajes de contacto |

### BD Marketplace — `MARKETPLACE_DATABASE_URL`

Conexión: Neon HTTP (proyecto separado)

| Grupo | Tablas |
|-------|--------|
| **Core** | `marketplace_users`, `marketplace_listings`, `listing_images`, `marketplace_chassis_types`, `marketplace_conditions` |
| **Comunicación** | `marketplace_conversations`, `marketplace_messages`, `marketplace_notifications` |
| **Transacciones** | `marketplace_offers`, `marketplace_orders` |
| **Usuario** | `marketplace_favorites`, `marketplace_saved_searches`, `marketplace_reviews`, `marketplace_seller_stats` |
| **Sistema** | `marketplace_settings`, `marketplace_reports`, `marketplace_activity_log`, `marketplace_listing_views`, `marketplace_email_templates`, `marketplace_audit_logs` |

**Nota:** `drizzle.config.ts` solo apunta al schema principal. El marketplace se gestiona por separado con `db:push` o SQL directo.

---

## 8. Internacionalización (i18n)

### Sistema en Producción

**Archivo principal:** `client/src/lib/i18n-simple.ts`

- Estado global (sin React Context)
- Hook `useLanguage()` con re-render automático
- El idioma se extrae del segmento `/:lang` en la URL

### Archivos con Traducciones

| Archivo | Contenido |
|---------|-----------|
| `lib/i18n-simple.ts` | Traducciones principales del sitio (nav, hero, formularios, 404, etc.) |
| `lib/marketplace-i18n.ts` | Traducciones marketplace (listings, dashboard, etc.) |
| `lib/chassisUtils.ts` | Traducción ES de specs técnicas |
| `MarketplaceLandingPage.tsx` | Traducciones embebidas de la landing |
| `ManualUserPage.tsx` / `ManualAdminPage.tsx` | Contenido largo EN/ES inline |

### Páginas sin Traducir (solo inglés)

- `AboutPage.tsx` — contenido hardcoded en inglés
- `NewChassisPage.tsx` — textos en inglés fijo
- Algunos toasts del marketplace (favoritos, clipboard)

### Archivos i18n NO USADOS (código muerto)

- `lib/i18n.ts` — sistema alternativo con React Context
- `lib/i18n-working.ts` — otra variante
- `LanguageSelector.tsx` y `LanguageSelector-working.tsx` — Header usa `LanguageSelector-simple.tsx`

---

## 9. Integraciones Externas

### SendGrid (Email)

**Archivos:** `server/services/mail.ts` (catálogo), `server/marketplace/email.ts` (marketplace)

- Notificaciones internas a admins (array `NOTIFICATION_EMAILS`)
- Confirmación al cliente (EN/ES según URL)
- Emails de marketplace: welcome, ofertas, mensajes, aprobaciones, inquiries, password reset

### Odoo CRM → ⏳ Migrar a Google Sheets

**Archivo:** `server/services/odoo.ts`

- Crea leads y contactos en Odoo vía JSON-RPC
- Se invoca desde formularios de contacto y brochure
- **Estado:** Credenciales eliminadas del código. Variables de entorno requeridas. **Pendiente reemplazar con Google Sheets API.**

### Stripe

**Archivos:** `server/marketplace/stripe.ts`, `server/marketplace/stripe-routes.ts`

- Stripe Connect para onboarding de sellers
- Checkout sessions para pagos
- Webhooks para confirmación
- Reembolsos (admin)

### Cloudinary

**Archivo:** `server/marketplace/cloudinary.ts`

- Subida de imágenes (base64 y URL)
- Parámetros firmados para upload directo desde browser
- Eliminación de imágenes
- Organizado por carpetas: `marketplace/listings/{userId}`

---

## 10. Autenticación y Seguridad

### Marketplace Auth (JWT)

- **Access token**: 15 min (configurable via `JWT_ACCESS_TOKEN_EXPIRY`)
- **Refresh token**: 7 días (configurable via `JWT_REFRESH_TOKEN_EXPIRY`)
- **Password hashing**: bcrypt con 12 rounds
- **Brute force protection**: bloqueo de cuenta tras 5 intentos fallidos (15 min)
- **Rate limiting**: en login y registro

### Middlewares de Autorización

| Middleware | Roles permitidos |
|-----------|-----------------|
| `authenticateToken` | Cualquier usuario autenticado |
| `optionalAuth` | Autenticado o anónimo |
| `requireBuyer` | buyer, seller, admin, super_admin |
| `requireSeller` | seller, admin, super_admin |
| `requireAdmin` | admin, super_admin |
| `requireSuperAdmin` | solo super_admin |

### Protecciones Aplicadas (Abril 2026)

- ✅ Credenciales Odoo eliminadas del código fuente
- ✅ Contraseña admin eliminada del código fuente
- ✅ JWT secret ya no tiene fallback predecible
- ✅ Endpoints Odoo protegidos con `authenticateToken + requireAdmin`
- ✅ IDOR en conversaciones arreglado (validación de buyer/seller)
- ✅ Mass assignment en PUT /listings arreglado (schema Zod)
- ✅ Credenciales eliminadas de `MARKETPLACE_DATABASE.md`

---

## 11. Variables de Entorno

Archivo de referencia: `env.example`

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL principal (catálogo) |
| `MARKETPLACE_DATABASE_URL` | ✅ | PostgreSQL marketplace (Neon) |
| `SENDGRID_API_KEY` | ✅ | API key SendGrid |
| `SENDGRID_FROM_EMAIL` | Sí | Email remitente |
| `SENDGRID_FROM_NAME` | Sí | Nombre remitente |
| `JWT_SECRET` | ✅ **Crítico** | Secret para tokens JWT (min 32 chars) |
| `JWT_ACCESS_TOKEN_EXPIRY` | No | Default: 15m |
| `JWT_REFRESH_TOKEN_EXPIRY` | No | Default: 7d |
| `STRIPE_SECRET_KEY` | Para pagos | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Para pagos | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Para pagos | Stripe webhook signing secret |
| `STRIPE_CONNECT_CLIENT_ID` | Para pagos | Stripe Connect client ID |
| `STRIPE_PLATFORM_FEE_PERCENT` | No | Default: 3.5 |
| `CLOUDINARY_CLOUD_NAME` | Para imágenes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Para imágenes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Para imágenes | Cloudinary API secret |
| `ODOO_URL` | ⏳ Será reemplazado | URL de Odoo |
| `ODOO_USERNAME` | ⏳ Será reemplazado | Usuario Odoo |
| `ODOO_PASSWORD` | ⏳ Será reemplazado | Password Odoo |
| `ODOO_DATABASE` | ⏳ Será reemplazado | Base de datos Odoo |
| `ODOO_COMPANY_ID` | ⏳ Será reemplazado | Company ID Odoo |
| `NODE_ENV` | No | development / production |
| `VERCEL_URL` | Auto | URL de Vercel (auto-set en deploy) |
| `APP_URL` | No | URL base de la app |
| `ADMIN_EMAIL` | Para seed | Email del super admin |
| `ADMIN_PASSWORD` | Para seed | Password del super admin (solo para script) |

---

## 12. Deploy y Configuración

### Vercel (`vercel.json`)

- **Build 1:** `@vercel/node` → `server/index.ts` (API serverless)
- **Build 2:** `@vercel/static-build` → `dist/` (frontend estático)
- **Rutas:** `/api/*` → servidor, `/*` → SPA (`index.html`)
- **Env:** `NODE_ENV=production`

### Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp env.example .env
# Editar .env con valores reales

# 3. Aplicar schema a la BD
npm run db:push

# 4. (Opcional) Crear super admin
ADMIN_PASSWORD=TuPasswordSeguro npx tsx server/seed-super-admin.ts

# 5. Iniciar en desarrollo
npm run dev
# Abre http://localhost:5000
```

### Build de Producción

```bash
npm run build    # Vite (frontend) + esbuild (servidor)
npm run start    # NODE_ENV=production node dist/server/index.js
```

---

## 13. Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `npm run dev` | `tsx server/index.ts` | Desarrollo con hot reload |
| `npm run build` | `vite build && esbuild...` | Build producción |
| `npm run start` | `node dist/server/index.js` | Ejecutar producción |
| `npm run check` | `tsc` | Type-check completo |
| `npm run db:push` | `drizzle-kit push` | Aplicar schema a BD |
| `npm run seed:admin` | `tsx server/seed-super-admin.ts` | Crear super admin |

---

## 14. Problemas Conocidos y Deuda Técnica

### Prioridad Alta

| # | Problema | Archivo(s) |
|---|----------|------------|
| 1 | **Odoo debe migrarse a Google Sheets** para guardar leads | `server/services/odoo.ts` |
| 2 | Credenciales de Neon estuvieron expuestas en el repo (rotar cuando sea posible) | `MARKETPLACE_DATABASE.md` (ya limpio) |
| 3 | `AboutPage.tsx` y `NewChassisPage.tsx` solo en inglés | `client/src/pages/` |
| 4 | Enlaces sin prefijo `/:lang` en varias páginas (FloatingButton, VideoSection, NewChassisPage, ProductPage, BrandPage) | `client/src/components/`, `client/src/pages/` |

### Prioridad Media

| # | Problema | Archivo(s) |
|---|----------|------------|
| 5 | Catálogo triplicado: `PRODUCT_DATA` embebido + `chassis-data.ts` + tabla `chassis_models` | `server/storage.ts`, `server/chassis-data.ts` |
| 6 | `contact_messages.createdAt` es `text` en vez de `timestamp` | `shared/schema.ts` |
| 7 | Error handler global hace `throw err` después de responder | `server/index.ts` |
| 8 | `drizzle.config.ts` no incluye marketplace schema | `drizzle.config.ts` |
| 9 | Errores TypeScript preexistentes (22 errores en `npm run check`) | Varios archivos del frontend y 2 del server |

### Prioridad Baja

| # | Problema | Archivo(s) |
|---|----------|------------|
| 10 | Archivos i18n muertos: `i18n.ts`, `i18n-working.ts`, `LanguageSelector.tsx`, `LanguageSelector-working.tsx`, `clearCache.ts` | `client/src/lib/`, `client/src/components/shared/` |
| 11 | Dependencias no usadas: `passport`, `express-session`, `connect-pg-simple`, `memorystore`, `mailgun-js`, `nodemailer` | `package.json` |
| 12 | `package.json` name es `rest-express` en vez de `american-chassis-depot` | `package.json` |
| 13 | Documentación antigua desactualizada (README, CONTRIBUTING, PROJECT_DOCUMENTATION) | Archivos .md raíz |
| 14 | No hay tests ni CI/CD | Proyecto completo |

---

## 15. Cambios Recientes de Seguridad (Abril 2026)

Archivos modificados en esta sesión (6 archivos, +85 / -18 líneas):

| Archivo | Cambio |
|---------|--------|
| `server/services/odoo.ts` | Credenciales hardcodeadas → strings vacíos + warning |
| `server/seed-super-admin.ts` | Password hardcodeado → requiere `ADMIN_PASSWORD` env var |
| `server/marketplace/auth.ts` | JWT secret predecible → genera aleatorio si falta env var |
| `MARKETPLACE_DATABASE.md` | Connection string con password → referencia a env var |
| `server/routes.ts` | Endpoints Odoo abiertos → protegidos con `authenticateToken + requireAdmin` |
| `server/marketplace/routes.ts` | IDOR en conversaciones → validación de pertenencia; mass assignment → schema Zod |

---

## 16. Próximos Pasos / Roadmap

### Inmediato
- [ ] **Migrar Odoo → Google Sheets** para guardar leads de formularios
- [ ] Rotar credenciales de Neon (estuvieron expuestas en el repo)

### Corto Plazo
- [ ] Traducir `AboutPage.tsx` y `NewChassisPage.tsx` al español
- [ ] Arreglar enlaces sin `/:lang` en componentes
- [ ] Limpiar archivos de código muerto (i18n, LanguageSelector, clearCache)

### Mediano Plazo
- [ ] Unificar fuente de datos del catálogo (BD vs embebido)
- [ ] Arreglar errores TypeScript preexistentes
- [ ] Eliminar dependencias no usadas de `package.json`
- [ ] Actualizar documentación antigua (README, CONTRIBUTING)

### Largo Plazo
- [ ] Agregar tests (al menos smoke tests para API)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Evaluar migración a un solo sistema de BD

---

*Este documento reemplaza y consolida la información de README.md, ARCHITECTURE.md, PROJECT_DOCUMENTATION.md, MARKETPLACE_PLAN.md y MARKETPLACE_DATABASE.md como fuente única de verdad del proyecto.*
