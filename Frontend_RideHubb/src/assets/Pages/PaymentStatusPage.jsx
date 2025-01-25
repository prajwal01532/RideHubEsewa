import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { esewaPayment } from '../../services/api';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentStatusPage = () => {
  const [status, setStatus] = useState('processing');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get query parameters from URL
        const params = new URLSearchParams(location.search);
        const transactionId = params.get('transaction_uuid');
        
        if (!transactionId) {
          setStatus('failed');
          return;
        }

        // Verify payment status
        const response = await esewaPayment.verifyPayment(transactionId);
        
        if (response.success) {
          setStatus('success');
          // Redirect to bookings page after 3 seconds
          setTimeout(() => {
            navigate('/bookings');
          }, 3000);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        toast.error('Payment verification failed');
      }
    };

    verifyPayment();
  }, [location, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="text-6xl text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
            <p className="text-sm text-gray-500">Redirecting to bookings page...</p>
          </div>
        );
      
      case 'failed':
        return (
          <div className="text-center">
            <FaTimesCircle className="text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">Something went wrong with your payment.</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        );
      
      default:
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying payment...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentStatusPage;
