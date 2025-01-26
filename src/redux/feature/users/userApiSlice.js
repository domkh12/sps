import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { setIsTwoFAEnabled, setTwoFASecretCode } from "../auth/authSlice";
import {
  setAllFullNameUsersFetched,
  setGender,
  setRoles,
  setSignUpMethods,
  setStatus,
  setUser,
} from "./userSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ pageNo = 1, pageSize = 5 }) => ({
        url: `/users?pageNo=${pageNo}&pageSize=${pageSize}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUsers = responseData.allUsers.content.map((user) => {
          user.id = user.uuid;
          return user;
        });
        return {
          ...usersAdapter.setAll(initialState, loadedUsers),
          totalPages: responseData.allUsers.page.totalPages,
          totalElements: responseData.allUsers.page.totalElements,
          pageNo: responseData.allUsers.page.number,
          pageSize: responseData.allUsers.page.size,
          activeCount: responseData.statusCount.Active,
          pendingCount: responseData.statusCount.Pending,
          bannedCount: responseData.statusCount.Banned,
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

    searchUser: builder.query({
      query: ({
        pageNo = 1,
        pageSize = 5,
        searchQuery = "",
        roleFilter = [],
        signUpMethodFilter = [],
        statusFilter = "",
        branchFilter = [],
      }) => ({
        url: `/users/search?pageNo=${pageNo}&pageSize=${pageSize}&keyword=${searchQuery}&roleId=${roleFilter}&signUpMethodId=${signUpMethodFilter}&status=${statusFilter}&branchId=${branchFilter}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
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
    }),

    findUserByUuid: builder.query({
      query: (uuid) => ({
        url: `/users/${uuid}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        responseData.id = responseData.uuid;
        return usersAdapter.setOne(initialState, responseData);
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
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const userUuid = getState().users.uuid;
          if (userUuid === data.uuid) {
            dispatch(setUser(data));
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },
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
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    connectedUser: builder.mutation({
      query: ({ uuid, isOnline }) => ({
        url: `/users/${uuid}/status`,
        method: "PATCH",
        body: {
          isOnline,
        },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setStatus(data.status));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      },
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.uuid }],
    }),

    getAllFullNameUsers: builder.mutation({
      query: () => ({
        url: `/users/full-names`,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
         try {
           const { data } = await queryFulfilled;
           dispatch(setAllFullNameUsersFetched({ data }));
         } catch (error) {
           console.log(error);
         }
      }
    }),

    get2faSecretCode: builder.mutation({
      query: () => ({
        url: "/users/2fa-secret-code",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
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
          dispatch(setIsTwoFAEnabled({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    findAllGender: builder.mutation({
      query: () => ({
        url: "/genders",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setGender({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getAllRoles: builder.mutation({
      query: () => ({
        url: "/roles",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRoles({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getAllSignUpMethods: builder.mutation({
      query: () => ({
        url: "/sign-up-methods",
        method: "GET",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSignUpMethods({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useSearchUserQuery,
  useGetAllSignUpMethodsMutation,
  useGetAllRolesMutation,
  useGetUsersQuery,
  useFindUserByUuidQuery,
  useAddNewUserMutation,
  useGetAllFullNameUsersMutation,
  useUpdateUserMutation,
  useConnectedUserMutation,
  useGet2faSecretCodeMutation,
  useGet2faStatusMutation,
  useDeleteUserMutation,
  useFindAllGenderMutation,
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
