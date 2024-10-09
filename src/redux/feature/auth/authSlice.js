import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  // initial data
  initialState: {
    token: null,
  },

  // function
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
    },

    logout: (state, action) => {
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToekn = (state) => state.auth.token;
