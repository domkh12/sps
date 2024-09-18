import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userToken
        if (token){
            // include token in req header
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => 'user/profile',
            method: 'GET',
        }),
    }),
  }),
});

export const { useGetUserDetailsQuery } = authApi
