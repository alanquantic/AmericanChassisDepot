import React from 'react';

const brands = [
  'SAF-HOLLAND',
  'Hendrickson',
  'Meritor',
  'JOST',
  'WABCO',
  'Bendix',
  'Alcoa',
  'Michelin',
  'TSE Brakes',
  'Firestone'
];

const LogoMarquee: React.FC = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-8">
          Trusted Component Brands
        </h2>
        
        {/* Desktop marquee */}
        <div className="hidden sm:block relative">
          <div className="flex items-center space-x-12 marquee">
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 text-lg font-montserrat font-semibold text-neutral-600 hover:text-primary transition-colors duration-300 whitespace-nowrap"
              >
                {brand}
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 text-lg font-montserrat font-semibold text-neutral-600 hover:text-primary transition-colors duration-300 whitespace-nowrap"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile static grid for reduced motion accessibility */}
        <div className="sm:hidden grid grid-cols-2 gap-4">
          {brands.slice(0, 6).map((brand, index) => (
            <div
              key={index}
              className="text-center text-sm font-montserrat font-medium text-neutral-600 py-2 px-3 bg-neutral-50 rounded-lg"
            >
              {brand}
            </div>
          ))}
        </div>

        {/* Static grid fallback for users who prefer reduced motion */}
        <div className="hidden motion-reduce:grid motion-reduce:grid-cols-3 lg:motion-reduce:grid-cols-5 gap-4 sm:motion-reduce:block">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="text-center text-sm font-montserrat font-medium text-neutral-600 py-2 px-3 bg-neutral-50 rounded-lg"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;