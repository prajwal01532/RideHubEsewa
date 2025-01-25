import React from 'react';

const BookingConfirmationModal = ({ isOpen, onClose, onConfirm, bookingDetails, vehicle, totalAmount }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Vehicle Details</h3>
            <p className="text-gray-700">Name: {vehicle.name}</p>
            <p className="text-gray-700">Brand: {vehicle.brand}</p>
            <p className="text-gray-700">Price per day: Rs. {vehicle.pricePerDay}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Booking Details</h3>
            <p className="text-gray-700">Start Date: {new Date(bookingDetails.startDate).toLocaleDateString()}</p>
            <p className="text-gray-700">End Date: {new Date(bookingDetails.endDate).toLocaleDateString()}</p>
            <p className="text-gray-700">Pickup Location: {bookingDetails.pickupLocation}</p>
            <p className="text-gray-700">Drop-off Location: {bookingDetails.dropoffLocation}</p>
            <p className="text-gray-700">Payment Method: {bookingDetails.paymentMethod}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Amount:</span>
              <span className="text-xl font-bold text-orange-600">Rs. {totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
