import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaSort, FaCar, FaMotorcycle, FaUsers, FaClipboardList, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChartLine } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../services/api';

const VehicleSearchPage = () => {
  const { type } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    activeRentals: 0,
    availableCars: 0,
    availableBikes: 0
  });

  const fetchDashboardStats = async () => {
    try {
      const [bookingsResponse, carsResponse, bikesResponse] = await Promise.all([
        api.get('/bookings'),
        api.get('/vehicles/car'),
        api.get('/vehicles/bike')
      ]);

      const activeBookings = bookingsResponse.data.data.filter(booking => booking.status === 'active');
      const availableCars = carsResponse.data.data.filter(car => car.status === 'available');
      const availableBikes = bikesResponse.data.data.filter(bike => bike.status === 'available');

      setDashboardStats({
        totalBookings: bookingsResponse.data.data.length,
        activeRentals: activeBookings.length,
        availableCars: availableCars.length,
        availableBikes: availableBikes.length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching vehicles for type:', type);
        const response = await api.get(`/vehicles/${type.toLowerCase()}`);
        console.log('API Response:', response);
        
        if (response.data && Array.isArray(response.data.data)) {
          console.log('Vehicles data:', response.data.data);
          const availableVehicles = response.data.data.filter(vehicle => 
            vehicle && (vehicle.status === 'available' || vehicle.isAvailable)
          );
          setVehicles(availableVehicles);
          setError(null);
        } else {
          console.error('Invalid response format:', response.data);
          throw new Error(`Failed to fetch ${type}s: Invalid response format`);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError(err.message);
        toast.error(`Error loading ${type}s: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (type) {
      fetchVehicles();
    }
  }, [type]);

  const handleLogout = () => {
    logout();
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (!vehicle) return false;
    
    const matchesSearch = (vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesBrand = !selectedBrand || vehicle.brand === selectedBrand;
    
    const matchesPriceRange = priceRange === 'all' ? true :
      priceRange === 'low' ? vehicle.pricePerDay <= 5000 :
      priceRange === 'medium' ? vehicle.pricePerDay > 5000 && vehicle.pricePerDay <= 10000 :
      vehicle.pricePerDay > 10000;

    return matchesSearch && matchesBrand && matchesPriceRange;
  });

  const uniqueBrands = Array.from(new Set(vehicles.filter(v => v && v.brand).map(vehicle => vehicle.brand)));

  const handleBookNow = (vehicle) => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${type}/${vehicle._id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white fixed md:static w-64 h-full shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 z-30`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">RideHub</h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <FaTimes className="text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            <Link to="/dashboard" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-orange-50">
              <MdDashboard className="text-xl" />
              <span>Dashboard</span>
            </Link>
            <Link to="/vehicles/car" className={`flex items-center space-x-3 p-2 rounded-lg ${type === 'car' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50'}`}>
              <FaCar className="text-xl" />
              <span>Cars</span>
            </Link>
            <Link to="/vehicles/bike" className={`flex items-center space-x-3 p-2 rounded-lg ${type === 'bike' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-orange-50'}`}>
              <FaMotorcycle className="text-xl" />
              <span>Bikes</span>
            </Link>
            <Link to="/bookings" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-orange-50">
              <FaClipboardList className="text-xl" />
              <span>My Bookings</span>
            </Link>
            <Link to="/account/settings" className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-orange-50">
              <FaCog className="text-xl" />
              <span>Settings</span>
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg hover:bg-orange-50 w-full mt-4"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Top Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  className="md:hidden mr-4 text-gray-600"
                  onClick={() => setSidebarOpen(true)}
                >
                  <FaBars className="text-xl" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {type === 'car' ? 'Cars' : 'Bikes'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MdNotifications className="text-xl text-gray-600" />
                </button>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {user?.firstName?.[0] || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Bookings</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.totalBookings}</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <FaClipboardList className="text-2xl text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active Rentals</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.activeRentals}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FaChartLine className="text-2xl text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Available Cars</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.availableCars}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaCar className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Available Bikes</p>
                  <h3 className="text-2xl font-bold text-gray-900">{dashboardStats.availableBikes}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaMotorcycle className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={`Search ${type}s...`}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="low">Under Rs. 5000/day</option>
                <option value="medium">Rs. 5000-10000/day</option>
                <option value="high">Above Rs. 10000/day</option>
              </select>
            </div>
          </div>

          {/* Vehicles Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading {type}s...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>Error: {error}</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {type}s found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative pb-[56.25%]">
                    <img
                      src={vehicle.images?.[0] || "/placeholder.svg"}
                      alt={vehicle.name}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-gray-600">{vehicle.brand}</p>
                      <div className="mt-2 space-y-1">
                        {vehicle.modelYear && (
                          <p className="text-sm text-gray-500">Year: {vehicle.modelYear}</p>
                        )}
                        {vehicle.fuelType && (
                          <p className="text-sm text-gray-500">Fuel: {vehicle.fuelType}</p>
                        )}
                        {vehicle.location && (
                          <p className="text-sm text-gray-500">
                            📍 {vehicle.location.city}, {vehicle.location.district}
                          </p>
                        )}
                      </div>
                    </div>

                    {vehicle.features && Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {vehicle.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                            {feature}
                          </span>
                        ))}
                        {vehicle.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                            +{vehicle.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Price per day</p>
                          <p className="text-2xl font-bold text-orange-600">
                            Rs. {vehicle.pricePerDay}
                          </p>
                        </div>
                        <Link
                          to={`/vehicles/${type}/${vehicle._id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                      
                      <button
                        className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                        onClick={() => handleBookNow(vehicle)}
                      >
                        <span>Book Now</span>
                        <FaClipboardList className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchPage;