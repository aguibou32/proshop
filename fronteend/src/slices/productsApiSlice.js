import { apiSlice } from "./apiSlice";
import { PRODUCTS_URL, UPLOADS_URL } from "../constants";

// We are basically just injecting this slice called productsApiSlice to the parent slice called apiSlice using the injectEndpoints

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({pageNumber}) => ({
        url: PRODUCTS_URL,
        params: {
          pageNumber
        },
        method: 'GET'
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        // body: data // In this case, we not passing any data because we are firstly creating the sample data and only after that we then go and edit it 
        invalidatesTags: ['Product'], // What this will do is to prevent cashing so that we have fresh data all the time. 
      })
    }),

    updateProduct: builder.mutation({
      query: (product) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: 'PUT',
        body: product
      }),
      invalidatesTags: ['Products']
    }),
    deleteProduct: builder.mutation({
      query: (product) => ({
        url: `${PRODUCTS_URL}/${product._id}`,
        method: 'DELETE',
        invalidatesTags: ['Product']
      }),
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}`, // This is not a productRoutes url
        method: 'POST',
        body: data
      })
    }),
    createReview: builder.mutation({
      query: (review) => ({
        url: `${PRODUCTS_URL}/${review._id}/reviews`,
        method: 'POST',
        body: review
      }),
      invalidatesTags: ['Product']
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useCreateReviewMutation
} = productsApiSlice;