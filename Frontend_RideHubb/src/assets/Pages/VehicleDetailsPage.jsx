import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCar, FaMotorcycle, FaGasPump, FaCalendarAlt, FaMapMarkerAlt, FaList, FaMoneyBillWave, 
  FaCog, FaTachometerAlt, FaUserFriends, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const VehicleDetailsPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/vehicles/${type}/${id}`);
        if (response.data && response.data.success) {
          setVehicle(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicle details');
        }
      } catch (err) {
        console.error('Error fetching vehicle details:', err);
        setError(err.message);
        toast.error('Error loading vehicle details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [type, id]);

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${type}/${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Vehicle not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to {type === 'car' ? 'Cars' : 'Bikes'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={vehicle.images[activeImageIndex] || "/placeholder.svg"}
                alt={`${vehicle.name} - View ${activeImageIndex + 1}`}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      index === activeImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.name} - Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Vehicle Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  {type === 'car' ? (
                    <FaCar className="mr-3 text-orange-600" />
                  ) : (
                    <FaMotorcycle className="mr-3 text-orange-600" />
                  )}
                  {vehicle.name}
                </h1>
                <div className="text-2xl font-bold text-orange-600">
                  Rs. {vehicle.pricePerDay}/day
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{vehicle.brand}</p>

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <FaGasPump className="mr-2 text-orange-500" />
                  <span>Fuel Type: {vehicle.fuelType}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2 text-orange-500" />
                  <span>Model Year: {vehicle.modelYear}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-orange-500" />
                  <span>Location: {vehicle.location.city}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FaTachometerAlt className="mr-2 text-orange-500" />
                  <span>{type === 'car' ? 'Mileage' : 'Engine'}: {vehicle.mileage || vehicle.engineCapacity}</span>
                </div>
              </div>

              {/* Features List */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaList className="mr-2 text-orange-500" />
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {Array.isArray(vehicle.features) 
                    ? vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <FaCheck className="mr-2 text-green-500" />
                          {feature}
                        </div>
                      ))
                    : vehicle.features?.split(',').map((feature, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <FaCheck className="mr-2 text-green-500" />
                          {feature.trim()}
                        </div>
                      )) || (
                        <div className="text-gray-700">No features listed</div>
                      )
                  }
                </div>
              </div>

              {/* Vehicle Specifications */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaCog className="mr-2 text-orange-500" />
                  Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  {type === 'car' ? (
                    <>
                      <div className="flex items-center text-gray-700">
                        <FaUserFriends className="mr-2 text-orange-500" />
                        <span>Seating Capacity: {vehicle.seatingCapacity}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaCog className="mr-2 text-orange-500" />
                        <span>Transmission: {vehicle.transmission}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-700">
                        <FaCog className="mr-2 text-orange-500" />
                        <span>Engine: {vehicle.engineCapacity}cc</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaTachometerAlt className="mr-2 text-orange-500" />
                        <span>Mileage: {vehicle.mileage} km/l</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FaShieldAlt className="mr-2 text-orange-500" />
                  Rental Terms
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Valid driving license required</li>
                  <li>Security deposit: Rs. {vehicle.securityDeposit || 5000}</li>
                  <li>Free cancellation up to 24 hours before pickup</li>
                  <li>Fuel policy: Return with same fuel level</li>
                </ul>
              </div>

              {/* Booking Button */}
              <button
                onClick={handleBookNow}
                className="w-full bg-orange-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;