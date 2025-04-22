import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ContactForm from '@/components/shared/ContactForm';
import { RulerIcon, WeightIcon, ToolsIcon, CertificateIcon } from '@/lib/icons';

const UsedChassisPage: React.FC = () => {
  // Obtener modelos de chasis usados
  const { data: chassisModels, isLoading } = useQuery({
    queryKey: ['/api/chassis/filter', { conditionSlug: 'used-chassis' }],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24 relative">
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-6">Used Chassis</h1>
              <p className="text-lg md:text-xl mb-8">
                Quality pre-owned chassis that have been thoroughly inspected and refurbished as needed, offering excellent value for your investment.
              </p>
              <Link 
                href="/contact" 
                className="bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 inline-block shadow-md"
              >
                Request Quote
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-12">
              Benefits of Used Chassis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CertificateIcon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Cost Effective</h3>
                <p className="text-neutral-600">
                  Save significantly on your investment while still getting a reliable and functional chassis for your operations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ToolsIcon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Thorough Inspection</h3>
                <p className="text-neutral-600">
                  Every used chassis undergoes comprehensive inspection and necessary refurbishment before being made available.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <WeightIcon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Immediate Availability</h3>
                <p className="text-neutral-600">
                  Used chassis are often available for immediate delivery, helping you meet urgent operational needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <RulerIcon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Proven Performance</h3>
                <p className="text-neutral-600">
                  Used chassis have demonstrated their reliability in real-world conditions and have a proven track record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-4">
              Featured Used Chassis Models
            </h2>
            <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
              Explore our selection of quality pre-owned chassis models that offer excellent value for your money.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // Skeleton loader mientras se cargan los datos
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Skeleton className="w-full h-56" />
                    <div className="p-6">
                      <Skeleton className="w-3/4 h-6 mb-3" />
                      <Skeleton className="w-full h-4 mb-2" />
                      <Skeleton className="w-full h-4 mb-2" />
                      <Skeleton className="w-1/2 h-4 mb-4" />
                      <Skeleton className="w-1/3 h-10" />
                    </div>
                  </div>
                ))
              ) : Array.isArray(chassisModels) && chassisModels.length > 0 ? (
                // Muestra los modelos de chasis
                chassisModels.slice(0, 3).map((model: any) => (
                  <div key={model.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      {model.imageUrls && model.imageUrls.length > 0 ? (
                        <img 
                          src={model.imageUrls[0]} 
                          alt={model.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                          <span className="text-neutral-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-montserrat font-semibold text-primary mb-2">{model.name}</h3>
                      <p className="text-neutral-600 mb-4 line-clamp-2">{model.description}</p>
                      <Link 
                        href={`/products/${model.slug}`} 
                        className="inline-block bg-primary hover:bg-primary-dark text-white font-montserrat px-6 py-2 rounded transition-all duration-300 hover:bg-opacity-90"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-neutral-500">No models available at the moment. Please check back later.</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/products" 
                className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-8 py-3 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white" id="contact">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-2">Request Information</h2>
              <p className="text-neutral-600 text-center mb-8">
                Interested in our used chassis options? Fill out the form below and our team will contact you shortly.
              </p>
              <ContactForm className="space-y-6" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default UsedChassisPage;