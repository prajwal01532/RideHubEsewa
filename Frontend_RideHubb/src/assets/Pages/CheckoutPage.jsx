import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api, { esewaPayment } from '../../services/api';
import { FaCalendarAlt, FaUser, FaCar, FaMotorcycle, FaClock, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, format } from 'date-fns';

const DRIVER_PRICE_PER_DAY = 500;

const CheckoutPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({
    startDate: null,
    endDate: null,
    requiresDriver: false,
    message: ''
  });

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/vehicles/${type}/${id}`);
        if (response.data.success) {
          setVehicle(response.data.data);
        } else {
          throw new Error('Failed to fetch vehicle details');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load vehicle details');
        navigate('/vehicles/' + type);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [type, id, navigate]);

  const calculateTotalAmount = () => {
    if (!vehicle || !bookingDetails.startDate || !bookingDetails.endDate) return 0;
    
    const days = Math.ceil(
      (bookingDetails.endDate.getTime() - bookingDetails.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let totalAmount = days * vehicle.pricePerDay;
    if (bookingDetails.requiresDriver) {
      totalAmount += days * DRIVER_PRICE_PER_DAY;
    }
    
    return totalAmount;
  };

  const handleInputChange = (e) => {
    const { name, type, checked } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : e.target.value
    }));
  };

  const handleDateChange = (date, field) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: date,
      // Reset end date if start date is after current end date
      ...(field === 'startDate' && prev.endDate && date > prev.endDate 
        ? { endDate: addDays(date, 1) }
        : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!bookingDetails.startDate || !bookingDetails.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    // Validate dates
    if (bookingDetails.startDate >= bookingDetails.endDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      const totalAmount = calculateTotalAmount();
      
      const bookingData = {
        vehicleId: id,
        vehicleType: type,
        startDate: format(bookingDetails.startDate, 'yyyy-MM-dd'),
        endDate: format(bookingDetails.endDate, 'yyyy-MM-dd'),
        requiresDriver: bookingDetails.requiresDriver,
        message: bookingDetails.message,
        totalAmount: totalAmount
      };

      // Create booking
      const bookingResponse = await api.post('/bookings', bookingData);
      
      if (bookingResponse.data.success) {
        const booking = bookingResponse.data.data;
        
        // Initiate eSewa payment
        const paymentResponse = await api.post('/bookings/payments/initiate', {
          amount: totalAmount,
          bookingId: booking._id
        });

        if (paymentResponse.data.success && paymentResponse.data.url) {
          // Redirect to eSewa payment page
          window.location.href = paymentResponse.data.url;
        } else {
          throw new Error(paymentResponse.data.message || 'Failed to initiate payment');
        }
      } else {
        throw new Error(bookingResponse.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to process booking');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const numberOfDays = bookingDetails.startDate && bookingDetails.endDate
    ? Math.ceil((bookingDetails.endDate - bookingDetails.startDate) / (1000 * 60 * 60 * 24))
    : 0;

  const CustomDatePickerInput = React.forwardRef(({ value, onClick, label, icon }, ref) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div 
        className="relative w-full cursor-pointer"
        onClick={onClick}
      >
        <input
          ref={ref}
          value={value}
          readOnly
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 cursor-pointer bg-white"
          placeholder="Select date"
        />
        {icon && <div className="absolute right-3 top-3 text-gray-400">{icon}</div>}
      </div>
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Vehicle Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  {type === 'car' ? <FaCar className="mr-2" /> : <FaMotorcycle className="mr-2" />}
                  Vehicle Details
                </h2>
                
                <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={vehicle?.images?.[0] || "/placeholder.svg"}
                    alt={vehicle?.name}
                    className="w-full md:w-64 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{vehicle?.name}</h3>
                    <p className="text-gray-600 mb-2">{vehicle?.brand}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-600">
                        <FaMoneyBillWave className="mr-2" />
                        <span>Rs. {vehicle?.pricePerDay}/day</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        <span>Available Now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  Booking Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DatePicker
                      selected={bookingDetails.startDate}
                      onChange={(date) => handleDateChange(date, 'startDate')}
                      selectsStart
                      startDate={bookingDetails.startDate}
                      endDate={bookingDetails.endDate}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select start date"
                      customInput={
                        <CustomDatePickerInput 
                          label="From Date" 
                          icon={<FaCalendarAlt />}
                        />
                      }
                      className="w-full"
                    />

                    <DatePicker
                      selected={bookingDetails.endDate}
                      onChange={(date) => handleDateChange(date, 'endDate')}
                      selectsEnd
                      startDate={bookingDetails.startDate}
                      endDate={bookingDetails.endDate}
                      minDate={bookingDetails.startDate || new Date()}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select end date"
                      customInput={
                        <CustomDatePickerInput 
                          label="To Date" 
                          icon={<FaCalendarAlt />}
                        />
                      }
                      className="w-full"
                    />
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="requiresDriver"
                        name="requiresDriver"
                        checked={bookingDetails.requiresDriver}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="requiresDriver" className="text-sm font-medium text-gray-700 flex items-center">
                        <FaUser className="mr-2" />
                        Include Driver (Rs. {DRIVER_PRICE_PER_DAY}/day)
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                      name="message"
                      value={bookingDetails.message}
                      onChange={handleInputChange}
                      rows="3"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-6">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vehicle Rent</span>
                    <span className="font-semibold">Rs. {vehicle?.pricePerDay} × {numberOfDays || 0} days</span>
                  </div>
                  
                  {bookingDetails.requiresDriver && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Driver Charges</span>
                      <span className="font-semibold">Rs. {DRIVER_PRICE_PER_DAY} × {numberOfDays || 0} days</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-orange-600">Rs. {calculateTotalAmount()}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-gray-400 mt-1 mr-2" />
                      <p className="text-sm text-gray-600">
                        Payment will be processed securely through eSewa. You'll be redirected to complete the payment.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!bookingDetails.startDate || !bookingDetails.endDate || loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <>
                        <FaMoneyBillWave className="mr-2" />
                        Pay with eSewa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
