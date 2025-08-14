import React from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ContactForm from '@/components/shared/ContactForm';
import { RulerIcon, WeightIcon, ToolsIcon, CertificateIcon } from '@/lib/icons';

// Hide/retire Used Chassis page content and redirect to home
const UsedChassisPage: React.FC = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-16 md:py-24 relative">
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-6">New Chassis</h1>
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
              Benefits of New Chassis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <CertificateIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Cost Effective</h3>
                <p className="text-neutral-600">
                  Save significantly on your investment while still getting a reliable and functional chassis for your operations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <ToolsIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Thorough Inspection</h3>
                <p className="text-neutral-600">
                  Every used chassis undergoes comprehensive inspection and necessary refurbishment before being made available.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <WeightIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Immediate Availability</h3>
                <p className="text-neutral-600">
                  Used chassis are often available for immediate delivery, helping you meet urgent operational needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <RulerIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Proven Performance</h3>
                <p className="text-neutral-600">
                  Used chassis have demonstrated their reliability in real-world conditions and have a proven track record.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Used Chassis Gallery */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-montserrat font-bold text-primary text-center mb-12">
              Some of our inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used1.jpg" 
                  alt="Used chassis inventory 1" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used2.jpg" 
                  alt="Used chassis inventory 2" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used3.jpg" 
                  alt="Used chassis inventory 3" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used4.jpg" 
                  alt="Used chassis inventory 4" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used2040-1.jpg" 
                  alt="Used 20/40 chassis model 1" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used2040-2.jpg" 
                  alt="Used 20/40 chassis model 2" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <img 
                  src="/assets/used2040-3.jpg" 
                  alt="Used 20/40 chassis model 3" 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-montserrat font-bold text-primary mb-6">
              Find Quality Used Chassis
            </h2>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Browse our inventory of quality inspected used chassis or contact us with your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="inline-block bg-primary hover:bg-[#092a53] text-white font-montserrat font-medium px-8 py-3 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                View All Products
              </Link>
              <Link 
                href="/contact" 
                className="inline-block bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-medium px-8 py-3 rounded transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Contact Us
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