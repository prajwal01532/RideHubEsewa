const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  modelYear: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    required: true
  },
  engineCapacity: Number,
  location: {
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  pricePerDay: {
    type: Number,
    required: true
  },
  images: [String],
  features: String,
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance'],
    default: 'available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);

