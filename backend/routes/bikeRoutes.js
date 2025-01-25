import express from 'express';
import * as bikeController from '../controllers/bikeController.js';

const router = express.Router();

router.post('/', bikeController.addBike);
router.get('/', bikeController.getAllBikes);

export default router;
