import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import type { Condition } from '@shared/schema';

const ChassisTypeShowcase: React.FC = () => {
  const { data: conditions, isLoading, error } = useQuery<Condition[]>({
    queryKey: ['/api/conditions'],
  });

  if (error) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-red-500">Failed to load chassis types. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white" id="chassis-types">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">Our Chassis Types</h2>
        <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-12">
          Browse our selection of high-quality new and used chassis options to find the perfect solution for your transportation needs.
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
          ) : (
            conditions?.map((condition) => (
              <div key={condition.id} className="bg-neutral-100 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1" id={condition.slug}>
                <div className="h-56 bg-neutral-200 overflow-hidden">
                  <img 
                    src={condition.imageUrl} 
                    alt={condition.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-montserrat font-bold text-primary mb-2">{condition.name}</h3>
                  <p className="text-neutral-600 mb-4">
                    {condition.description}
                  </p>
                  <Link href={`/conditions/${condition.slug}`} className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-4 py-2 rounded transition duration-200">
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

export default ChassisTypeShowcase;
