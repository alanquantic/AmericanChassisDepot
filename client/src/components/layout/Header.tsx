import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '@/lib/icons';
import LanguageSelector from '@/components/shared/LanguageSelector-simple';
import { useLanguage } from '@/lib/i18n-simple';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileBrandsOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileBrandsOpen(false);
  };

  const toggleMobileBrands = () => {
    setIsMobileBrandsOpen(!isMobileBrandsOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMobileMenu} className="flex items-center space-x-3">
          <img 
            src="/attached_assets/acn.png" 
            alt="American Chassis Depot Logo" 
            className="h-12 w-auto"
          />
          <div className="flex flex-col">
            <span className="font-montserrat font-bold text-lg text-primary leading-tight">
              American Chassis Depot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-6" aria-label="Main Navigation">
            <Link 
              href="/" 
              className={`font-montserrat font-medium ${location === '/' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Home page"
              title="Go to homepage"
            >
              {t('home')}
            </Link>
            <Link 
              href="/products" 
              className={`font-montserrat font-medium ${location === '/products' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Browse our chassis products"
              title="Browse all chassis products"
            >
              {t('products')}
            </Link>
            <Link 
              href="/about" 
              className={`font-montserrat font-medium ${location === '/about' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="About American Chassis Depot"
              title="Learn about our company"
            >
              {t('about')}
            </Link>
            <Link 
              href="/contact" 
              className={`font-montserrat font-medium ${location === '/contact' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Contact us"
              title="Get in touch with our team"
            >
              {t('contact')}
            </Link>
          </nav>
          
          {/* Language Selector */}
          <LanguageSelector />
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-primary focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <XIcon className="w-6 h-6" />
          ) : (
            <MenuIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pb-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-montserrat font-medium text-primary">Menu</span>
            <LanguageSelector />
          </div>
          <nav aria-label="Mobile Navigation">
            <Link 
              href="/" 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Home page"
            >
              {t('home')}
            </Link>
            <Link 
              href="/products" 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/products' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Browse our chassis products"
            >
              {t('products')}
            </Link>
            <Link 
              href="/about" 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/about' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="About American Chassis Depot"
            >
              {t('about')}
            </Link>
            <Link 
              href="/contact" 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/contact' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Contact us"
            >
              {t('contact')}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;