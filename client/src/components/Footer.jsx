import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-white border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-300">123 Auto Lane</p>
            <p className="text-gray-600 dark:text-gray-300">Cartown, ST 12345</p>
            <p className="text-gray-600 dark:text-gray-300">Phone: (555) 123-4567</p>
            <p className="text-gray-600 dark:text-gray-300">Email: info@bobsgarage.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Business Hours</h3>
            <p className="text-gray-600 dark:text-gray-300">Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p className="text-gray-600 dark:text-gray-300">Saturday: 9:00 AM - 4:00 PM</p>
            <p className="text-gray-600 dark:text-gray-300">Sunday: Closed</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">© 2024 Bob's Garage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
