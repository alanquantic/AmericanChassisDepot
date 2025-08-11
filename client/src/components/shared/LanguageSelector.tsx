import React from 'react';
import { useLanguage } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent border border-primary rounded px-2 py-1 text-sm font-montserrat text-primary focus:outline-none focus:border-[#B22234] cursor-pointer"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
};

export default LanguageSelector;