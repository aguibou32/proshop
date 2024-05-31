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
const createProduct = asyncHandler( async (req, res) => {

  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id, // logged in user
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description'
  }) ;

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);

});


  // @desc Update a product
  // @route PUT /api/products/:id
  // @access Private/Admin
  const updateProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    // res.send({product: product});
    // res.send({body: req.body})
    if(product){

      const {name, price, description, image, brand, category, countInStock } = req.body;

      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();

      res.json(updatedProduct);
    }else{
      res.status(404);
      throw new Error('Ressource not found');
    }
  })
  

  // @desc DELETE a product
  // @route DELETE /api/products/:id
  // @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product){
    await Product.deleteOne({_id: product._id});
    res.status(200).json({message: 'Product Deleted'})
  }else{
    res.status(404);
    throw new Error('Product not found');
  }
})

export {getProducts, getProductById, createProduct, deleteProduct, updateProduct };