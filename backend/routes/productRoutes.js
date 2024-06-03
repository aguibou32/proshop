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

const router = express.Router()

router.route('/').get(getProducts)
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductById)
router.route('/').post(protect, admin, createProduct)
router.route('/:id').put(protect, admin, updateProduct)
router.route('/:id').delete(protect, admin, deleteProduct)
router.route('/:id/reviews').post(protect, createProductReview) // we have to post method so we add /reviews to this one to differentiate them

export default router;