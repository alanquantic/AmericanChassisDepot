import React from 'react';
import { Link } from 'wouter';
import { 
  FacebookIcon, 
  TwitterIcon, 
  LinkedInIcon, 
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  EmailIcon
} from '@/lib/icons';
import { CONTACT_INFO, getContactInfo } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n-simple';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const contactInfo = getContactInfo();
  
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-4">American Chassis Depot</h3>
            <p className="mb-4">{t('footerDescription')}</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/americanchassisdepot" className="text-white hover:text-[#E30D16] transition duration-200" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/americanchassis" className="text-white hover:text-[#E30D16] transition duration-200" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/company/americanchassisdepot" className="text-white hover:text-[#E30D16] transition duration-200" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/americanchassisdepot" className="text-white hover:text-[#E30D16] transition duration-200" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#E30D16] transition duration-200">{t('home')}</Link></li>
              <li><Link href="/products" className="hover:text-[#E30D16] transition duration-200">{t('products')}</Link></li>
              <li><Link href="/about" className="hover:text-[#E30D16] transition duration-200">{t('about')}</Link></li>
              <li><Link href="/contact" className="hover:text-[#E30D16] transition duration-200">{t('contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">{t('contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mt-1 mr-3" />
                <a href="https://maps.google.com/?q=4811+N+McCarty+St+Suite+C,+Houston,+TX+77013" target="_blank" rel="noopener noreferrer" className="hover:text-[#E30D16] transition duration-200">
                  {contactInfo.address}
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3" />
                <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`} className="hover:text-[#E30D16] transition duration-200">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center">
                <EmailIcon className="w-5 h-5 mr-3" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#E30D16] transition duration-200">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} American Chassis Depot. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
