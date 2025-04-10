import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { Brand } from '@shared/schema';

const BrandShowcase: React.FC = () => {
  const { data: brands, isLoading, error } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  if (error) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Failed to load brands. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="brands">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">Our Premium Brands</h2>
        <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-12">
          We partner with the industry's leading chassis manufacturers to provide you with reliable and durable solutions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="bg-neutral-100 rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))
          ) : (
            brands?.map((brand) => (
              <div key={brand.id} className="bg-neutral-100 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1" id={brand.slug}>
                <div className="h-48 bg-neutral-200 overflow-hidden">
                  <img 
                    src={brand.imageUrl} 
                    alt={brand.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{brand.name}</h3>
                  <p className="text-neutral-600 mb-4">
                    {brand.description}
                  </p>
                  <Link href={`/brands/${brand.slug}`} className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-4 py-2 rounded transition duration-200">
                    View Models
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
