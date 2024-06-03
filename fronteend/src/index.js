import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ProductScreen from './screens/ProductScreen';
import LoginScreen from './screens/LoginScreen';


import { Provider } from 'react-redux';
import store from './store';
import Register from './screens/RegisterScreen';
import ShippingScreen from './components/ShippingScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UsersScreen from './screens/admin/UsersScreen';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import ProductList from './screens/admin/ProductList';
import OrderListScreen from './screens/admin/OrderListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>

    <Route index={true} element={<HomeScreen />} />
    <Route path='/page/:currentPage' element={<HomeScreen />} />
    <Route path='/search/:keyword' element={<HomeScreen />} />
    <Route path='/search/:keyword/page/:currentPage' element={<HomeScreen />} />
    <Route path='/products/:id' element={<ProductScreen />} />
    <Route path='/cart' element={<CartScreen />} />
    <Route path='/login' element={<LoginScreen />} />
    <Route path='/register' element={<Register />} />

    <Route path='' element={<PrivateRoute/>}>
      <Route path='/shipping' element={<ShippingScreen />} />
      <Route path='/payment' element={<PaymentScreen />} />
      <Route path='/placeorder' element={<PlaceOrderScreen />} />
      <Route path='/orders/:id' element={<OrderScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
    </Route>

    <Route path='' element={<AdminRoute />}>
      <Route path='/admin/orderlist' element={<OrderListScreen />} />
      <Route path='/admin/productlist' element={<ProductList />} />
      <Route path='/admin/productlist/:currentPage' element={<ProductList />} />
      <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />

      <Route path='/admin/users' element={<UsersScreen />} />
      <Route path='/admin/users/:id' element={<UserEditScreen />} />
      
    </Route>
  </Route>
));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
