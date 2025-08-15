import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage, getCurrentLanguage } from '@/lib/i18n-simple';
import type { Condition } from '@shared/schema';

const ChassisTypeShowcase: React.FC = () => {
  const { t } = useLanguage();
  const { data, isLoading, error } = useQuery<Condition[]>({
    queryKey: ['/api/conditions'],
  });

  // Asegurémonos de que conditions sea un array
  const conditions = Array.isArray(data) ? data : [];

  if (error) {
    console.error('Error loading conditions:', error);
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">{t('failedToLoadChassisTypes')}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="chassis-types">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">{t('chassisShowcaseTitle')}</h2>
        <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-12">
          {t('chassisShowcaseSubtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {isLoading ? (
            // Loading skeletons
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))
          ) : conditions.length > 0 ? (
            conditions
              .filter((condition) => condition.slug !== 'chassis-nuevos-espanol') // Ocultar la condición española
              .map((condition) => {
                // Determinar si es "Used Chassis" para mostrar el formulario
                const isUsedChassis = condition.name.toLowerCase().includes('used') || condition.slug.includes('used');
                
                return (
              <div key={condition.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2" id={condition.slug}>
                <div className="relative h-64 bg-neutral-200 overflow-hidden">
                  <div className="absolute top-0 left-0 bg-[#E30D16] text-white px-3 py-1 m-2 rounded-sm font-montserrat text-sm font-semibold z-10">
                    {condition.name}
                  </div>
                  <img 
                    src={condition.imageUrl} 
                    alt={condition.name} 
                    className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-montserrat font-bold text-primary mb-3">{condition.name}</h3>
                  <p className="text-neutral-600 mb-5">
                    {condition.description}
                  </p>
                  <Link 
                    href={isUsedChassis ? `/${getCurrentLanguage()}/used-chassis` : `/${getCurrentLanguage()}/products`} 
                    className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-6 py-2 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    {t('viewModels')}
                  </Link>
                </div>
              </div>
            );
              })
            )
          ) : (
            <div className="col-span-2 text-center py-10">
              <p className="text-neutral-500">{t('noChassisTypesAvailable')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ChassisTypeShowcase;
