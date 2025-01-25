import React from 'react';
import { Link } from 'react-router-dom';
import LayoutPrazzol from '../../LayoutPrazzol';
import { FaCar, FaMotorcycle, FaShieldAlt, FaClock, FaUserFriends } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

const HomePage = () => {
  return (
    <LayoutPrazzol>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-600 to-orange-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Your Journey Begins Here
            </h1>
            <p className="text-xl text-white mb-8">
              Rent cars and bikes with ease. Travel on your terms.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#f9fafb" fillOpacity="1" d="M0,96L80,112C160,128,320,160,480,160C640,160,800,128,960,112C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Vehicle Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Choose Your Ride
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cars Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="bg-orange-50 p-8">
              <FaCar className="text-8xl text-orange-600 mx-auto" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cars</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <FaShieldAlt className="mr-3 text-orange-500" />
                  Fully insured vehicles
                </li>
                <li className="flex items-center text-gray-600">
                  <FaClock className="mr-3 text-orange-500" />
                  24/7 roadside assistance
                </li>
                <li className="flex items-center text-gray-600">
                  <MdLocationOn className="mr-3 text-orange-500" />
                  Multiple pickup locations
                </li>
              </ul>
              <Link
                to="/login"
                className="mt-6 block text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
              >
                Rent a Car
              </Link>
            </div>
          </div>

          {/* Bikes Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <div className="bg-orange-50 p-8">
              <FaMotorcycle className="text-8xl text-orange-600 mx-auto" />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bikes</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600">
                  <FaShieldAlt className="mr-3 text-orange-500" />
                  Safety gear included
                </li>
                <li className="flex items-center text-gray-600">
                  <FaClock className="mr-3 text-orange-500" />
                  Flexible rental duration
                </li>
                <li className="flex items-center text-gray-600">
                  <MdLocationOn className="mr-3 text-orange-500" />
                  City-wide availability
                </li>
              </ul>
              <Link
                to="/login"
                className="mt-6 block text-center bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
              >
                Rent a Bike
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose RideHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaShieldAlt className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                All vehicles are regularly maintained and fully insured for your peace of mind.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaClock className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is always available to assist you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <FaUserFriends className="text-2xl text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Simple and quick booking process with instant confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default HomePage; 