import React from 'react';
import { useLanguage } from '@/lib/i18n-simple';

const BusinessAdvantages: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-primary mb-4">{t('businessAdvantagesTitle')}</h2>
          <p className="text-neutral-700 max-w-3xl mx-auto">
            {t('businessAdvantagesSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-neutral-100 p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-primary mb-3">{t('costEfficiencyTitle')}</h3>
            <ul className="text-neutral-700 space-y-2">
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('reducedMaintenanceCosts')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('extendedProductLifecycle')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('optimizedFuelEfficiency')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('minimizedDowntime')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-neutral-100 p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-primary mb-3">{t('operationalExcellenceTitle')}</h3>
            <ul className="text-neutral-700 space-y-2">
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('increasedLoadCapacity')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('enhancedManeuverability')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('versatileModels')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('streamlinedProcesses')}</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-neutral-100 p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-montserrat font-bold text-primary mb-3">{t('safetyComplianceTitle')}</h3>
            <ul className="text-neutral-700 space-y-2">
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('dotCompliance')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('advancedSafetyFeatures')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('reducedAccidentRisk')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#E30D16] mr-2">✓</span>
                <span>{t('regularInspection')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessAdvantages;