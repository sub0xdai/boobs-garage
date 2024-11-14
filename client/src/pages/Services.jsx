import { useState, useEffect } from 'react';
import { api } from '../utils/fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import ViewToggle from '../components/ViewToggle';

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Fetching services...');
        const response = await api.get('/api/services');
        console.log('Response:', response);
        const data = await response.json();
        console.log('Fetched services:', data);
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBooking = (service) => {
    navigate('/contact', { 
      state: { 
        service: service.name,
        message: `I would like to book the ${service.name} service.`
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-[#2e3440] dark:text-[#d8dee9]">Loading services...</div>
    );
  }

  return (
    <div className="bg-[#d8dee9] dark:bg-[#2e3440] transition-colors duration-200">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">Our Services</h1>
        <p className="text-[#4c566a] dark:text-[#81a1c1]">Professional auto repair services at competitive prices</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-end mb-6 px-4">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Services Section */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            let featuresArray = [];
            try {
              featuresArray = service.features ? JSON.parse(service.features) : [];
            } catch (err) {
              console.error('Error parsing features for service:', service.name, err);
            }

            return (
              <div key={service.id} className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-6 transition-colors duration-200">
                <h2 className="text-2xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
                  {service.name}
                </h2>
                <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">{service.description}</p>
                <p className="text-[#8fbcbb] dark:text-[#88c0d0] font-bold mb-4">
                  From ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                </p>
                <ul className="space-y-2">
                  {featuresArray.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-[#4c566a] dark:text-[#81a1c1]">
                      <svg 
                        className="w-4 h-4 text-[#a3be8c] dark:text-[#a3be8c] mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleBooking(service)}
                  className="mt-6 w-full bg-[#d08770] dark:bg-[#bf616a] text-white py-2 rounded 
                            hover:bg-[#c97a65] dark:hover:bg-[#a9545d] transition-all duration-200
                            shadow-md hover:shadow-lg active:scale-98"
                >
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-4 px-4">
          {services.map((service) => {
            let featuresArray = [];
            try {
              featuresArray = service.features ? JSON.parse(service.features) : [];
            } catch (err) {
              console.error('Error parsing features for service:', service.name, err);
            }

            return (
              <div 
                key={service.id} 
                className="bg-[#e5e9f0] dark:bg-[#3b4252] rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center transition-colors duration-200"
              >
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#2e3440] dark:text-[#d8dee9] mb-2">
                    {service.name}
                  </h2>
                  <p className="text-[#4c566a] dark:text-[#81a1c1] mb-2">{service.description}</p>
                  {featuresArray.length > 0 && (
                    <ul className="space-y-1">
                      {featuresArray.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-[#4c566a] dark:text-[#81a1c1] text-sm">
                          <svg 
                            className="w-4 h-4 text-[#a3be8c] dark:text-[#a3be8c] mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="md:ml-6 mt-4 md:mt-0 flex flex-col items-center md:items-end">
                  <p className="text-[#8fbcbb] dark:text-[#88c0d0] font-bold mb-2">
                    From ${typeof service.price === 'number' ? service.price.toFixed(2) : service.price}
                  </p>
                  <button 
                    onClick={() => handleBooking(service)}
                    className="w-full md:w-auto px-6 py-2 bg-[#d08770] dark:bg-[#bf616a] text-white rounded 
                              hover:bg-[#c97a65] dark:hover:bg-[#a9545d] transition-all duration-200
                              shadow-md hover:shadow-lg active:scale-98"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-12 bg-[#e5e9f0] dark:bg-[#3b4252] p-8 rounded-lg transition-colors duration-200">
        <h2 className="text-2xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">
          Why Choose Our Services?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">Expert Technicians</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">
              All our mechanics are certified and experienced.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">Quality Parts</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">
              We use only high-quality, genuine parts.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">Warranty</h3>
            <p className="text-[#4c566a] dark:text-[#81a1c1]">
              All our services come with a satisfaction guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
