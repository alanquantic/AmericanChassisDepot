import React from 'react';
import { Link } from 'wouter';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import ContactForm from '@/components/shared/ContactForm';
import { RulerIcon, WeightIcon, ToolsIcon, CertificateIcon } from '@/lib/icons';

const NewChassisPage: React.FC = () => {

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
                Discover our top-quality new chassis with full manufacturer warranties and the latest features and technology.
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
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Full Warranty</h3>
                <p className="text-neutral-600">
                  All new chassis come with comprehensive manufacturer warranties, providing peace of mind for your investment.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <ToolsIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Latest Technology</h3>
                <p className="text-neutral-600">
                  Benefit from cutting-edge design and technology improvements for better performance and efficiency.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <WeightIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Optimal Performance</h3>
                <p className="text-neutral-600">
                  Experience maximum reliability and performance with factory-fresh components designed for optimal operation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl text-center">
                <div className="mx-auto mb-4">
                  <RulerIcon className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">Customization Options</h3>
                <p className="text-neutral-600">
                  Select from various customization options to tailor your chassis to your specific operational requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-montserrat font-bold text-primary mb-6">
              Ready to Find Your Ideal Chassis?
            </h2>
            <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
              Browse our complete inventory of new chassis options or contact us directly for personalized assistance.
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
                Interested in our new chassis options? Fill out the form below and our team will contact you shortly.
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

export default NewChassisPage;