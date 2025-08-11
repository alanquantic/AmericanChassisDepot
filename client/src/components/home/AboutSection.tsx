import React from 'react';
import { TruckIcon, ToolsIcon, CertificateIcon } from '@/lib/icons';
import { COMPANY_INFO, getCompanyInfo } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n-simple';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  const companyInfo = getCompanyInfo();
  
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl font-montserrat font-bold text-primary mb-6">{t('aboutTitle')}</h2>
            <p className="text-lg text-neutral-600 mb-6">
              {companyInfo.description}
            </p>
            <p className="text-lg text-neutral-600 mb-6">
              {t('aboutDescription')}
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              {companyInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                    {benefit.icon === 'truck' && <TruckIcon className="w-6 h-6" />}
                    {benefit.icon === 'tools' && <ToolsIcon className="w-6 h-6" />}
                    {benefit.icon === 'certificate' && <CertificateIcon className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-montserrat font-semibold text-primary">{benefit.title}</h4>
                    <p className="text-neutral-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2">
            <img 
              src="https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="American Chassis Depot facility" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
