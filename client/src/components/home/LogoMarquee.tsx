import React from 'react';
import { useLanguage } from '@/lib/i18n-simple';
import BendixLogo from '@assets/Bendix_1754944094395.png';
import GroteLogo from '@assets/Grote_1754944094396.png';
import HendricksonLogo from '@assets/H_1754944094396.png';
import JostLogo from '@assets/Jost_1754944094396.png';
import PhillipsLogo from '@assets/Phillips_1754944094396.png';
import WabcoLogo from '@assets/WABCO_1754944094397.png';

const brands = [
  { name: 'Bendix', logo: BendixLogo },
  { name: 'Grote', logo: GroteLogo },
  { name: 'Hendrickson', logo: HendricksonLogo },
  { name: 'Jost', logo: JostLogo },
  { name: 'Phillips', logo: PhillipsLogo },
  { name: 'WABCO', logo: WabcoLogo },
];

const LogoMarquee: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-8">
          {t('trustedBrands')}
        </h2>
        
        {/* Desktop marquee */}
        <div className="hidden sm:block relative">
          <div className="flex items-center space-x-16 marquee">
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile static grid for reduced motion accessibility */}
        <div className="sm:hidden grid grid-cols-2 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-neutral-50 rounded-lg"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Static grid fallback for users who prefer reduced motion */}
        <div className="hidden motion-reduce:grid motion-reduce:grid-cols-3 lg:motion-reduce:grid-cols-6 gap-6 sm:motion-reduce:block">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-neutral-50 rounded-lg"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;