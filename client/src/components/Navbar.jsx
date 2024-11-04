// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'


function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">Bob's Garage</Link>
          
          <div className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="hover:text-gray-600 dark:hover:text-gray-300">Home</Link>
            <Link to="/services" className="hover:text-gray-600 dark:hover:text-gray-300">Services</Link>
            <Link to="/blog" className="hover:text-gray-600 dark:hover:text-gray-300">Blog</Link>
            <Link to="/contact" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</Link>
            
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="hover:text-gray-600 dark:hover:text-gray-300">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-gray-600 dark:hover:text-gray-300">Login</Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )}

export default Navbar
