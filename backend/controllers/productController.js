import asyncHandler from '../middleware/asyncHandler.js'
import Product from "../models/productModel.js";

// @ desc Fetch all the products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
})

// @des Fetch a single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product){
    return res.json(product);
  }else{
    res.status(404);
    throw new Error('Resource not found.');
  }
});


//  @ desc Create a product
//  @ route POST /api/products
//  @ access PRIVATE ADMIN
const createProduct = asyncHandler( (req, res) => {

  const product = new Product 
})

export {getProducts, getProductById};