import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../feature/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  //  console.log(args) // request URL, method, body
  //  console.log(api) // signal , dispatch, getState()
  //  console.log(extraOptions) // custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions);
  
  console.log(result);
  // handle other status code:
  if (result?.error?.status === 401) {
    console.log("sending refresh token");

    // send refresh token to get new access token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);    
    if (refreshResult?.data) {
      // store new accessToken
      api.dispatch(setCredentials({ ...refreshResult.data }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut())
      // if (refreshResult?.error?.status === 401) {
      //   refreshResult.error.data.message = "Your login are expired.";        
      // }

      // return refreshResult;
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Vehicle", "VehicleType"],
  endpoints: (builder) => ({}),
});
