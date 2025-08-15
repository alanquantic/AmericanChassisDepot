import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UsedChassisForm from '@/components/shared/UsedChassisForm';
import Seo from '@/components/seo/Seo';
import { useLanguage } from '@/lib/i18n-simple';

const UsedChassisPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <Seo
        title={t('usedChassisInquiry') + ' | American Chassis Depot'}
        description={t('usedChassisInquiryDescription')}
        canonicalPath={`/${t('lang')}/used-chassis`}
      />
      
      <main className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-montserrat font-bold text-primary mb-4">
              {t('usedChassisInquiry')}
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {t('usedChassisInquiryDescription')}
            </p>
          </div>
          
          <UsedChassisForm />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default UsedChassisPage;