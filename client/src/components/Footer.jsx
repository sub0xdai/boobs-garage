import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-[#e5e9f0] dark:bg-[#3b4252] text-[#4c566a] dark:text-[#81a1c1] border-t border-[#d8dee9] dark:border-[#2e3440] transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Contact Us</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">123 Auto Lane</p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Cartown, ST 12345</p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Phone: (555) 123-4567</p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Email: info@bobsgarage.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/services" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-[#4c566a] dark:text-[#81a1c1] hover:text-[#8fbcbb] dark:hover:text-[#8fbcbb] transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Business Hours</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Saturday: 9:00 AM - 4:00 PM</p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">Sunday: Closed</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#d8dee9] dark:border-[#2e3440] mt-8 pt-8 text-center transition-colors duration-200">
          <p className="text-[#4c566a] dark:text-[#81a1c1]">© 2024 Bob's Garage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
