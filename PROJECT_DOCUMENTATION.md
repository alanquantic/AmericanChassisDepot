# 📋 DOCUMENTACIÓN COMPLETA - AMERICAN CHASSIS DEPOT

## 🏗️ **ARQUITECTURA DEL PROYECTO**

### **Stack Tecnológico**
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express (TypeScript, ESM) + Neon PostgreSQL + Drizzle ORM
- **Router**: Wouter (lightweight router)
- **State Management**: TanStack Query (React Query)
- **Deployment**: Vercel con integración GitHub
- **Email**: Mailgun para notificaciones

### **Estructura de Carpetas**
```
AmericanChassisDepot/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── lib/           # Utilidades y configuraciones
│   │   └── hooks/         # Custom hooks
├── server/                # Backend Express
│   ├── services/          # Servicios (email, etc.)
│   └── types/             # Tipos TypeScript
├── shared/                # Schema compartido (Drizzle)
├── data/                  # Datos de productos y configuraciones
└── client/public/         # Assets estáticos
```

## 🌐 **SISTEMA DE IDIOMAS (i18n)**

### **Configuración**
- **URLs con prefijo**: `/:lang/` (ej: `/en/products`, `/es/products`)
- **Detección automática**: Basada en URL o preferencia del usuario
- **Separación completa**: Productos EN y ES son completamente independientes

### **Archivos de Configuración**
- `client/src/lib/i18n-simple.ts` - Configuración de idiomas
- `client/src/lib/constants.ts` - Traducciones y constantes

### **Separación de Productos**
```typescript
// ESPAÑOL: Solo productos con conditionId = 5 (chassis-nuevos-espanol)
// INGLÉS: Solo productos con conditionId = 1,2,3 (excluyendo españoles)
```

## 📦 **GESTIÓN DE PRODUCTOS**

### **Fuentes de Datos**
1. **`data/chassis-data.ts`** - Datos principales (se usa para poblar DB)
2. **`data/image_mapping.csv`** - Mapeo de imágenes EN
3. **`data/image_mapping_es.csv`** - Mapeo de imágenes ES
4. **`data/chassisModels.json`** - Datos adicionales

### **Proceso de Agregar Productos**
1. **Agregar a `chassis-data.ts`** con slug único
2. **Agregar imágenes** a `data/uploads_en/` y `data/uploads_es/`
3. **Actualizar CSV** con mapeo de imágenes
4. **Crear PDF** en `client/public/brochures/en/` y `client/public/brochures/es/`
5. **Ejecutar seed** de la base de datos

### **Estructura de Producto**
```typescript
interface ChassisModel {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  additionalImages: string[];
  conditionId: number; // 1=new, 2=used, 5=español
  size: string;
  axleConfig: string;
  // ... especificaciones técnicas
}
```

## 🖼️ **GESTIÓN DE IMÁGENES**

### **Sistema de Bloqueo de Imágenes**
- **Archivo**: `server/storage.ts`
- **Función**: `sanitizeModelImages()`
- **Propósito**: Filtrar imágenes no deseadas de todas las respuestas API

```typescript
const BLOCKED_IMAGE_SUBSTRINGS = [
  "photo-1580674684081-7617fbf3d745", // Unsplash
  "20_SL_Tandem_4.jpg",
  "20_40_Extendable_Tandem_2.jpg",
  // ... más imágenes bloqueadas
];
```

### **Formato de Imágenes**
- **WebP**: Formato preferido para web
- **Nomenclatura**: `PRODUCT_NAME.webp` (EN) / `PRODUCT_NAME-esp.webp` (ES)
- **Ubicación**: `data/uploads_en/` y `data/uploads_es/`

## 📄 **SISTEMA DE FORMULARIOS UNIFICADO**

### **Componente Principal**
- **Archivo**: `client/src/components/shared/UnifiedContactForm.tsx`
- **Propósito**: Maneja tanto cotizaciones como descargas de folletos

### **Características**
- ✅ **Campos obligatorios**: nombre, email, empresa, teléfono, unidades, interés, mensaje
- ✅ **Validación de seguridad**: honeypot, timestamp, sanitización
- ✅ **Detección de idioma**: Automática basada en URL
- ✅ **Alineación perfecta**: Íconos y texto centrados
- ✅ **Responsive**: Adaptable a móvil y desktop

### **Configuración de Botones**
```typescript
// ProductGrid
className="... min-w-[200px] whitespace-nowrap"

// ProductPage
className="... min-w-[220px] whitespace-nowrap" // Request Quote
className="... min-w-[240px] whitespace-nowrap" // Download Brochure
```

### **Alineación de Íconos**
```typescript
<div className="flex items-center justify-center gap-2">
  <FileTextIcon className="w-5 h-5" />
  <span>{getTriggerText()}</span>
</div>
```

## 📧 **SISTEMA DE EMAILS**

### **Servicios de Email**
- **Archivo**: `server/services/mail.ts`
- **Proveedor**: Mailgun
- **Tipos de Email**:
  1. **Notificación interna** - Para el equipo de ventas
  2. **Confirmación al cliente** - Con logo y información del producto

### **Configuración de Variables de Entorno**
```env
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=your_domain
```

### **Estructura de Email de Confirmación**
- **Asunto personalizado** según idioma y acción
- **Logo de la empresa** incluido
- **Información del producto** específica
- **Datos de contacto** de la empresa
- **Diseño responsive** HTML

## 🗄️ **BASE DE DATOS**

### **Schema (Drizzle ORM)**
```typescript
// shared/schema.ts
- conditions: Condiciones de productos (new, used, español)
- chassis_models: Modelos de chasis
- contact_messages: Mensajes de formularios
```

