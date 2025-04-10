import React from 'react';
import { Link } from 'wouter';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-primary py-16 md:py-24">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative container mx-auto px-4 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-montserrat font-bold text-white text-center mb-6">
          Premium Chassis Solutions for Every Need
        </h1>
        <p className="text-lg md:text-xl text-white text-center max-w-3xl mb-8">
          Explore our wide selection of high-quality chassis from leading manufacturers in the industry
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/products" className="bg-[#E30D16] hover:bg-[#c70b13] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition duration-200 text-center">
            View Products
          </Link>
          <Link href="/contact" className="bg-white hover:bg-neutral-300 text-primary font-montserrat font-semibold px-8 py-3 rounded-md transition duration-200 text-center">
            Request Quote
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
