import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CONDITIONS, getConditions } from '@/lib/constants';
import { useLocation } from 'wouter';
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

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().min(1, { message: "Company name is required" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  units: z.string().min(1, { message: "Number of units is required" }),
  interest: z.string().min(1, { message: "Please select an option" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  sourceUrl: z.string().optional()
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = "" }) => {
  const { toast } = useToast();
  const [location] = useLocation();
  const { t } = useLanguage();
  
  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      units: "",
      interest: "",
      message: "",
      sourceUrl: window.location.href
    }
  });
  
  // Submit mutation
  const mutation = useMutation({
    mutationFn: (values: ContactFormValues) => {
      // Include the current URL in the submission
      const dataWithSource = {
        ...values,
        sourceUrl: window.location.href
      };
      return apiRequest('POST', '/api/contact', dataWithSource);
    },
    onSuccess: (response: any) => {
      // Same friendly message regardless of email status
      toast({
        title: getCurrentLanguage() === 'es' ? "¡Gracias!" : "Thank You!",
        description: getCurrentLanguage() === 'es' ? "Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo pronto." : "We've received your information. Our team will contact you soon.",
        variant: "default",
        duration: 5000
      });
      
      form.reset({
        name: "",
        email: "",
        company: "",
        phone: "",
        units: "",
        interest: "",
        message: "",
        sourceUrl: window.location.href
      });
    },
    onError: (error) => {
      toast({
        title: getCurrentLanguage() === 'es' ? "Error" : "Error",
        description: getCurrentLanguage() === 'es' ? "Hubo un problema enviando tu mensaje. Por favor intenta de nuevo." : "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
      console.error("Form submission error:", error);
    }
  });
  
  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-montserrat text-neutral-700">{t('fullName')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90" 
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
                <FormLabel className="font-montserrat text-neutral-700">{t('emailAddressLabel')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-montserrat text-neutral-700">{t('companyName')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 transition-all duration-200 hover:border-primary" 
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
                <FormLabel className="font-montserrat text-neutral-700">{t('phoneNumberLabel')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="tel"
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 transition-all duration-200 hover:border-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-montserrat text-neutral-700">{t('interestedIn')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 transition-all duration-200 hover:border-primary">
                      <SelectValue placeholder={t('selectChassisType')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Condition options */}
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
                <FormLabel className="font-montserrat text-neutral-700">{t('numberOfUnits')}</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number"
                    min="1"
                    placeholder={t('howManyUnits')}
                    className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 transition-all duration-200 hover:border-primary" 
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
            <FormItem className="mb-6">
              <FormLabel className="font-montserrat text-neutral-700">{t('message')}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={4}
                  className="w-full px-4 py-2 border border-neutral-300 rounded focus:outline-none focus:border-primary bg-white/90 transition-all duration-200 hover:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-semibold px-8 py-3 rounded transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? t('sending') : t('sendMessage')}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
