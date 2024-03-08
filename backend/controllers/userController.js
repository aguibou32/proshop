import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  res.send('auth user');
});

// @desc Register user & get token
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  res.send('register user');
});

// @desc Logout user & clear cookie
// @route POST /api/users/
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.send('logout user');
});

// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send('get user profile');
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send('update user profile');
});

// @desc Get all users
// @route GET /api/users/
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send('get users');
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private
const getUserByID = asyncHandler(async (req, res) => {
  res.send('get user by id');
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private / Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send('update user by id');
});

// @desc Delete user
// @route DELETE /api/users/
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  res.send('delete user');
});

export {
  authUser, 
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser
}