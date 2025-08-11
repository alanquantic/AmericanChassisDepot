import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import { MapPinIcon, PhoneIcon, EmailIcon } from '@/lib/icons';
import { CONTACT_INFO } from '@/lib/constants';
import ContactForm from '@/components/shared/ContactForm';
import { useLanguage } from '@/lib/i18n-simple';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <>
      <Header />
      
      <main>
        {/* Page Header */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-4">{t('contactUs')}</h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              {t('contactPageSubtitle')}
            </p>
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Address */}
                <div className="bg-neutral-100 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <MapPinIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-primary text-xl mb-2">{t('ourLocation')}</h3>
                  <p className="text-neutral-600">{CONTACT_INFO.address}</p>
                </div>
                
                {/* Phone */}
                <div className="bg-neutral-100 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <PhoneIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-primary text-xl mb-2">{t('phoneNumber')}</h3>
                  <p className="text-neutral-600">{CONTACT_INFO.phone}</p>
                  <p className="text-neutral-600 mt-2 text-sm">{t('callUsMonday')}</p>
                </div>
                
                {/* Email */}
                <div className="bg-neutral-100 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <EmailIcon className="w-8 h-8" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-primary text-xl mb-2">{t('emailAddress')}</h3>
                  <p className="text-neutral-600">{CONTACT_INFO.email}</p>
                  <p className="text-neutral-600 mt-2 text-sm">{t('respondWithin24')}</p>
                </div>
              </div>
              
              {/* Business Hours */}
              <div className="bg-neutral-100 rounded-lg p-8 mb-12">
                <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-6">{t('businessHours')}</h2>
                <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                  {CONTACT_INFO.hours.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="font-montserrat font-medium text-primary">{item.day}</div>
                      <div className="text-neutral-600">{item.hours}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-montserrat font-bold text-primary text-center mb-6">{t('sendUsAMessage')}</h2>
                  <p className="text-lg text-neutral-600 text-center max-w-2xl mx-auto mb-8">
                    {t('fillOutForm')}
                  </p>
                  <div className="max-w-2xl mx-auto">
                    <ContactForm />
                  </div>
                </div>
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

export default ContactPage;
