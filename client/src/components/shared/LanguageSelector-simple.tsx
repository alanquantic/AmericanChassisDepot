import React from 'react';
import { useLanguage, Language } from '@/lib/i18n-simple';
import { useLocation } from 'wouter';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [location, navigate] = useLocation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language;
    setLanguage(lang);
    const path = location.replace(/^\/(en|es)/, `/${lang}`);
    const next = /^\/(en|es)/.test(path) ? path : `/${lang}` + (path.startsWith('/') ? path : `/${path}`);
    navigate(next);
  };

  return (
    <select 
      value={language} 
      onChange={handleLanguageChange}
      className="bg-transparent border border-primary rounded px-2 py-1 text-sm font-montserrat text-primary focus:outline-none focus:border-[#B22234] cursor-pointer"
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
    </select>
  );
}