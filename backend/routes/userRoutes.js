import express from 'express';
import {
  authUser, 
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
} from '../controllers/userController.js';
import {protect, admin} from '../middleware/authMiddleware.js';


const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/').post(registerUser);

router.route('/auth').post(authUser);
router.route('/logout').post(logoutUser);

router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);

// admin routes
router.route('/:id').get(admin, getUserById); 
router.route('/:id').put(admin, updateUser); 
router.route('/:id').delete(admin, deleteUser); 

export default router;