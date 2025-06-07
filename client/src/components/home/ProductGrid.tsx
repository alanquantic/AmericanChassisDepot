import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { RulerIcon, WeightIcon } from '@/lib/icons';
import { CONDITIONS, SIZES } from '@/lib/constants';
import type { ChassisModel } from '@shared/schema';

interface ProductGridProps {
  initialSize?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ initialSize }) => {
  const [conditionFilter, setConditionFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState(initialSize || 'all');
  
  // Update size filter if initialSize prop changes
  useEffect(() => {
    if (initialSize) {
      setSizeFilter(initialSize);
    }
  }, [initialSize]);

  // Fetch chassis models with filters
  const { data, isLoading, error } = useQuery<ChassisModel[]>({
    queryKey: ['/api/chassis/filter', { condition: conditionFilter, size: sizeFilter, manufacturer: 'all' }],
  });

  // Asegurémonos de que models sea un array
  const models = Array.isArray(data) ? data : [];

  // Handle filter changes
  const handleConditionFilterChange = (value: string) => {
    setConditionFilter(value);
  };

  const handleSizeFilterChange = (value: string) => {
    setSizeFilter(value);
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
        <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">Featured Chassis Models</h2>
        <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-8">
          Browse our selection of premium chassis models or filter by your specific requirements
        </p>
        
        {/* Condition filter controls */}
        <div className="flex flex-wrap justify-center mb-8 gap-4">
          {CONDITIONS.map(condition => (
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
        
        {/* Size filter */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          <span className="text-primary font-montserrat font-medium self-center">Size:</span>
          {SIZES.map(size => (
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
              const conditionName = CONDITIONS.find(c => c.value !== 'all' && c.value.includes(model.conditionId === 1 ? 'new' : 'used'))?.name || '';
              
              return (
                <div 
                  key={model.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-56 bg-neutral-200 overflow-hidden relative">
                    <div className={`absolute top-0 left-0 text-white px-3 py-1 m-2 rounded-sm font-montserrat text-sm font-semibold ${
                      model.conditionId === 1 ? 'bg-[#E30D16]' : 'bg-blue-600'
                    }`}>
                      {conditionName}
                    </div>
                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 m-2 rounded-sm font-montserrat text-sm font-semibold">
                      {model.manufacturer}
                    </div>
                    <img 
                      src={model.imageUrl} 
                      alt={model.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{model.name}</h3>
                    <div className="flex items-center gap-2 mb-3 text-neutral-600">
                      <RulerIcon className="w-4 h-4" />
                      <span>{model.size}</span>
                      <span className="mx-2">|</span>
                      <WeightIcon className="w-4 h-4" />
                      <span>{model.dutyType}</span>
                    </div>
                    <p className="text-neutral-600 mb-4">
                      {model.description}
                    </p>
                    <Link
                      href={`/products/${model.slug}`} 
                      className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-4 py-2 rounded transition duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-600">No chassis models found with the selected filters.</p>
            </div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/products" className="inline-block bg-[#F5A623] hover:bg-[#e09511] text-primary font-montserrat font-semibold px-8 py-3 rounded-md transition duration-200">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
