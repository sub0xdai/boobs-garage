import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fetchWithAuth from '../utils/fetchWithAuth';

function Home() {
  const [homeImage, setHomeImage] = useState(null);

  useEffect(() => {
    const fetchHomeImage = async () => {
      try {
        const response = await fetchWithAuth('/api/home-image');
        if (response.ok) {
          const data = await response.json();
          if (data.imageUrl) {
            setHomeImage(data);
          }
        }
      } catch (error) {
        console.error('Error fetching home image:', error);
      }
    };

    fetchHomeImage();
  }, []);

  return (
    <div className="min-h-screen bg-[#d8dee9] dark:bg-[#2e3440] space-y-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-12">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9] transition-colors duration-200">
          Welcome to Bob's Garage
        </h1>
        <p className="text-lg sm:text-xl text-[#4c566a] dark:text-[#81a1c1] mb-8 transition-colors duration-200">
          Professional Auto Repair & Maintenance Services
        </p>
      </section>

      {/* Featured Image */}
      {homeImage?.imageUrl && (
        <section className="relative">
          <div className="overflow-hidden rounded-xl shadow-lg max-w-6xl mx-auto">
            <img
              src={`http://localhost:5000${homeImage.imageUrl}`}
              alt="Bob's Garage Featured Image"
              className="w-full h-[250px] sm:h-[400px] object-cover object-center"
            />
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          {
            title: "Car Repair",
            description: "Expert diagnostic and repair services for all makes and models."
          },
          {
            title: "Maintenance",
            description: "Regular maintenance to keep your vehicle running smoothly."
          },
          {
            title: "Tire Services",
            description: "Complete tire services including rotation, balancing, and replacement."
          }
        ].map((service, index) => (
          <div key={index} className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#2e3440] dark:text-[#d8dee9]">{service.title}</h2>
            <p className="text-[#4c566a] dark:text-[#81a1c1] mb-4">{service.description}</p>
            <button className="text-[#8fbcbb] hover:text-[#88c0d0] dark:text-[#8fbcbb] dark:hover:text-[#88c0d0] transition-colors duration-200">
              Learn More →
            </button>
          </div>
        ))}
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#e5e9f0] dark:bg-[#3b4252] p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#2e3440] dark:text-[#d8dee9]">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#8fbcbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">Experienced Mechanics</h3>
              <p className="text-[#4c566a] dark:text-[#81a1c1]">
                Our team has years of experience working with all types of vehicles.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-[#8fbcbb] dark:text-[#8fbcbb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-[#2e3440] dark:text-[#d8dee9]">Quick Service</h3>
              <p className="text-[#4c566a] dark:text-[#81a1c1]">
                We value your time and strive to provide efficient service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-[#d08770] dark:bg-[#bf616a] p-6 sm:p-8 rounded-lg shadow-md transition-colors duration-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Need Auto Service?</h2>
        <p className="mb-6 text-white">Contact us today to schedule an appointment!</p>
        <div className="flex justify-center">
          <Link to="/contact">
            <button className="bg-white hover:bg-[#d8dee9] text-[#d08770] dark:text-[#bf616a] px-10 py-4 rounded-lg transition-all duration-200 text-lg font-semibold shadow-md hover:shadow-lg">
              Book Online
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
