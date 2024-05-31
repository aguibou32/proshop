import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';


// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  // {email:email} // the first one is the one that is in the db; the second one is user input
  // You could simplify it and just say findOne({email})

  if (user && (await user.matchPassword(password))) { // the matchPassword is defined in the userModel
    
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });

  }else{
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc Register user & get token
// @route POST /api/users/
// @access Public
const registerUser = asyncHandler(async (req, res) => {

  const { name, email, password } = req.body;

  // validation 
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields.');
  }

  // Find if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exist !');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create(
    {
      name,
      email,
      password: hashedPassword
    });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
    
  } else {
    res.status(400);
    throw new Error('Invalid user data.');
  }
});

// @desc Logout user & clear cookie
// @route POST /api/users/
// @access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({message: 'Logged out successfully'})
});

// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {

 const user = await User.findById(req.user._id); // This is possible because of the auth middleware;
 if(user){
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin
  });
 }else{
  res.status(404);
  throw new Error('User not found')
 }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log(user);


  if(user){
    user.name = req.body.name || user.name; // Check if the request came with a name, if not keep the name
    user.email = req.body.email || user.email; // Check if the request came with an email, if not keep the one the user already have

    if(req.body.password){ // Because the password is hashed, we cannot do it the way we did it above. Othwerwise we would need to dehash it first and then compare the 2

      const salt = await bcrypt.genSalt(10);
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id : updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  }else{
    res.status(404);
    throw new Error('User not found')
  }
});

// @desc Get all users
// @route GET /api/users/
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {

  const users = await User.find({})
  res.status(200).json(users)
  
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if(user){
    return res.json(user)
  }else{
    res.status(404)
    throw new Error('User not found')
  }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private / Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if(user){
    user.name = req.body.name || user.name; // Check if the request came with a name, if not keep the name
    user.email = req.body.email || user.email; // Check if the request came with an email, if not keep the one the user already have

    if(req.body.password){ // Because the password is hashed, we cannot do it the way we did it above. Othwerwise we would need to dehash it first and then compare the 2

      const salt = await bcrypt.genSalt(10);
      const password = req.body.password;
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id : updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin
    })
  }else{
    res.status(404)
    throw new Error('User not found')
  }
});

// @desc Delete user
// @route DELETE /api/users/
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.id)
  if(user){
    await User.deleteOne({_id: user._id})
    res.status(200).json({message: 'User Deleted'})
  }else{
    res.status(404)
    throw new Error('User not found')
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
}