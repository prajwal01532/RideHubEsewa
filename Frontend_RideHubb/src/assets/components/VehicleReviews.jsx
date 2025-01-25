import React from 'react';
import { FaStar, FaUser } from 'react-icons/fa';

const VehicleReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review this vehicle!</p>
      </div>
    );
  }

  const calculateAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingPercentages = () => {
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      ratingCounts[review.rating]++;
    });

    return Object.entries(ratingCounts).reverse().map(([rating, count]) => ({
      rating: parseInt(rating),
      percentage: (count / reviews.length) * 100
    }));
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
        <div className="text-center md:text-left">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {calculateAverageRating()}
            <span className="text-lg text-gray-500 ml-2">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={star <= Math.round(calculateAverageRating())
                  ? 'text-yellow-400'
                  : 'text-gray-300'
                }
              />
            ))}
          </div>
          <p className="text-gray-600">{reviews.length} reviews</p>
        </div>

        <div className="space-y-2">
          {getRatingPercentages().map(({ rating, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="w-12 text-sm text-gray-600">{rating} stars</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-12 text-sm text-gray-600">{Math.round(percentage)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleReviews;
