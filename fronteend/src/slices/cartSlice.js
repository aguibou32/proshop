import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from '../../src/utils/cartUtils.js';

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {
  cartItems: [],
  itemsPrice: 0.0,
  shippingPrice: 0.0,
  taxPrice: 0.0,
  totalPrice: 0.0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // Extract the item from the action payload
      // console.log(item);
      // Check if the item already exists in the cart
      const existsItem = state.cartItems.find(x => x._id === item._id);

      // If the item exists, update its information in the cart
      if (existsItem) {
        state.cartItems = state.cartItems.map((x) => x._id === existsItem._id ? item : x);
      } else {
        // If the item doesn't exist, add it to the cart
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const item = action.payload;

      state.cartItems = state.cartItems.filter((x) => x._id !== item._id);
      updateCart(state);
    }
  }
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;