import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#E5D0AC' }} className="text-black py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 cursor-pointer">
              <a href="https://facebook.com" className="hover:text-gray-600"><FaFacebook size={24} /></a>
              <a href="https://twitter.com" className="hover:text-gray-600"><FaTwitter size={24} /></a>
              <a href="https://instagram.com" className="hover:text-gray-600"><FaInstagram size={24} /></a>
              <a href="https://linkedin.com" className="hover:text-gray-600"><FaLinkedin size={24} /></a>
            </div>
          </div>

          <div className="w-full md:w-2/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="flex flex-wrap space-x-6">
              <li><a href="/donate" className="hover:text-gray-600">Donate</a></li>
              <li><a href="/funds" className="hover:text-gray-600">Funds</a></li>
              <li><a href="/about" className="hover:text-gray-600">About Us</a></li>
              <li><a href="/sponsors" className="hover:text-gray-600">Sponsors</a></li>
              <li><a href="#contact" className="hover:text-gray-600">Contact</a></li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-black mt-6 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;