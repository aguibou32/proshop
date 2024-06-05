import express from 'express';
import { 
  getProducts,
  getProductById, 
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getTopProducts
} from '../controllers/productController.js'
import {protect, admin} from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js'

const router = express.Router()

router.route('/').get(getProducts)
router.route('/top').get(getTopProducts)
router.route('/:id').get(checkObjectId, getProductById)
router.route('/').post(protect, admin, createProduct)
router.route('/:id').put(protect, admin, checkObjectId, updateProduct)
router.route('/:id').delete(protect, admin, checkObjectId, deleteProduct)
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview) // we have to post method so we add /reviews to this one to differentiate them

export default router;