import asyncHandler from '../middleware/asyncHandler.js'
import Product from "../models/productModel.js";


// @ desc Fetch all the products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {

  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}

  const totalNumberOfProducts = await Product.countDocuments({ ...keyword }) // total number of products
  const numberOfProductsPerPage = process.env.PAGINATION_LIMIT // n products we want per page

  const currentPage = Number(req.query.currentPage) || 1 // getting the current page

  const products = await Product.find({ ...keyword })
    .limit(numberOfProductsPerPage)
    .skip(numberOfProductsPerPage * (currentPage - 1)) // skip all record before the current page

  const totalPages = Math.ceil(totalNumberOfProducts / numberOfProductsPerPage)

  res.status(200).json({
    products,
    currentPage,
    totalPages
  })
})


// @des Fetch a single product
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.status(200).json(product);
  } else {
    res.status(404);
    throw new Error('Resource not found.');
  }
});


// @des Get top rated products
// @route GET /api/products/top
// @access Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(3)

  if (products) {
    return res.status(200).json(products)
  } else {
    res.status(404);
    throw new Error('Resources not found.')
  }

})



//  @ desc Create a product
//  @ route POST /api/products
//  @ access PRIVATE ADMIN
const createProduct = asyncHandler(async (req, res) => {

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
  });

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
  if (product) {

    const { name, price, description, image, brand, category, countInStock } = req.body;

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Ressource not found');
  }
})


// @desc POST a product review
// @route POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {

  const { rating, comment } = req.body; // Destructuring the rating and comment from the request body
  const product = await Product.findById(req.params.id); // Finding the product by ID passed in the URL

  if (product) {

    // Checking to see if the user has already reviewed this specific product
    // To do that:
    // Loop through all the reviews of the product
    // Compare each review's user ID with the ID of the currently authenticated user
    // If a match is found, it means the user has already reviewed this specific product
    // To simplify the explanation. If there is one review with the logged in user id,
    // It means the logged in user already reviewed this product 

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    // Create a new review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id // req.user._id is the id of the logged in user
    }

    // Add the new review to the product's reviews array
    product.reviews.push(review)
    // product.reviews = [...product.reviews, review] // same as above

    // Update the number of reviews and the product's rating
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    // Save the updated product
    await product.save()

    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})




export { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductReview, getTopProducts };