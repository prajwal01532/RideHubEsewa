import express from 'express';
import * as carController from '../controllers/carController.js';

const router = express.Router();

router.post('/', carController.addCar);
router.get('/', carController.getAllCars);

export default router;
