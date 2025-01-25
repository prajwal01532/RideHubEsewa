import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BsCarFront, BsBicycle, BsPerson, BsList, BsX } from 'react-icons/bs';

const LayoutPrazzol = ({ children }) => {
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleModalToggle = () => {
    setIsVehicleModalOpen(!isVehicleModalOpen);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About Us' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg py-2' 
            : 'bg-gray-900/90 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2"
            >
              <img 
                src="/src/assets/images/logo.png" 
                alt="RideHub" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                RideHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'
                  } ${location.pathname === link.path ? 'border-b-2 border-orange-500' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Vehicle Type Button */}
              <button
                onClick={handleModalToggle}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                  isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'
                }`}
              >
                <BsCarFront className="w-4 h-4" />
                <span>Vehicles</span>
              </button>

              {/* Login/Register Buttons */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-700 hover:text-orange-500' : 'text-white hover:text-orange-300'
                  }`}
                >
                  <BsPerson className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMobileMenuToggle}
              className="md:hidden p-2 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <BsX className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              ) : (
                <BsList className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white mt-4 rounded-lg shadow-lg overflow-hidden">
              <nav className="flex flex-col py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleModalToggle}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors text-left"
                >
                  <BsCarFront className="w-4 h-4" />
                  <span>Vehicles</span>
                </button>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BsPerson className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="mx-6 mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg text-center hover:bg-orange-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Vehicle Type Modal */}
      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Ride</h2>
            <div className="grid grid-cols-2 gap-6">
              <button 
                className="group relative bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                onClick={() => { handleModalToggle(); navigate('/vehicle/car'); }}
              >
                <div className="flex flex-col items-center">
                  <BsCarFront className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="mt-4 text-lg font-medium text-gray-900">Cars</span>
                  <p className="mt-2 text-sm text-gray-500">Luxury & Off-road</p>
                </div>
              </button>
              <button 
                className="group relative bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                onClick={() => { handleModalToggle(); navigate('/vehicle/bike'); }}
              >
                <div className="flex flex-col items-center">
                  <BsBicycle className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="mt-4 text-lg font-medium text-gray-900">Bikes</span>
                  <p className="mt-2 text-sm text-gray-500">Sport & Cruiser</p>
                </div>
              </button>
            </div>
            <button
              onClick={handleModalToggle}
              className="mt-8 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} RideHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LayoutPrazzol;
