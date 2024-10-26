import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedUsers = responseData.content.map((user) => {
          user.id = user.uuid;
          return user;
        });
        return {
          ...usersAdapter.setAll(initialState, loadedUsers),
          totalPages: responseData.page.totalPages,
        };
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
    addNewUser: builder.mutation({
      query: (initialState) => ({
        url: "/users",
        method: "POST",
        body: {
          ...initialState,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...initialUserData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
        body: {
          id,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    paginationUser: builder.mutation({
      query: ({ pageNo, pageSize = 20 }) => ({
        url: `/users?pageNo=${pageNo}&pageSize=${pageSize}`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.content.map((user) => ({
          ...user,
          id: user.uuid,
        }));
        return { users: loadedUsers, totalPages: responseData.page.totalPages };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { users: newUsers } = data;

          // Replace existing data with the new paginated data
          dispatch(
            userApiSlice.util.updateQueryData(
              "getUsers",
              undefined,
              (draft) => {
                usersAdapter.setAll(draft, newUsers);
              }
            )
          );
        } catch (error) {
          console.error("Failed to fetch paginated users:", error);
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  usePaginationUserMutation,
} = userApiSlice;

// return the query result object
export const selectUserResult = userApiSlice.endpoints.getUsers.select();
// create momorized selector
const selectUserData = createSelector(
  selectUserResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // pass the selector that return the users slice of state
} = usersAdapter.getSelectors((state) => selectUserData(state) ?? initialState);
