import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Shield,
  Users,
  Package,
  DollarSign,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Camera,
  BarChart3,
  AlertTriangle,
  Lock,
  UserCog,
  Ban,
  RefreshCw,
  Search,
  Filter,
  Mail,
  ChevronRight,
  Star,
  BadgeCheck,
  Database,
  Globe,
  Key
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function ManualAdminPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();

  // Add noindex meta tag
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    document.title = lang === 'es' 
      ? 'Manual de Administrador | American Chassis Depot' 
      : 'Administrator Manual | American Chassis Depot';

    return () => {
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, [lang]);

  const content = {
    en: {
      title: 'Administrator Manual',
      subtitle: 'Complete guide for managing the American Chassis Depot Marketplace',
      lastUpdated: 'Last updated: January 2026',
      accessWarning: 'This documentation is for authorized administrators only. Do not share access credentials.',
      sections: [
        {
          id: 'roles',
          title: 'Admin Roles & Permissions',
          icon: Shield,
          description: 'Understanding the different admin levels',
          items: [
            {
              title: 'Admin Role',
              icon: UserCog,
              content: [
                'Can approve or reject new listings',
                'Can view all listings and their status',
                'Can change listing status (active/inactive/sold)',
                'Can view all offers and their details',
                'Can access marketplace statistics',
                'Cannot manage users or change roles'
              ]
            },
            {
              title: 'Super Admin Role',
              icon: Shield,
              content: [
                'All Admin permissions, plus:',
                'Can view and manage ALL users',
                'Can change user roles (buyer/seller/admin)',
                'Can suspend or activate user accounts',
                'Can delete user accounts',
                'Can edit ANY listing (price, details, photos)',
                'Can delete ANY listing',
                'Full access to all system features'
              ]
            }
          ]
        },
        {
          id: 'dashboard',
          title: 'Admin Dashboard Overview',
          icon: BarChart3,
          description: 'Understanding the admin panel interface',
          items: [
            {
              title: 'Statistics Cards',
              icon: BarChart3,
              content: [
                'Total Listings: All listings in the system',
                'Active Listings: Currently live on marketplace',
                'Pending Approval: Awaiting admin review',
                'Total Users: Registered buyers and sellers',
                'Total Offers: All offers made',
                'Inventory Value: Sum of all active listing values',
                'Click "Refresh" to update stats manually'
              ]
            },
            {
              title: 'Navigation Tabs',
              icon: Filter,
              content: [
                'Pending Approval: New listings to review',
                'All Listings: Complete listing management',
                'Users: User account management (Super Admin)',
                'Offers: Monitor all marketplace offers'
              ]
            }
          ]
        },
        {
          id: 'listings',
          title: 'Managing Listings',
          icon: Package,
          description: 'How to review, edit, and manage marketplace listings',
          items: [
            {
              title: 'Approving New Listings',
              icon: CheckCircle,
              content: [
                'New listings appear in "Pending Approval" tab',
                'Review listing details: title, description, price, photos',
                'Check for accuracy and policy compliance',
                'Click "Approve" to make listing live',
                'Click "Reject" and provide reason to decline',
                'Sellers receive email notification of decision'
              ]
            },
            {
              title: 'All Listings Tab',
              icon: Package,
              content: [
                'View all listings regardless of status',
                'Use search to find by title, city, state, or listing number',
                'Filter by status: Active, Pending, Sold, Inactive',
                'Recently modified listings appear first',
                'Pagination: 20 listings per page'
              ]
            },
            {
              title: 'Listing Actions (Dropdown Menu)',
              icon: Edit,
              content: [
                'View Details: See public listing page',
                'Edit Listing: Full editing dialog (Super Admin)',
                'Manage Photos: Add/remove/reorder images',
                'Change Price: Quick price update',
                'Activate/Deactivate: Toggle listing visibility',
                'Mark as Sold: Close the listing',
                'Delete: Permanently remove listing'
              ]
            },
            {
              title: 'Editing a Listing (Super Admin)',
              icon: Edit,
              content: [
                'Basic Info: Title (EN/ES), Description (EN/ES)',
                'Pricing: Price per unit, Negotiable toggle',
                'Inventory: Total quantity, Available quantity',
                'Location: City, State',
                'Admin-Only Fields (yellow section):',
                '  - Chassis Type (Gooseneck, Slider, etc.)',
                '  - Chassis Size (20\', 40\', 45\', etc.)',
                '  - Condition (New, Road-worthy, As-Is, Certified)',
                '  - Featured toggle (highlight listing)',
                '  - Verified toggle (trust badge)'
              ]
            },
            {
              title: 'Managing Photos',
              icon: Camera,
              content: [
                'Click "Manage Photos" from listing dropdown',
                'Upload new photos (drag & drop or click)',
                'Photos auto-optimize: max 1920px, WebP format',
                'Large files (>500KB) auto-compress',
                'Drag to reorder photos',
                'Delete unwanted photos',
                'Toggle reference image visibility',
                '"Admin Mode" badge shows when managing as admin'
              ]
            }
          ]
        },
        {
          id: 'users',
          title: 'Managing Users (Super Admin)',
          icon: Users,
          description: 'User account management and moderation',
          items: [
            {
              title: 'Users Tab Overview',
              icon: Users,
              content: [
                'View all registered users',
                'Search by name, email, or company',
                'Filter by role: All, Buyer, Seller, Admin',
                'Filter by status: All, Active, Suspended',
                'See registration date and last login'
              ]
            },
            {
              title: 'User Actions',
              icon: UserCog,
              content: [
                'View Details: See full user profile',
                'Edit User: Update name, company, contact info',
                'Change Role: Promote/demote user level',
                'Suspend: Temporarily disable account',
                'Activate: Re-enable suspended account',
                'Delete: Permanently remove user and their data'
              ]
            },
            {
              title: 'Changing User Roles',
              icon: Shield,
              content: [
                'Buyer: Can browse and make offers',
                'Seller: Can create listings and receive offers',
                'Admin: Can moderate listings',
                'Super Admin: Full system access',
                'Role changes take effect immediately',
                'User receives notification of role change'
              ]
            },
            {
              title: 'Suspending Users',
              icon: Ban,
              content: [
                'Provide a reason for suspension',
                'User cannot login while suspended',
                'Their listings remain but are not editable',
                'Offers are paused',
                'Can be reactivated at any time'
              ]
            }
          ]
        },
        {
          id: 'offers',
          title: 'Monitoring Offers',
          icon: DollarSign,
          description: 'Track and oversee marketplace negotiations',
          items: [
            {
              title: 'Offers Dashboard',
              icon: DollarSign,
              content: [
                'Stats: Pending, Accepted, Rejected, Total',
                'Search by offer number or listing name',
                'Filter by status',
                'View all offer details at a glance'
              ]
            },
            {
              title: 'Offer Information',
              icon: Eye,
              content: [
                'Offer number (OFR-XXXX-XXXX)',
                'Status badge (Pending/Accepted/Rejected/Countered/Expired)',
                'Listing title and number',
                'Buyer and seller names/companies',
                'Price: Total amount, per unit, quantity',
                'Counter offer details if applicable',
                'Buyer notes and seller response',
                'Dates: Created, Expires, Responded'
              ]
            },
            {
              title: 'Quick Actions',
              icon: Mail,
              content: [
                'View Listing: See the chassis being offered on',
                'Email Buyer: Quick contact via mailto link',
                'Monitor negotiations without interfering',
                'Identify stalled or problematic offers'
              ]
            }
          ]
        },
        {
          id: 'best-practices',
          title: 'Best Practices',
          icon: Star,
          description: 'Guidelines for effective marketplace management',
          items: [
            {
              title: 'Listing Review Guidelines',
              icon: CheckCircle,
              content: [
                'Verify photos match the chassis being sold',
                'Check pricing is reasonable for market',
                'Ensure descriptions are accurate and detailed',
                'Confirm location information is correct',
                'Reject duplicate or spam listings',
                'Respond to pending listings within 24-48 hours'
              ]
            },
            {
              title: 'User Management Tips',
              icon: Users,
              content: [
                'Investigate before suspending accounts',
                'Document reasons for all moderation actions',
                'Be consistent with policy enforcement',
                'Respond to user complaints promptly',
                'Only promote trusted users to Admin'
              ]
            },
            {
              title: 'Security Practices',
              icon: Lock,
              content: [
                'Never share admin credentials',
                'Use strong, unique passwords',
                'Log out when finished',
                'Report any suspicious activity',
                'Regularly review user registrations',
                'Monitor for fraudulent listings'
              ]
            }
          ]
        },
        {
          id: 'troubleshooting',
          title: 'Troubleshooting',
          icon: AlertTriangle,
          description: 'Common issues and solutions',
          items: [
            {
              title: 'Stats Showing 0',
              icon: RefreshCw,
              content: [
                'Session may have expired',
                'Click "Refresh" button in header',
                'If persists, log out and log back in',
                'Clear browser cache if needed',
                'Token auto-refreshes but may occasionally fail'
              ]
            },
            {
              title: 'Listing Not Appearing',
              icon: Eye,
              content: [
                'Check if listing is in correct status',
                'Recently modified listings appear first',
                'Use search to find specific listings',
                'Clear filters to see all listings',
                'Check pagination (might be on another page)'
              ]
            },
            {
              title: 'Photo Upload Issues',
              icon: Camera,
              content: [
                'Max file size: 10MB per image',
                'Supported formats: JPG, PNG, WebP, GIF',
                'Large files auto-compress to ~500KB',
                'Check internet connection',
                'Try a different browser if issues persist'
              ]
            }
          ]
        }
      ]
    },
    es: {
      title: 'Manual de Administrador',
      subtitle: 'Guía completa para gestionar el Marketplace de American Chassis Depot',
      lastUpdated: 'Última actualización: Enero 2026',
      accessWarning: 'Esta documentación es solo para administradores autorizados. No compartas credenciales de acceso.',
      sections: [
        {
          id: 'roles',
          title: 'Roles y Permisos de Admin',
          icon: Shield,
          description: 'Entendiendo los diferentes niveles de administración',
          items: [
            {
              title: 'Rol Admin',
              icon: UserCog,
              content: [
                'Puede aprobar o rechazar nuevos listings',
                'Puede ver todos los listings y su estado',
                'Puede cambiar estado (activo/inactivo/vendido)',
                'Puede ver todas las ofertas y detalles',
                'Puede acceder a estadísticas del marketplace',
                'NO puede gestionar usuarios ni cambiar roles'
              ]
            },
            {
              title: 'Rol Super Admin',
              icon: Shield,
              content: [
                'Todos los permisos de Admin, más:',
                'Puede ver y gestionar TODOS los usuarios',
                'Puede cambiar roles (comprador/vendedor/admin)',
                'Puede suspender o activar cuentas',
                'Puede eliminar cuentas de usuario',
                'Puede editar CUALQUIER listing (precio, detalles, fotos)',
                'Puede eliminar CUALQUIER listing',
                'Acceso completo a todas las funciones'
              ]
            }
          ]
        },
        {
          id: 'dashboard',
          title: 'Panel de Administración',
          icon: BarChart3,
          description: 'Entendiendo la interfaz del panel admin',
          items: [
            {
              title: 'Tarjetas de Estadísticas',
              icon: BarChart3,
              content: [
                'Total Listings: Todos los listings del sistema',
                'Listings Activos: Actualmente en el marketplace',
                'Pendientes: Esperando revisión',
                'Total Usuarios: Compradores y vendedores registrados',
                'Total Ofertas: Todas las ofertas realizadas',
                'Valor Inventario: Suma de todos los listings activos',
                'Clic en "Actualizar" para refrescar manualmente'
              ]
            },
            {
              title: 'Pestañas de Navegación',
              icon: Filter,
              content: [
                'Pendientes: Nuevos listings por revisar',
                'Todos los Listings: Gestión completa',
                'Usuarios: Gestión de cuentas (Super Admin)',
                'Ofertas: Monitoreo de ofertas'
              ]
            }
          ]
        },
        {
          id: 'listings',
          title: 'Gestionar Listings',
          icon: Package,
          description: 'Cómo revisar, editar y gestionar listings',
          items: [
            {
              title: 'Aprobar Nuevos Listings',
              icon: CheckCircle,
              content: [
                'Nuevos listings aparecen en "Pendientes"',
                'Revisar: título, descripción, precio, fotos',
                'Verificar exactitud y cumplimiento de políticas',
                'Clic "Aprobar" para publicar',
                'Clic "Rechazar" y dar razón para declinar',
                'Vendedores reciben email con la decisión'
              ]
            },
            {
              title: 'Pestaña Todos los Listings',
              icon: Package,
              content: [
                'Ver todos los listings sin importar estado',
                'Buscar por título, ciudad, estado o número',
                'Filtrar por estado: Activo, Pendiente, Vendido, Inactivo',
                'Listings modificados recientemente aparecen primero',
                'Paginación: 20 listings por página'
              ]
            },
            {
              title: 'Acciones del Listing (Menú)',
              icon: Edit,
              content: [
                'Ver Detalles: Ver página pública',
                'Editar Listing: Diálogo de edición completo (Super Admin)',
                'Gestionar Fotos: Agregar/eliminar/reordenar',
                'Cambiar Precio: Actualización rápida',
                'Activar/Desactivar: Cambiar visibilidad',
                'Marcar Vendido: Cerrar el listing',
                'Eliminar: Borrar permanentemente'
              ]
            },
            {
              title: 'Editar un Listing (Super Admin)',
              icon: Edit,
              content: [
                'Info Básica: Título (EN/ES), Descripción (EN/ES)',
                'Precio: Precio por unidad, Toggle negociable',
                'Inventario: Cantidad total, Cantidad disponible',
                'Ubicación: Ciudad, Estado',
                'Campos Solo Admin (sección amarilla):',
                '  - Tipo de Chassis (Gooseneck, Slider, etc.)',
                '  - Tamaño (20\', 40\', 45\', etc.)',
                '  - Condición (Nuevo, Road-worthy, As-Is, Certificado)',
                '  - Toggle Destacado (resaltar listing)',
                '  - Toggle Verificado (insignia de confianza)'
              ]
            },
            {
              title: 'Gestionar Fotos',
              icon: Camera,
              content: [
                'Clic "Gestionar Fotos" en el menú del listing',
                'Subir fotos (arrastrar o clic)',
                'Auto-optimización: máx 1920px, formato WebP',
                'Archivos grandes (>500KB) se comprimen',
                'Arrastrar para reordenar',
                'Eliminar fotos no deseadas',
                'Toggle de imagen de referencia',
                'Insignia "Modo Admin" cuando gestionas como admin'
              ]
            }
          ]
        },
        {
          id: 'users',
          title: 'Gestionar Usuarios (Super Admin)',
          icon: Users,
          description: 'Gestión y moderación de cuentas',
          items: [
            {
              title: 'Pestaña de Usuarios',
              icon: Users,
              content: [
                'Ver todos los usuarios registrados',
                'Buscar por nombre, email o empresa',
                'Filtrar por rol: Todos, Comprador, Vendedor, Admin',
                'Filtrar por estado: Todos, Activo, Suspendido',
                'Ver fecha de registro y último acceso'
              ]
            },
            {
              title: 'Acciones de Usuario',
              icon: UserCog,
              content: [
                'Ver Detalles: Ver perfil completo',
                'Editar: Actualizar nombre, empresa, contacto',
                'Cambiar Rol: Promover/degradar nivel',
                'Suspender: Deshabilitar cuenta temporalmente',
                'Activar: Rehabilitar cuenta suspendida',
                'Eliminar: Borrar usuario y sus datos'
              ]
            },
            {
              title: 'Cambiar Roles de Usuario',
              icon: Shield,
              content: [
                'Comprador: Puede explorar y hacer ofertas',
                'Vendedor: Puede crear listings y recibir ofertas',
                'Admin: Puede moderar listings',
                'Super Admin: Acceso completo al sistema',
                'Cambios de rol aplican inmediatamente',
                'Usuario recibe notificación del cambio'
              ]
            },
            {
              title: 'Suspender Usuarios',
              icon: Ban,
              content: [
                'Proporcionar razón de suspensión',
                'Usuario no puede iniciar sesión',
                'Sus listings permanecen pero no editables',
                'Ofertas se pausan',
                'Se puede reactivar en cualquier momento'
              ]
            }
          ]
        },
        {
          id: 'offers',
          title: 'Monitorear Ofertas',
          icon: DollarSign,
          description: 'Seguimiento de negociaciones del marketplace',
          items: [
            {
              title: 'Panel de Ofertas',
              icon: DollarSign,
              content: [
                'Estadísticas: Pendientes, Aceptadas, Rechazadas, Total',
                'Buscar por número de oferta o listing',
                'Filtrar por estado',
                'Ver detalles de ofertas de un vistazo'
              ]
            },
            {
              title: 'Información de Oferta',
              icon: Eye,
              content: [
                'Número de oferta (OFR-XXXX-XXXX)',
                'Insignia de estado (Pendiente/Aceptada/Rechazada/Contraoferta/Expirada)',
                'Título y número del listing',
                'Nombres/empresas de comprador y vendedor',
                'Precio: Total, por unidad, cantidad',
                'Detalles de contraoferta si aplica',
                'Notas del comprador y respuesta del vendedor',
                'Fechas: Creada, Expira, Respondida'
              ]
            },
            {
              title: 'Acciones Rápidas',
              icon: Mail,
              content: [
                'Ver Listing: Ver el chassis de la oferta',
                'Email Comprador: Contacto rápido',
                'Monitorear negociaciones sin interferir',
                'Identificar ofertas estancadas o problemáticas'
              ]
            }
          ]
        },
        {
          id: 'best-practices',
          title: 'Mejores Prácticas',
          icon: Star,
          description: 'Guías para gestión efectiva del marketplace',
          items: [
            {
              title: 'Guía de Revisión de Listings',
              icon: CheckCircle,
              content: [
                'Verificar que fotos coincidan con el chassis',
                'Revisar que precio sea razonable para el mercado',
                'Asegurar descripciones precisas y detalladas',
                'Confirmar información de ubicación correcta',
                'Rechazar listings duplicados o spam',
                'Responder a pendientes en 24-48 horas'
              ]
            },
            {
              title: 'Tips de Gestión de Usuarios',
              icon: Users,
              content: [
                'Investigar antes de suspender cuentas',
                'Documentar razones de acciones de moderación',
                'Ser consistente con políticas',
                'Responder a quejas prontamente',
                'Solo promover usuarios de confianza a Admin'
              ]
            },
            {
              title: 'Prácticas de Seguridad',
              icon: Lock,
              content: [
                'Nunca compartir credenciales de admin',
                'Usar contraseñas fuertes y únicas',
                'Cerrar sesión al terminar',
                'Reportar actividad sospechosa',
                'Revisar registros de usuarios regularmente',
                'Monitorear listings fraudulentos'
              ]
            }
          ]
        },
        {
          id: 'troubleshooting',
          title: 'Solución de Problemas',
          icon: AlertTriangle,
          description: 'Problemas comunes y soluciones',
          items: [
            {
              title: 'Estadísticas en 0',
              icon: RefreshCw,
              content: [
                'La sesión pudo haber expirado',
                'Clic en botón "Actualizar" en el header',
                'Si persiste, cerrar sesión y volver a entrar',
                'Limpiar caché del navegador si es necesario',
                'El token se auto-refresca pero puede fallar'
              ]
            },
            {
              title: 'Listing No Aparece',
              icon: Eye,
              content: [
                'Verificar que listing tenga el estado correcto',
                'Listings modificados aparecen primero',
                'Usar búsqueda para encontrar listings específicos',
                'Limpiar filtros para ver todos',
                'Revisar paginación (puede estar en otra página)'
              ]
            },
            {
              title: 'Problemas con Fotos',
              icon: Camera,
              content: [
                'Tamaño máximo: 10MB por imagen',
                'Formatos soportados: JPG, PNG, WebP, GIF',
                'Archivos grandes se comprimen a ~500KB',
                'Verificar conexión a internet',
                'Probar otro navegador si persiste'
              ]
            }
          ]
        }
      ]
    }
  };

  const t = content[lang as keyof typeof content] || content.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge className="mb-4 bg-[#BF0A30]">
            <Shield className="w-4 h-4 mr-2" />
            {lang === 'es' ? 'Solo Administradores' : 'Administrators Only'}
          </Badge>
          <h1 className="text-4xl font-bold text-[#0A3161] mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
        </motion.div>

        {/* Warning */}
        <Alert className="mb-8 border-amber-300 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {t.accessWarning}
          </AlertDescription>
        </Alert>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">
              {lang === 'es' ? 'Navegación Rápida' : 'Quick Navigation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {t.sections.map((section) => (
                <Button 
                  key={section.id}
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        {t.sections.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-[#0A3161] to-[#0A3161]/80 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <section.icon className="w-6 h-6" />
                  {section.title}
                </CardTitle>
                <CardDescription className="text-gray-200">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-[#BF0A30] pl-4">
                      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 mb-3">
                        <item.icon className="w-5 h-5 text-[#BF0A30]" />
                        {item.title}
                      </h3>
                      <ul className="space-y-2">
                        {item.content.map((line, lineIndex) => (
                          <li key={lineIndex} className="flex items-start gap-2 text-gray-700">
                            <ChevronRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <span className={line.startsWith('  -') ? 'ml-4 text-gray-600' : ''}>
                              {line}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Quick Access */}
        <Card className="bg-[#0A3161] text-white">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {lang === 'es' ? 'Acceso Rápido' : 'Quick Access'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100 h-auto py-4"
                onClick={() => navigate(`/${lang}/marketplace/admin`)}
              >
                <div className="flex flex-col items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  <span>{lang === 'es' ? 'Panel Admin' : 'Admin Panel'}</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100 h-auto py-4"
                onClick={() => navigate(`/${lang}/chassis-marketplace`)}
              >
                <div className="flex flex-col items-center gap-2">
                  <Package className="w-6 h-6" />
                  <span>Marketplace</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100 h-auto py-4"
                onClick={() => navigate(`/${lang}/marketplace/manual/user`)}
              >
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  <span>{lang === 'es' ? 'Manual Usuario' : 'User Manual'}</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100 h-auto py-4"
                onClick={() => window.location.href = 'mailto:sales@americanchassisdepot.com'}
              >
                <div className="flex flex-col items-center gap-2">
                  <Mail className="w-6 h-6" />
                  <span>{lang === 'es' ? 'Soporte' : 'Support'}</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
