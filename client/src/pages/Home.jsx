// src/pages/Home.jsx
import TestAuth from '../components/TestAuth'

function Home() {
  return (
    <div className="space-y-12">
      <TestAuth />
      {/* Hero Section */}
      <section className="text-center pb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Bob's Garage</h1>
        <p className="text-xl text-gray-600 mb-8">Professional Auto Repair & Maintenance Services</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
          Book a Service
        </button>
      </section>

      {/* Services Preview */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Car Repair</h2>
          <p className="text-gray-600 mb-4">Expert diagnostic and repair services for all makes and models.</p>
          <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Maintenance</h2>
          <p className="text-gray-600 mb-4">Regular maintenance to keep your vehicle running smoothly.</p>
          <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tire Services</h2>
          <p className="text-gray-600 mb-4">Complete tire services including rotation, balancing, and replacement.</p>
          <button className="text-blue-600 hover:text-blue-800">Learn More →</button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2">Experienced Mechanics</h3>
              <p className="text-gray-600">Our team has years of experience working with all types of vehicles.</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2">Quick Service</h3>
              <p className="text-gray-600">We value your time and strive to provide efficient service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-blue-600 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Need Auto Service?</h2>
        <p className="mb-6">Contact us today to schedule an appointment!</p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition">
            Call Now
          </button>
          <button className="border-2 border-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Book Online
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
