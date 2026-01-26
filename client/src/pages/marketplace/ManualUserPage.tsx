import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  ShoppingCart, 
  Store, 
  Search, 
  Heart, 
  MessageSquare, 
  DollarSign,
  Camera,
  Shield,
  CheckCircle,
  ArrowRight,
  LogIn,
  UserPlus,
  FileText,
  Bell,
  CreditCard,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function ManualUserPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();

  // Add noindex meta tag
  useEffect(() => {
    // Set noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    // Set page title
    document.title = lang === 'es' 
      ? 'Manual de Usuario | American Chassis Depot' 
      : 'User Manual | American Chassis Depot';

    return () => {
      // Cleanup: remove or reset meta tag
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, [lang]);

  const content = {
    en: {
      title: 'User Manual',
      subtitle: 'Complete guide for buyers and sellers on the American Chassis Depot Marketplace',
      lastUpdated: 'Last updated: January 2026',
      sections: [
        {
          id: 'getting-started',
          title: 'Getting Started',
          icon: BookOpen,
          items: [
            {
              title: 'Creating an Account',
              icon: UserPlus,
              content: [
                'Visit the marketplace at americanchassisdepot.com/marketplace',
                'Click "Register" in the top navigation',
                'Fill in your details: name, email, company (optional), phone',
                'Choose your role: Buyer or Seller',
                'Verify your email address',
                'Complete your profile for better visibility'
              ]
            },
            {
              title: 'Logging In',
              icon: LogIn,
              content: [
                'Click "Login" in the navigation',
                'Enter your email and password',
                'Your session remains active for 7 days',
                'Use "Forgot Password" if you need to reset your credentials'
              ]
            }
          ]
        },
        {
          id: 'for-buyers',
          title: 'For Buyers',
          icon: ShoppingCart,
          items: [
            {
              title: 'Browsing Listings',
              icon: Search,
              content: [
                'Use filters to narrow down: chassis type, size, condition, location',
                'Sort by price, date, or views',
                'Click on any listing to see full details',
                'View high-resolution photos and specifications'
              ]
            },
            {
              title: 'Saving Favorites',
              icon: Heart,
              content: [
                'Click the heart icon on any listing to save it',
                'Access your favorites from your dashboard',
                'Get notified when favorite listings change price',
                'Easily compare multiple chassis options'
              ]
            },
            {
              title: 'Making an Offer',
              icon: DollarSign,
              content: [
                'Click "Make Offer" on any listing',
                'Specify quantity and your price per unit',
                'Add notes to explain your offer',
                'Offers are valid for 7 days by default',
                'You\'ll receive email notifications on seller response'
              ]
            },
            {
              title: 'Messaging Sellers',
              icon: MessageSquare,
              content: [
                'Use the "Contact Seller" button on listings',
                'Ask questions about condition, history, availability',
                'All messages are saved in your inbox',
                'Receive email notifications for new messages'
              ]
            }
          ]
        },
        {
          id: 'for-sellers',
          title: 'For Sellers',
          icon: Store,
          items: [
            {
              title: 'Creating a Listing',
              icon: FileText,
              content: [
                'Go to your Seller Dashboard',
                'Click "Create New Listing"',
                'Select chassis type and size',
                'Set condition (New, Road-worthy, As-Is, Certified)',
                'Enter price per unit and quantity available',
                'Add detailed description in English and Spanish',
                'Your listing will be reviewed before going live'
              ]
            },
            {
              title: 'Adding Photos',
              icon: Camera,
              content: [
                'Upload up to 10 photos per listing',
                'Photos are automatically optimized for web',
                'Maximum file size: 10MB per image',
                'Supported formats: JPG, PNG, WebP, GIF',
                'Drag to reorder photos',
                'First photo becomes the main image'
              ]
            },
            {
              title: 'Managing Offers',
              icon: DollarSign,
              content: [
                'View all offers in your dashboard',
                'Accept, reject, or counter any offer',
                'Add notes when responding',
                'Accepted offers move to the orders section',
                'Keep track of all negotiations'
              ]
            },
            {
              title: 'Notifications',
              icon: Bell,
              content: [
                'Receive instant notifications for new offers',
                'Get alerts when buyers message you',
                'Email notifications for important updates',
                'Configure notification preferences in settings'
              ]
            }
          ]
        },
        {
          id: 'account-security',
          title: 'Account & Security',
          icon: Shield,
          items: [
            {
              title: 'Profile Settings',
              icon: User,
              content: [
                'Update your name, company, and contact info',
                'Add a profile picture for trust',
                'Set your preferred language',
                'Manage notification preferences'
              ]
            },
            {
              title: 'Security Tips',
              icon: Shield,
              content: [
                'Use a strong, unique password',
                'Never share your login credentials',
                'Log out on shared computers',
                'Report suspicious activity immediately',
                'Verify buyer/seller identity before transactions'
              ]
            }
          ]
        },
        {
          id: 'faq',
          title: 'Frequently Asked Questions',
          icon: HelpCircle,
          items: [
            {
              title: 'Common Questions',
              icon: HelpCircle,
              content: [
                'Q: How long until my listing is approved? A: Usually within 24-48 hours.',
                'Q: Can I edit my listing after posting? A: Yes, from your seller dashboard.',
                'Q: How do I report a problem? A: Contact us at sales@americanchassisdepot.com',
                'Q: Is there a listing fee? A: Contact us for current pricing.',
                'Q: Can I cancel an accepted offer? A: Contact the other party and support.'
              ]
            }
          ]
        }
      ]
    },
    es: {
      title: 'Manual de Usuario',
      subtitle: 'Guía completa para compradores y vendedores en el Marketplace de American Chassis Depot',
      lastUpdated: 'Última actualización: Enero 2026',
      sections: [
        {
          id: 'getting-started',
          title: 'Primeros Pasos',
          icon: BookOpen,
          items: [
            {
              title: 'Crear una Cuenta',
              icon: UserPlus,
              content: [
                'Visita el marketplace en americanchassisdepot.com/marketplace',
                'Haz clic en "Registrarse" en la navegación superior',
                'Completa tus datos: nombre, email, empresa (opcional), teléfono',
                'Elige tu rol: Comprador o Vendedor',
                'Verifica tu dirección de email',
                'Completa tu perfil para mayor visibilidad'
              ]
            },
            {
              title: 'Iniciar Sesión',
              icon: LogIn,
              content: [
                'Haz clic en "Iniciar Sesión" en la navegación',
                'Ingresa tu email y contraseña',
                'Tu sesión permanece activa por 7 días',
                'Usa "Olvidé mi Contraseña" si necesitas restablecerla'
              ]
            }
          ]
        },
        {
          id: 'for-buyers',
          title: 'Para Compradores',
          icon: ShoppingCart,
          items: [
            {
              title: 'Explorar Listings',
              icon: Search,
              content: [
                'Usa filtros para refinar: tipo de chassis, tamaño, condición, ubicación',
                'Ordena por precio, fecha o vistas',
                'Haz clic en cualquier listing para ver detalles completos',
                'Ve fotos en alta resolución y especificaciones'
              ]
            },
            {
              title: 'Guardar Favoritos',
              icon: Heart,
              content: [
                'Haz clic en el icono de corazón para guardar un listing',
                'Accede a tus favoritos desde tu panel',
                'Recibe notificaciones cuando cambien los precios',
                'Compara fácilmente múltiples opciones'
              ]
            },
            {
              title: 'Hacer una Oferta',
              icon: DollarSign,
              content: [
                'Haz clic en "Hacer Oferta" en cualquier listing',
                'Especifica cantidad y tu precio por unidad',
                'Agrega notas para explicar tu oferta',
                'Las ofertas son válidas por 7 días por defecto',
                'Recibirás notificaciones por email sobre la respuesta'
              ]
            },
            {
              title: 'Mensajes a Vendedores',
              icon: MessageSquare,
              content: [
                'Usa el botón "Contactar Vendedor" en los listings',
                'Pregunta sobre condición, historial, disponibilidad',
                'Todos los mensajes se guardan en tu bandeja',
                'Recibe notificaciones por email de nuevos mensajes'
              ]
            }
          ]
        },
        {
          id: 'for-sellers',
          title: 'Para Vendedores',
          icon: Store,
          items: [
            {
              title: 'Crear un Listing',
              icon: FileText,
              content: [
                'Ve a tu Panel de Vendedor',
                'Haz clic en "Crear Nuevo Listing"',
                'Selecciona tipo y tamaño de chassis',
                'Establece condición (Nuevo, Road-worthy, As-Is, Certificado)',
                'Ingresa precio por unidad y cantidad disponible',
                'Agrega descripción detallada en inglés y español',
                'Tu listing será revisado antes de publicarse'
              ]
            },
            {
              title: 'Agregar Fotos',
              icon: Camera,
              content: [
                'Sube hasta 10 fotos por listing',
                'Las fotos se optimizan automáticamente para web',
                'Tamaño máximo: 10MB por imagen',
                'Formatos soportados: JPG, PNG, WebP, GIF',
                'Arrastra para reordenar fotos',
                'La primera foto será la imagen principal'
              ]
            },
            {
              title: 'Gestionar Ofertas',
              icon: DollarSign,
              content: [
                'Ve todas las ofertas en tu panel',
                'Acepta, rechaza o contraoferta',
                'Agrega notas al responder',
                'Las ofertas aceptadas pasan a pedidos',
                'Lleva registro de todas las negociaciones'
              ]
            },
            {
              title: 'Notificaciones',
              icon: Bell,
              content: [
                'Recibe notificaciones instantáneas de nuevas ofertas',
                'Alertas cuando compradores te escriban',
                'Notificaciones por email de actualizaciones importantes',
                'Configura preferencias en ajustes'
              ]
            }
          ]
        },
        {
          id: 'account-security',
          title: 'Cuenta y Seguridad',
          icon: Shield,
          items: [
            {
              title: 'Configuración de Perfil',
              icon: User,
              content: [
                'Actualiza tu nombre, empresa y contacto',
                'Agrega foto de perfil para generar confianza',
                'Establece tu idioma preferido',
                'Gestiona preferencias de notificaciones'
              ]
            },
            {
              title: 'Consejos de Seguridad',
              icon: Shield,
              content: [
                'Usa una contraseña fuerte y única',
                'Nunca compartas tus credenciales',
                'Cierra sesión en computadoras compartidas',
                'Reporta actividad sospechosa inmediatamente',
                'Verifica la identidad antes de transacciones'
              ]
            }
          ]
        },
        {
          id: 'faq',
          title: 'Preguntas Frecuentes',
          icon: HelpCircle,
          items: [
            {
              title: 'Preguntas Comunes',
              icon: HelpCircle,
              content: [
                'P: ¿Cuánto tarda la aprobación? R: Usualmente 24-48 horas.',
                'P: ¿Puedo editar mi listing? R: Sí, desde tu panel de vendedor.',
                'P: ¿Cómo reporto un problema? R: Contacta a sales@americanchassisdepot.com',
                'P: ¿Hay costo por publicar? R: Contáctanos para precios actuales.',
                'P: ¿Puedo cancelar una oferta aceptada? R: Contacta a la otra parte y a soporte.'
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
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            {lang === 'es' ? 'Documentación' : 'Documentation'}
          </Badge>
          <h1 className="text-4xl font-bold text-[#0A3161] mb-4">{t.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.subtitle}</p>
          <p className="text-sm text-gray-400 mt-4">{t.lastUpdated}</p>
        </motion.div>

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
                            <span>{line}</span>
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

        {/* Contact Section */}
        <Card className="bg-[#0A3161] text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? '¿Necesitas más ayuda?' : 'Need more help?'}
            </h2>
            <p className="text-gray-300 mb-6">
              {lang === 'es' 
                ? 'Nuestro equipo está disponible para asistirte'
                : 'Our team is available to assist you'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100"
                onClick={() => window.location.href = 'mailto:sales@americanchassisdepot.com'}
              >
                sales@americanchassisdepot.com
              </Button>
              <Button 
                variant="outline" 
                className="bg-white text-[#0A3161] hover:bg-gray-100"
                onClick={() => window.location.href = 'tel:+13463956739'}
              >
                +1 346 395 6739
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
