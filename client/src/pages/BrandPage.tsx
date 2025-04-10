import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import { RulerIcon, WeightIcon } from '@/lib/icons';
import { Skeleton } from '@/components/ui/skeleton';
import ContactForm from '@/components/shared/ContactForm';
import type { Brand, ChassisModel } from '@shared/schema';

const BrandPage: React.FC = () => {
  const { slug } = useParams();
  
  // Fetch brand data
  const { data: brand, isLoading: brandLoading, error: brandError } = useQuery<Brand>({
    queryKey: [`/api/brands/${slug}`],
    enabled: !!slug,
  });
  
  // Fetch this brand's chassis models
  const { data: models, isLoading: modelsLoading, error: modelsError } = useQuery<ChassisModel[]>({
    queryKey: [`/api/brands/${slug}/chassis`],
    enabled: !!slug,
  });
  
  const isLoading = brandLoading || modelsLoading;
  const error = brandError || modelsError;
  
  if (error) {
    return (
      <>
        <Header />
        <div className="py-16 bg-neutral-200 min-h-screen">
          <div className="container mx-auto px-4">
            <p className="text-center text-red-500">Failed to load brand information. Please try again later.</p>
            <div className="mt-8 text-center">
              <Link href="/" className="inline-block bg-primary hover:bg-primary-dark text-white font-montserrat font-medium px-6 py-2 rounded transition duration-200">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      <main>
        {/* Brand Hero */}
        <section className="relative bg-primary py-12 md:py-20">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative container mx-auto px-4">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-10 w-1/2 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-6" />
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-white text-center mb-4">
                  {brand?.name}
                </h1>
                <p className="text-lg md:text-xl text-white text-center max-w-3xl mx-auto">
                  {brand?.description}
                </p>
              </>
            )}
          </div>
        </section>
        
        {/* Brand Chassis Models */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">Available Models</h2>
            <p className="text-lg text-neutral-600 text-center max-w-3xl mx-auto mb-12">
              Explore our selection of premium {brand?.name} chassis solutions
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Loading skeletons
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="bg-neutral-100 rounded-lg shadow-md overflow-hidden">
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
              ) : models && models.length > 0 ? (
                models.map((model) => (
                  <div 
                    key={model.id} 
                    className="bg-neutral-100 rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="h-56 bg-neutral-200 overflow-hidden">
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
                        className="inline-block bg-primary hover:bg-primary-dark text-white font-montserrat font-medium px-4 py-2 rounded transition duration-200"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-neutral-600">No chassis models available for this brand.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Contact Form */}
        <section className="py-16 bg-neutral-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
              <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-6">Request Information</h2>
              <p className="text-lg text-neutral-600 text-center mb-8">
                Interested in {brand?.name}? Fill out the form below and one of our representatives will get back to you.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingButton />
    </>
  );
};

export default BrandPage;
