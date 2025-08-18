import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/lib/i18n-simple';
import { useToast } from '@/hooks/use-toast';

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
  chassisType: z.string()
    .min(1, { message: "Please select a chassis type" }),
  quantity: z.string()
    .min(1, { message: "Quantity is required" })
    .regex(/^\d+$/, { message: "Quantity must be a valid number" }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  honeypot: z.string().max(0, { message: "Invalid submission" }),
  timestamp: z.string()
});

type FormData = z.infer<typeof formSchema>;

const UsedChassisForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      chassisType: '',
      quantity: '',
      message: '',
      honeypot: '',
      timestamp: new Date().toISOString()
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Validate honeypot and timestamp
      if (data.honeypot || !data.timestamp) {
        throw new Error('Invalid submission');
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          chassisName: 'Used Chassis Inquiry',
          chassisSlug: 'used-chassis',
          actionType: 'quote',
          sourceUrl: window.location.href,
          userAgent: navigator.userAgent
        }),
      });

      if (response.ok) {
        toast({
          title: t('success'),
          description: t('usedChassisInquirySent'),
        });
        form.reset();
      } else {
        throw new Error('Failed to send inquiry');
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSendInquiry'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-montserrat font-bold text-primary mb-6 text-center">
        {t('usedChassisInquiry')}
      </h2>
      <p className="text-neutral-600 mb-6 text-center">
        {t('usedChassisInquiryDescription')}
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')} *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>{t('email')} *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                  <FormLabel>{t('company')} *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>{t('phone')} *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="chassisType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('chassisType')} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectChassisType')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="20ft">20ft</SelectItem>
                      <SelectItem value="40ft">40ft</SelectItem>
                      <SelectItem value="45ft">45ft</SelectItem>
                      <SelectItem value="53ft">53ft</SelectItem>
                      <SelectItem value="extendable">Extendable</SelectItem>
                      <SelectItem value="gooseneck">Gooseneck</SelectItem>
                      <SelectItem value="triaxle">Triaxle</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('quantity')} *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                <FormLabel>{t('message')} *</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder={t('usedChassisMessagePlaceholder')}
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Honeypot field */}
          <input
            type="text"
            {...form.register('honeypot')}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <Button 
            type="submit" 
            className="w-full bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-medium px-6 py-3 rounded transition-all duration-200"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? t('sending') : t('sendInquiry')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UsedChassisForm;
