import React from 'react';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaCar, FaMotorcycle, FaShieldAlt, FaTools, FaRoute, FaClock, FaUserTie, FaPhoneAlt } from 'react-icons/fa';
import { MdLocationOn, MdSecurity, MdLocalOffer } from 'react-icons/md';

const ServicesPage = () => {
  return (
    <LayoutPrazzol>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Premium Services
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Experience the best in vehicle rental services with our comprehensive range of offerings
            </p>
          </div>
        </div>
      </div>

      {/* Main Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vehicle Rental Services */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Vehicle Rental Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Car Rental Service */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <FaCar className="text-4xl text-orange-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Car Rental</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Choose from our wide range of well-maintained cars for your journey
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600">
                      <FaShieldAlt className="mr-3 text-orange-500" />
                      Comprehensive insurance coverage
                    </li>
                    <li className="flex items-center text-gray-600">
                      <FaTools className="mr-3 text-orange-500" />
                      Regular maintenance and cleaning
                    </li>
                    <li className="flex items-center text-gray-600">
                      <FaRoute className="mr-3 text-orange-500" />
                      Flexible pickup and drop-off locations
                    </li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">Starting from $50/day</span>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      Book Now
                    </button>
          </div>
        </div>
      </div>

              {/* Bike Rental Service */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <FaMotorcycle className="text-4xl text-orange-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-900">Bike Rental</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Explore the city with our efficient and reliable bikes
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-600">
                      <MdSecurity className="mr-3 text-orange-500" />
                      Safety gear provided
                    </li>
                    <li className="flex items-center text-gray-600">
                      <FaClock className="mr-3 text-orange-500" />
                      Hourly rental options available
                    </li>
                    <li className="flex items-center text-gray-600">
                      <MdLocalOffer className="mr-3 text-orange-500" />
                      Student discounts available
                    </li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">Starting from $20/day</span>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Additional Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 24/7 Support */}
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FaPhoneAlt className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Round-the-clock customer support for emergencies and assistance
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Emergency roadside assistance</li>
                  <li className="text-sm text-gray-600">• Technical support</li>
                  <li className="text-sm text-gray-600">• Booking assistance</li>
                </ul>
              </div>

              {/* Chauffeur Service */}
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <FaUserTie className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Chauffeur Service</h3>
                <p className="text-gray-600">
                  Professional drivers for a comfortable and safe journey
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Experienced drivers</li>
                  <li className="text-sm text-gray-600">• Corporate packages</li>
                  <li className="text-sm text-gray-600">• Airport transfers</li>
                </ul>
              </div>

              {/* Pickup & Drop */}
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <MdLocationOn className="text-2xl text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Pickup & Drop</h3>
                <p className="text-gray-600">
                  Convenient vehicle delivery and collection at your location
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="text-sm text-gray-600">• Door-to-door service</li>
                  <li className="text-sm text-gray-600">• Flexible timing</li>
                  <li className="text-sm text-gray-600">• Multiple locations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need More Information?
            </h2>
            <p className="text-gray-600">
              Our team is here to answer any questions you may have about our services
            </p>
          </div>
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors flex items-center">
              <FaPhoneAlt className="mr-2" />
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default ServicesPage;
