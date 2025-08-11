import React from 'react';
import { Link } from 'wouter';
import ContactForm from '@/components/shared/ContactForm';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/videos/poster.jpg"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
      
      {/* Gradient overlay with US flag colors */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A3161]/80 via-[#B22234]/50 to-[#0A3161]/80"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 min-h-screen flex items-center z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Column - Hero Content */}
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 drop-shadow-lg">
              Premium Chassis Solutions for Every Need
            </h1>
            <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl">
              Explore our wide selection of high-quality chassis from leading manufacturers in the industry
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-[#B22234] hover:bg-[#9A1E2E] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 text-center shadow-lg"
              >
                View Products
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 transform hover:scale-105 text-center shadow-lg border border-white/30"
              >
                Request Quote
              </Link>
            </div>
          </div>

          {/* Right Column - Glass Card Quote Form */}
          <div className="lg:block">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-montserrat font-bold text-white mb-6 text-center">
                Get a Quote
              </h2>
              <ContactForm className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Form stacks below on smaller screens */}
      <div className="lg:hidden relative z-20 bg-white/10 backdrop-blur-lg border-t border-white/20 p-6">
        <div className="container mx-auto">
          <h2 className="text-2xl font-montserrat font-bold text-white mb-6 text-center">
            Get a Quote
          </h2>
          <ContactForm className="text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
