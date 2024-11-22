import { Link } from 'react-router-dom'

function Footer() {
  const socialLinks = [
    { icon: 'facebook', href: 'https://facebook.com', label: 'Facebook' },
    { icon: 'twitter', href: 'https://twitter.com', label: 'Twitter' },
    { icon: 'instagram', href: 'https://instagram.com', label: 'Instagram' }
  ];

  return (
    <footer className="bg-[#e5e9f0] dark:bg-[#3b4252] text-[#4c566a] dark:text-[#81a1c1] border-t border-[#d8dee9] dark:border-[#2e3440] transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Bob's Garage</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">Your trusted auto repair and service center, providing quality service since 1990.</p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.icon}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200"
                  aria-label={link.label}
                >
                  <i className={`fab fa-${link.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/services" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/staff" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Auto Lane, Cartown, ST 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-phone"></i>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope"></i>
                <span>info@bobsgarage.com</span>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="inline-block mt-2 text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#88c0d0] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                >
                  Get in Touch →
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Business Hours</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
            <div className="mt-4">
              <Link 
                to="/services" 
                className="inline-block text-[#8fbcbb] dark:text-[#88c0d0] hover:text-[#88c0d0] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Book Service →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#d8dee9] dark:border-[#2e3440] mt-8 pt-8 text-center transition-colors duration-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#4c566a] dark:text-[#81a1c1]"> 2024 Bob's Garage. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link 
                to="/privacy" 
                className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
