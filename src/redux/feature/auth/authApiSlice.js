import { apiSlice } from "../../app/api/apiSlice";
import { setUser, setUuid } from "../users/userSlice";
import {
  logOut,
  setCredentials,
  setQrCodeUrl,
  setUserProfile,
} from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),

    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken } = data;
          const { uuid } = data;
          dispatch(setCredentials({ accessToken }));
          dispatch(setUuid(uuid));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getQrCode2Fa: builder.mutation({
      query: () => ({
        url: "/auth/enable-2fa",
        method: "POST",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setQrCodeUrl({ data }));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    verifyTwoFa: builder.mutation({
      query: (code) => ({
        url: `/auth/verify-2fa?code=${code}`,
        method: "POST",
      }),
    }),

    disableTwoFa: builder.mutation({
      query: () => ({
        url: `/auth/disable-2fa`,
        method: "POST",
      }),
    }),

    verify2FALogin: builder.mutation({
      query: ({ code, email }) => ({
        url: `/auth/verify-2fa-login?code=${code}&email=${email}`,
        method: "POST",
      }),
    }),

    verifySites: builder.mutation({
      query: ({ uuid }) => ({
        url: `/auth/verify-sites?uuid=${uuid}`,
        method: "POST",
      }),
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `/auth/profiles`,
      }),
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [{type: "Profile", id: "LIST"}, ...result.ids.map((id) => ({type: "Profile", id})),];
        } else return [{type: "Profile", id: "LIST"}];
      },
    }),

    updateUserProfile: builder.mutation({
      query: ({ ...initialUserData }) => ({
        url: `/auth/profiles`,
        method: "PUT",
        body: { ...initialUserData },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Profile", id: "LIST" }],
    }),

    changePassword: builder.mutation({
      query: ({ ...initialUserData }) => ({
        url: `/auth/change-password`,
        method: "POST",
        body: { ...initialUserData },
      }),
    }),

    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: `/auth/forgot-password?email=${email}`,
        method: "POST",
      }),
    }),

    resetPasssword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body: { token: token, newPassword: newPassword },
      }),
    }),
  }),
});

export const {
  useResetPassswordMutation,
  useForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateUserProfileMutation,
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useGetQrCode2FaMutation,
  useVerifyTwoFaMutation,
  useDisableTwoFaMutation,
  useVerify2FALoginMutation,
  useVerifySitesMutation,
  useGetUserProfileQuery,
} = authApiSlice;
