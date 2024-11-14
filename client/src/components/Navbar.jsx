import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
    { to: '/feedback', label: 'Feedback' },
    { to: '/staff', label: 'Our Team' },
    { to: '/about', label: 'About Us' }
  ];

  return (
    <nav className="bg-[#e5e9f0] dark:bg-[#3b4252] shadow-md sticky top-0 z-50 transition-colors duration-200 border-b border-[#d8dee9] dark:border-[#2e3440]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold text-[#2e3440] dark:text-[#d8dee9] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200"
          >
            Bob's Garage
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] focus:outline-none transition-all duration-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] px-3 py-2 rounded-md transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-6">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-[#bf616a] dark:text-[#bf616a] hover:text-[#d08770] dark:hover:text-[#d08770] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] px-3 py-2 rounded-md transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] hover:bg-[#d8dee9] dark:hover:bg-[#434c5e] px-3 py-2 rounded-md transition-all duration-200"
                >
                  Logout
                </button>
                <div className="pl-2">
                  <ThemeToggle />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-[#d08770] dark:text-[#bf616a] hover:text-white hover:bg-[#d08770] dark:hover:bg-[#bf616a] px-4 py-2 rounded-md transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <div className="pl-2">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#eceff4] dark:bg-[#434c5e] border-t border-[#d8dee9] dark:border-[#2e3440] transition-colors duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] hover:bg-[#d8dee9] dark:hover:bg-[#3b4252] px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div className="space-y-1">
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-[#bf616a] dark:text-[#bf616a] hover:text-[#d08770] dark:hover:text-[#d08770] hover:bg-[#d8dee9] dark:hover:bg-[#3b4252] px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] hover:bg-[#d8dee9] dark:hover:bg-[#3b4252] px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-[#d08770] dark:text-[#bf616a] hover:text-white hover:bg-[#d08770] dark:hover:bg-[#bf616a] px-3 py-2 rounded-md text-base font-medium transition-all duration-200"
                >
                  Login
                </Link>
              )}
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
