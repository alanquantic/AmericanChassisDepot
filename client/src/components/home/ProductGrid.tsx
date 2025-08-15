import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { RulerIcon, WeightIcon } from '@/lib/icons';
import { getPrimaryCharacteristic } from '@/lib/chassisUtils';
import { getConditions, getSizes, getCharacteristics } from '@/lib/constants';
import { useLanguage, getCurrentLanguage } from '@/lib/i18n-simple';
import { queryClient } from '@/lib/queryClient';
import { UnifiedContactForm } from '@/components/shared/UnifiedContactForm';
import type { ChassisModel } from '@shared/schema';

interface ProductGridProps {
  initialSize?: string;
  showOnlyNew?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ initialSize, showOnlyNew = false }) => {
  const { t } = useLanguage();
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState(initialSize || 'all');
  const [characteristicFilter, setCharacteristicFilter] = useState('all');
  
  // Update size filter if initialSize prop changes
  useEffect(() => {
    if (initialSize) {
      setSizeFilter(initialSize);
    }
  }, [initialSize]);

  // Fetch chassis models with filters - TOTAL SEPARATION by language
  const currentLanguage = getCurrentLanguage();
  
  // CRITICAL: Complete separation between languages
  let conditionToUse;
  if (currentLanguage === 'es') {
    // ESPAÑOL: SOLO chassis españoles, sin excepciones
    conditionToUse = 'chassis-nuevos-espanol';
  } else {
    // INGLÉS: SOLO chassis ingleses (excluir completamente los españoles)
    if (showOnlyNew) {
      conditionToUse = 'new-chassis';
    } else {
      // Si el filtro es 'all', necesitamos asegurar que NO incluya chassis españoles
      conditionToUse = conditionFilter === 'all' ? 'english-only' : conditionFilter;
    }
  }
  
  // Query parameters for filtering chassis

  const { data, isLoading, error } = useQuery<ChassisModel[]>({
    queryKey: ['/api/chassis/filter', { condition: conditionToUse, size: sizeFilter, manufacturer: 'all', characteristic: characteristicFilter, language: currentLanguage }],
    queryFn: async () => {
      const params = new URLSearchParams({
        condition: conditionToUse || 'all',
        size: sizeFilter || 'all', 
        manufacturer: 'all',
        characteristic: characteristicFilter || 'all'
      });
      
      const url = `/api/chassis/filter?${params.toString()}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Process API response data

  // Asegurémonos de que models sea un array y seleccionemos 6 aleatorios cuando showOnlyNew es true
  let models = Array.isArray(data) ? data : [];
  
  // Si showOnlyNew es true (estamos en el home), seleccionamos 6 productos aleatorios
  if (showOnlyNew && models.length > 6) {
    // Mezclar el array y tomar los primeros 6
    const shuffled = models.sort(() => 0.5 - Math.random());
    models = shuffled.slice(0, 6);
  }

  // Handle filter changes - ensure Spanish separation
  const handleConditionFilterChange = (value: string) => {
    // Si estamos en español, ignorar cambios de condición ya que solo tenemos chassis españoles
    if (currentLanguage === 'es') {
      return; // No permitir cambio de condición en español
    }
    setConditionFilter(value);
  };

  const handleSizeFilterChange = (value: string) => {
    console.log('🔄 Changing size filter from', sizeFilter, 'to', value);
    queryClient.clear();
    setSizeFilter(value);
  };

  const handleCharacteristicFilterChange = (value: string) => {
    // Clear cache before changing filter to ensure fresh data
    queryClient.clear();
    setCharacteristicFilter(value);
  };

  if (error) {
    console.error('Error loading chassis models:', error);
    return (
      <div className="py-16 bg-neutral-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-neutral-200" id="products">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">{t('ourChassisTypes')}</h2>
        <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-8">
          {t('browseSelection')}
        </p>
        
        {/* Condition filter - only show when NOT showOnlyNew AND NOT Spanish */}
        {!showOnlyNew && currentLanguage !== 'es' && (
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            <span className="text-primary font-montserrat font-medium self-center">Condition:</span>
            {getConditions().map(condition => (
              <button
                key={condition.value}
                className={`font-montserrat font-medium px-4 py-2 rounded transition duration-200 ${
                  conditionFilter === condition.value 
                    ? 'active-filter' 
                    : 'inactive-filter'
                }`}
                onClick={() => handleConditionFilterChange(condition.value)}
              >
                {condition.name}
              </button>
            ))}
          </div>
        )}

        {/* Size filter */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          <span className="text-primary font-montserrat font-medium self-center">{getCurrentLanguage() === 'es' ? 'Filtrar por Tamaño:' : 'Filter by Size:'}</span>
          {getSizes().map(size => (
            <button
              key={size.value}
              className={`font-montserrat font-medium px-4 py-2 rounded transition duration-200 ${
                sizeFilter === size.value 
                  ? 'active-filter' 
                  : 'inactive-filter'
              }`}
              onClick={() => handleSizeFilterChange(size.value)}
            >
              {size.name}
            </button>
          ))}
        </div>

        {/* Characteristics filter - only show when NOT showOnlyNew */}
        {!showOnlyNew && (
          <div className="flex flex-wrap justify-center mb-8 gap-4">
            <span className="text-primary font-montserrat font-medium self-center">{getCurrentLanguage() === 'es' ? 'Filtrar por Características:' : 'Filter by Characteristics:'}</span>
            {getCharacteristics().map(characteristic => (
              <button
                key={characteristic.value}
                className={`font-montserrat font-medium px-4 py-2 rounded transition duration-200 ${
                  characteristicFilter === characteristic.value 
                    ? 'active-filter' 
                    : 'inactive-filter'
                }`}
                onClick={() => handleCharacteristicFilterChange(characteristic.value)}
              >
                {characteristic.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))
          ) : models.length > 0 ? (
            models.map((model) => {
              // Find condition name based on model's conditionId
              const currentLang = getCurrentLanguage();
              const isSpanish = currentLang === 'es';
              
              // CRITICAL: Los chassis españoles (conditionId=5) siempre son "Nuevo"
              // Only show NEW badge; never show USED
              const showNewBadge = model.conditionId !== 4 && model.conditionId !== 2;
              const conditionName = isSpanish ? 'Nuevo' : 'New';
              
              return (
                <div 
                  key={model.id} 
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-56 bg-neutral-200 overflow-hidden relative">
                    {/* Solo mostrar etiqueta de condición cuando NO es showOnlyNew */}
                    {!showOnlyNew && showNewBadge && (
                      <div className={`absolute top-0 left-0 text-white px-3 py-1 m-2 rounded font-montserrat text-sm font-semibold ${
                        'bg-[#B22234]'
                      }`}>
                        {conditionName}
                      </div>
                    )}
                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-sm font-montserrat text-sm font-semibold">
                      American Chassis Depot
                    </div>
                    <img 
                      src={model.imageUrl} 
                      alt={model.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-montserrat font-bold text-primary mb-2">
                      {model.name.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 text-neutral-600">
                      <RulerIcon className="w-4 h-4" />
                      <span>{model.size}</span>
                      <span className="mx-2">|</span>
                      <WeightIcon className="w-4 h-4" />
                      <span>{getPrimaryCharacteristic(model.name, model.axleConfig)}</span>
                    </div>
                    <p className="text-neutral-600 mb-4">
                      {model.description}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/${getCurrentLanguage()}/products/${model.slug}`} 
                        className="inline-block border border-primary text-primary hover:bg-primary hover:text-white font-montserrat font-medium px-4 py-2 rounded transition-all duration-200"
                      >
                        {t('viewDetails')}
                      </Link>
                      <UnifiedContactForm
                        chassisName={model.name}
                        chassisSlug={model.slug}
                        actionType="quote"
                        triggerText={t('getAQuote')}
                        className="inline-block bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-medium px-6 py-2 rounded transition-all duration-200 min-w-[120px]"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-600">{t('noChassisFound')}</p>
            </div>
          )}
        </div>
        
        {/* Solo mostrar botón View All Products cuando estamos en el home (showOnlyNew = true) */}
        {showOnlyNew && (
          <div className="text-center mt-12">
            <Link href={`/${getCurrentLanguage()}/products`} className="inline-block bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg">
              {t('viewAllProducts')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
