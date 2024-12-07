import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { SIGNUPMETHOD } from "./../../../config/signUpMethod";
import { setIsTwoFAEnabled, setTwoFASecretCode } from "../auth/authSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 30,
        signUpMethod = SIGNUPMETHOD.CUSTOM,
      } = {}) =>
        `/users?pageNo=${pageNo}&pageSize=${pageSize}&signUpMethod=${signUpMethod}`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      serializeQueryArgs: ({ pageNo }) => {
        const newQueryArgs = { ...pageNo };
        if (newQueryArgs.page) {
          delete newQueryArgs.page;
        }
        return newQueryArgs;
      },
      transformResponse: (responseData) => {
        const loadedUsers = responseData.content.map((user) => {
          user.id = user.uuid;
          return user;
        });
        return {
          ...usersAdapter.setAll(initialState, loadedUsers),
          totalPages: responseData.page.totalPages,
          totalElements: responseData.page.totalElements,
          pageNo: responseData.page.number,
          pageSize: responseData.page.size,
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
    searchUsers: builder.mutation({
      query: ({ query }) => ({
        url: `/users/search?q=${query}`,
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
          console.log("data", data);
          const { users: newUsers, totalPages: newTotalPages } = data;

          dispatch(
            userApiSlice.util.updateQueryData(
              "getUsers",
              undefined,
              (draft) => {
                usersAdapter.setAll(draft, newUsers);
                draft.totalPages = newTotalPages;
              }
            )
          );
        } catch (error) {
          console.error("Failed to fetch paginated users:", error);
        }
      },
    }),
    findByUuid: builder.mutation({
      query: (uuid) => ({
        url: `/users/${uuid}`,
      }),
      transformResponse: (responseData) => {
        const loadedUser = {
          ...responseData,
          id: responseData.uuid,
        };
        return usersAdapter.setAll(initialState, [loadedUser]);
      },
    }),
    connectedUser: builder.mutation({
      query: ({ uuid, status }) => ({
        url: `/users/${uuid}/status`,
        method: "PATCH",
        body: {
          status,
        },
      }),
      transformResponse: (responseData) => {
        console.log("responseData", responseData);
      },
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.uuid }],
    }),
    getFullNameUsers: builder.query({
      query: () => `/users/full-names`,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedUsers = responseData.map((user) => {
          user.id = user.uuid;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
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

    get2faSecretCode: builder.mutation({
      query: () => ({
        url: "/users/2fa-secret-code",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data", data);
          dispatch(setTwoFASecretCode({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    get2faStatus: builder.mutation({
      query: () => ({
        url: "/users/2fa-status",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data", data);
          dispatch(setIsTwoFAEnabled({ data }));
        } catch (error) {
          console.log(error);
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
  useSearchUsersMutation,
  useFindByUuidMutation,
  useConnectedUserMutation,
  useGetFullNameUsersQuery,
  useGet2faSecretCodeMutation,
  useGet2faStatusMutation,
} = userApiSlice;

// return the query result object
export const selectUserResult = userApiSlice.endpoints.getUsers.select();
export const selectUserProfile = userApiSlice.endpoints.findByUuid.select();
export const selectFullNameUser =
  userApiSlice.endpoints.getFullNameUsers.select();
// create momorized selector
const selectUserData = createSelector(
  selectUserResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);
// create momorized selector
const selectUserProfileData = createSelector(
  selectUserProfile,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);
// create momorized selector
const selectFullNameUserData = createSelector(
  selectFullNameUser,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // pass the selector that return the users slice of state
} = usersAdapter.getSelectors((state) => selectUserData(state) ?? initialState);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllUserProfile,
  selectById: selectUserProfileById,
  selectIds: selectUserProfileIds,
  // pass the selector that return the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUserProfileData(state) ?? initialState
);

// getSelector creates these selectors and we rename them with aliase using destructuring
export const {
  selectAll: selectAllFullNameUsers,
  selectById: selectUserFullNameById,
  selectIds: selectUserFullNameIds,
  // pass the selector that return the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectFullNameUserData(state) ?? initialState
);
