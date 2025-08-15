import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getConditions } from '@/lib/constants';
import { useLanguage, getCurrentLanguage } from '@/lib/i18n-simple';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DownloadIcon, FileTextIcon } from 'lucide-react';

// Enhanced form schema with security validation
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  company: z.string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must be less than 100 characters" }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(20, { message: "Phone number must be less than 20 characters" })
    .regex(/^[\d\s\-\+\(\)]+$/, { message: "Phone number can only contain digits, spaces, hyphens, plus signs, and parentheses" }),
  units: z.string()
    .min(1, { message: "Number of units is required" })
    .regex(/^\d+$/, { message: "Units must be a valid number" }),
  interest: z.string()
    .min(1, { message: "Please select an option" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  sourceUrl: z.string().optional(),
  // Security fields
  honeypot: z.string().max(0, { message: "Invalid submission" }), // Hidden field to catch bots
  timestamp: z.string()
});

type UnifiedFormValues = z.infer<typeof formSchema>;

interface UnifiedContactFormProps {
  chassisName: string;
  chassisSlug: string;
  actionType: 'quote' | 'brochure';
  triggerText?: string;
  className?: string;
}

export const UnifiedContactForm: React.FC<UnifiedContactFormProps> = ({ 
  chassisName, 
  chassisSlug, 
  actionType,
  triggerText,
  className = "" 
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [staticUrl, setStaticUrl] = useState<string | null>(null);
  
  // Initialize form with security timestamp
  const form = useForm<UnifiedFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      units: "",
      interest: "",
      message: "",
      sourceUrl: window.location.href,
      honeypot: "",
      timestamp: new Date().toISOString()
    }
  });

  // Check for static PDF if action is brochure
  React.useEffect(() => {
    if (actionType === 'brochure') {
      const lang = getCurrentLanguage();
      const url = `/brochures/${lang === 'es' ? 'es' : 'en'}/${chassisSlug}.pdf`;
      fetch(url, { method: 'HEAD' }).then((res) => {
        if (res.ok) setStaticUrl(url);
      }).catch(() => {});
    }
  }, [chassisSlug, actionType]);

  // Submit mutation
  const mutation = useMutation({
    mutationFn: (values: UnifiedFormValues) => {
      // Security check: ensure timestamp is recent (within 5 minutes)
      const submissionTime = new Date(values.timestamp);
      const now = new Date();
      const timeDiff = now.getTime() - submissionTime.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeDiff > fiveMinutes) {
        throw new Error('Form submission expired. Please refresh and try again.');
      }

      // Include product information and action type
      const dataWithContext = {
        ...values,
        chassisName,
        chassisSlug,
        actionType,
        sourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      const endpoint = actionType === 'quote' ? '/api/contact' : '/api/download-brochure';
      return apiRequest('POST', endpoint, dataWithContext);
    },
    onSuccess: (response: any) => {
      try {
        const lang = getCurrentLanguage();
        // GA4 events
        const eventName = actionType === 'quote' ? 'generate_lead' : 'brochure_download';
        const eventLabel = actionType === 'quote' ? 'Quote Request' : 'Download Brochure';
        
        // @ts-ignore
        window.gtag && window.gtag('event', eventName, {
          event_category: actionType === 'quote' ? 'Lead' : 'Engagement',
          event_label: eventLabel,
          product_slug: chassisSlug,
          product_name: chassisName,
          language: lang,
          source_url: window.location.href
        });

        // Additional file_download event for brochures
        if (actionType === 'brochure') {
          // @ts-ignore
          window.gtag && window.gtag('event', 'file_download', {
            link_text: 'Download Brochure',
            file_name: `${chassisSlug}.pdf`,
            product_slug: chassisSlug,
            product_name: chassisName,
            language: lang
          });
        }
      } catch {}

      // Handle brochure download if static URL exists
      if (actionType === 'brochure' && staticUrl) {
        window.open(staticUrl, '_blank');
      }

      // Success message
      const successTitle = actionType === 'quote' 
        ? (getCurrentLanguage() === 'es' ? "¡Solicitud Enviada!" : "Request Sent!")
        : (getCurrentLanguage() === 'es' ? "¡Descarga Iniciada!" : "Download Started!");
      
      const successDesc = actionType === 'quote'
        ? (getCurrentLanguage() === 'es' 
            ? "Hemos recibido tu solicitud de cotización. Nuestro equipo se pondrá en contacto contigo pronto con una propuesta personalizada." 
            : "We've received your quote request. Our team will contact you soon with a personalized proposal.")
        : (getCurrentLanguage() === 'es'
            ? "El folleto se está descargando. También hemos enviado una copia a tu correo electrónico."
            : "The brochure is downloading. We've also sent a copy to your email.");

      toast({
        title: successTitle,
        description: successDesc,
        variant: "default",
        duration: 5000
      });
      
      // Reset form
      form.reset({
        name: "",
        email: "",
        company: "",
        phone: "",
        units: "",
        interest: "",
        message: "",
        sourceUrl: window.location.href,
        honeypot: "",
        timestamp: new Date().toISOString()
      });
      
      setIsOpen(false);
    },
    onError: (error: any) => {
      const errorTitle = getCurrentLanguage() === 'es' ? "Error" : "Error";
      const errorDesc = getCurrentLanguage() === 'es'
        ? "Hubo un problema procesando tu solicitud. Por favor intenta de nuevo."
        : "There was a problem processing your request. Please try again.";
      
      toast({
        title: errorTitle,
        description: errorDesc,
        variant: "destructive"
      });
      console.error("Form submission error:", error);
    }
  });
  
  const onSubmit = (data: UnifiedFormValues) => {
    // Security check: honeypot field should be empty
    if (data.honeypot) {
      console.warn("Bot detected via honeypot field");
      return;
    }
    
    // Update timestamp for security
    data.timestamp = new Date().toISOString();
    mutation.mutate(data);
  };

  const getTriggerText = () => {
    if (triggerText) return triggerText;
    return actionType === 'quote' 
      ? (getCurrentLanguage() === 'es' ? 'Solicitar Cotización' : 'Request Quote')
      : (getCurrentLanguage() === 'es' ? 'Descargar Folleto' : 'Download Brochure');
  };

  const getDialogTitle = () => {
    return actionType === 'quote'
      ? (getCurrentLanguage() === 'es' ? 'Solicitar Cotización' : 'Request Quote')
      : (getCurrentLanguage() === 'es' ? 'Descargar Folleto' : 'Download Brochure');
  };

  const getDialogDescription = () => {
    return actionType === 'quote'
      ? (getCurrentLanguage() === 'es' 
          ? 'Completa el formulario a continuación y uno de nuestros representantes se pondrá en contacto contigo con una cotización personalizada.'
          : 'Complete the form below and one of our representatives will contact you with a personalized quote.')
      : (getCurrentLanguage() === 'es'
          ? 'Completa el formulario para descargar el folleto técnico de este producto.'
          : 'Complete the form to download the technical brochure for this product.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className={`bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-medium px-6 py-3 rounded transition-all duration-200 flex items-center gap-2 ${className}`}
        >
          {actionType === 'quote' ? <FileTextIcon className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />}
          {getTriggerText()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-montserrat font-bold text-primary text-xl">
            {getDialogTitle()}
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            {getDialogDescription()}
          </p>
          <p className="text-sm text-neutral-500 mt-1">
            {getCurrentLanguage() === 'es' ? 'Producto:' : 'Product:'} <span className="font-semibold">{chassisName}</span>
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            {/* Hidden honeypot field for bot protection */}
            <input 
              type="text" 
              {...form.register('honeypot')} 
              style={{ display: 'none' }} 
              tabIndex={-1}
              autoComplete="off"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('fullName')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                        placeholder={t('fullName')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('emailAddressLabel')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email"
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                        placeholder={t('emailAddressLabel')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('companyName')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                        placeholder={t('companyName')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('phoneNumberLabel')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="tel"
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                        placeholder={t('phoneNumberLabel')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('interestedIn')} *
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600">
                          <SelectValue placeholder={t('selectChassisType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getConditions().filter(condition => condition.value !== 'all').map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">{getCurrentLanguage() === 'es' ? 'Otro' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="units"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-montserrat font-medium">
                      {t('numberOfUnits')} *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        min="1"
                        placeholder={t('howManyUnits')}
                        className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-montserrat font-medium">
                    {t('message')} *
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 text-gray-900 placeholder-gray-600" 
                      placeholder={actionType === 'quote' 
                        ? (getCurrentLanguage() === 'es' 
                            ? 'Describe tus necesidades específicas, requisitos especiales, o cualquier pregunta que tengas sobre este producto...'
                            : 'Describe your specific needs, special requirements, or any questions you have about this product...')
                        : (getCurrentLanguage() === 'es'
                            ? 'Comentarios adicionales o preguntas sobre este producto...'
                            : 'Additional comments or questions about this product...')
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 font-montserrat"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-semibold"
              >
                {mutation.isPending 
                  ? (getCurrentLanguage() === 'es' ? 'Enviando...' : 'Sending...')
                  : (actionType === 'quote' 
                      ? (getCurrentLanguage() === 'es' ? 'Enviar Solicitud' : 'Send Request')
                      : (getCurrentLanguage() === 'es' ? 'Descargar Folleto' : 'Download Brochure')
                    )
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UnifiedContactForm;
