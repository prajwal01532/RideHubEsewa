import Bike from '../models/Bike.js';

export const addBike = async (req, res) => {
  try {
    const newBike = new Bike(req.body);
    await newBike.save();
    res.status(201).json({
      success: true,
      message: 'Bike added successfully',
      data: newBike
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add bike',
      error: error.message
    });
  }
};

export const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.status(200).json({
      success: true,
      data: bikes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch bikes',
      error: error.message
    });
  }
};
