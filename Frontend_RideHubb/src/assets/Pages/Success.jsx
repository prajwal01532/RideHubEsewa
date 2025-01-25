import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../../services/api';

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bookingId = params.get('bookingId');
    
    if (bookingId) {
      // Fetch booking details
      api.get(`/bookings/${bookingId}`)
        .then(response => {
          if (response.data.success) {
            setBooking(response.data.data);
          }
        })
        .catch(error => {
          console.error('Error fetching booking:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your booking has been confirmed.
          </p>
        </div>

        {booking && (
          <div className="mt-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Vehicle: {booking.vehicleName}</p>
                  <p>Start Date: {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p>End Date: {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p>Amount Paid: Rs. {booking.totalAmount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;