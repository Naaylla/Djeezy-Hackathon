import { useState } from 'react';
import logo from '../../../assets/header/logo.svg';
import login_button from '../../../assets/header/login_button.svg';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="bg-beige p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-between w-full md:w-auto">
          <img
            src={logo}
            alt="Logo"
            className="h-10 cursor-pointer"
            onClick={handleLogoClick}
          />
          <button
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <ul
          className={`md:flex md:items-center gap-[83px] flex flex-col md:flex-row mt-4 md:mt-0 ${
            isMobileMenuOpen ? 'flex flex-col' : 'hidden md:flex'
          }`}
        >
          <li className="relative cursor-pointer group">
            <a href="#Donate">
              Donate
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C14600] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
          <li className="relative cursor-pointer group">
            Funds
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C14600] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="relative cursor-pointer group">
            About
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C14600] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="relative cursor-pointer group">
            Sponsors
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C14600] transition-all duration-300 group-hover:w-full"></span>
          </li>
          <li className="relative cursor-pointer group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C14600] transition-all duration-300 group-hover:w-full"></span>
          </li>
        </ul>

        <Link to="/Login" className="mt-4 md:mt-0">
          <button className="flex items-center hover:scale-110 transition-transform duration-300">
            <img src={login_button} className="cursor-pointer" alt="Login" />
          </button>
        </Link>
      </div>
    </nav>
  );
}