### **Tablas Principales**
1. **`conditions`**: Condiciones de productos
2. **`chassis_models`**: Modelos de chasis con especificaciones
3. **`contact_messages`**: Mensajes de formularios con contexto

### **Operaciones de Base de Datos**
- **Archivo**: `server/storage.ts`
- **Métodos**: CRUD para productos y mensajes
- **Filtrado**: Por idioma, condición, tamaño, etc.

## 🚀 **DEPLOYMENT Y GIT**

### **Configuración de Git**
```bash
# Rama principal
git checkout main

# Rama de desarrollo
git checkout fix/form-contrast

# Remoto SSH
git remote add origin git@github.com:alanquantic/voltdrive.git
```

### **Proceso de Deployment**
1. **Desarrollo local**: `npm run dev`
2. **Build**: `npm run build`
3. **Commit y Push**: `git add . && git commit -m "message" && git push`
4. **Deployment automático**: Vercel detecta cambios en GitHub

### **Archivos de Configuración**
- `vercel.json` - Configuración de Vercel
- `vite.config.ts` - Configuración de Vite
- `tailwind.config.ts` - Configuración de Tailwind

## 🔧 **PROCESO PARA AGREGAR NUEVOS PRODUCTOS**

### **Paso 1: Datos del Producto**
```typescript
// data/chassis-data.ts
{
  name: "Nuevo Producto",
  slug: "nuevo-producto",
  description: "Descripción del producto",
  conditionId: 1, // 1=new, 2=used, 5=español
  size: "40ft",
  axleConfig: "Tandem",
  // ... especificaciones completas
}
```

### **Paso 2: Imágenes**
1. **Agregar imágenes** a `data/uploads_en/` y `data/uploads_es/`
2. **Formato**: WebP preferido
3. **Nomenclatura**: `PRODUCT_NAME.webp` (EN) / `PRODUCT_NAME-esp.webp` (ES)

### **Paso 3: Mapeo de Imágenes**
```csv
# data/image_mapping.csv (EN)
nuevo-producto,PRODUCT_NAME.webp

# data/image_mapping_es.csv (ES)
nuevo-producto-esp,PRODUCT_NAME-esp.webp
```

### **Paso 4: PDF Brochure**
1. **Crear PDF** con nombre `nuevo-producto.pdf`
2. **Ubicación**: `client/public/brochures/en/` y `client/public/brochures/es/`
3. **Nomenclatura**: Debe coincidir exactamente con el slug

### **Paso 5: Base de Datos**
```bash
# Ejecutar seed para poblar la DB
npm run db:push
```

## 🛠️ **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Error: Página en Blanco**
- **Causa**: Referencias a componentes no existentes
- **Solución**: Verificar imports y componentes
- **Debug**: Revisar consola del navegador

### **Error: Imágenes No Deseadas**
- **Causa**: Imágenes en CSV pero no bloqueadas
- **Solución**: Agregar a `BLOCKED_IMAGE_SUBSTRINGS` en `server/storage.ts`

### **Error: PDF 404**
- **Causa**: Slug no coincide entre frontend y backend
- **Solución**: Verificar que el producto existe en `chassis-data.ts`

### **Error: Botones en Dos Líneas**
- **Causa**: Ancho insuficiente
- **Solución**: Aumentar `min-w-[XXXpx]` y agregar `whitespace-nowrap`

### **Error: Íconos Desalineados**
- **Causa**: Problema de flexbox
- **Solución**: Usar wrapper div con `flex items-center justify-center`

## 📊 **ANALYTICS Y TRACKING**

### **Google Analytics 4**
- **Eventos configurados**:
  - `generate_lead` - Solicitudes de cotización
  - `brochure_download` - Descargas de folletos
  - `file_download` - Descargas de archivos

### **Datos Trackeados**
- Producto específico (slug, nombre)
- Idioma del usuario
- URL de origen
- Tipo de acción

## 🔒 **SEGURIDAD**

### **Protección de Formularios**
- **Honeypot field**: Campo oculto para detectar bots
- **Timestamp validation**: Previene envíos automáticos
- **Input sanitization**: Validación estricta de caracteres
- **Rate limiting**: Validación de tiempo entre envíos

### **Validaciones**
```typescript
// Zod schema con validaciones estrictas
name: z.string().regex(/^[a-zA-Z\s]+$/)
email: z.string().email()
phone: z.string().regex(/^[\d\s\-\+\(\)]+$/)
```

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints**
- **Mobile**: `px-4 py-4`
- **Tablet**: `md:px-8 md:py-8` (768px+)
- **Desktop**: `lg:px-12 lg:py-12` (1024px+)

### **Componentes Responsive**
- **Botones**: Ancho mínimo adaptativo
- **Formularios**: Grid responsivo
- **Imágenes**: Aspect ratio mantenido

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

### **Para Nuevas Sesiones**
1. **Revisar estado actual** del proyecto
2. **Verificar logs** de consola para errores
3. **Probar formularios** en ambos idiomas
4. **Verificar emails** de confirmación
5. **Revisar analytics** y tracking

### **Mantenimiento Regular**
- **Actualizar dependencias** mensualmente
- **Revisar logs** de errores
- **Monitorear performance** de Vercel
- **Backup** de base de datos

---

## 📞 **CONTACTO Y SOPORTE**

- **Email**: sales@americanchassisdepot.com
- **Teléfono**: +1 (505) 433-0000
- **Sitio Web**: www.americanchassisdepot.com

---

*Documentación actualizada: Enero 2025*
*Última revisión: Sistema de formularios unificado implementado*
