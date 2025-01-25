import React from 'react';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaHandshake, FaUsers, FaCar, FaAward, FaPhoneAlt } from 'react-icons/fa';
import { MdSecurity, MdTimer, MdLocationOn } from 'react-icons/md';

const AboutPage = () => {
  return (
    <LayoutPrazzol>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About RideHub
            </h1>
            <p className="text-xl text-white opacity-90 max-w-3xl mx-auto">
              Your trusted partner in vehicle rentals, making transportation accessible and convenient
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Founded with a vision to revolutionize the vehicle rental industry, RideHub has grown 
              from a small local business to a leading provider of transportation solutions. Our 
              commitment to quality service and customer satisfaction has helped us build a loyal 
              community of riders who trust us for their mobility needs.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">5000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">20+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <MdSecurity className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Safety First</h3>
              <p className="text-gray-600">
                We prioritize the safety of our customers with well-maintained vehicles and comprehensive insurance coverage.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <FaHandshake className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Trust</h3>
              <p className="text-gray-600">
                Building long-lasting relationships through transparency, reliability, and exceptional service.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <MdTimer className="text-3xl text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Efficiency</h3>
              <p className="text-gray-600">
                Quick and hassle-free booking process with 24/7 customer support for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prajwal Pokhrel</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>

            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="COO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sanjiv Jung Basnet</h3>
              <p className="text-gray-600">Chief Operations Officer</p>
            </div>

            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="CTO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sannosam Sojhe Rai</h3>
              <p className="text-gray-600">Chief Technology Officer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of satisfied customers who trust RideHub for their transportation needs
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors flex items-center">
                <FaCar className="mr-2" />
                Rent Now
              </button>
              <button className="px-8 py-3 border-2 border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-colors flex items-center">
                <FaPhoneAlt className="mr-2" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default AboutPage; 