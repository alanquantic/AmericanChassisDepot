import React from 'react';
import { useLanguage, Language } from '@/lib/i18n-simple';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Changing language to:', e.target.value);
    setLanguage(e.target.value as Language);
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