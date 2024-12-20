import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const signUpMethodAdapter = createEntityAdapter({});

const initialState = signUpMethodAdapter.getInitialState();

export const signUpMethodApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSignUpMethod: builder.query({
      query: () => `/sign-up-methods`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {        
        const loadedsignUpMethod = responseData.map((signUpMethod) => {
          signUpMethod.id = signUpMethod.id;
          return signUpMethod;
        });
        return signUpMethodAdapter.setAll(initialState, loadedsignUpMethod);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "SignUpMethod", id: "LIST" },
            ...result.ids.map((id) => ({ type: "SignUpMethod", id })),
          ];
        } else return [{ type: "SignUpMethod", id: "LIST" }];
      },
    }),       
  }),
});

export const {  
  useGetSignUpMethodQuery,  
} = signUpMethodApiSlice;

// return the query result object
export const selectSignUpMethodResult =
  signUpMethodApiSlice.endpoints.getSignUpMethod.select();
// create momorized selector
const selectSignUpMethodData = createSelector(
  selectSignUpMethodResult,
  (signUpMethodResult) => signUpMethodResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllSignUpMethod,
  selectById: selectSignUpMethodById,
  selectIds: selectSignUpMethodIds,
  // pass the selector that return the signUpMethod slice of state
} = signUpMethodAdapter.getSelectors(
  (state) => selectSignUpMethodData(state) ?? initialState
);
