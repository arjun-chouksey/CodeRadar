import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500 font-semibold' : 'text-gray-700 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CodeRadar</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors duration-300`}>
              Home
            </Link>
            <Link to="/all" className={`${isActive('/all')} transition-colors duration-300`}>
              All Contests
            </Link>
            <Link to="/upcoming" className={`${isActive('/upcoming')} transition-colors duration-300`}>
              Upcoming
            </Link>
            <Link to="/ongoing" className={`${isActive('/ongoing')} transition-colors duration-300`}>
              Ongoing
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${isActive('/')} block px-4 py-2 rounded-md transition-colors duration-300`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/all" 
                className={`${isActive('/all')} block px-4 py-2 rounded-md transition-colors duration-300`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Contests
              </Link>
              <Link 
                to="/upcoming" 
                className={`${isActive('/upcoming')} block px-4 py-2 rounded-md transition-colors duration-300`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upcoming
              </Link>
              <Link 
                to="/ongoing" 
                className={`${isActive('/ongoing')} block px-4 py-2 rounded-md transition-colors duration-300`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ongoing
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 