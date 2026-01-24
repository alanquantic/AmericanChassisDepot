import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '@/lib/icons';
import { User, LogOut } from 'lucide-react';
import LanguageSelector from '@/components/shared/LanguageSelector-simple';
import { useLanguage } from '@/lib/i18n-simple';
import { isAuthenticated, getStoredUser, logout } from '@/lib/marketplace-api';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [location, navigate] = useLocation();
  const { t } = useLanguage();

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        setUser(getStoredUser());
      } else {
        setUser(null);
      }
    };
    checkAuth();
    // Re-check on storage changes
    window.addEventListener('storage', checkAuth);
    // Re-check periodically for same-tab changes
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsUserMenuOpen(false);
    navigate(`${langPrefix}/chassis-marketplace`);
  };

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

  const langPrefix = location.startsWith('/es') ? '/es' : '/en';
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={`${langPrefix}`} onClick={closeMobileMenu} className="flex items-center space-x-3">
          <img 
            src="/acn.png" 
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
              href={`${langPrefix}`} 
              className={`font-montserrat font-medium ${location === `${langPrefix}` ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Home page"
              title="Go to homepage"
            >
              {t('home')}
            </Link>
            <Link 
              href={`${langPrefix}/products`} 
              className={`font-montserrat font-medium ${location === `${langPrefix}/products` ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Browse our chassis products"
              title="Browse all chassis products"
            >
              {t('products')}
            </Link>
            <Link 
              href={`${langPrefix}/about`} 
              className={`font-montserrat font-medium ${location === `${langPrefix}/about` ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="About American Chassis Depot"
              title="Learn about our company"
            >
              {t('about')}
            </Link>
            <Link 
              href={`${langPrefix}/contact`} 
              className={`font-montserrat font-medium ${location === `${langPrefix}/contact` ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'} transition duration-200`}
              aria-label="Contact us"
              title="Get in touch with our team"
            >
              {t('contact')}
            </Link>
            <Link 
              href={`${langPrefix}/chassis-marketplace`} 
              className={`font-montserrat font-semibold px-4 py-2 rounded-lg ${location.includes('/chassis-marketplace') || location.includes('/marketplace') ? 'bg-[#B22234] text-white' : 'bg-[#0A3161] text-white hover:bg-[#B22234]'} transition duration-200`}
              aria-label="Chassis Marketplace"
              title="Buy & Sell Used Chassis"
            >
              {t('marketplace')}
            </Link>
          </nav>
          
          {/* User Menu / Login */}
          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-[#0A3161] flex items-center justify-center text-white text-sm font-medium">
                  {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-gray-700 max-w-[100px] truncate">
                  {user.firstName || user.email.split('@')[0]}
                </span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link
                    href={`${langPrefix}/marketplace/dashboard`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {location.startsWith('/es') ? 'Cerrar Sesión' : 'Log Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`${langPrefix}/marketplace/login`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0A3161] text-[#0A3161] hover:bg-[#0A3161] hover:text-white transition text-sm font-medium"
            >
              <User className="w-4 h-4" />
              {location.startsWith('/es') ? 'Iniciar Sesión' : 'Login'}
            </Link>
          )}
          
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
              href={`${langPrefix}`} 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Home page"
            >
              {t('home')}
            </Link>
            <Link 
              href={`${langPrefix}/products`} 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/products' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Browse our chassis products"
            >
              {t('products')}
            </Link>
            <Link 
              href={`${langPrefix}/about`} 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/about' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="About American Chassis Depot"
            >
              {t('about')}
            </Link>
            <Link 
              href={`${langPrefix}/contact`} 
              onClick={closeMobileMenu} 
              className={`block py-2 font-montserrat font-medium ${location === '/contact' ? 'text-[#B22234]' : 'text-primary hover:text-[#B22234]'}`}
              aria-label="Contact us"
            >
              {t('contact')}
            </Link>
            <Link 
              href={`${langPrefix}/chassis-marketplace`} 
              onClick={closeMobileMenu} 
              className="block mt-4 py-3 px-4 text-center font-montserrat font-semibold rounded-lg bg-[#0A3161] text-white hover:bg-[#B22234] transition duration-200"
              aria-label="Chassis Marketplace"
            >
              {t('marketplace')}
            </Link>
            
            {/* Mobile User Section */}
            {isLoggedIn && user ? (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A3161] flex items-center justify-center text-white font-medium">
                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName || user.email.split('@')[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Link
                  href={`${langPrefix}/marketplace/dashboard`}
                  onClick={closeMobileMenu}
                  className="block py-2 px-4 text-center rounded-lg bg-gray-100 text-gray-700 font-medium mb-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); closeMobileMenu(); }}
                  className="block w-full py-2 px-4 text-center rounded-lg bg-red-50 text-red-600 font-medium"
                >
                  {location.startsWith('/es') ? 'Cerrar Sesión' : 'Log Out'}
                </button>
              </div>
            ) : (
              <Link
                href={`${langPrefix}/marketplace/login`}
                onClick={closeMobileMenu}
                className="block mt-4 py-3 px-4 text-center font-montserrat font-semibold rounded-lg border-2 border-[#0A3161] text-[#0A3161] hover:bg-[#0A3161] hover:text-white transition duration-200"
              >
                {location.startsWith('/es') ? 'Iniciar Sesión' : 'Login'}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;