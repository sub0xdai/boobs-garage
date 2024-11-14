const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4 transition-colors duration-200">
          About Bob's Garage
        </h1>
        <p className="text-lg text-[#4c566a] dark:text-[#81a1c1] transition-colors duration-200">
          Your Trusted Auto Service Partner Since 1998
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-lg p-6 transition-all duration-200">
            <h2 className="text-2xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4">
              Our Story
            </h2>
            <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">
              Bob's Garage began as a small family-owned business in 1998. What started as a one-man operation has grown into a full-service automotive repair facility, trusted by hundreds of local families and businesses.
            </p>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">
              Over the past 25 years, we've built our reputation on honest service, expert knowledge, and a commitment to our community. Our team of certified mechanics brings decades of combined experience to every job.
            </p>
          </div>

          <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-lg p-6 transition-all duration-200">
            <h2 className="text-2xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4">
              Our Values
            </h2>
            <ul className="space-y-4 text-[#4c566a] dark:text-[#81a1c1]">
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Honesty and Transparency in All Services</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Quality Workmanship Guaranteed</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fair and Competitive Pricing</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#88c0d0] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Customer Satisfaction Priority</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-lg p-6 transition-all duration-200">
            <h2 className="text-2xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4">
              Our Expertise
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#8fbcbb] dark:border-[#88c0d0] pl-4">
                <h3 className="text-lg font-semibold text-[#2e3440] dark:text-[#d8dee9] mb-2">
                  Comprehensive Services
                </h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">
                  From routine maintenance to complex repairs, we handle all aspects of automotive care for both domestic and foreign vehicles.
                </p>
              </div>
              <div className="border-l-4 border-[#8fbcbb] dark:border-[#88c0d0] pl-4">
                <h3 className="text-lg font-semibold text-[#2e3440] dark:text-[#d8dee9] mb-2">
                  Modern Technology
                </h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">
                  Our facility is equipped with the latest diagnostic tools and equipment to service modern vehicles effectively.
                </p>
              </div>
              <div className="border-l-4 border-[#8fbcbb] dark:border-[#88c0d0] pl-4">
                <h3 className="text-lg font-semibold text-[#2e3440] dark:text-[#d8dee9] mb-2">
                  Certified Team
                </h3>
                <p className="text-[#4c566a] dark:text-[#81a1c1]">
                  Our mechanics are ASE certified and regularly trained on the latest automotive technologies.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-lg p-6 transition-all duration-200">
            <h2 className="text-2xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-4">
              Community Involvement
            </h2>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">
              We're proud to be an active part of our local community, supporting local events and providing educational workshops on basic car maintenance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
