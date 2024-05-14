import {apiSlice} from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: `${ORDERS_URL}`,
        method: 'POST',
        body: {...order}
      })
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'GET', // by default it's a GET so you could leave it out
      }),
      keepUnusedDataFor: 5, // 5 seconds
    }),
    payOrder: builder.mutation({
      query: (orderId, details) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: {...details}
      })
    }),
    getPayPalClientId: builder.query({ // This query is just to get our client id from the backend because do not want to store it in the frontend 
      query: () => ({
        url: PAYPAL_URL,
      }), 
      keepUnusedDataFor: 5, // 5 seconds
    })
  })
});

export const {useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery} = ordersApiSlice;

// REMEMBER the queries finish with Query, the ones that make changes to the db finish with MUTATION