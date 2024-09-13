import express from 'express';
import { getAvailablePartners, assignPartner, updateOrderStatus } from '../controllers/deliveryController.js';

const deliveryRouter = express.Router();

// Get all available delivery partners
deliveryRouter.get('/available', getAvailablePartners);

// Assign a delivery partner to an order
deliveryRouter.post('/assign', assignPartner);

// Update order status and free the delivery partner
deliveryRouter.post('/status', updateOrderStatus);

export default deliveryRouter;
