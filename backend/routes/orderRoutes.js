import express from 'express'

import {
  addOrderItems, 
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  getOrders
} from '../controllers/orderController.js'
import {protect, admin} from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems) // logged in user adds their orders
router.route('/myOrders').get(protect, getMyOrders) // logged in user gets all their orders
router.route('/:id/pay').put(checkObjectId, protect, updateOrderToPaid) // user pays for an order
router.route('/:id').get(checkObjectId, protect, getOrderById) // get a single order
router.route('/').get(protect, admin, getOrders) // admin gets all the orders
router.route('/:id/deliver').put(checkObjectId, protect, admin, updateOrderToDelivered) // admin marks order as delivered

export default router