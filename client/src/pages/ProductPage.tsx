import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import { Skeleton } from '@/components/ui/skeleton';
import { RulerIcon, WeightIcon } from '@/lib/icons';
import ContactForm from '@/components/shared/ContactForm';
import type { ChassisModel } from '@shared/schema';

// Define a type for the manufacturer info
interface Manufacturer {
  id: number;
  name: string;
  description: string;
}

interface ProductPageProps {
  slug?: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const slug = propSlug || params.slug;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Fetch chassis model data
  const { data: model, isLoading: modelLoading, error: modelError } = useQuery<ChassisModel>({
    queryKey: [`/api/chassis/${slug}`],
    enabled: !!slug,
  });
  
  // Use manufacturer from model
  const manufacturer = model?.manufacturer || "";

  // Update the selected image when model data is loaded
  useEffect(() => {
    if (model && model.imageUrl) {
      setSelectedImage(model.imageUrl);
    }
  }, [model]);
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]); // Re-run when slug changes
  
  const isLoading = modelLoading;
  
  // Handle thumbnail click
  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };
  
  if (modelError) {
    return (
      <>
        <Header />
        <div className="py-16 bg-neutral-200 min-h-screen">
          <div className="container mx-auto px-4">
            <p className="text-center text-red-500">Failed to load product information. Please try again later.</p>
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
        {/* Product Hero */}
        <section className="bg-neutral-100 py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Image gallery */}
              <div className="md:w-1/2">
                {isLoading ? (
                  <Skeleton className="h-96 w-full rounded-lg" />
                ) : (
                  <div className="space-y-4">
                    {/* Main image */}
                    <div className="bg-white p-4 rounded-lg shadow-md h-80 md:h-96 flex items-center justify-center">
                      <img 
                        src={selectedImage || model?.imageUrl} 
                        alt={model?.name} 
                        className="max-w-full max-h-full object-contain rounded"
                      />
                    </div>
                    
                    {/* Thumbnail gallery */}
                    {model?.additionalImages && model.additionalImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {/* Main image thumbnail */}
                        <div 
                          className={`h-16 bg-white p-1 rounded cursor-pointer border-2 ${selectedImage === model.imageUrl ? 'border-[#E30D16]' : 'border-transparent'}`}
                          onClick={() => handleThumbnailClick(model.imageUrl)}
                        >
                          <img 
                            src={model.imageUrl} 
                            alt={`${model.name} thumbnail`} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        {/* Additional image thumbnails */}
                        {model.additionalImages.map((image, index) => (
                          <div 
                            key={index}
                            className={`h-16 bg-white p-1 rounded cursor-pointer border-2 ${selectedImage === image ? 'border-[#E30D16]' : 'border-transparent'}`}
                            onClick={() => handleThumbnailClick(image)}
                          >
                            <img 
                              src={image} 
                              alt={`${model.name} view ${index + 1}`} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className="md:w-1/2">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="mt-8">
                      <Skeleton className="h-12 w-40" />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-montserrat font-bold text-primary mb-2">
                      {model?.name}
                    </h1>
                    <div className="flex items-center gap-2 mb-6">
                      <span className={`text-white px-3 py-1 rounded-sm font-montserrat text-sm font-semibold ${
                        model?.conditionId === 1 ? 'bg-[#E30D16]' : 'bg-blue-600'
                      }`}>
                        {model?.conditionId === 1 ? 'New Chassis' : 'Used Chassis'}
                      </span>
                      <span className="bg-primary text-white px-3 py-1 rounded-sm font-montserrat text-sm font-semibold">
                        {manufacturer}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mb-6 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <RulerIcon className="w-5 h-5" />
                        <span>{model?.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <WeightIcon className="w-5 h-5" />
                        <span>{model?.dutyType}</span>
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-8">
                      {model?.description}
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-block bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-6 py-3 rounded transition duration-200"
                    >
                      Request Quote
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Specifications & Features */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Specifications */}
              <div>
                <h2 className="text-2xl font-montserrat font-bold text-primary mb-6">Specifications</h2>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(4).fill(0).map((_, index) => (
                      <Skeleton key={index} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {model?.specifications?.map((spec, index) => (
                      <li key={index} className="flex items-center border-b border-neutral-200 pb-2">
                        <span className="text-neutral-700">{spec}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Features */}
              <div>
                <h2 className="text-2xl font-montserrat font-bold text-primary mb-6">Key Features</h2>
                {isLoading ? (
                  <div className="space-y-3">
                    {Array(4).fill(0).map((_, index) => (
                      <Skeleton key={index} className="h-6 w-full" />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {model?.features?.map((feature, index) => (
                      <li key={index} className="flex items-center border-b border-neutral-200 pb-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form */}
        <section className="py-16 bg-neutral-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
              <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-6">Interested in this Chassis?</h2>
              <p className="text-lg text-neutral-600 text-center mb-8">
                Contact us for pricing, availability, or to schedule a consultation
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

export default ProductPage;
