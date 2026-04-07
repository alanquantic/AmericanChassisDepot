# 🗄️ Base de Datos del Marketplace - American Chassis Depot

## Información de Conexión

| Campo | Valor |
|-------|-------|
| **Proyecto Neon** | `american-chassis-marketplace` |
| **Project ID** | `dark-tooth-89610362` |
| **Branch** | `main` (ID: `br-hidden-art-ahojeq50`) |
| **Database** | `neondb` |
| **Region** | `us-east-1` (AWS) |
| **Host** | `ep-silent-wildflower-ahgv2edz-pooler.c-3.us-east-1.aws.neon.tech` |

### Connection String
```
# Stored in MARKETPLACE_DATABASE_URL environment variable — never commit credentials to source control.
# See env.example for the variable name.
```

---

## 📊 Resumen de la Base de Datos

### Estadísticas Actuales

| Métrica | Valor |
|---------|-------|
| **Total Listings** | 50 |
| **Usuarios** | 2 (1 super_admin, 1 seller) |
| **Tipos de Chassis** | 4 |
| **Condiciones** | 4 |
| **Unidades en Inventario** | 501 |
| **Valor Total Inventario** | $6,451,055 USD |

---

## 📋 Tablas Creadas (20 tablas)

### Tablas Core

| # | Tabla | Descripción | Registros |
|---|-------|-------------|-----------|
| 1 | `marketplace_users` | Usuarios (buyers, sellers, admins, super_admins) | 2 |
| 2 | `marketplace_listings` | Listings de chassis | 50 |
| 3 | `marketplace_chassis_types` | Tipos de chassis (Gooseneck, Slider, etc.) | 4 |
| 4 | `marketplace_conditions` | Condiciones (ASIS, Road-worthy, New, Certified) | 4 |
| 5 | `listing_images` | Imágenes de listings | 0 |

### Tablas de Comunicación

| # | Tabla | Descripción |
|---|-------|-------------|
| 6 | `marketplace_conversations` | Conversaciones entre usuarios |
| 7 | `marketplace_messages` | Mensajes individuales |
| 8 | `marketplace_notifications` | Notificaciones del sistema |

### Tablas de Transacciones

| # | Tabla | Descripción |
|---|-------|-------------|
| 9 | `marketplace_offers` | Ofertas formales de compradores |
| 10 | `marketplace_orders` | Órdenes/transacciones |
| 11 | `marketplace_order_items` | Items de órdenes |

### Tablas de Usuario

| # | Tabla | Descripción |
|---|-------|-------------|
| 12 | `marketplace_favorites` | Listings favoritos |
| 13 | `marketplace_saved_searches` | Búsquedas guardadas |
| 14 | `marketplace_reviews` | Reviews y valoraciones |
| 15 | `marketplace_seller_stats` | Estadísticas de vendedores |

### Tablas de Sistema

| # | Tabla | Descripción |
|---|-------|-------------|
| 16 | `marketplace_settings` | Configuraciones del sistema | 10 |
| 17 | `marketplace_reports` | Reportes/flags de usuarios |
| 18 | `marketplace_activity_log` | Log de actividad/auditoría |
| 19 | `marketplace_listing_views` | Analytics de vistas |
| 20 | `marketplace_email_templates` | Templates de emails |

---

## 🏷️ Datos de Referencia

### Tipos de Chassis (`marketplace_chassis_types`)

| ID | Name | Name ES | Slug |
|----|------|---------|------|
| 1 | Gooseneck | Cuello de Ganso | gooseneck |
| 2 | Slider | Deslizable | slider |
| 3 | Extendable | Extensible | extendable |
| 4 | Spread | Spread Axle | spread |

### Condiciones (`marketplace_conditions`)

| ID | Name | Name ES | Slug | Color |
|----|------|---------|------|-------|
| 1 | As-Is | Como Está | asis | #EF4444 (rojo) |
| 2 | Road-Worthy | Listo para Circular | roadworthy | #22C55E (verde) |
| 3 | New | Nuevo | new | #3B82F6 (azul) |
| 4 | Certified | Certificado | certified | #8B5CF6 (púrpura) |

### Configuraciones (`marketplace_settings`)

