import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      })
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST'
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`, // It is very IMPORT TO CHECK YOUR ROUTES IN THE BACKEND BEFORE YOU PUT ANYTHING HERE
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Users']
    }), 

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    }),

    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: 'GET'
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5,
    }),

    getUser: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'GET'
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5
    }),

    updateUser: builder.mutation({
      query: (user) => ({
        url: `${USERS_URL}/${user._id}`,
        method: 'PUT',
        body: user
      }), 
      invalidatesTags: ['Users']
    }),

    deleteUser: builder.mutation({
      query: (user) => ({
        url: `${USERS_URL}/${user._id}`,
        method: 'DELETE',
      })
    })

  })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserProfileMutation, useGetUsersQuery, useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice;