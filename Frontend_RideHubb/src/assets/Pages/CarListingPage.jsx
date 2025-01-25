import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const CarListingPage = () => {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    priceRange: 'all',
    brand: 'all',
    type: 'all'
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/vehicles/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriceRange = filters.priceRange === 'all' ? true :
      filters.priceRange === 'low' ? car.pricePerDay <= 5000 :
      filters.priceRange === 'medium' ? car.pricePerDay > 5000 && car.pricePerDay <= 10000 :
      car.pricePerDay > 10000;

    const matchesBrand = filters.brand === 'all' ? true : car.brand === filters.brand;
    const matchesType = filters.type === 'all' ? true : car.type === filters.type;

    return matchesSearch && matchesPriceRange && matchesBrand && matchesType;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 relative mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search cars..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="flex space-x-4">
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              >
                <option value="all">All Prices</option>
                <option value="low">Under Rs. 5000/day</option>
                <option value="medium">Rs. 5000-10000/day</option>
                <option value="high">Above Rs. 10000/day</option>
              </select>
              <select
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              >
                <option value="all">All Brands</option>
                {Array.from(new Set(cars.map(car => car.brand))).map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div key={car._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative pb-[56.25%]">
                  <img
                    src={car.images?.[0] || "/placeholder.svg"}
                    alt={car.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{car.name}</h3>
                      <p className="text-gray-600">{car.brand}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      car.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {car.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-orange-600">
                      Rs. {car.pricePerDay}/day
                    </p>
                    <button
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      onClick={() => window.location.href = `/book/${car._id}`}
                    >
                      Book Now
                    </button>
                  </div>
                  {car.features && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarListingPage;
