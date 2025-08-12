import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButton from '@/components/layout/FloatingButton';
import Hero from '@/components/home/Hero';
import LogoMarquee from '@/components/home/LogoMarquee';
import ChassisTypeShowcase from '@/components/home/ChassisTypeShowcase';
import ProductGrid from '@/components/home/ProductGrid';
import AboutSection from '@/components/home/AboutSection';
import BusinessAdvantages from '@/components/home/BusinessAdvantages';
import VideoSection from '@/components/home/VideoSection';
import { MapPinIcon, PhoneIcon, EmailIcon } from '@/lib/icons';
import { getContactInfo } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n-simple';
import ContactForm from '@/components/shared/ContactForm';

// Eliminamos los atributos de React.Fragment que causan el warning

interface HomePageProps {
  initialSize?: string;
}

const HomePage: React.FC<HomePageProps> = ({ initialSize }) => {
  const { t } = useLanguage();
  const contactInfo = getContactInfo();
  
  return (
    <div>
      <Header />
      
      <main>
        <Hero />
        <LogoMarquee />
        <ChassisTypeShowcase />
        <ProductGrid initialSize={initialSize} showOnlyNew={!initialSize} />
        <BusinessAdvantages />
        <VideoSection />
        <AboutSection />
        
        {/* Contact Section */}
        <section className="py-16 bg-neutral-200" id="contact">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 bg-primary p-8 text-white">
                  <h2 className="text-2xl font-montserrat font-bold mb-6">{t('contactInformation')}</h2>
                  <div className="mb-8">
                    <p className="mb-4">{t('haveQuestionsOrNeedQuote')}</p>
                    <div className="flex items-start mb-4">
                      <MapPinIcon className="w-5 h-5 mt-1 mr-4" />
                      <span>{contactInfo.address}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <PhoneIcon className="w-5 h-5 mr-4" />
                      <span>{contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <EmailIcon className="w-5 h-5 mr-4" />
                      <span>{contactInfo.email}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-4">{t('businessHours')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {contactInfo.hours.map((item, index) => (
                      <div key={index} className="contents">
                        <div>{item.day}</div>
                        <div>{item.hours}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-3/5 p-8">
                  <h2 className="text-2xl font-montserrat font-bold text-primary mb-6">{t('sendUsAMessage')}</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <FloatingButton />
    </div>
  );
};

export default HomePage;
