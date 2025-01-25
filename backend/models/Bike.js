import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  modelYear: { type: Number, required: true },
  engineType: { type: String, required: true },
  engineCapacity: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    district: { type: String, required: true }
  },
  pricePerDay: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' }
}, { timestamps: true });

export default mongoose.model('Bike', bikeSchema);
