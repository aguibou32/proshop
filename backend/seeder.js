import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import users from './data/users.js';
import products from './data/products.js';

import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';


import connectDB from './config/db.js';

dotenv.config(); // Making the values in the .env file is available to our app because we need it for connectDB() to work
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users); // adding all the users. The user is the admin
    const adminUser = createdUsers[0]._id; // Getting the first user because it is the admin user

    // creating a new array of products where we have changed the user of the product to be the admin
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser}
    });

    await Product.insertMany(sampleProducts);
    console.log('Data Imported! '.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
  }
}

// We basically saying, if you call this function in the terminal and you add -d, then it will destroy the data, if you do not add -d, it will just add the data.

if (process.argv[2] === '-d') {
  destroyData();
}else{
  importData();
}