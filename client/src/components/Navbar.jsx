// src/components/Navbar.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center">
            <span>Bob's Garage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/services" className="hover:text-gray-300 transition-colors">Services</Link>
            <Link to="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
            <Link to="/login" className="hover:text-gray-300 transition-colors">Login</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Home</Link>
              <Link to="/services" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Services</Link>
              <Link to="/blog" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Blog</Link>
              <Link to="/contact" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Contact</Link>
              <Link to="/login" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Login</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
