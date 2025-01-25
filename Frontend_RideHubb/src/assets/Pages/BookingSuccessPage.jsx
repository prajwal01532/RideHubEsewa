import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const BookingSuccessPage = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { bookingDetails, vehicleDetails } = location.state || {};

	if (!bookingDetails || !vehicleDetails) {
		navigate('/');
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-100 py-12">
			<div className="max-w-3xl mx-auto px-4">
				<div className="bg-white rounded-lg shadow-lg p-8 text-center">
					<FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
					<h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Successful!</h1>
					<p className="text-gray-600 mb-8">Thank you for choosing RideHub. Your booking has been confirmed.</p>

					<div className="bg-gray-50 rounded-lg p-6 mb-8">
						<h2 className="text-xl font-semibold mb-4">Booking Details</h2>
						<div className="grid grid-cols-2 gap-4 text-left">
							<div>
								<p className="text-gray-600">Vehicle</p>
								<p className="font-medium">{vehicleDetails.name}</p>
							</div>
							<div>
								<p className="text-gray-600">Booking ID</p>
								<p className="font-medium">{bookingDetails.vehicleId}</p>
							</div>
							<div>
								<p className="text-gray-600">Start Date</p>
								<p className="font-medium">{new Date(bookingDetails.startDate).toLocaleDateString()}</p>
							</div>
							<div>
								<p className="text-gray-600">End Date</p>
								<p className="font-medium">{new Date(bookingDetails.endDate).toLocaleDateString()}</p>
							</div>
							<div>
								<p className="text-gray-600">Pickup Location</p>
								<p className="font-medium">{bookingDetails.pickupLocation}</p>
							</div>
							<div>
								<p className="text-gray-600">Drop-off Location</p>
								<p className="font-medium">{bookingDetails.dropoffLocation}</p>
							</div>
							<div>
								<p className="text-gray-600">Total Amount</p>
								<p className="font-medium">Rs. {bookingDetails.totalAmount}</p>
							</div>
							<div>
								<p className="text-gray-600">Payment Method</p>
								<p className="font-medium">{bookingDetails.paymentMethod}</p>
							</div>
						</div>
					</div>

					<div className="flex justify-center space-x-4">
						<button
							onClick={() => navigate('/bookings')}
							className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
						>
							View My Bookings
						</button>
						<button
							onClick={() => navigate('/')}
							className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
						>
							Return to Home
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingSuccessPage;