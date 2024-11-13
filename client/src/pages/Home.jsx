// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import fetchWithAuth from '../utils/fetchWithAuth';

function Home() {
  const [homeImage, setHomeImage] = useState(null);  // Move this to the top

  useEffect(() => {
    const fetchHomeImage = async () => {
      try {
        const response = await fetchWithAuth('/api/home-image');
        console.log('Home image response:', response); // Debug log
        if (response.ok) {
          const data = await response.json();
          console.log('Home image data:', data); // Debug log
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
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center pb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Bob's Garage</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">Professional Auto Repair & Maintenance Services</p>
        <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg 
                         hover:bg-blue-700 dark:hover:bg-blue-600 transition">
          Book a Service
        </button>
      </section>

      {/* Featured Image */}
      {homeImage?.imageUrl && (
        <section className="relative">
          <div className="overflow-hidden rounded-xl shadow-lg max-w-6xl mx-auto">
            <img
              src={`http://localhost:5000${homeImage.imageUrl}`}
              alt="Bob's Garage Featured Image"
              className="w-full h-[400px] object-cover object-center"
            />
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Car Repair</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Expert diagnostic and repair services for all makes and models.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Learn More →
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Maintenance</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Regular maintenance to keep your vehicle running smoothly.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Learn More →
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tire Services</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Complete tire services including rotation, balancing, and replacement.
          </p>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            Learn More →
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Why Choose Us</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Experienced Mechanics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team has years of experience working with all types of vehicles.
              </p>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Quick Service</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We value your time and strive to provide efficient service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="text-center bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Need Auto Service?</h2>
        <p className="mb-6">Contact us today to schedule an appointment!</p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 dark:text-blue-700 px-6 py-2 rounded-lg 
                           hover:bg-gray-100 dark:hover:bg-gray-100 transition">
            Call Now
          </button>
          <button className="border-2 border-white px-6 py-2 rounded-lg 
                           hover:bg-blue-700 dark:hover:bg-blue-800 transition">
            Book Online
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
