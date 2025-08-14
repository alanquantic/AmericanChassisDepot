import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import { Skeleton } from '@/components/ui/skeleton';
import { RulerIcon, WeightIcon, TruckIcon, CogIcon } from '@/lib/icons';
import ContactForm from '@/components/shared/ContactForm';
import { DownloadBrochureForm } from '@/components/shared/DownloadBrochureForm';
import { useLanguage } from '@/lib/i18n-simple';
import { getPrimaryCharacteristic } from '@/lib/chassisUtils';
import type { ChassisModel } from '@shared/schema';
import Seo from '@/components/seo/Seo';

interface ProductPageProps {
  slug?: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ slug: propSlug }) => {
  const params = useParams();
  const slug = propSlug || params.slug;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { t } = useLanguage();
  
  // Fetch chassis model data
  const { data: model, isLoading: modelLoading, error: modelError } = useQuery<ChassisModel>({
    queryKey: [`/api/chassis/${slug}`],
    enabled: !!slug,
  });
  
  // Manufacturer badge should always display the brand name
  const manufacturer = 'American Chassis Depot';

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
      {/* SEO per producto */}
      {model && (
        <Seo
          title={`${model.name} | American Chassis Depot`}
          description={model.description || 'Premium container chassis model.'}
          imageUrl={model.imageUrl}
          canonicalPath={`/${getLanguage()}/products/${model.slug}`}
          productSlug={model.slug}
        />
      )}
      {/* JSON-LD Producto */}
      {model && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: model.name,
          description: model.description,
          image: model.imageUrl,
          brand: { '@type': 'Brand', name: 'American Chassis Depot' },
          category: 'New Container Chassis',
          url: `${window.location.origin}/${getLanguage()}/products/${model.slug}`,
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            priceCurrency: 'USD'
          }
        }) }} />
      )}
      
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
                      {/* Only show NEW badge; never show USED */}
                      {model?.conditionId === 3 || model?.conditionId === 5 ? (
                        <span className="text-white px-3 py-1 rounded-sm font-montserrat text-sm font-semibold bg-[#E30D16]">
                          {t('new')}
                        </span>
                      ) : null}
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
                        <TruckIcon className="w-5 h-5" />
                        <span>{getPrimaryCharacteristic(model?.name || '', model?.axleConfig || '')}</span>
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-8">
                      {model?.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href={`/${getLanguage()}/contact`} 
                        className="inline-block bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-6 py-3 rounded transition duration-200"
                        onClick={() => {
                          try {
                            // @ts-ignore
                            window.gtag && window.gtag('event','request_quote_click',{
                              event_category:'Engagement',
                              event_label:'Request Quote Button',
                              product_slug: model?.slug,
                              product_name: model?.name,
                              language: getLanguage()
                            });
                          } catch {}
                        }}
                      >
                        {t('requestQuote')}
                      </Link>
                      <DownloadBrochureForm 
                        chassisName={model?.name || ''} 
                        chassisSlug={model?.slug || ''} 
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Technical Specifications */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-12">{t('technicalSpecifications')}</h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-neutral-50 p-6 rounded-lg">
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Key Specifications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {model?.overallLength && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('overallLength')}</h3>
                      <p className="text-neutral-700">{model.overallLength}</p>
                    </div>
                  )}
                  {model?.overallWidth && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('overallWidth')}</h3>
                      <p className="text-neutral-700">{model.overallWidth}</p>
                    </div>
                  )}
                  {model?.tareWeight && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('tareWeight')}</h3>
                      <p className="text-neutral-700">{model.tareWeight}</p>
                    </div>
                  )}
                  {model?.payload && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('payloadCapacity')}</h3>
                      <p className="text-neutral-700">{model.payload}</p>
                    </div>
                  )}
                  {model?.axleSpread && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('axleSpread')}</h3>
                      <p className="text-neutral-700">{model.axleSpread}</p>
                    </div>
                  )}
                  {model?.fifthWheelHeight && (
                    <div className="bg-neutral-50 p-6 rounded-lg">
                      <h3 className="font-montserrat font-semibold text-primary mb-2">{t('fifthWheelHeight')}</h3>
                      <p className="text-neutral-700">{model.fifthWheelHeight}</p>
                    </div>
                  )}
                </div>

                {/* Detailed Component Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Frame Components */}
                  {model?.frameComponents && model.frameComponents.length > 0 && (
                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-primary mb-6 flex items-center">
                        <CogIcon className="w-6 h-6 mr-2" />
                        {t('frameComponentsTitle')}
                      </h3>
                      <ul className="space-y-3">
                        {model.frameComponents.map((component, index) => (
                          <li key={index} className="flex items-start border-b border-neutral-200 pb-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-neutral-700">{component}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suspension Details */}
                  {model?.suspensionDetails && model.suspensionDetails.length > 0 && (
                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-primary mb-6 flex items-center">
                        <TruckIcon className="w-6 h-6 mr-2" />
                        {t('suspensionSystemTitle')}
                      </h3>
                      <ul className="space-y-3">
                        {model.suspensionDetails.map((detail, index) => (
                          <li key={index} className="flex items-start border-b border-neutral-200 pb-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-neutral-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Brake System */}
                  {model?.brakeSystemDetails && model.brakeSystemDetails.length > 0 && (
                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-primary mb-6 flex items-center">
                        <WeightIcon className="w-6 h-6 mr-2" />
                        {t('brakeSystemTitle')}
                      </h3>
                      <ul className="space-y-3">
                        {model.brakeSystemDetails.map((detail, index) => (
                          <li key={index} className="flex items-start border-b border-neutral-200 pb-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-neutral-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Electrical Details */}
                  {model?.electricalDetails && model.electricalDetails.length > 0 && (
                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-primary mb-6">
                        {t('electricalSystemTitle')}
                      </h3>
                      <ul className="space-y-3">
                        {model.electricalDetails.map((detail, index) => (
                          <li key={index} className="flex items-start border-b border-neutral-200 pb-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-neutral-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Additional Equipment */}
                {model?.additionalEquipment && model.additionalEquipment.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-montserrat font-bold text-primary mb-6">{t('additionalEquipmentTitle')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {model.additionalEquipment.map((equipment, index) => (
                        <div key={index} className="flex items-center bg-neutral-50 p-4 rounded">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-neutral-700">{equipment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        {/* Contact Form */}
        <section className="py-16 bg-neutral-200">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden p-8">
              <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-6">{t('interestedInThisChassis')}</h2>
              <p className="text-lg text-neutral-600 text-center mb-8">
                {t('contactUsPricingAvailability')}
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
