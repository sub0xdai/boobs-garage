function Contact() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-[#2e3440] dark:text-[#d8dee9]">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Get in Touch</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 className="font-bold text-[#2e3440] dark:text-[#d8dee9]">Address</h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">123 Auto Lane<br />Cartown, ST 12345</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h3 className="font-bold text-[#2e3440] dark:text-[#d8dee9]">Phone</h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">(555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start">
              <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h3 className="font-bold text-[#2e3440] dark:text-[#d8dee9]">Email</h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">info@bobsgarage.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-6 transition-colors duration-200">
          <h2 className="text-2xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Send us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-[#d8dee9] dark:border-[#2e3440] rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0] 
                         bg-white dark:bg-[#2e3440] text-[#2e3440] dark:text-[#d8dee9]
                         placeholder-[#4c566a] dark:placeholder-[#81a1c1] transition-all duration-200"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-[#d8dee9] dark:border-[#2e3440] rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0] 
                         bg-white dark:bg-[#2e3440] text-[#2e3440] dark:text-[#d8dee9]
                         placeholder-[#4c566a] dark:placeholder-[#81a1c1] transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#4c566a] dark:text-[#81a1c1] mb-1">Message</label>
              <textarea 
                className="w-full px-3 py-2 border border-[#d8dee9] dark:border-[#2e3440] rounded-md 
                         focus:outline-none focus:ring-1 focus:ring-[#8fbcbb] dark:focus:ring-[#88c0d0] 
                         bg-white dark:bg-[#2e3440] text-[#2e3440] dark:text-[#d8dee9]
                         placeholder-[#4c566a] dark:placeholder-[#81a1c1] transition-all duration-200"
                rows="4"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#d08770] dark:bg-[#bf616a] text-white py-2 px-4 rounded-md 
                       hover:bg-[#c97a65] dark:hover:bg-[#a9545d] transition-all duration-200
                       shadow-md hover:shadow-lg active:scale-98"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
