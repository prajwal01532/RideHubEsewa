import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { FaCar, FaMotorcycle, FaUsers, FaBan, FaUserShield, FaComments, FaTrash, FaPlus, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { MdDashboard, MdNotifications } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAddBikeModal, setShowAddBikeModal] = useState(false);
  const [vehicles, setVehicles] = useState({ cars: [], bikes: [] });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/dashboard');
  };

  const handleViewUsers = async () => {
    setShowUserList(true);
    setIsLoadingUsers(true);
    try {
      const response = await api.get('/auth/users');
      if (response.data && response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error('No users data available');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      try {
        await fetchVehicles();
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Add Car Modal Component
  const AddCarModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      brand: '',
      modelYear: '',
      fuelType: '',
      location: {
        city: '',
        district: ''
      },
      pricePerDay: '',
      images: [],
      features: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleAddVehicle('car', formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <FaCar className="text-3xl text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Add New Car</h2>
                <p className="text-gray-600">Enter car details for rental</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddCarModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-blue-800">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Name*</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., Toyota Camry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., Toyota" 
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-800">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Year*</label>
                  <input 
                    type="number" 
                    value={formData.modelYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, modelYear: e.target.value }))}
                    required
                    min="2000"
                    max="2024"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., 2024" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type*</label>
                  <select 
                    value={formData.fuelType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fuelType: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location & Availability */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-green-800">Location & Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City*</label>
                  <input 
                    type="text" 
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., Kathmandu" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District*</label>
                  <input 
                    type="text" 
                    value={formData.location.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, district: e.target.value } }))}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., Bagmati" 
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Images */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-purple-800">Pricing & Images</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">Rs.</span>
                    <input 
                      type="number"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter daily rental price" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Images*</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Add Image URLs</p>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="url" 
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Enter image URL"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={() => {
                              if (formData.imageUrl) {
                                setFormData(prev => ({
                                  ...prev,
                                  images: [...prev.images, prev.imageUrl],
                                  imageUrl: ''
                                }));
                              }
                            }}
                          >
                            Add URL
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <FaTimes className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-yellow-800">Additional Features</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features & Specifications</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  rows="3"
                  placeholder="Enter car features (AC, Music System, GPS, etc.)"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? 'Adding Car...' : 'Add Car'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Add Bike Modal Component
  const AddBikeModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      brand: '',
      modelYear: '',
      engineType: '',
      engineCapacity: '',
      location: {
        city: '',
        district: ''
      },
      pricePerDay: '',
      images: [],
      features: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleAddVehicle('bike', formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <FaMotorcycle className="text-3xl text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">Add New Bike</h2>
                <p className="text-gray-600">Enter bike details for rental</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddBikeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-purple-800">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bike Name*</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    placeholder="e.g., Royal Enfield Classic" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand*</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    placeholder="e.g., Royal Enfield" 
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-800">Technical Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model Year*</label>
                  <input 
                    type="number" 
                    required
                    min="2000"
                    max="2024"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    placeholder="e.g., 2024" 
                    value={formData.modelYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, modelYear: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type*</label>
                  <select 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    value={formData.engineType}
                    onChange={(e) => setFormData(prev => ({ ...prev, engineType: e.target.value }))}
                  >
                    <option value="">Select Engine Type</option>
                    <option value="petrol">Petrol</option>
                    <option value="electric">Electric</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Capacity (CC)*</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  placeholder="e.g., 350" 
                  value={formData.engineCapacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, engineCapacity: e.target.value }))}
                />
              </div>
            </div>

            {/* Location & Availability */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-green-800">Location & Availability</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City*</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    placeholder="e.g., Kathmandu" 
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, city: e.target.value } }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">District*</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                    placeholder="e.g., Bagmati" 
                    value={formData.location.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: { ...prev.location, district: e.target.value } }))}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Images */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-indigo-800">Pricing & Images</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">Rs.</span>
                    <input 
                      type="number"
                      required
                      min="0"
                      className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                      placeholder="Enter daily rental price" 
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerDay: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bike Images*</label>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Add Image URLs</p>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input 
                            type="url" 
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                            placeholder="Enter image URL"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          />
                          <button
                            type="button"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            onClick={() => {
                              if (formData.imageUrl) {
                                setFormData(prev => ({
                                  ...prev,
                                  images: [...prev.images, prev.imageUrl],
                                  imageUrl: ''
                                }));
                              }
                            }}
                          >
                            Add URL
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }));
                                }}
                              >
                                <FaTimes className="text-sm" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-yellow-800">Additional Features</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features & Specifications</label>
                <textarea 
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  rows="3"
                  placeholder="Enter bike features (ABS, Digital Console, etc.)"
                  value={formData.features}
                  onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FaMotorcycle />
              <span>Add Bike</span>
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Add Vehicle Details Modal
  const VehicleDetailsModal = ({ vehicle, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{vehicle.name}</h2>
            <p className="text-gray-600">{vehicle.brand} - {vehicle.modelYear}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicle.images.map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${vehicle.name} - ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Technical Details</h3>
              <div className="space-y-2">
                <p><span className="text-gray-600">Fuel Type:</span> {vehicle.fuelType || vehicle.engineType}</p>
                <p><span className="text-gray-600">Engine:</span> {vehicle.engineCapacity}cc</p>
                <p><span className="text-gray-600">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'rented' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Location</h3>
              <p>{vehicle.location.city}, {vehicle.location.district}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Pricing</h3>
              <p className="text-2xl font-bold text-orange-600">Rs. {vehicle.pricePerDay}/day</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Features</h3>
              <p>{vehicle.features}</p>
            </div>

            <button
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this vehicle?')) {
                  try {
                    const response = await api.delete(`/vehicles/${vehicle.type}/${vehicle._id}`);
                    if (response.data.success) {
                      toast.success(response.data.message);
                      await fetchVehicles(); // Refresh the vehicles list
                      onClose();
                    }
                  } catch (error) {
                    console.error('Error deleting vehicle:', error);
                    toast.error(error.response?.data?.message || 'Failed to delete vehicle');
                  }
                }
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FaTrash className="text-lg" />
              <span>Delete Vehicle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">User Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">First Name</p>
                  <p className="font-medium">{user.firstName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Name</p>
                  <p className="font-medium">{user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile Number</p>
                  <p className="font-medium">{user.mobileNumber}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4 text-lg">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nationality</p>
                  <p className="font-medium">{user.nationality}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Created</p>
                  <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${user.isBlocked ? 'text-red-600' : 'text-green-600'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //Display Garneyyyyy thaum
  // Update the vehicles display section in the dashboard
  const VehiclesList = ({ vehicles, type }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{type === 'car' ? 'Cars' : 'Bikes'}</h2>
        <button
          onClick={() => type === 'car' ? setShowAddCarModal(true) : setShowAddBikeModal(true)}
          className={`px-4 py-2 text-white rounded-lg transition-colors ${
            type === 'car' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          Add New {type === 'car' ? 'Car' : 'Bike'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => {
          // Ensure each vehicle has a type property
          const vehicleWithType = { ...vehicle, type };
          return (
          <div key={vehicle._id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={vehicle.images[0] || "/placeholder.svg"}
              alt={vehicle.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{vehicle.name}</h3>
              <p className="text-gray-600 mb-2">{vehicle.brand}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-orange-600">Rs. {vehicle.pricePerDay}/day</p>
                <button
                  onClick={() => {
                    setSelectedVehicle(vehicleWithType);
                    setShowVehicleDetails(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );

  // Add this function to handle form submission
  const handleAddVehicle = async (type, formData) => {
    setIsLoading(true);
    try {
      const vehicleData = {
        type,
        name: formData.name,
        brand: formData.brand,
        modelYear: parseInt(formData.modelYear),
        fuelType: type === 'car' ? formData.fuelType : undefined,
        engineType: type === 'bike' ? formData.engineType : undefined,
        engineCapacity: type === 'bike' ? parseInt(formData.engineCapacity) : undefined,
        location: {
          city: formData.location.city,
          district: formData.location.district
        },
        pricePerDay: parseFloat(formData.pricePerDay),
        images: formData.images || [],
        features: formData.features || ''
      };

      const response = await api.post('/vehicles', vehicleData);

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchVehicles(); // Refresh the vehicles list
        type === 'car' ? setShowAddCarModal(false) : setShowAddBikeModal(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to add ${type}. Please try again.`;
      toast.error(errorMessage);
      console.error('Error adding vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to fetch vehicles
  const fetchVehicles = async () => {
    try {
      const [carsResponse, bikesResponse] = await Promise.all([
        api.get('/vehicles/car'),
        api.get('/vehicles/bike')
      ]);
      
      setVehicles({
        cars: carsResponse.data.data,
        bikes: bikesResponse.data.data
      });
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast.error('Failed to fetch vehicles. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-orange-600">RideHub Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MdNotifications className="text-xl text-gray-600" />
              </button>
              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Admin Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Vehicles Container */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Vehicles</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowAddCarModal(true)}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700"
              >
                <FaCar className="text-xl" />
                <span>Add New Car</span>
              </button>
              <button
                onClick={() => setShowAddBikeModal(true)}
                className="flex items-center justify-center space-x-2 bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700"
              >
                <FaMotorcycle className="text-xl" />
                <span>Add New Bike</span>
              </button>
            </div>
          </div>

          {/* User Management Container */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleViewUsers}
                className="flex items-center justify-center space-x-2 bg-green-600 text-white p-4 rounded-lg hover:bg-green-700"
              >
                <FaUsers className="text-xl" />
                <span>View Registered Users</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Lists */}
        <div className="space-y-8">
          <VehiclesList vehicles={vehicles.cars} type="car" />
          <VehiclesList vehicles={vehicles.bikes} type="bike" />
        </div>

        {/* User List Section */}
        {showUserList && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Registered Users</h2>
              <button
                onClick={() => setShowUserList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            {isLoadingUsers ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Full Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Mobile Number</th>
                      <th className="px-6 py-3">Nationality</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.mobileNumber}</td>
                        <td className="px-6 py-4">{user.nationality}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No registered users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddCarModal && <AddCarModal />}
      {showAddBikeModal && <AddBikeModal />}
      {showVehicleDetails && selectedVehicle && (
        <VehicleDetailsModal
          vehicle={selectedVehicle}
          onClose={() => setShowVehicleDetails(false)}
        />
      )}
      {showUserModal && selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboardPage;
