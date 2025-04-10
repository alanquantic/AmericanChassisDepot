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
            <div className="bg-primary text-white font-montserrat font-bold text-xl p-2 rounded">
              <span className="text-[#E30D16]">A</span>CD
            </div>
            <span className="ml-2 font-montserrat font-semibold text-primary text-lg hidden md:block">
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
            <button className="font-montserrat font-medium text-primary hover:text-[#E30D16] transition duration-200 flex items-center">
              Brands <ChevronDownIcon className="ml-1 w-4 h-4" />
            </button>
            <div className="absolute hidden group-hover:block hover:block bg-white mt-2 py-2 w-48 rounded shadow-lg z-10 transition-all duration-300 ease-in-out">
              <Link 
                href="/brands/bull-chassis" 
                className="block px-4 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1"
              >
                Bull Chassis
              </Link>
              <Link 
                href="/brands/cheetah-chassis" 
                className="block px-4 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1"
              >
                Cheetah Chassis
              </Link>
              <Link 
                href="/brands/pratt-chassis" 
                className="block px-4 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1"
              >
                Pratt Intermodal Chassis
              </Link>
              <Link 
                href="/brands/stoughton-chassis" 
                className="block px-4 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-200 transform hover:translate-x-1"
              >
                Stoughton Chassis
              </Link>
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
            Brands
            {isMobileBrandsOpen ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>
          {isMobileBrandsOpen && (
            <div className="pl-4 animate-accordion-down">
              <Link 
                href="/brands/bull-chassis" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                Bull Chassis
              </Link>
              <Link 
                href="/brands/cheetah-chassis" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                Cheetah Chassis
              </Link>
              <Link 
                href="/brands/pratt-chassis" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                Pratt Intermodal Chassis
              </Link>
              <Link 
                href="/brands/stoughton-chassis" 
                onClick={closeMobileMenu}
                className="block py-2 text-primary hover:text-[#E30D16] transition-all duration-200 transform hover:translate-x-1"
              >
                Stoughton Chassis
              </Link>
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
