import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import { TruckIcon, ToolsIcon, CertificateIcon } from '@/lib/icons';

const AboutPage: React.FC = () => {
  return (
    <>
      <Header />
      
      <main>
        {/* Page Header */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-4">About American Chassis Depot</h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Your trusted partner for high-quality chassis solutions since 2010
            </p>
          </div>
        </section>
        
        {/* Company Overview */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-montserrat font-bold text-primary mb-6">Our Story</h2>
                  <p className="text-neutral-700 mb-4">
                    Founded in 2010, American Chassis Depot has grown to become one of the leading distributors of premium chassis solutions in North America. What started as a small family business has evolved into a trusted partner for logistics companies, shipping firms, and transportation enterprises across the continent.
                  </p>
                  <p className="text-neutral-700 mb-4">
                    Our mission is to provide reliable, durable, and innovative chassis solutions that help our clients optimize their transportation operations and increase efficiency while maintaining the highest standards of safety and quality.
                  </p>
                  <p className="text-neutral-700">
                    With a team of experienced professionals and strong partnerships with top manufacturers, we're committed to delivering exceptional products and outstanding customer service to every client we serve.
                  </p>
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                    alt="American Chassis Depot headquarters" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-neutral-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-primary mb-4">Our Core Values</h2>
              <p className="text-neutral-700 max-w-3xl mx-auto">
                At American Chassis Depot, our values guide everything we do. They shape our culture, define our character, and drive our commitment to excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <CertificateIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-3">Quality</h3>
                <p className="text-neutral-700">
                  We are committed to providing the highest quality chassis products that exceed industry standards and customer expectations.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <TruckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-3">Reliability</h3>
                <p className="text-neutral-700">
                  Our customers rely on us for dependable products, timely delivery, and consistent service they can count on day after day.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md text-center transition-transform duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <ToolsIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-3">Innovation</h3>
                <p className="text-neutral-700">
                  We continuously seek innovative solutions to improve our products and services, staying ahead of industry trends and customer needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-primary mb-4">Our Leadership Team</h2>
              <p className="text-neutral-700 max-w-3xl mx-auto">
                Meet the experienced professionals who lead American Chassis Depot with passion, expertise, and a commitment to excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 overflow-hidden rounded-full mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="John Richardson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-1">John Richardson</h3>
                <p className="text-[#E30D16] font-medium mb-3">Chief Executive Officer</p>
                <p className="text-neutral-700 text-sm">
                  With over 25 years of experience in the transportation industry, John brings strategic vision and leadership to American Chassis Depot.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 overflow-hidden rounded-full mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Sarah Martinez" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-1">Sarah Martinez</h3>
                <p className="text-[#E30D16] font-medium mb-3">Chief Operations Officer</p>
                <p className="text-neutral-700 text-sm">
                  Sarah oversees our day-to-day operations, ensuring operational excellence and continuous improvement across all departments.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 overflow-hidden rounded-full mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                    alt="Michael Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-montserrat font-bold text-primary mb-1">Michael Chen</h3>
                <p className="text-[#E30D16] font-medium mb-3">Chief Technology Officer</p>
                <p className="text-neutral-700 text-sm">
                  Michael leads our technology initiatives, driving innovation and digital transformation to enhance our products and customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold mb-4">Why Choose American Chassis Depot</h2>
              <p className="max-w-3xl mx-auto">
                We stand apart from the competition through our unwavering commitment to quality, service, and customer satisfaction.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <h3 className="text-xl font-montserrat font-bold mb-3">Premium Quality</h3>
                <p className="text-white/90">
                  All our chassis are built with premium materials and undergo rigorous quality control to ensure durability and reliability.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <h3 className="text-xl font-montserrat font-bold mb-3">Expert Consultation</h3>
                <p className="text-white/90">
                  Our team of industry experts provides personalized consultation to help you find the perfect chassis solution for your needs.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <h3 className="text-xl font-montserrat font-bold mb-3">Nationwide Service</h3>
                <p className="text-white/90">
                  With our extensive network, we provide reliable delivery and service across the entire United States.
                </p>
              </div>
              
              <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                <h3 className="text-xl font-montserrat font-bold mb-3">Customer Support</h3>
                <p className="text-white/90">
                  Our dedicated customer support team is always ready to assist you with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingButton />
    </>
  );
};

export default AboutPage;