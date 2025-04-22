import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '@/lib/icons';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileBrandsMenu = () => {
    setIsMobileBrandsOpen(!isMobileBrandsOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileBrandsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 md:h-12 md:w-12 relative">
              <img 
                src="/assets/logo.png" 
                alt="American Chassis Depot Logo" 
                className="object-contain h-full w-full"
              />
            </div>
            <span className="ml-2 md:ml-3 font-montserrat font-semibold text-primary text-xs md:text-lg">
              American Chassis Depot
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className={`font-montserrat font-medium ${location === '/' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'} transition duration-200`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`font-montserrat font-medium ${location === '/products' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'} transition duration-200`}
          >
            Products
          </Link>
          <Link 
            href="/about" 
            className={`font-montserrat font-medium ${location === '/about' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'} transition duration-200`}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={`font-montserrat font-medium ${location === '/contact' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'} transition duration-200`}
          >
            Contact
          </Link>
        </nav>

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
          <Link href="/" onClick={closeMobileMenu} className={`block py-2 font-montserrat font-medium ${location === '/' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'}`}>
            Home
          </Link>
          <Link href="/products" onClick={closeMobileMenu} className={`block py-2 font-montserrat font-medium ${location === '/products' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'}`}>
            Products
          </Link>
          <Link href="/about" onClick={closeMobileMenu} className={`block py-2 font-montserrat font-medium ${location === '/about' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'}`}>
            About Us
          </Link>
          <Link href="/contact" onClick={closeMobileMenu} className={`block py-2 font-montserrat font-medium ${location === '/contact' ? 'text-[#E30D16]' : 'text-primary hover:text-[#E30D16]'}`}>
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;