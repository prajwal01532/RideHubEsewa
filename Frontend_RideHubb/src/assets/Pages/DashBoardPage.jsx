import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCar, FaMotorcycle, FaUsers, FaClipboardList, FaChartLine, FaCalendarAlt, FaCog, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
import { MdNotifications, MdDashboard } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../../services/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    activeRentals: 0,
    availableCars: 0,
    availableBikes: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  // Fetch dashboard stats and recent bookings
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all required data in parallel
        const [bookingsResponse, carsResponse, bikesResponse] = await Promise.all([
          api.get('/bookings'),
          api.get('/vehicles/car'),
          api.get('/vehicles/bike')
        ]);

        // Process bookings data
        const allBookings = bookingsResponse.data.data || [];
        const activeBookings = allBookings.filter(booking => booking.status === 'active');
        
        // Process vehicles data
        const availableCars = (carsResponse.data.data || []).filter(car => car.status === 'available');
        const availableBikes = (bikesResponse.data.data || []).filter(bike => bike.status === 'available');

        // Update dashboard stats
        setDashboardStats({
          totalBookings: allBookings.length,
          activeRentals: activeBookings.length,
          availableCars: availableCars.length,
          availableBikes: availableBikes.length
        });

        // Set recent bookings (last 5 bookings)
        setRecentBookings(allBookings.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            <span className={`text-2xl font-bold text-orange-600 ${!sidebarOpen && 'hidden'}`}>
              RideHub
            </span>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="flex items-center p-3 bg-orange-50 text-orange-600 rounded-lg">
                  <MdDashboard className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Dashboard</span>}
                </Link>
              </li>
              <li>
                <Link to="/vehicles/car" className="flex items-center p-3 text-gray-700 hover:bg-orange-50 rounded-lg">
                  <FaCar className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Cars</span>}
                </Link>
              </li>
              <li>
                <Link to="/vehicles/bike" className="flex items-center p-3 text-gray-700 hover:bg-orange-50 rounded-lg">
                  <FaMotorcycle className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Bikes</span>}
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="flex items-center p-3 text-gray-700 hover:bg-orange-50 rounded-lg">
                  <FaClipboardList className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Bookings</span>}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="flex items-center p-3 text-gray-700 hover:bg-orange-50 rounded-lg">
                  <FaUserShield className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Admin Login</span>}
                </Link>
              </li>
              <li>
                <Link to="/account/settings" className="flex items-center p-3 text-gray-700 hover:bg-orange-50 rounded-lg">
                  <FaCog className="text-xl" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button 
              onClick={logout}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-orange-50 rounded-lg"
            >
              <FaSignOutAlt className="text-xl" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        {/* Top Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName || 'User'}!</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MdNotifications className="text-xl text-gray-600" />
                </button>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {(user?.firstName?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
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

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {booking.vehicleType === 'car' ? (
                                <FaCar className="text-blue-600 mr-2" />
                              ) : (
                                <FaMotorcycle className="text-purple-600 mr-2" />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {booking.vehicleName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.vehicleBrand}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.startDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking.duration} days
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Rs. {booking.totalCost}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;