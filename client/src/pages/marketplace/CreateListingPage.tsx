import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Package,
  DollarSign,
  MapPin,
  FileText,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  getStoredUser, 
  isAuthenticated,
  createListing,
} from '@/lib/marketplace-api';
import { getCurrentLanguage } from '@/lib/i18n-simple';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Chassis types
const CHASSIS_TYPES = [
  { value: 'Gooseneck', label: 'Gooseneck' },
  { value: 'Slider', label: 'Slider' },
  { value: 'Extendable', label: 'Extendable' },
  { value: 'Spread', label: 'Spread' },
  { value: 'Tank', label: 'Tank / ISO Tank' },
];

// Chassis sizes
const CHASSIS_SIZES = [
  { value: "20'", label: "20'" },
  { value: "40'", label: "40'" },
  { value: "45'", label: "45'" },
  { value: "53'", label: "53'" },
  { value: "20-40'", label: "20-40' (Extendable)" },
  { value: "40-45'", label: "40-45' (Extendable)" },
  { value: "40-45-48'", label: "40-45-48' (Extendable)" },
  { value: "40-45-48-53'", label: "40-45-48-53' (Extendable)" },
];

// Conditions
const CONDITIONS = [
  { value: 'New', label: { en: 'New', es: 'Nuevo' } },
  { value: 'Road-worthy', label: { en: 'Road-worthy', es: 'Road-worthy' } },
  { value: 'ASIS', label: { en: 'As-Is', es: 'As-Is' } },
  { value: 'Certified', label: { en: 'Certified', es: 'Certificado' } },
];

interface FormData {
  chassisType: string;
  chassisSize: string;
  condition: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  pricePerUnit: string;
  priceNegotiable: boolean;
  quantity: number;
  city: string;
  state: string;
  year?: string;
  manufacturer?: string;
}

export default function CreateListingPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const lang = getCurrentLanguage();
  const user = getStoredUser();

  const [formData, setFormData] = useState<FormData>({
    chassisType: '',
    chassisSize: '',
    condition: '',
    title: '',
    titleEs: '',
    description: '',
    descriptionEs: '',
    pricePerUnit: '',
    priceNegotiable: false,
    quantity: 1,
    city: '',
    state: '',
    year: '',
    manufacturer: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
      return;
    }
    if (!user || !['seller', 'admin', 'super_admin'].includes(user.role)) {
      toast({
        title: lang === 'es' ? 'Acceso denegado' : 'Access denied',
        description: lang === 'es' ? 'Necesitas ser vendedor para crear listings' : 'You need to be a seller to create listings',
        variant: 'destructive',
      });
      navigate(`/${lang}/marketplace/dashboard`);
    }
  }, [user, navigate, lang]);

  // Auto-generate title based on selections
  useEffect(() => {
    if (formData.chassisType && formData.chassisSize && formData.city && formData.state) {
      const autoTitle = `${formData.chassisType} ${formData.chassisSize} Chassis - ${formData.city}, ${formData.state}`;
      const autoTitleEs = `Chassis ${formData.chassisType} ${formData.chassisSize} - ${formData.city}, ${formData.state}`;
      
      if (!formData.title || formData.title.includes('Chassis -')) {
        setFormData(prev => ({ ...prev, title: autoTitle, titleEs: autoTitleEs }));
      }
    }
  }, [formData.chassisType, formData.chassisSize, formData.city, formData.state]);

  const createMutation = useMutation({
    mutationFn: createListing,
    onSuccess: (data) => {
      toast({
        title: lang === 'es' ? 'Listing creado' : 'Listing created',
        description: lang === 'es' 
          ? 'Tu listing está pendiente de aprobación. Te notificaremos cuando esté activo.'
          : 'Your listing is pending approval. We\'ll notify you when it\'s live.',
      });
      navigate(`/${lang}/marketplace/seller/listings`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || (lang === 'es' ? 'Error al crear listing' : 'Failed to create listing'),
        variant: 'destructive',
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.chassisType) newErrors.chassisType = lang === 'es' ? 'Requerido' : 'Required';
    if (!formData.chassisSize) newErrors.chassisSize = lang === 'es' ? 'Requerido' : 'Required';
    if (!formData.condition) newErrors.condition = lang === 'es' ? 'Requerido' : 'Required';
    if (!formData.title) newErrors.title = lang === 'es' ? 'Requerido' : 'Required';
    if (!formData.pricePerUnit || parseFloat(formData.pricePerUnit) <= 0) {
      newErrors.pricePerUnit = lang === 'es' ? 'Precio inválido' : 'Invalid price';
    }
    if (!formData.quantity || formData.quantity < 1) {
      newErrors.quantity = lang === 'es' ? 'Mínimo 1' : 'Minimum 1';
    }
    if (!formData.city) newErrors.city = lang === 'es' ? 'Requerido' : 'Required';
    if (!formData.state) newErrors.state = lang === 'es' ? 'Requerido' : 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: lang === 'es' ? 'Formulario incompleto' : 'Incomplete form',
        description: lang === 'es' ? 'Por favor completa todos los campos requeridos' : 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      chassisType: formData.chassisType,
      chassisSize: formData.chassisSize,
      condition: formData.condition,
      title: formData.title,
      titleEs: formData.titleEs || formData.title,
      description: formData.description,
      descriptionEs: formData.descriptionEs || formData.description,
      pricePerUnit: formData.pricePerUnit,
      priceNegotiable: formData.priceNegotiable,
      quantity: formData.quantity,
      city: formData.city,
      state: formData.state,
      year: formData.year ? parseInt(formData.year) : undefined,
      manufacturer: formData.manufacturer || undefined,
    } as any);
  };

  const content = {
    en: {
      title: 'Create New Listing',
      subtitle: 'List your chassis for sale on the marketplace',
      backToListings: 'Back to My Listings',
      chassisInfo: 'Chassis Information',
      chassisInfoDesc: 'Select the type, size, and condition of your chassis',
      type: 'Chassis Type',
      size: 'Chassis Size',
      condition: 'Condition',
      pricing: 'Pricing & Quantity',
      pricingDesc: 'Set your price and available quantity',
      pricePerUnit: 'Price per Unit ($)',
      negotiable: 'Price Negotiable',
      quantity: 'Quantity Available',
      location: 'Location',
      locationDesc: 'Where is the chassis located?',
      city: 'City',
      state: 'State',
      details: 'Listing Details',
      detailsDesc: 'Add title and description for your listing',
      titleEn: 'Title (English)',
      titleEs: 'Title (Spanish)',
      descEn: 'Description (English)',
      descEs: 'Description (Spanish)',
      optional: 'Optional',
      year: 'Year',
      manufacturer: 'Manufacturer',
      createListing: 'Create Listing',
      creating: 'Creating...',
      pendingNote: 'Note: Your listing will be reviewed by our team before going live. This usually takes 24-48 hours.',
      selectPlaceholder: 'Select...',
    },
    es: {
      title: 'Crear Nuevo Listing',
      subtitle: 'Publica tu chassis en el marketplace',
      backToListings: 'Volver a Mis Listings',
      chassisInfo: 'Información del Chassis',
      chassisInfoDesc: 'Selecciona el tipo, tamaño y condición de tu chassis',
      type: 'Tipo de Chassis',
      size: 'Tamaño',
      condition: 'Condición',
      pricing: 'Precio y Cantidad',
      pricingDesc: 'Establece tu precio y cantidad disponible',
      pricePerUnit: 'Precio por Unidad ($)',
      negotiable: 'Precio Negociable',
      quantity: 'Cantidad Disponible',
      location: 'Ubicación',
      locationDesc: '¿Dónde está ubicado el chassis?',
      city: 'Ciudad',
      state: 'Estado',
      details: 'Detalles del Listing',
      detailsDesc: 'Agrega título y descripción para tu listing',
      titleEn: 'Título (Inglés)',
      titleEs: 'Título (Español)',
      descEn: 'Descripción (Inglés)',
      descEs: 'Descripción (Español)',
      optional: 'Opcional',
      year: 'Año',
      manufacturer: 'Fabricante',
      createListing: 'Crear Listing',
      creating: 'Creando...',
      pendingNote: 'Nota: Tu listing será revisado por nuestro equipo antes de publicarse. Esto usualmente toma 24-48 horas.',
      selectPlaceholder: 'Seleccionar...',
    },
  };

  const t = content[lang as keyof typeof content] || content.en;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(`/${lang}/marketplace/seller/listings`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToListings}
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#0A3161] flex items-center gap-3">
            <Package className="w-8 h-8" />
            {t.title}
          </h1>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chassis Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0A3161]" />
                  {t.chassisInfo}
                </CardTitle>
                <CardDescription>{t.chassisInfoDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t.type} *</Label>
                    <Select
                      value={formData.chassisType}
                      onValueChange={(value) => setFormData({ ...formData, chassisType: value })}
                    >
                      <SelectTrigger className={errors.chassisType ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {CHASSIS_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.chassisType && <p className="text-red-500 text-xs mt-1">{errors.chassisType}</p>}
                  </div>

                  <div>
                    <Label>{t.size} *</Label>
                    <Select
                      value={formData.chassisSize}
                      onValueChange={(value) => setFormData({ ...formData, chassisSize: value })}
                    >
                      <SelectTrigger className={errors.chassisSize ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {CHASSIS_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.chassisSize && <p className="text-red-500 text-xs mt-1">{errors.chassisSize}</p>}
                  </div>

                  <div>
                    <Label>{t.condition} *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({ ...formData, condition: value })}
                    >
                      <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITIONS.map((cond) => (
                          <SelectItem key={cond.value} value={cond.value}>
                            {cond.label[lang as 'en' | 'es'] || cond.label.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.year} ({t.optional})</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      min="1990"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div>
                    <Label>{t.manufacturer} ({t.optional})</Label>
                    <Input
                      placeholder="CIMC, Singamas, etc."
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  {t.pricing}
                </CardTitle>
                <CardDescription>{t.pricingDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t.pricePerUnit} *</Label>
                    <Input
                      type="number"
                      placeholder="15000"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      className={errors.pricePerUnit ? 'border-red-500' : ''}
                      min="0"
                      step="100"
                    />
                    {errors.pricePerUnit && <p className="text-red-500 text-xs mt-1">{errors.pricePerUnit}</p>}
                  </div>

                  <div>
                    <Label>{t.quantity} *</Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className={errors.quantity ? 'border-red-500' : ''}
                      min="1"
                    />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={formData.priceNegotiable}
                      onCheckedChange={(checked) => setFormData({ ...formData, priceNegotiable: checked })}
                    />
                    <Label className="cursor-pointer">{t.negotiable}</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  {t.location}
                </CardTitle>
                <CardDescription>{t.locationDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.city} *</Label>
                    <Input
                      placeholder="Houston"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label>{t.state} *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => setFormData({ ...formData, state: value })}
                    >
                      <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                        <SelectValue placeholder={t.selectPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {t.details}
                </CardTitle>
                <CardDescription>{t.detailsDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t.titleEn} *</Label>
                    <Input
                      placeholder="Gooseneck 40' Chassis - Houston, TX"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label>{t.titleEs} ({t.optional})</Label>
                    <Input
                      placeholder="Chassis Gooseneck 40' - Houston, TX"
                      value={formData.titleEs}
                      onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>{t.descEn} ({t.optional})</Label>
                  <Textarea
                    placeholder="Describe your chassis condition, features, history, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>{t.descEs} ({t.optional})</Label>
                  <Textarea
                    placeholder="Describe la condición, características, historial, etc."
                    value={formData.descriptionEs}
                    onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Note */}
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {t.pendingNote}
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/${lang}/marketplace/seller/listings`)}
            >
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              className="bg-[#0A3161] hover:bg-[#0A3161]/90"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t.creating}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t.createListing}
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
