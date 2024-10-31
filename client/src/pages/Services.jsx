// src/pages/Services.jsx
function Services() {
  const services = [
    {
      title: "Oil Change",
      description: "Regular oil changes to keep your engine running smoothly.",
      price: "From $39.99",
      features: [
        "Synthetic oil options available",
        "Filter replacement",
        "Multi-point inspection"
      ]
    },
    {
      title: "Brake Service",
      description: "Complete brake inspection and repair services.",
      price: "From $89.99",
      features: [
        "Brake pad replacement",
        "Rotor inspection",
        "Brake fluid check"
      ]
    },
    {
      title: "Tire Services",
      description: "Comprehensive tire maintenance and replacement.",
      price: "From $49.99",
      features: [
        "Tire rotation",
        "Wheel balancing",
        "Tire pressure check"
      ]
    }
  ]

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600">Professional auto repair services at competitive prices</p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <p className="text-blue-600 font-bold mb-4">{service.price}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Services?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2">Expert Technicians</h3>
            <p className="text-gray-600">All our mechanics are certified and experienced.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Quality Parts</h3>
            <p className="text-gray-600">We use only high-quality, genuine parts.</p>
          </div>
          <div>
            <h3 className="font-bold mb-2">Warranty</h3>
            <p className="text-gray-600">All our services come with a satisfaction guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
