import express from 'express';
import * as carController from '../controllers/carController.js';
import * as bikeController from '../controllers/bikeController.js';
import * as vehicleController from '../controllers/vehicleController.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { type } = req.body;
  if (type === 'car') {
    await carController.addCar(req, res);
  } else if (type === 'bike') {
    await bikeController.addBike(req, res);
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid vehicle type'
    });
  }
});

router.get('/:type', async (req, res) => {
  const { type } = req.params;
  if (type === 'car') {
    await carController.getAllCars(req, res);
  } else if (type === 'bike') {
    await bikeController.getAllBikes(req, res);
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid vehicle type'
    });
  }
});

router.get('/:type/:id', vehicleController.getVehicleById);
router.delete('/:type/:id', vehicleController.deleteVehicle);

export default router;
