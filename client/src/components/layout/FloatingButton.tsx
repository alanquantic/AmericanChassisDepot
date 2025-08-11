import React from 'react';
import { Link } from 'wouter';
import { PhoneIcon, EmailIcon } from '@/lib/icons';
import { getContactInfo } from '@/lib/constants';
import { useLanguage } from '@/lib/i18n-simple';

const FloatingButton: React.FC = () => {
  const { t } = useLanguage();
  const contactInfo = getContactInfo();
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
        <a
          href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
          className="bg-[#E30D16] hover:bg-[#c70b13] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-200"
          aria-label={t('callAriaLabel')}
          title={t('callTitle')}
        >
          <PhoneIcon className="w-6 h-6" />
        </a>
        <Link
          href="/contact"
          className="bg-[#F5A623] hover:bg-[#e09511] text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition duration-200"
          aria-label={t('emailAriaLabel')}
          title={t('emailTitle')}
        >
          <EmailIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default FloatingButton;
