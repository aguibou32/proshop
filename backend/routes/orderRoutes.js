import express from 'express';
import {
  addOrderItems, 
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  getOrders
} from '../controllers/orderController.js';
import {protect, admin} from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').post(protect, addOrderItems); // logged in user adds their orders
router.route('/mine').get(protect, getMyOrders); // logged in user gets all their orders
router.route('/:id/pay').put(protect, updateOrderToPaid); // user pays for an order
router.route('/').get(protect, admin, getOrders); // admin gets all the orders
router.route('/:id').get(protect, admin, getOrderById); // admin gets a single order
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // admin marks order as delivered

export default router;

