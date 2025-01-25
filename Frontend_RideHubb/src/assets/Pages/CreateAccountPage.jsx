import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import LayoutPrazzol from "../../LayoutPrazzol";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nationality: 'Nepalese',
    countryCode: '+977',
    mobileNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState({ show: false, type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      setShowMessage({
        show: true,
        type: 'success',
        message: 'Registration successful! Redirecting to login...'
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setShowMessage({
        show: true,
        type: 'error',
        message: error.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <LayoutPrazzol>
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gray-200 rounded-xl shadow-lg p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join RideHub Today
            </p>
          </div>

          {/* Message Modal */}
          {showMessage.show && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black opacity-50"></div>
              <div className="relative bg-white rounded-lg p-8 max-w-sm w-full mx-4">
                <button
                  onClick={() => setShowMessage({ show: false, type: '', message: '' })}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
                <div className="text-center">
                  {showMessage.type === 'success' ? (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  <h3 className={`text-lg font-medium ${
                    showMessage.type === 'success' ? 'text-green-900' : 'text-red-900'
                  } mb-2`}>
                    {showMessage.type === 'success' ? 'SUCCESS' : 'ERROR'}
                  </h3>
                  <p className="text-sm text-gray-500">{showMessage.message}</p>
                  <button
                    onClick={() => setShowMessage({ show: false, type: '', message: '' })}
                    className={`mt-5 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                      showMessage.type === 'success'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      showMessage.type === 'success' ? 'focus:ring-green-500' : 'focus:ring-red-500'
                    } sm:text-sm`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md ${
                      errors.firstName ? 'border-red-500' : ''
                    }`}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* Right Column */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md ${
                      errors.lastName ? 'border-red-500' : ''
                    }`}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                  Nationality
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nationality"
                    id="nationality"
                    required
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md bg-gray-50"
                    placeholder="Nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="focus:ring-orange-500 focus:border-orange-500 py-2.5 pl-3 pr-7 border-r-0 border-gray-300 bg-gray-50 rounded-l-md sm:text-base"
                  >
                    <option value="+977">+977 (Nepal)</option>
                    <option value="+91">+91 (India)</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      id="mobileNumber"
                      required
                      className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-none rounded-r-md ${
                        errors.mobileNumber ? 'border-red-500' : ''
                      }`}
                      placeholder="Mobile Number"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    className={`focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 py-2.5 sm:text-base border-gray-300 rounded-md ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLoading ? 'Loading...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-200 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrazzol>
  );
};

export default CreateAccountPage;
