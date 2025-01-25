import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from 'react-icons/fa';

const Failure = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <FaTimesCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Failed
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            There was an issue processing your payment.
          </p>
        </div>

        <div className="mt-8">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md">
              <div className="text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>The payment was not completed successfully</li>
                  <li>No amount has been deducted from your account</li>
                  <li>You can try booking again or choose a different payment method</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/bookings')}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failure;