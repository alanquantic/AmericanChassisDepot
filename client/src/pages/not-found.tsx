import React from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/lib/i18n-simple';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Seo from '@/components/seo/Seo';

const NotFound: React.FC = () => {
  const { t, language } = useLanguage();
  const [location] = useLocation();
  
  const langPrefix = location.startsWith('/es') ? '/es' : location.startsWith('/en') ? '/en' : `/${language}`;
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Seo
        title={language === 'es' ? 'Página no encontrada | American Chassis Depot' : 'Page Not Found | American Chassis Depot'}
        description="The page you are looking for does not exist."
        noindex={true}
      />
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">{t('pageNotFoundTitle')}</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-4">
            {t('pageNotFoundDescription')}
          </p>
          
          <Link href={langPrefix} className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            {t('goHomeButton')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
