import Car from '../models/Car.js';

export const addCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({
      success: true,
      message: 'Car added successfully',
      data: newCar
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to add car',
      error: error.message
    });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({
      success: true,
      data: cars
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch cars',
      error: error.message
    });
  }
};
