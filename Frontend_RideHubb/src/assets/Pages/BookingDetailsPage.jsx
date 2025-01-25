import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingService } from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { FaStar } from 'react-icons/fa';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await bookingService.getBookingDetails(bookingId);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        navigate('/bookings');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await bookingService.submitReview(bookingId, reviewData);
      toast.success('Review submitted successfully');
      setIsReviewModalOpen(false);
      
      // Refresh booking details to show the review
      const response = await bookingService.getBookingDetails(bookingId);
      setBooking(response.data);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Booking not found</h2>
          <button
            onClick={() => navigate('/bookings')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
          <button
            onClick={() => navigate('/bookings')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to Bookings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold">{booking.vehicle.name}</h2>
                <p className="text-gray-600">{booking.vehicle.brand}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Booking Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Booking ID: <span className="text-gray-800">{booking.bookingId}</span>
                  </p>
                  <p className="text-gray-600">
                    Start Date: <span className="text-gray-800">{new Date(booking.startDate).toLocaleDateString()}</span>
                  </p>
                  <p className="text-gray-600">
                    End Date: <span className="text-gray-800">{new Date(booking.endDate).toLocaleDateString()}</span>
                  </p>
                  <p className="text-gray-600">
                    Duration: <span className="text-gray-800">
                      {Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Location Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Pickup Location: <span className="text-gray-800">{booking.pickupLocation}</span>
                  </p>
                  <p className="text-gray-600">
                    Drop-off Location: <span className="text-gray-800">{booking.dropoffLocation}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Payment Details</h3>
                  <p className="text-gray-600">
                    Payment Method: <span className="text-gray-800">{booking.paymentMethod}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-orange-600">Rs. {booking.totalAmount}</p>
                </div>
              </div>
            </div>

            {booking.review && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold mb-2">Your Review</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= booking.review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{booking.review.review}</p>
                </div>
              </div>
            )}

            <div className="mt-6 border-t pt-6 space-y-4">
              {booking.status === 'pending' && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              
              {booking.status === 'completed' && !booking.review && (
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Write a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        booking={booking}
      />
    </div>
  );
};

export default BookingDetailsPage;
