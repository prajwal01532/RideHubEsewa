import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaMapMarkerAlt, FaFlag, FaQuestionCircle, FaComments, FaTrash, FaSignOutAlt, FaBars, FaTimes, FaClipboardList, FaCog, FaCar, FaMotorcycle } from 'react-icons/fa';
import { MdDashboard, MdNotifications, MdEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: 'Kathmandu, Nepal', isDefault: true },
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [deleteAccount, setDeleteAccount] = useState({ show: false, password: '' });
  const [showNotification, setShowNotification] = useState(false);

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setAddresses([
        ...addresses,
        { id: Date.now(), type: 'Other', address: newAddress, isDefault: false }
      ]);
      setNewAddress('');
      setShowAddAddress(false);
    }
  };

  const handleSendFeedback = () => {
    if (feedback.trim()) {
      // Here you would typically send the feedback to your backend
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setFeedback('');
    }
  };

  const handleDeleteAccount = () => {
    // Here you would verify the password and delete the account
    if (deleteAccount.password) {
      // Delete account logic
      logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Same as Dashboard */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        {/* Same sidebar code as Dashboard */}
        {/* ... */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded-full relative">
                  <MdNotifications className="text-xl text-gray-600" />
                  {showNotification && (
                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {(user?.firstName?.[0] || 'A').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md">
            <div className="grid grid-cols-12 min-h-[600px]">
              {/* Settings Navigation */}
              <div className="col-span-3 border-r">
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => setActiveTab('account')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'account' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaUser className="mr-3" /> Account Information
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('address')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'address' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaMapMarkerAlt className="mr-3" /> Address Book
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('country')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'country' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaFlag className="mr-3" /> Country
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('help')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'help' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaQuestionCircle className="mr-3" /> Help
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('feedback')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'feedback' ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaComments className="mr-3" /> Feedback
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('delete')}
                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                          activeTab === 'delete' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FaTrash className="mr-3" /> Delete Account
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Settings Content */}
              <div className="col-span-9 p-6">
                {/* Account Information */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Account Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">First Name</p>
                          <p className="font-semibold">{user?.firstName || 'John'}</p>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700">
                          <MdEdit />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Last Name</p>
                          <p className="font-semibold">{user?.lastName || 'Doe'}</p>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700">
                          <MdEdit />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-semibold">{user?.email || 'john.doe@example.com'}</p>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700">
                          <MdEdit />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-semibold">{user?.phone || '+977 98XXXXXXXX'}</p>
                        </div>
                        <button className="text-orange-600 hover:text-orange-700">
                          <MdEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Book */}
                {activeTab === 'address' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Address Book</h2>
                      <button
                        onClick={() => setShowAddAddress(true)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        + Add Address
                      </button>
                    </div>
                    
                    {/* Address List */}
                    <div className="space-y-4">
                      {addresses.map(address => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{address.type}</h3>
                              <p className="text-gray-600">{address.address}</p>
                              {address.isDefault && (
                                <span className="text-sm text-orange-600">Default Address</span>
                              )}
                            </div>
                            <div className="space-x-2">
                              <button className="text-orange-600 hover:text-orange-700">Edit</button>
                              <button className="text-red-600 hover:text-red-700">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Address Modal */}
                    {showAddAddress && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-96">
                          <h3 className="text-xl font-bold mb-4">Add New Address</h3>
                          <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            placeholder="Enter your address"
                            className="w-full p-2 border rounded-lg mb-4"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setShowAddAddress(false)}
                              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleAddAddress}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Country */}
                {activeTab === 'country' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Country</h2>
                    <div className="text-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Flag_of_Nepal.svg"
                        alt="Nepal Flag"
                        className="mx-auto h-48 mb-4"
                      />
                      <h3 className="text-xl font-bold">Nepal</h3>
                      <p className="text-gray-600">Your current location is set to Nepal</p>
                    </div>
                  </div>
                )}

                {/* Help */}
                {activeTab === 'help' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Help Guidelines</h2>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">How to Book a Vehicle</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                          <li>Browse available vehicles in Cars or Bikes section</li>
                          <li>Select your preferred vehicle</li>
                          <li>Choose rental duration</li>
                          <li>Confirm your booking</li>
                          <li>Complete the payment</li>
                        </ol>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Rental Policies</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Valid ID required for rental</li>
                          <li>Minimum age requirement: 18 years</li>
                          <li>Security deposit required</li>
                          <li>24-hour cancellation policy</li>
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Contact Support</h3>
                        <p className="text-gray-600">
                          Email: support@ridehub.com<br />
                          Phone: +977 98XXXXXXXX<br />
                          Available 24/7
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {activeTab === 'feedback' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Send Feedback</h2>
                    <div className="space-y-4">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts, suggestions, or report issues..."
                        className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      ></textarea>
                      <button
                        onClick={handleSendFeedback}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                      >
                        Send Feedback
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Account */}
                {activeTab === 'delete' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-red-600">Delete Account</h2>
                    <div className="bg-red-50 p-4 rounded-lg mb-6">
                      <p className="text-red-600">
                        Warning: This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                    {!deleteAccount.show ? (
                      <button
                        onClick={() => setDeleteAccount({ ...deleteAccount, show: true })}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="password"
                          value={deleteAccount.password}
                          onChange={(e) => setDeleteAccount({ ...deleteAccount, password: e.target.value })}
                          placeholder="Enter your password to confirm"
                          className="w-full p-2 border rounded-lg"
                        />
                        <div className="space-x-2">
                          <button
                            onClick={handleDeleteAccount}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteAccount({ show: false, password: '' })}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 