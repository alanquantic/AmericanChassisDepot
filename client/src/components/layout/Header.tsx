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
          <div className="relative group">
            <button 
              className="font-montserrat font-medium text-primary hover:text-[#E30D16] transition duration-200 flex items-center"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Sizes <ChevronDownIcon className="ml-1 w-4 h-4" />
            </button>
            <div className="absolute hidden group-hover:block hover:block bg-white mt-2 py-2 w-48 rounded shadow-lg z-10 transition-opacity duration-300 ease-in-out border border-gray-200">
              <div className="py-1 px-2">
                <a 
                  href="/products/new-20ft-sl-tandem" 
                  className="block px-4 py-3 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1 rounded-md"
                >
                  20ft Chassis
                </a>
                <a 
                  href="/products/new-20-40ft-extendable-tandem" 
                  className="block px-4 py-3 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1 rounded-md"
                >
                  20-40ft Extendable
                </a>
                <a 
                  href="/products/new-20-40ft-12pins-triaxle" 
                  className="block px-4 py-3 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1 rounded-md"
                >
                  20-40ft Triaxle
                </a>
                <a 
                  href="/products/new-40-45ft-extendable" 
                  className="block px-4 py-3 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1 rounded-md"
                >
                  40-45ft Extendable
                </a>
                <a 
                  href="/products/used-20-40-45ft-extendable-triaxle" 
                  className="block px-4 py-3 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1 rounded-md"
                >
                  20-40-45ft Extendable
                </a>
              </div>
            </div>
          </div>
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
          <button 
            className="w-full text-left py-2 font-montserrat font-medium text-primary hover:text-[#E30D16] flex justify-between items-center" 
            onClick={toggleMobileBrandsMenu}
          >
            Sizes
            {isMobileBrandsOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
          {isMobileBrandsOpen && (
            <div className="pl-4 animate-accordion-down">
              <a 
                href="/products/new-20ft-sl-tandem" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                20ft Chassis
              </a>
              <a 
                href="/products/new-20-40ft-extendable-tandem" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                20-40ft Extendable
              </a>
              <a 
                href="/products/new-20-40ft-12pins-triaxle" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                20-40ft Triaxle
              </a>
              <a 
                href="/products/new-40-45ft-extendable" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                40-45ft Extendable
              </a>
              <a 
                href="/products/used-20-40-45ft-extendable-triaxle" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                20-40-45ft Extendable
              </a>
            </div>
          )}
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