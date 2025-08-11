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
        
        {/* Static logo grid - Desktop */}
        <div className="hidden sm:block">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile static grid */}
        <div className="sm:hidden grid grid-cols-2 gap-6">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 bg-neutral-50 rounded-lg"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;