| Key | Value | Description |
|-----|-------|-------------|
| `platform_fee_percent` | 3.5 | Comisión de la plataforma (%) |
| `min_listing_price` | 1000 | Precio mínimo de listing (USD) |
| `max_images_per_listing` | 10 | Máximo de imágenes por listing |
| `listing_expiry_days` | 90 | Días hasta expiración de listing |
| `require_email_verification` | true | Requerir verificación de email |
| `require_seller_verification` | true | Requerir verificación de vendedor |
| `email_provider` | sendgrid | Proveedor de email |
| `stripe_enabled` | true | Pagos con Stripe habilitados |
| `escrow_days` | 3 | Días de retención de fondos |
| `support_email` | support@americanchassisdepot.com | Email de soporte |

---

## 👤 Usuarios Iniciales

| ID | Email | Role | Company |
|----|-------|------|---------|
| 1 | admin@americanchassisdepot.com | super_admin | American Chassis Depot |
| 2 | sales@americanchassisdepot.com | seller | American Chassis Depot |

> ⚠️ **IMPORTANTE**: Los passwords deben ser actualizados en producción. El hash actual es un placeholder.

---

## 📍 Distribución de Inventario por Estado

| Estado | Listings | Unidades | Valor Estimado |
|--------|----------|----------|----------------|
| CA | 15 | 166 | $1,891,200 |
| FL | 5 | 137 | $2,015,600 |
| TX | 5 | 41 | $745,400 |
| GA | 3 | 32 | $276,200 |
| IL | 4 | 35 | $536,655 |
| VA | 3 | 7 | $154,750 |
| WA | 3 | 12 | $101,050 |
| AZ | 2 | 30 | $377,000 |
| NJ | 3 | 13 | $275,850 |
| Otros | 7 | 28 | $77,350 |

---

## 🔐 Índices Creados (31 índices)

```sql
-- Listings
idx_listings_status
idx_listings_seller
idx_listings_location
idx_listings_type
idx_listings_price
idx_listings_created
idx_listings_condition
idx_listings_featured

-- Conversaciones y Mensajes
idx_conversations_buyer
idx_conversations_seller
idx_conversations_listing
idx_messages_conversation
idx_messages_sender

-- Ofertas
idx_offers_listing
idx_offers_buyer
idx_offers_seller
idx_offers_status

-- Órdenes
idx_orders_buyer
idx_orders_seller
idx_orders_status
idx_orders_number

-- Notificaciones
idx_notifications_user
idx_notifications_unread

-- Activity Log
idx_activity_user
idx_activity_entity

-- Favoritos
idx_favorites_user
idx_favorites_listing

-- Reviews
idx_reviews_listing
idx_reviews_reviewed_user

-- Analytics
idx_listing_views_listing
idx_listing_views_date
```

---

## 🛠️ Comandos Útiles

### Conectar con psql
```bash
psql "$MARKETPLACE_DATABASE_URL"
```

### Ver estadísticas del inventario
```sql
SELECT 
  state,
  COUNT(*) as listings,
  SUM(quantity_available) as units,
  SUM(quantity_available * price_per_unit) as total_value
FROM marketplace_listings
WHERE status = 'active'
GROUP BY state
ORDER BY total_value DESC;
```

### Ver listings por tipo
```sql
SELECT 
  chassis_type,
  COUNT(*) as count,
  AVG(price_per_unit) as avg_price,
  MIN(price_per_unit) as min_price,
  MAX(price_per_unit) as max_price
FROM marketplace_listings
GROUP BY chassis_type;
```

### Ver listings por condición
```sql
SELECT 
  condition,
  COUNT(*) as count,
  SUM(quantity_available) as total_units
FROM marketplace_listings
GROUP BY condition;
```

---

## 📁 Archivos Relacionados

- `/shared/marketplace-schema.ts` - Schema Drizzle ORM
- `/env.example` - Variables de entorno
- `/MARKETPLACE_PLAN.md` - Plan completo del proyecto
- `/server/routes/marketplace/` - (por crear) Rutas del API

---

**Última actualización**: Enero 2026
**Creado por**: Sistema de inicialización del Marketplace
