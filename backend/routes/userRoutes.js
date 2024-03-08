import express from 'express';
import {
  authUser, 
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser
} from '../controllers/userController.js';



const router = express.Router();

router.route('/').get(getUsers);
router.route('/').post(registerUser);

router.route('/logout').post(logoutUser);
router.route('/login').post(authUser);

router.route('/profile').get(getUserProfile);
router.route('/profile').put(updateUserProfile);

router.route('/:id').get(getUserByID); 
router.route('/:id').put(updateUser); 
router.route('/:id').delete(deleteUser); 

export default router;