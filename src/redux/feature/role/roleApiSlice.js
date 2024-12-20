import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const roleAdapter = createEntityAdapter({});

const initialState = roleAdapter.getInitialState();

export const roleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRole: builder.query({
      query: () => `/roles`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {        
        const loadedrole = responseData.map((role) => {
          role.id = role.id;
          return role;
        });
        return roleAdapter.setAll(initialState, loadedrole);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Role", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Role", id })),
          ];
        } else return [{ type: "Role", id: "LIST" }];
      },
    }),       
  }),
});

export const {  
  useGetRoleQuery,  
} = roleApiSlice;

// return the query result object
export const selectRoleResult =
  roleApiSlice.endpoints.getRole.select();
// create momorized selector
const selectRoleData = createSelector(
  selectRoleResult,
  (roleResult) => roleResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllRole,
  selectById: selectRoleById,
  selectIds: selectRoleIds,
  // pass the selector that return the role slice of state
} = roleAdapter.getSelectors(
  (state) => selectRoleData(state) ?? initialState
);
