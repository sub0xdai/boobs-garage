// src/components/Navbar.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const { user, logout } = useAuth()

  console.log('Current user:', user) // Debug log

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Bob's Garage
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
             <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Services
            </Link>
            <Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
            <Link to="/feedback" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"> Feedback </Link>

            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Admin 
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </button>
                <ThemeToggle />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Login
                </Link>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
