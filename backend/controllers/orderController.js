import asyncHandler from '../middleware/asyncHandler.js'
import Order from "../models/orderModel.js";


// @des CREATE new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  // res.json({'Request body': req.body, 'user': req.user});
  // res.json({'req': req.user})

  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items provided' });
      return;
    }

    const order = new Order({
      // here we basically creating a new array and adding a new field (product to reference the product itself)
      orderItems: orderItems.map(x => ({
        ...x,
        product: x._id,
        _id: undefined
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder); // this is what is sent to front end
  } catch (error) {
    console.log('error occuried while creating an order: ', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @des GET logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'no orders found' });
    }
    res.status(200).json(orders);


  } catch (error) {
    console.log("Error fetching orders: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @des GET order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => { 
  // res.json({body: req.params.id});

  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email'); // the id here is not the same as the _id from the db

    if (order === null) {
      return res.status(404).json({ message: 'no order found' });
    }
    res.status(200).json(order);

  } catch (error) {
    console.log("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

});

// @des UPDATE order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id);

  if(order === null){
    return res.status(404).json({ message: 'no order found' });
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  }

  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
});

// @des UPDATE order to delivered
// @route PUT /api/orders/:id/update
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send('update order to delivered');
});

// @des GET all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  res.send('get all orders');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  getOrders
}