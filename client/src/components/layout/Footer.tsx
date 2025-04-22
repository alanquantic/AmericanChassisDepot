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
import { CONTACT_INFO } from '@/lib/constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-4">American Chassis Depot</h3>
            <p className="mb-4">Your trusted source for premium chassis solutions from leading manufacturers.</p>
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
            <h4 className="font-montserrat font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#E30D16] transition duration-200">Home</Link></li>
              <li><Link href="/products" className="hover:text-[#E30D16] transition duration-200">Products</Link></li>
              <li><Link href="/about" className="hover:text-[#E30D16] transition duration-200">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#E30D16] transition duration-200">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-montserrat font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="w-5 h-5 mt-1 mr-3" />
                <a href="https://maps.google.com/?q=4811+N+McCarty+St+Suite+C,+Houston,+TX+77013" target="_blank" rel="noopener noreferrer" className="hover:text-[#E30D16] transition duration-200">
                  {CONTACT_INFO.address}
                </a>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-3" />
                <a href={`tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, '')}`} className="hover:text-[#E30D16] transition duration-200">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center">
                <EmailIcon className="w-5 h-5 mr-3" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-[#E30D16] transition duration-200">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 pt-6 text-center text-neutral-400">
          <p>&copy; {new Date().getFullYear()} American Chassis Depot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
