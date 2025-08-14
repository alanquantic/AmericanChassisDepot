import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n-simple';
import { useToast } from '@/hooks/use-toast';
import { DownloadIcon } from 'lucide-react';

const downloadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters')
});

type DownloadFormData = z.infer<typeof downloadFormSchema>;

interface DownloadBrochureFormProps {
  chassisName: string;
  chassisSlug: string;
}

export const DownloadBrochureForm: React.FC<DownloadBrochureFormProps> = ({ 
  chassisName, 
  chassisSlug 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<DownloadFormData>({
    resolver: zodResolver(downloadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: ''
    }
  });

  const downloadMutation = useMutation({
    mutationFn: async (data: DownloadFormData & { chassisName: string; chassisSlug: string }) => {
      const response = await fetch('/api/download-brochure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to process download request');
      }
      
      return response.blob();
    },
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chassisSlug}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: t('downloadStartedTitle'),
        description: t('downloadStartedDesc'),
      });
      
      setIsOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('downloadFailedTitle'),
        description: t('downloadFailedDesc'),
      });
    }
  });

  const onSubmit = (data: DownloadFormData) => {
    downloadMutation.mutate({
      ...data,
      chassisName,
      chassisSlug
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-medium px-6 py-3 rounded transition-all duration-200 flex items-center gap-2"
        >
          <DownloadIcon className="w-5 h-5" />
          {t('downloadBrochure')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-montserrat font-bold text-primary">
            {t('downloadBrochure')}
          </DialogTitle>
          <p className="text-sm text-neutral-600 mt-2">
            {t('sendUsAMessage')}
          </p>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-montserrat font-medium">
              {t('fullName')} *
            </Label>
            <Input
              id="name"
              {...form.register('name')}
              className="font-montserrat"
              placeholder={t('fullName')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-montserrat font-medium">
              {t('emailAddressLabel')} *
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className="font-montserrat"
              placeholder={t('emailAddressLabel')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="font-montserrat font-medium">
              {t('companyName')} *
            </Label>
            <Input
              id="company"
              {...form.register('company')}
              className="font-montserrat"
              placeholder={t('companyName')}
            />
            {form.formState.errors.company && (
              <p className="text-sm text-red-500">{form.formState.errors.company.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-montserrat font-medium">
              {t('phoneNumberLabel')} *
            </Label>
            <Input
              id="phone"
              type="tel"
              {...form.register('phone')}
              className="font-montserrat"
              placeholder={t('phoneNumberLabel')}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
            )}
          </div>

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
              disabled={downloadMutation.isPending}
              className="flex-1 bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat"
            >
              {downloadMutation.isPending ? t('downloading') : t('download')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};